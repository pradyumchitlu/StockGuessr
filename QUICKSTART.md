# StockGuessr Quick Start Guide

Get the application running locally in 5 minutes!

## Prerequisites

- Node.js v16+ and npm installed
- MongoDB account (create free account at mongodb.com/cloud/atlas)
- OpenAI API key (create at platform.openai.com)

## 1. Clone & Setup

```bash
# Navigate to project
cd StockGuessr

# Install server dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install

# Return to root
cd ..
```

## 2. Configure Environment

### Backend (.env)
Create `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/stockguessr
JWT_SECRET=my_super_secret_key_12345
OPENAI_API_KEY=sk-your-key-here
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## 3. Seed Database

```bash
cd server
npm run seed
```

This populates MongoDB with sample stock scenarios for testing.

## 4. Run Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Server starts on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# App opens on http://localhost:5173
```

## 5. Test the Application

1. Go to `http://localhost:5173`
2. Register a new account
3. Go to Dashboard → Find Match Now
4. Complete a game
5. View results and AI analysis

## Useful Commands

### Backend
```bash
npm run dev        # Start development server
npm run seed       # Seed database with scenarios
npm start          # Start production server
```

### Frontend
```bash
npm run dev        # Start development with HMR
npm run build      # Build for production
npm run preview    # Preview production build
```

## Common Issues

**"Cannot connect to API"**
- Make sure backend is running on port 5000
- Check VITE_API_URL in client/.env matches backend URL

**"MongoDB connection refused"**
- Verify MONGODB_URI is correct
- Check username/password are correct
- Add your IP to MongoDB Atlas whitelist

**"Port 5000 already in use"**
- Kill the process: `lsof -ti:5000 | xargs kill -9` (Mac/Linux)
- Or change PORT in .env and VITE_API_URL

**Socket.io won't connect**
- Check CORS_ORIGIN matches frontend URL
- Verify both servers are running
- Check browser console for errors

## Next Steps

- Read [README.md](./README.md) for full documentation
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) to deploy to production
- Review code structure in each component directory
- Add more stock scenarios to MongoDB

## File Structure Reference

```
StockGuessr/
├── server/           # Node.js Express backend
│   ├── src/
│   │   ├── index.js             # Main server
│   │   ├── models/              # MongoDB schemas
│   │   ├── routes/              # API endpoints
│   │   └── utils/               # Utilities
│   └── scripts/
│       └── seedScenarios.js      # Database seeder
│
├── client/           # React Vite frontend
│   ├── src/
│   │   ├── App.jsx              # Main app
│   │   ├── pages/               # Page components
│   │   ├── components/          # Reusable components
│   │   ├── context/             # State management
│   │   └── utils/               # API client
│   └── vite.config.js
│
├── README.md         # Full documentation
└── DEPLOYMENT.md     # Production deployment guide
```

## Development Tips

- Frontend hot reload: Changes save automatically
- Backend requires manual restart after changes
- Check Chrome DevTools Console for errors
- MongoDB Atlas free tier has limits (512MB)
- OpenAI API costs money - use sparingly in testing

Happy trading! 🚀
