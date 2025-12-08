require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./utils/db');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const matchRoutes = require('./routes/matches');
const scenarioRoutes = require('./routes/scenarios');

const app = express();
const server = http.createServer(app);

// Allow multiple origins for development
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.CORS_ORIGIN
].filter(Boolean);

const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

// Connect to MongoDB
connectDB();

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/scenarios', scenarioRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Root route
app.get('/', (req, res) => {
  res.send('StockGuessr API is running');
});

// Socket.io
const activeMatches = new Map();

const ROUND_DURATION = 24 * 1000; // 24 seconds
const DECISION_DURATION = 18 * 1000; // 18 seconds
const COUNTDOWN_DURATION = 10 * 1000; // 10 seconds before game starts

function startGameLoop(roomName, io) {
  if (activeMatches.has(roomName)) {
    console.log(`[GameLoop] Match ${roomName} already active, skipping`);
    return;
  }

  console.log(`[GameLoop] Starting game loop for ${roomName}`);

  const matchState = {
    currentWeek: 0,
    phase: 'countdown',
    endTime: Date.now() + COUNTDOWN_DURATION,
    isRunning: true
  };

  activeMatches.set(roomName, matchState);

  const loop = async () => {
    if (!activeMatches.has(roomName)) {
      console.log(`[GameLoop] Match ${roomName} no longer active, exiting`);
      return;
    }
    const state = activeMatches.get(roomName);

    // Phase: REVEAL (showing chart)
    console.log(`[GameLoop] ${roomName} Week ${state.currentWeek} - REVEAL phase`);
    state.phase = 'reveal';
    state.endTime = Date.now() + (ROUND_DURATION - DECISION_DURATION);
    io.to(roomName).emit('match_state', state);

    await new Promise(resolve => setTimeout(resolve, ROUND_DURATION - DECISION_DURATION));
    if (!activeMatches.has(roomName)) return;

    // Phase: DECISION (trading allowed)
    console.log(`[GameLoop] ${roomName} Week ${state.currentWeek} - DECISION phase`);
    state.phase = 'decision';
    state.endTime = Date.now() + DECISION_DURATION;
    io.to(roomName).emit('match_state', state);

    await new Promise(resolve => setTimeout(resolve, DECISION_DURATION));
    if (!activeMatches.has(roomName)) return;

    // Phase: END OF ROUND (advance week)
    state.currentWeek++;
    console.log(`[GameLoop] ${roomName} - Advanced to week ${state.currentWeek}`);

    if (state.currentWeek >= 4) { // 4 weeks total (0-3)
      console.log(`[GameLoop] ${roomName} - Game completed`);
      state.phase = 'completed';
      state.isRunning = false;
      io.to(roomName).emit('match_state', state);
      activeMatches.delete(roomName);
      return;
    } else {
      // Loop again
      loop();
    }
  };

  // Start with 5-second countdown
  console.log(`[GameLoop] ${roomName} - 5 second countdown starting`);
  io.to(roomName).emit('match_state', matchState);

  setTimeout(() => {
    if (!activeMatches.has(roomName)) return;
    loop();
  }, COUNTDOWN_DURATION);
}

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join match room
  socket.on('join_match', (data) => {
    const { matchId, userId } = data;
    const roomName = `match_${matchId}`;

    socket.join(roomName);

    const room = io.sockets.adapter.rooms.get(roomName);
    const playerCount = room ? room.size : 0;

    console.log(`User ${userId} joined match ${matchId}. Total players: ${playerCount}`);

    // Notify everyone in the room
    io.to(roomName).emit('player_joined', {
      userId,
      playerCount,
    });

    // If 2 players, start game loop
    // If 2 players, check if we need to start or sync
    if (playerCount === 2) {
      io.to(roomName).emit('match_ready', { start: true });

      if (!activeMatches.has(roomName)) {
        startGameLoop(roomName, io);
      } else {
        // Match already running, sync the joining player
        socket.emit('match_state', activeMatches.get(roomName));
      }
    } else if (activeMatches.has(roomName)) {
      // If rejoining an active match (and somehow playerCount != 2, e.g. observer?), send current state
      socket.emit('match_state', activeMatches.get(roomName));
    }
  });

  // Handle trade action
  socket.on('trade_action', (data) => {
    const { matchId, playerId, action, price, week, pnl, shares, equity } = data;
    // Broadcast to opponent
    socket.to(`match_${matchId}`).emit('opponent_trade', {
      playerId,
      action,
      price,
      week,
      pnl,
      shares,
      equity
    });
  });

  // Leave match
  socket.on('leave_match', (data) => {
    const { matchId } = data;
    socket.leave(`match_${matchId}`);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, io };
