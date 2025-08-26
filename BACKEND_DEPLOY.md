# Backend Deployment to Render 🚀

## Current Status
✅ Frontend: https://football-player-value-prediction.vercel.app/
⏳ Backend: Ready to deploy to Render

## Quick Render Deployment Steps

### 1. Go to Render Dashboard
- Visit: https://render.com
- Sign up/Login with GitHub account

### 2. Create New Web Service
- Click "New +" → "Web Service"
- Connect your GitHub repository: `football-player-value-prediction`

### 3. Configure Service Settings
```
Name: football-player-backend
Region: Frankfurt (Europe) or Oregon (US West)
Branch: main
Runtime: Python 3

Build Command: cd backend && pip install -r requirements.txt
Start Command: cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### 4. Environment Variables
Add this environment variable:
```
PYTHONPATH = /opt/render/project/src/backend
```

### 5. Deploy!
- Click "Create Web Service"
- Wait 5-10 minutes for deployment
- Get your backend URL (something like: `https://football-player-backend.onrender.com`)

## After Backend Deployment

### Update Frontend Environment
Once you have the Render URL, update the frontend:

1. Go to your Vercel dashboard
2. Find your project: `football-player-value-prediction`
3. Go to Settings → Environment Variables
4. Add/Update:
   ```
   VITE_API_URL = https://your-render-url.onrender.com
   ```
5. Redeploy frontend

### Test Everything
1. Backend health: `https://your-render-url.onrender.com/health`
2. API docs: `https://your-render-url.onrender.com/docs`
3. Frontend: https://football-player-value-prediction.vercel.app/

## Troubleshooting

### If Render Build Fails:
- Check build logs in Render dashboard
- Verify requirements.txt is correct
- Ensure model.pkl exists in backend/

### If Frontend Can't Connect:
- Update VITE_API_URL in Vercel environment variables
- Redeploy frontend after updating environment
- Check browser console for CORS errors

## Expected Results
- Backend URL: `https://football-player-backend.onrender.com`
- API Docs: `https://football-player-backend.onrender.com/docs`
- Full working app at: https://football-player-value-prediction.vercel.app/

Ready to deploy! 🎯