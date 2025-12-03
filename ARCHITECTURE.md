# StockGuessr Architecture & Development Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend (Vite)                   │
│  (Login, Dashboard, Matchmaking, GameBoard, Analysis)       │
└──────────────────────────────────────────────────────────────┘
                              │
                    HTTP/REST & WebSocket
                              │
┌──────────────────────────────────────────────────────────────┐
│                   Express Backend (Node.js)                  │
│                                                              │
│  Routes:                 Middleware:                         │
│  ├─ /api/auth           ├─ JWT Authentication              │
│  ├─ /api/matches        ├─ Error Handling                  │
│  └─ /api/scenarios      └─ CORS                            │
│                                                              │
│  Features:                                                  │
│  ├─ Socket.io (Real-time game sync)                        │
│  ├─ OpenAI (Post-game analysis)                            │
│  └─ JWT Tokens (7-day expiration)                          │
└──────────────────────────────────────────────────────────────┘
                              │
                        MongoDB
                              │
     ┌────────────┬────────────┬────────────┐
     │   Users    │  Matches   │ Scenarios  │
     └────────────┴────────────┴────────────┘
```

## Authentication Flow

```
1. User Registration/Login
   ↓
2. Backend validates credentials (bcrypt)
   ↓
3. Generate JWT token (7-day expiration)
   ↓
4. Frontend stores token in localStorage
   ↓
5. API calls include Authorization header: "Bearer {token}"
   ↓
6. Backend middleware validates token on protected routes
```

## Real-Time Game Flow

```
Player 1                    Server                 Player 2
   │                          │                        │
   ├──────join_match─────────→│                        │
   │                          │←──────join_match───────┤
   │                          │                        │
   │◄─────game_state─────────┤────game_state──────────→│
   │◄─────game_state─────────┤────game_state──────────→│
   │                          │                        │
   ├──────trade_action───────→│                        │
   │                          ├────trade_executed─────→│
   │                          │                        │
   │                     Game Loop                      │
   │                     (Weeks 1-4)                    │
   │                          │                        │
   ├──────finish_game────────→│                        │
   │                          ├────finish_game────────→│
   │                          │                        │
   │◄──────analysis────────────update_match──────────→│
```

## Data Models

### User Model
- Authentication: email, username, password (bcrypted)
- Stats tracking: wins, losses, totalMatches, avgPnL, totalPnL
- Lightweight design - no roles/permissions for v1

### Match Model
- Hierarchical player data (player1/player2 nested objects)
- Trade history stored as arrays
- Winner determined by final equity
- AI analysis stored in match document
- Status tracking: IN_PROGRESS → COMPLETED

### StockScenario Model
- Dual candle sets: context (3 months historical) + game (4 weeks)
- News tied to weeks for timeline accuracy
- Difficulty levels guide player selection
- timesUsed tracks popularity for analytics

## Component Architecture

### Pages (Full Screen Views)
- **Login**: Authentication form with error handling
- **Register**: New account creation with validation
- **Dashboard**: Stats display + match history + play button
- **Matchmaking**: Queue/searching animation
- **GameBoard**: Main game interface (chart + trades + scores)
- **Analysis**: Post-game review + AI feedback

### Components (Reusable)
- **Button**: Variant-based styling (primary/secondary/danger)
- **StockChart**: Recharts composition chart (price + volume)
- **TradePanel**: BUY/SELL/HOLD interface
- **ScoreBoard**: Live player equity + PnL display

### Context & Hooks
- **AuthContext**: Global auth state + methods (register/login/logout)
- **useAuth**: Custom hook for accessing auth context

### Utilities
- **api.js**: Axios instance with JWT interceptor
- **socket.js**: Socket.io client singleton

## Key Technical Decisions

### Frontend: React Context vs Redux
**Decision**: Context API
- Rationale: Simple auth state, no complex state management needed
- Suitable for app size and complexity
- Easier for junior developers to understand

### Backend: REST + Socket.io vs GraphQL
**Decision**: REST + Socket.io
- REST for standard CRUD operations
- Socket.io for real-time game synchronization
- GraphQL would be overkill for current scope

### Authentication: JWT vs Sessions
**Decision**: JWT
- Stateless authentication
- Easy to scale horizontally
- Works well with mobile clients
- Typical for SPA applications

### Game Logic: Frontend vs Backend
**Decision**: Dual responsibility
- Game state calculated on frontend for responsiveness
- Backend validates and persists final results
- Prevents cheating on critical calculations

## Database Indexing Strategy

```javascript
// Recommended MongoDB Indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ username: 1 }, { unique: true })

db.matches.createIndex({ 'player1.userId': 1 })
db.matches.createIndex({ 'player2.userId': 1 })
db.matches.createIndex({ createdAt: -1 })
db.matches.createIndex({ status: 1 })

db.stockscenarios.createIndex({ ticker: 1 })
db.stockscenarios.createIndex({ startDate: 1 })
db.stockscenarios.createIndex({ difficulty: 1 })
```

## API Design

### RESTful Principles
- Nouns as resources: `/api/matches`, `/api/scenarios`
- HTTP verbs for actions: POST (create), GET (read), PUT (update), DELETE (remove)
- Status codes: 201 (created), 200 (ok), 400 (bad request), 401 (unauthorized), 403 (forbidden), 404 (not found), 409 (conflict), 500 (server error)
- Consistent error response format

### Request/Response Format
```javascript
// Request
POST /api/auth/login
{
  email: "user@example.com",
  password: "password123"
}

// Response Success
{
  token: "eyJhbGciOiJIUzI1NiIs...",
  user: {
    _id: "507f1f77bcf86cd799439011",
    email: "user@example.com",
    username: "trader42",
    stats: { wins: 5, losses: 2, ... }
  }
}

// Response Error
{
  message: "Invalid email or password"
}
```

## Security Considerations

### Backend Security
1. **Input Validation**: Mongoose schemas validate data types
2. **Authorization**: Check ownership before modifying resources
3. **Password Hashing**: Bcrypt with 10 salt rounds
4. **JWT Secret**: Stored in environment variables
5. **CORS**: Restricted to approved origins
6. **Error Messages**: Generic messages to prevent user enumeration

### Frontend Security
1. **XSS Prevention**: React auto-escapes JSX content
2. **CSRF**: JWT in Authorization header (not cookies)
3. **Token Storage**: localStorage (accessible to JavaScript, but app-only)
4. **Secrets**: Never hardcode API keys or secrets
5. **HTTPS**: Required for production

## Performance Optimizations

### Frontend
- Vite for fast builds and HMR
- Code splitting via React Router
- Recharts memoization for chart rendering
- Framer Motion for GPU-accelerated animations
- TailwindCSS purges unused styles

### Backend
- Database indexes on frequently queried fields
- Connection pooling (Mongoose default)
- Error handling prevents server crashes
- CORS pre-flight caching

### Database
- Nested documents reduce joins
- Indexed foreign key references
- TTL indexes for session cleanup (future)

## Scaling Considerations

### Current (Single Server)
- MongoDB Atlas free tier (512MB)
- Single Express server
- Socket.io uses in-memory adapter

### Phase 2 Scaling
- Upgrade MongoDB to paid tier
- Add caching layer (Redis)
- Implement Socket.io Redis adapter for multi-server

### Phase 3 Scaling
- Load balancer for backend
- CDN for static assets (Netlify default)
- Database replication
- Dedicated Socket.io servers

## Testing Strategy

### Unit Tests (Future)
- API endpoint tests with Jest
- Component tests with React Testing Library
- Model validation tests

### Integration Tests (Future)
- End-to-end game flow tests
- Authentication flow tests
- Database transaction tests

### Manual Testing
- Register new account
- Complete full game
- Check AI analysis
- Verify match history
- Test responsive design

## Deployment Checklist

- [ ] Environment variables configured
- [ ] MongoDB connection tested
- [ ] OpenAI API key verified
- [ ] CORS origins set correctly
- [ ] Frontend build succeeds
- [ ] Backend starts without errors
- [ ] Database seeded with scenarios
- [ ] Test registration flow
- [ ] Test game mechanics
- [ ] Test post-game analysis
- [ ] Check logs for errors
- [ ] Monitor performance metrics

## Code Style Guidelines

### Backend (Node.js)
- Use async/await over callbacks
- Validate input at route level
- Consistent error handling (try/catch)
- Meaningful variable names
- JSDoc comments for complex functions

### Frontend (React)
- Functional components with hooks
- Custom hooks for logic reuse
- Prop destructuring
- Meaningful component names
- CSS classes over inline styles (Tailwind)

## Future Enhancements

1. **Matchmaking Queue**: Real player pairing instead of random
2. **Leaderboard**: Global rankings by rating/wins
3. **Friends System**: Add friends, view their stats
4. **Replay System**: Record and watch match replays
5. **Mobile App**: React Native version
6. **Advanced Charts**: Candlestick data, more indicators
7. **Trading Tutorials**: In-app learning content
8. **Badges/Achievements**: Gamification elements
9. **Trading Bots**: AI opponents with different strategies
10. **Premium Features**: Cosmetics, early access to scenarios

## Troubleshooting Guide

### Common Errors

**"Token is not valid"**
- Token may have expired (7-day expiration)
- User needs to log in again
- Check browser localStorage for token

**"MongoDB connection timeout"**
- Check internet connection
- Verify MongoDB URI
- Check IP whitelist in MongoDB Atlas

**"Socket.io connection error"**
- Verify backend is running
- Check browser console for CORS errors
- Ensure firewall allows WebSocket

**"Cannot find module"**
- Run `npm install` in affected directory
- Check file paths (case-sensitive on Linux)
- Clear node_modules and reinstall if needed

## Performance Profiling

### Frontend (Chrome DevTools)
- Performance tab: Check FPS during gameplay
- Network tab: Monitor API response times
- Console: Check for JavaScript errors

### Backend (Node.js)
- Monitor process: `node --prof index.js`
- Check memory usage: Watch for leaks
- Monitor CPU: Should be under 50% idle

### Database (MongoDB Atlas)
- Monitor query performance
- Check index effectiveness
- Watch storage growth

## Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com/manual)
- [Socket.io Documentation](https://socket.io/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [OpenAI API](https://platform.openai.com/docs)
