from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
from contextlib import asynccontextmanager

from .models import PlayerInput, ModelFeatures, PredictionResponse, PlayerCardResponse
from .services.ml_service import ml_service

# Configure logging for production
logging.basicConfig(level=logging.WARNING)  # Only show warnings and errors
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Silent startup
    yield
    # Silent shutdown

# Create FastAPI app
app = FastAPI(
    title="Football Player Card API",
    description="API for generating football player cards with market value predictions",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS with support for production URLs
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:5173", 
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "https://*.vercel.app",
    "https://*.railway.app",
    "https://*.netlify.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Football Player Card API is running",
        "version": "1.0.0",
        "endpoints": {
            "predict": "/predict",
            "player_card": "/player-card",
            "docs": "/docs",
            "health": "/health"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": ml_service.model is not None
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict_player_value(player_data: PlayerInput):
    """
    Predict the market value of a football player based on their stats.
    
    This endpoint takes player statistics and returns a predicted market value
    using the trained CatBoost model.
    """
    try:
        # Convert to model features (exclude display-only fields)
        model_features = ModelFeatures(
            height_cm=player_data.height_cm,
            weight_kg=player_data.weight_kg,
            best_position=player_data.best_position.value,  # Extract enum value
            overall_rating=player_data.overall_rating,
            potential=player_data.potential,
            preferred_foot=player_data.preferred_foot.value,  # Extract enum value
            weak_foot=player_data.weak_foot,
            pace=player_data.pace,
            shooting=player_data.shooting,
            passing=player_data.passing,
            dribbling=player_data.dribbling,
            defending=player_data.defending,
            physical=player_data.physical,
            age=player_data.age
        )
        
        # Get prediction
        prediction = ml_service.predict(model_features)
        
        return prediction
        
    except Exception as e:
        logger.error(f"Prediction failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/player-card", response_model=PlayerCardResponse)
async def create_player_card(player_data: PlayerInput):
    """
    Create a complete player card with both player data and market value prediction.
    
    This endpoint is perfect for the frontend as it returns all the data needed
    to display a complete player card with the predicted value.
    """
    try:
        # Convert to model features for prediction
        model_features = ModelFeatures(
            height_cm=player_data.height_cm,
            weight_kg=player_data.weight_kg,
            best_position=player_data.best_position.value,
            overall_rating=player_data.overall_rating,
            potential=player_data.potential,
            preferred_foot=player_data.preferred_foot.value,
            weak_foot=player_data.weak_foot,
            pace=player_data.pace,
            shooting=player_data.shooting,
            passing=player_data.passing,
            dribbling=player_data.dribbling,
            defending=player_data.defending,
            physical=player_data.physical,
            age=player_data.age
        )
        
        # Get prediction
        prediction = ml_service.predict(model_features)
        
        # Return complete response
        return PlayerCardResponse(
            player_data=player_data,
            prediction=prediction
        )
        
    except Exception as e:
        logger.error(f"Player card creation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Player card creation failed: {str(e)}")

@app.get("/positions")
async def get_positions():
    """Get list of available positions"""
    return {
        "positions": [
            {"value": "CDM", "label": "CDM - Central Defensive Midfielder"},
            {"value": "RM", "label": "RM - Right Midfielder"},
            {"value": "CAM", "label": "CAM - Central Attacking Midfielder"},
            {"value": "ST", "label": "ST - Striker"},
            {"value": "CB", "label": "CB - Centre Back"},
            {"value": "CM", "label": "CM - Central Midfielder"},
            {"value": "RW", "label": "RW - Right Winger"},
            {"value": "LM", "label": "LM - Left Midfielder"},
            {"value": "RB", "label": "RB - Right Back"},
            {"value": "LB", "label": "LB - Left Back"},
            {"value": "LW", "label": "LW - Left Winger"},
            {"value": "CF", "label": "CF - Centre Forward"},
            {"value": "LWB", "label": "LWB - Left Wing Back"},
            {"value": "RWB", "label": "RWB - Right Wing Back"}
        ]
    }

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Custom HTTP exception handler"""
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "status_code": exc.status_code}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """General exception handler"""
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "status_code": 500}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)