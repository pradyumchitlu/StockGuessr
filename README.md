# StockGuessr - GeoGuessr for the Stock Market

A real-time 1v1 competitive trading game where players trade on hidden historical stock charts. Built with modern web technologies including React, Node.js, MongoDB, and Socket.io.

## 🎮 Features

### Core Gameplay
- **Real Historical Stock Data**: Trade on actual historical stock data from various tickers and time periods
- **Live 1v1 Competition**: Real-time multiplayer matches with synchronized game state
- **Dynamic Trading**: Buy long positions, hold, or sell at any point during the 4-week game
- **Live Score Updates**: Watch your opponent's P&L and equity in real-time
- **Newsflow Integration**: Relevant market news headlines appear each week to influence trading decisions

### User System
- **Secure Authentication**: JWT-based auth with bcrypt password hashing
- **Player Profiles**: View personal stats including win rate, average P&L, and total matches
- **Match History**: Browse and manage your complete match history with custom notes

### Post-Game Analysis
- **AI Coach Feedback**: OpenAI integration provides personalized trading analysis
- **Performance Metrics**: Detailed breakdown of your trades vs. opponent's trades
- **Personal Journal**: Add notes to matches to track learning and strategy

## 📸 Screenshots

### Landing Page
![Landing Page](screenshots/landing.png)

### Gameplay
![Gameplay](screenshots/gameplay.png)

### Results & Analysis
![Analysis](screenshots/analysis.png)

## 🛠 Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **TailwindCSS** for styling and responsive design
- **Recharts** for interactive stock price visualization
- **Socket.io Client** for real-time game synchronization
- **Axios** for API calls
- **Framer Motion** for smooth animations
- **React Router** for client-side navigation

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM for data persistence
- **Socket.io** for WebSocket real-time communication
- **JWT** for secure authentication
- **bcryptjs** for password hashing
- **OpenAI API** for post-game AI analysis
- **CORS** for cross-origin requests

### Database Models
1. **User**: Stores user profiles, credentials, and statistics
2. **Match**: Records game results, trades, and players
3. **StockScenario**: Pre-loaded historical stock data for gameplay

## 📋 Project Structure

```
StockGuessr/
├── server/
│   ├── src/
│   │   ├── index.js                 # Main server file with Socket.io
│   │   ├── models/
│   │   │   ├── User.js             # User schema with bcrypt
│   │   │   ├── Match.js            # Match game results
│   │   │   └── StockScenario.js    # Historical stock data
│   │   ├── routes/
│   │   │   ├── auth.js             # Auth endpoints (register/login)
│   │   │   ├── matches.js          # Match CRUD operations
│   │   │   └── scenarios.js        # Stock scenario endpoints
│   │   ├── middleware/
│   │   │   ├── auth.js             # JWT verification
│   │   │   └── errorHandler.js     # Error handling
│   │   └── utils/
│   │       ├── db.js               # MongoDB connection
│   │       ├── tokenUtils.js       # JWT generation/verification
│   │       ├── gameLogic.js        # Trading logic
│   │       └── aiAnalysis.js       # OpenAI integration
│   ├── .env                        # Environment variables
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── App.jsx                 # Main app with routing
│   │   ├── main.jsx               # React DOM entry point
│   │   ├── index.css              # Tailwind CSS
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Auth state management
│   │   ├── hooks/
│   │   │   └── useAuth.js         # Custom auth hook
│   │   ├── components/
│   │   │   ├── Button.jsx         # Reusable button
│   │   │   ├── StockChart.jsx     # Chart visualization
│   │   │   ├── TradePanel.jsx     # Trading interface
│   │   │   └── ScoreBoard.jsx     # Player scores display
│   │   ├── pages/
│   │   │   ├── Login.jsx          # Login page
│   │   │   ├── Register.jsx       # Registration page
│   │   │   ├── Dashboard.jsx      # Main dashboard with stats
│   │   │   ├── Matchmaking.jsx    # Matchmaking UI
│   │   │   ├── GameBoard.jsx      # Active game board
│   │   │   └── Analysis.jsx       # Post-game analysis
│   │   └── utils/
│   │       ├── api.js             # API client with axios
│   │       └── socket.js          # Socket.io client
│   ├── .env                        # Frontend environment
│   ├── tailwind.config.js         # Tailwind configuration
│   ├── postcss.config.js          # PostCSS plugins
│   └── package.json
│
└── README.md
```

## 🚀 Installation

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- OpenAI API key (for post-game analysis)

### Backend Setup

```bash
cd server
npm install

# Create .env file with:
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stockguessr
JWT_SECRET=your_super_secret_key_change_this
OPENAI_API_KEY=sk-your-openai-api-key
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Frontend Setup

```bash
cd client
npm install

# Create .env file with:
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## 🎯 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

### Production Build

**Frontend:**
```bash
cd client
npm run build
# Creates optimized build in dist/
```

**Backend:** Use any Node.js hosting (Railway, Heroku, etc.)

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user (protected)

### Matches
- `POST /api/matches` - Create new match (protected)
- `GET /api/matches/:id` - Get match details (protected)
- `PUT /api/matches/:id` - Update match with final results (protected)
- `GET /api/matches/history/:userId` - Get user's match history (protected)
- `PATCH /api/matches/:id/note` - Add note to match (protected)
- `DELETE /api/matches/:id` - Delete match (protected)

### Stock Scenarios
- `GET /api/scenarios/random` - Get random scenario for matchmaking
- `GET /api/scenarios` - Get all available scenarios
- `GET /api/scenarios/:id` - Get specific scenario

## 🎮 Gameplay Flow

1. **Registration/Login**: User creates account or logs in
2. **Dashboard**: View stats, match history, or start new game
3. **Matchmaking**: System randomly pairs players or with AI opponent
4. **Game Board**:
   - 4 weeks of trading (each week ~10 seconds)
   - Players see daily candles and volume
   - News headlines appear each week
   - Real-time opponent score updates
5. **Trading Actions**:
   - BUY: Enter long position
   - SELL: Close position and lock in profits/losses
   - HOLD: Do nothing
6. **End of Game**:
   - All positions auto-close at closing price
   - Winner determined by final equity
   - AI provides analysis of trades
7. **Post-Game**:
   - View performance metrics
   - Read AI coach feedback
   - Add personal notes
   - Option to play again

## 🎨 Design Principles

- **Clean & Minimalist**: Inspired by Notion and Apple design
- **Responsive**: Works seamlessly on desktop and mobile
- **Smooth Animations**: Framer Motion for engaging interactions
- **Clear Hierarchy**: Size, weight, and spacing guide user attention
- **Consistent Spacing**: 4px-based spacing scale throughout

## 🔒 Security Features

- **Password Hashing**: Bcryptjs with 10 salt rounds
- **JWT Authentication**: 7-day token expiration
- **Protected Routes**: Frontend redirects unauthenticated users
- **API Authorization**: Backend validates user ownership of resources
- **Environment Variables**: Sensitive keys never committed
- **CORS Protection**: Restricted to approved origins

## 📊 Database Schema

### User
```javascript
{
  email: String (unique),
  username: String (unique),
  password: String (hashed),
  stats: {
    wins: Number,
    losses: Number,
    totalMatches: Number,
    avgPnL: Number,
    totalPnL: Number
  },
  createdAt: Date
}
```

### Match
```javascript
{
  player1: { userId, username, finalEquity, trades[] },
  player2: { userId, username, finalEquity, trades[] },
  winner: ObjectId,
  stockTicker: String,
  stockDate: Date,
  aiAnalysis: String,
  notes: String,
  status: 'IN_PROGRESS' | 'COMPLETED',
  createdAt: Date
}
```

### StockScenario
```javascript
{
  ticker: String,
  startDate: Date,
  contextCandles: [{ date, open, close, high, low, volume }],
  gameCandles: [{ date, open, close, high, low, volume }],
  news: [{ week, headline, date }],
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
}
```

## 🚀 Deployment

### Frontend Deployment (Netlify)
```bash
# Build locally
cd client
npm run build

# Connect to Netlify and deploy
# Set build command: npm run build
# Set publish directory: dist
# Add environment variables in Netlify dashboard
```

### Backend Deployment (Railway)
```bash
# Push to Railway
# Configure:
# - Runtime: Node.js
# - Start command: npm start
# - Environment variables in Railway dashboard
```

## 🎓 Learning Outcomes

This project demonstrates:
- Full-stack MERN development
- Real-time WebSocket communication
- JWT-based authentication
- RESTful API design
- Database schema modeling
- State management with React Context
- Protected routes and authorization
- External API integration (OpenAI)
- Responsive UI design
- Production-ready error handling

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify connection string includes username/password
- Check IP whitelist in MongoDB Atlas
- Ensure database name is correct

### Socket.io Connection Fails
- Verify CORS origins match frontend URL
- Check both frontend and backend are running
- Ensure no firewall blocking WebSocket connections

### API Errors
- Check token is being sent in Authorization header
- Verify backend is running on correct port
- Check .env variables are set correctly

## 📝 Notes

- Stock data is pre-seeded; add scenarios via MongoDB directly or admin endpoint
- AI analysis requires valid OpenAI API key
- Game pacing (10 seconds per week) can be adjusted in GameBoard.jsx
- Matchmaking currently uses random opponent selection; implement queue system for production

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built as a CS390 Web Application Programming capstone project
