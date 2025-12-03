# StockGuessr - Complete Implementation Guide

## Project Overview
StockGuessr is a 1v1 competitive trading game where players trade on hidden historical stock charts. Players get $100,000 starting capital, 4 weeks of gameplay, and real market news headlines to guide their decisions. The goal is to maximize portfolio value.

## Tech Stack
- **Frontend:** Next.js 16, TypeScript, TailwindCSS, Framer Motion, Recharts, Socket.io
- **Backend:** Express.js, Node.js, MongoDB, Socket.io, OpenAI/Anthropic API
- **Database:** MongoDB Atlas
- **Authentication:** JWT with bcrypt hashing
- **AI Analysis:** Anthropic Claude for post-game trading analysis

## Project Structure

### Backend (`/server`)
```
server/
├── src/
│   ├── controllers/     # Business logic
│   ├── models/          # MongoDB schemas
│   │   ├── User.js
│   │   ├── Match.js
│   │   └── StockScenario.js
│   ├── routes/          # API endpoints
│   │   ├── auth.js
│   │   ├── matches.js
│   │   └── scenarios.js
│   ├── middleware/      # Auth & error handling
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── utils/           # Utilities
│   │   ├── db.js        # MongoDB connection
│   │   ├── tokenUtils.js
│   │   ├── aiAnalysis.js
│   │   └── gameLogic.js
│   └── index.js         # Express app & Socket.io
├── scripts/
│   └── seedScenarios.js # Populate 10 stock scenarios
├── .env                 # Environment variables
└── package.json
```

### Frontend (`/client`)
```
client/
├── app/
│   ├── page.tsx         # Landing page
│   ├── login/page.tsx   # Login page
│   ├── register/page.tsx # Registration page
│   ├── dashboard/page.tsx # User dashboard with stats
│   ├── game/page.tsx    # Main game UI with Recharts
│   ├── layout.tsx       # Root layout with AuthProvider
│   ├── globals.css      # Global styles
│   ├── lib/
│   │   └── api.ts       # API client with axios
│   └── context/
│       └── AuthContext.tsx # Auth state management
├── .env.local           # Local environment
├── tailwind.config.ts   # TailwindCSS config
└── package.json
```

## Features Implemented

### ✅ Authentication System
- User registration with email, username, password
- Login with JWT token
- Password hashing with bcrypt
- Protected routes and API endpoints
- Auth context for frontend state management

### ✅ User Dashboard
- View profile stats (Win Rate, Total PnL, Avg PnL)
- Match history with ticker and date
- Quick play button
- Professional GeoGuessr-inspired design

### ✅ Game Loop
- 4-week trading period
- Real stock data with candlestick charts
- Market news headlines per week
- Real-time price updates
- Trading actions: BUY, SELL, HOLD

### ✅ Game UI
- Recharts candlestick + volume visualization
- Live equity tracking
- Trading controls (Buy/Hold/Sell)
- Position tracking (shares, entry price)
- Market news display per week

### ✅ Match System
- Match creation between players
- Trade tracking per player
- Final equity calculation
- Win/loss determination
- Match history & CRUD operations

### ✅ AI Analysis
- Post-game AI coaching using Anthropic Claude
- Trades analyzed against historical data
- Personalized feedback per player
- Encouragement and insights

### ✅ Stock Scenarios
- 10 real-world tech stock scenarios:
  - Tesla (Bull run Q1 2021)
  - Apple (COVID crash & recovery)
  - Microsoft (Interest rate concerns)
  - Nvidia (AI boom)
  - Amazon (E-commerce surge)
  - Meta (Metaverse investment)
  - Google (ChatGPT competition)
  - AMD (AI chip demand)
  - IBM (Restructuring)
  - Intel (Chip shortage recovery)

## Setup & Running Locally

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Anthropic API key (in .env)

### Backend Setup
```bash
cd server
npm install

# Create .env file (already configured)
PORT=5000
MONGODB_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
OPENAI_API_KEY=<your_anthropic_key>
NODE_ENV=development
CORS_ORIGIN=http://localhost:3001

# Seed database with 10 scenarios
npm run seed

# Run development server
npm run dev
# Server runs on http://localhost:5000
```

### Frontend Setup
```bash
cd client
npm install

# Create .env.local file (already configured)
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Run development server
npm run dev
# Frontend runs on http://localhost:3001
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Scenarios
- `GET /api/scenarios/random` - Get random scenario for game
- `GET /api/scenarios` - List all scenarios
- `GET /api/scenarios/:id` - Get specific scenario

### Matches
- `POST /api/matches` - Create new match
- `GET /api/matches/:id` - Get match details
- `PUT /api/matches/:id` - Update match (complete game)
- `GET /api/matches/history/:userId` - Get user's match history
- `GET /api/matches/:id/analysis` - Get AI analysis for match
- `PATCH /api/matches/:id/note` - Add note to match
- `DELETE /api/matches/:id` - Delete match

## Game Flow

1. **Landing Page** - Marketing site with features overview
2. **Authentication** - Register or login
3. **Dashboard** - View stats, match history, start button
4. **Matchmaking** - Find random scenario (in production: pair with player)
5. **Game** - 4 weeks of trading
   - Week 0-3: Buy/Hold/Sell actions
   - News reveals per week
   - Real-time equity updates
6. **Results** - Final equity, PnL, winner
7. **Analysis** - AI coaching on trades (Claude)

## Key UI/UX Features

### Design Inspiration: GeoGuessr
- Dark modern aesthetic with gradient accents
- Clean information hierarchy
- Smooth Framer Motion animations
- Responsive grid layouts
- Real-time stat updates

### Components Used
- Recharts for candlestick + volume charts
- Framer Motion for animations
- Lucide React for icons
- TailwindCSS for styling
- shadcn/ui patterns

## Customization Options

### Add More Stock Scenarios
Edit `/server/scripts/seedScenarios.js`:
```javascript
// Add to sampleScenarios array
{
  ticker: 'YOUR_STOCK',
  startDate: new Date('2023-01-01'),
  contextCandles: generateCandles(...),
  gameCandles: generateCandles(...),
  news: [...],
  difficulty: 'EASY/MEDIUM/HARD'
}
```

### Adjust Game Duration
In `/client/app/game/page.tsx`:
- Change `currentWeek < 3` to control weeks
- Modify timing in the game loop

### Customize AI Analysis
In `/server/src/utils/aiAnalysis.js`:
- Modify the system prompt
- Change tone and feedback style

## Deployment

### Frontend: Netlify
```bash
cd client
npm run build
# Deploy built files to Netlify
# Set environment variable: NEXT_PUBLIC_API_URL=<backend_url>
```

### Backend: Railway
```bash
# Connect your GitHub repo
# Railway automatically detects Node.js app
# Set environment variables in Railway dashboard:
# - MONGODB_URI
# - JWT_SECRET
# - OPENAI_API_KEY (Anthropic)
# - NODE_ENV=production
# - CORS_ORIGIN=<frontend_url>
```

## Testing Checklist

- [ ] User registration with validation
- [ ] User login with correct credentials
- [ ] Dashboard loads with user stats
- [ ] Game scenario loads correctly
- [ ] Chart displays with data
- [ ] Trading actions (Buy/Sell/Hold) work
- [ ] Position tracking updates correctly
- [ ] Final equity calculates properly
- [ ] Match history saves to database
- [ ] AI analysis generates and displays
- [ ] Animations smooth and responsive
- [ ] Mobile responsive design

## Performance Optimizations

- Chart rendering optimized with Recharts
- API requests cached in context
- MongoDB indexes on userId, matchId
- Lazy loading of routes
- Socket.io namespace optimization

## Future Enhancements

1. **Real Matchmaking** - Pair players by skill rating
2. **Leaderboards** - Global rankings
3. **Multiple Markets** - Crypto, Forex, Commodities
4. **Streaming** - Live match broadcasting
5. **Mobile App** - React Native version
6. **Tournaments** - Bracket-style competitions
7. **Practice Mode** - Against bot players
8. **Social Features** - Friending, chat, replays

## Support

For issues or questions:
1. Check logs in development console
2. Verify MongoDB connection
3. Check API key configuration
4. Review network requests in DevTools

## License

This project is part of CS390 Web Application Programming capstone.

---

**Built with:** Next.js, Express, MongoDB, Framer Motion, Recharts, Anthropic API
**Status:** Full-stack complete and ready for deployment
