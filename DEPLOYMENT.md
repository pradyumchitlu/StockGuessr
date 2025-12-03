# StockGuessr Deployment Guide

This guide covers how to deploy StockGuessr to production on Netlify (frontend) and Railway (backend).

## Prerequisites

- GitHub account with the StockGuessr repository pushed
- MongoDB Atlas account (free tier available)
- OpenAI API key
- Netlify account
- Railway account

## Step 1: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new project named "StockGuessr"
4. Create a cluster (select free tier)
5. Create a database user with username and password
6. Whitelist IP addresses (add 0.0.0.0/0 for development)
7. Get your connection string from "Connect" button
8. Format: `mongodb+srv://username:password@cluster-name.mongodb.net/stockguessr?retryWrites=true&w=majority`

## Step 2: OpenAI API Setup

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Sign up or log in
3. Navigate to API keys section
4. Create a new API key
5. Copy and save securely (you'll need it for backend config)

## Step 3: Backend Deployment (Railway)

### Create Railway Account
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Create a new project

### Deploy Backend
1. Select "Deploy from GitHub"
2. Select your StockGuessr repository
3. Railway will auto-detect it's a Node.js project
4. In the "Variables" tab, add:

```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/stockguessr
JWT_SECRET=generate_a_random_string_here
OPENAI_API_KEY=sk-your-openai-api-key
NODE_ENV=production
CORS_ORIGIN=https://your-netlify-domain.netlify.app
```

5. Railway will provide you with a public URL (e.g., `https://stockguessr-prod.up.railway.app`)
6. Save this URL - you'll need it for frontend configuration

### Seed Database with Scenarios
After deployment:
1. SSH into Railway instance or run locally with production DB connection
2. Run: `node scripts/seedScenarios.js`
3. This populates the database with sample stock scenarios

## Step 4: Frontend Deployment (Netlify)

### Create Netlify Account
1. Go to [Netlify](https://netlify.com)
2. Sign up with GitHub
3. Create a new site

### Deploy Frontend
1. In Netlify: Click "Add new site" → "Import an existing project"
2. Select your GitHub repository
3. Configure build settings:
   - Build command: `cd client && npm run build`
   - Publish directory: `client/dist`
4. Add environment variables in Netlify dashboard:

```
VITE_API_URL=https://your-railway-domain.up.railway.app/api
VITE_SOCKET_URL=https://your-railway-domain.up.railway.app
```

5. Deploy!
6. Netlify will provide you with a domain (e.g., `stockguessr-prod.netlify.app`)

### Update Backend CORS
1. Go back to Railway
2. Update the `CORS_ORIGIN` variable with your Netlify domain
3. Redeploy backend

## Step 5: Post-Deployment Setup

### Test the Application
1. Go to your Netlify domain
2. Register a new account
3. Try creating a match
4. Verify Socket.io connection works (check browser console)
5. Test trading actions and post-game analysis

### Monitor Logs
- **Railway**: Dashboard shows real-time logs
- **Netlify**: Build logs available in deploy history
- **Browser Console**: Check for any frontend errors

### Troubleshooting Deployment

**"Cannot connect to API"**
- Verify `VITE_API_URL` matches Railway domain
- Check Railway backend is running (status in dashboard)
- Verify CORS_ORIGIN in Railway includes Netlify domain

**"Socket.io won't connect"**
- Verify `VITE_SOCKET_URL` matches Railway domain
- Check for WebSocket support (Railway supports it by default)
- Look for CORS errors in browser console

**"MongoDB connection fails"**
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user password doesn't have special characters (or URL-encode them)

**"OpenAI API errors"**
- Verify API key is correct
- Check OpenAI account has credits
- Review API usage limits

## Step 6: Custom Domain (Optional)

### For Netlify
1. In Netlify dashboard, go to Site settings
2. Change site name or add custom domain
3. Configure DNS (Netlify guides you through this)

### For Railway
1. Railway provides automatic HTTPS with their domain
2. To use custom domain, add to Railway "Variables" or "Custom Domain" section

## Environment Variables Checklist

### Server (.env in Railway)
- [ ] PORT=5000
- [ ] MONGODB_URI (with credentials)
- [ ] JWT_SECRET (random 32+ char string)
- [ ] OPENAI_API_KEY (starts with sk-)
- [ ] NODE_ENV=production
- [ ] CORS_ORIGIN (Netlify domain)

### Client (.env in Netlify)
- [ ] VITE_API_URL (Railway domain + /api)
- [ ] VITE_SOCKET_URL (Railway domain, no /api)

## Monitoring & Maintenance

### Database
- Monitor database size in MongoDB Atlas
- Set up automated backups
- Review slow queries in Atlas monitoring

### Backend
- Check Railway logs for errors
- Monitor CPU and memory usage
- Set up error alerting

### Frontend
- Monitor Netlify deploy logs
- Use Google Analytics for user tracking
- Check Core Web Vitals in Lighthouse

## Scaling Considerations

For production deployment with more users:

1. **Database**: Upgrade MongoDB Atlas plan
2. **Backend**: Increase Railway memory/CPU
3. **Frontend**: Netlify scales automatically (CDN-hosted)
4. **Socket.io**: May need Redis for multi-server scaling

## Security Checklist

- [ ] JWT_SECRET is strong and random
- [ ] API keys are not visible in repository
- [ ] HTTPS enabled (automatic on Railway/Netlify)
- [ ] CORS properly configured
- [ ] Database backups enabled
- [ ] Input validation on backend
- [ ] Rate limiting implemented (optional)

## Rollback Plan

If deployment goes wrong:
1. Railway: Click previous deployment to revert
2. Netlify: Go to "Deploys" and select previous version
3. Verify MongoDB is still in sync after rollback

## Next Steps

1. Set up GitHub Actions for CI/CD
2. Add staging environment
3. Implement automated testing
4. Set up monitoring/alerting
5. Configure backup strategy
