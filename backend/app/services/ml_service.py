import joblib
import pandas as pd
import os
from typing import Dict, Any
from ..models import ModelFeatures, PredictionResponse
import logging

# Try to import catboost, but handle gracefully if not available
try:
    import catboost
    CATBOOST_AVAILABLE = True
except ImportError:
    CATBOOST_AVAILABLE = False
    catboost = None

logger = logging.getLogger(__name__)

class MLModelService:
    def __init__(self):
        self.model = None
        self.model_path = os.path.join(os.path.dirname(__file__), "..", "..", "model.pkl")
        self.load_model()
        
    def load_model(self):
        """Load the CatBoost model from pickle file"""
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"Model file not found at {self.model_path}. Please ensure model.pkl exists in the backend directory.")
        
        try:
            if not CATBOOST_AVAILABLE:
                raise ImportError("CatBoost is required but not installed. Please install CatBoost to use the model.")
            
            self.model = joblib.load(self.model_path)
            
            # Validate that the model can be used for prediction
            if not hasattr(self.model, 'predict'):
                raise ValueError("Loaded model does not have a predict method. Please ensure the model file is valid.")
            
        except Exception as e:
            raise RuntimeError(f"Failed to load model from {self.model_path}: {str(e)}")
    
    def prepare_features(self, player_data: ModelFeatures) -> pd.DataFrame:
        """Convert player data to the format expected by the model"""
        # Convert the Pydantic model to a dictionary
        features_dict = player_data.model_dump()
        
        # CRITICAL: Define the exact feature order that must match the training data
        # This order MUST be identical to what was used during model training
        feature_columns = [
            'height_cm', 'weight_kg', 'best_position', 'overall_rating', 
            'potential', 'preferred_foot', 'weak_foot', 'pace', 'shooting',
            'passing', 'dribbling', 'defending', 'physical', 'age'
        ]
        
        # Ensure all required features are present and in correct format
        model_data = {}
        for col in feature_columns:
            if col in features_dict:
                value = features_dict[col]
                
                # Special handling for categorical features to ensure consistent format
                if col == 'best_position':
                    # Ensure position is uppercase and valid
                    valid_positions = ['CDM', 'RM', 'CAM', 'ST', 'CB', 'CM', 'RW', 'LM', 'RB', 'LB', 'LW', 'CF', 'LWB', 'RWB']
                    value = str(value).upper()
                    if value not in valid_positions:
                        value = 'ST'  # Default fallback
                    
                elif col == 'preferred_foot':
                    # Ensure foot is properly capitalized
                    value = str(value).capitalize()
                    if value not in ['Right', 'Left']:
                        value = 'Right'  # Default fallback
                
                model_data[col] = value
            else:
                raise ValueError(f"Missing required feature: {col}")
        
        # Create DataFrame with features in the exact order expected by the model
        df = pd.DataFrame([model_data], columns=feature_columns)
        
        return df
    
    def format_currency(self, value: float) -> str:
        """Format the predicted value as currency"""
        if value >= 1_000_000:
            return f"€{value / 1_000_000:.1f}M"
        elif value >= 1_000:
            return f"€{value / 1_000:.0f}K"
        else:
            return f"€{value:.0f}"
    
    def predict(self, player_data: ModelFeatures) -> PredictionResponse:
        """Make prediction for a player"""
        if self.model is None:
            raise ValueError("Model not loaded. Please ensure the model file exists and is valid.")
        
        try:
            # Prepare features for the model
            features_df = self.prepare_features(player_data)
            
            # Make prediction
            # For pipeline models, use predict method directly
            if hasattr(self.model, 'predict'):
                prediction = self.model.predict(features_df)
            else:
                raise ValueError("Model does not have predict method")
            
            # Extract the predicted value (assuming it returns a list/array)
            if isinstance(prediction, (list, tuple)):
                predicted_value = float(prediction[0])
            elif hasattr(prediction, '__iter__'):
                predicted_value = float(next(iter(prediction)))
            else:
                predicted_value = float(prediction)
            
            # Ensure the prediction is positive
            predicted_value = max(0, predicted_value)
            
            # Format the response
            formatted_value = self.format_currency(predicted_value)
            
            response = PredictionResponse(
                predicted_value=predicted_value,
                currency="EUR",
                formatted_value=formatted_value
            )
            
            return response
            
        except Exception as e:
            logger.error(f"Prediction failed: {str(e)}")
            raise RuntimeError(f"Failed to make prediction: {str(e)}")

# Global instance
ml_service = MLModelService()