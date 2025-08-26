# Render Backend Deployment Guide

## 🎉 Frontend Status: ✅ DEPLOYED
**Frontend URL**: https://football-player-value-prediction.vercel.app/

Now let's deploy the backend to Render to complete the setup.

## Step 1: Create GitHub Repository

1. **Initialize Git** (if not already done):
   ```bash
   cd /Users/sametozturk/Documents/FinalProjectML
   git init
   git add .
   git commit -m "Initial commit - Football Player Card Generator"
   ```

2. **Create GitHub Repository**:
   - Go to https://github.com/new
   - Repository name: `football-player-card-generator`
   - Set to Public
   - Don't initialize with README (we have files already)
   - Click "Create repository"

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/football-player-card-generator.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy Backend to Render

1. **Go to Render**: https://render.com (Sign up if needed)

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select "football-player-card-generator" repository

3. **Configure Service**:
   ```
   Name: football-player-card-backend
   Region: Oregon (US West) or closest to you
   Branch: main
   Runtime: Python 3
   
   Build Command: cd backend && pip install -r requirements.txt
   Start Command: cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

4. **Environment Variables**:
   ```
   PYTHONPATH = /opt/render/project/src/backend
   ```

5. **Advanced Settings**:
   - Auto-Deploy: Yes
   - Health Check Path: /health

6. **Deploy**: Click "Create Web Service"

## Step 3: Update Frontend with Backend URL

1. **Get Render URL**: After deployment, Render will provide a URL like:
   `https://football-player-card-backend.onrender.com`

2. **Update Frontend Environment**:
   ```bash
   # Update frontend/.env.production
   VITE_API_URL=https://your-render-url.onrender.com
   VITE_APP_ENV=production
   ```

3. **Redeploy Frontend**:
   ```bash
   cd frontend
   npx vercel --prod
   ```

## Step 4: Test Complete Application

1. **Test Backend**: Visit `https://your-render-url.onrender.com/docs`
2. **Test Frontend**: Visit your Vercel frontend URL
3. **Test Integration**: Fill out the player form and click "Calculate Market Value"

## Render Configuration Files (Already Created)

- `requirements.txt` (root level) ✅
- `Procfile` ✅
- `render.yaml` ✅

## Alternative: One-Click Deploy to Render

If you prefer, you can use this button after pushing to GitHub:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

## Troubleshooting

### If Backend Deployment Fails:
1. Check Render build logs
2. Ensure all dependencies are in requirements.txt
3. Verify Python version compatibility

### If Frontend Can't Connect to Backend:
1. Check CORS settings in backend (already configured)
2. Verify environment variable is correct
3. Check browser console for errors

## Expected Timeline
- GitHub push: 1-2 minutes
- Render deployment: 3-5 minutes
- Frontend update: 1-2 minutes
- **Total**: ~10 minutes

## Final URLs
- **Frontend**: https://football-player-value-prediction.vercel.app/ ✅
- **Backend**: https://your-render-url.onrender.com (after deployment)
- **API Docs**: https://your-render-url.onrender.com/docs (after deployment)

---

Let me know when you've completed the GitHub push and Render deployment, and I'll help you with the final frontend update!