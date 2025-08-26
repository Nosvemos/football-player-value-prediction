# ⚽ Football Player Value Prediction

An interactive web application for creating football player cards with AI-powered market value predictions using a CatBoost model.

## 🌟 Features

- **Interactive Player Card Creation**: Design custom EA FC 25-style player cards
- **Real-time Market Value Prediction**: Get instant player valuations using machine learning
- **Modern UI/UX**: Clean, responsive design with real-time updates
- **Comprehensive Player Stats**: Support for all major player attributes and positions

## 🚀 Live Demo

- **Frontend**: https://football-player-value-prediction.vercel.app/
- **Backend**: (Will be deployed to Render)

## 🛠️ Tech Stack

- **Frontend**: React + Vite
- **Backend**: FastAPI (Python)
- **ML Model**: CatBoost
- **Deployment**: Vercel (Frontend) + Render (Backend)

## 📁 Project Structure

```
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API integration
│   │   └── constants/     # Constants and configs
│   └── package.json
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── main.py       # FastAPI application
│   │   ├── models/       # Pydantic models
│   │   └── services/     # ML service
│   ├── model.pkl         # Pre-trained CatBoost model
│   └── requirements.txt
└── README.md
```

## 🔧 Local Development

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Access Points
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 🚀 Deployment

### Frontend (Vercel)
The frontend is automatically deployed to Vercel from this repository.

### Backend (Render)
1. Connect this repository to Render
2. Create a Web Service with:
   - Build Command: `cd backend && pip install -r requirements.txt`
   - Start Command: `cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Environment Variable: `PYTHONPATH=/opt/render/project/src/backend`

## 📊 ML Model

The CatBoost model predicts player market values based on:
- Physical attributes (height, weight, age)
- Playing position and preferred foot
- Skill ratings (pace, shooting, passing, dribbling, defending, physical)
- Overall rating and potential

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Dataset from Kaggle for training the ML model
- EA FC 25 for design inspiration
- React and FastAPI communities