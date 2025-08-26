from pydantic import BaseModel, Field
from typing import Literal, Optional
from enum import Enum

class Position(str, Enum):
    CDM = "CDM"
    RM = "RM"
    CAM = "CAM"
    ST = "ST"
    CB = "CB"
    CM = "CM"
    RW = "RW"
    LM = "LM"
    RB = "RB"
    LB = "LB"
    LW = "LW"
    CF = "CF"
    LWB = "LWB"
    RWB = "RWB"

class PreferredFoot(str, Enum):
    RIGHT = "Right"
    LEFT = "Left"

class PlayerInput(BaseModel):
    """Input model for player data - includes all fields for the frontend"""
    # Required fields for model prediction - relaxed constraints for frontend validation control
    height_cm: int = Field(..., ge=50, le=300, description="Player height in centimeters (frontend validates 150-210)")
    weight_kg: int = Field(..., ge=20, le=200, description="Player weight in kilograms (frontend validates 50-120)")
    best_position: Position = Field(..., description="Player's best position")
    overall_rating: int = Field(..., ge=1, le=99, description="Overall rating")
    potential: int = Field(..., ge=1, le=99, description="Potential rating")
    preferred_foot: PreferredFoot = Field(..., description="Preferred foot")
    weak_foot: int = Field(..., ge=1, le=5, description="Weak foot rating")
    pace: int = Field(..., ge=1, le=99, description="Pace rating")
    shooting: int = Field(..., ge=1, le=99, description="Shooting rating")
    passing: int = Field(..., ge=1, le=99, description="Passing rating")
    dribbling: int = Field(..., ge=1, le=99, description="Dribbling rating")
    defending: int = Field(..., ge=1, le=99, description="Defending rating")
    physical: int = Field(..., ge=1, le=99, description="Physical rating")
    age: int = Field(..., ge=5, le=60, description="Player age (frontend validates 16-45)")
    
    # Optional fields for display purposes only
    player_name: Optional[str] = Field(None, max_length=50, description="Player first name")
    player_surname: Optional[str] = Field(None, max_length=50, description="Player last name")
    nationality: Optional[str] = Field(None, max_length=50, description="Player nationality")

class ModelFeatures(BaseModel):
    """Model for the exact features expected by the CatBoost model"""
    height_cm: int
    weight_kg: int
    best_position: str
    overall_rating: int
    potential: int
    preferred_foot: str
    weak_foot: int
    pace: int
    shooting: int
    passing: int
    dribbling: int
    defending: int
    physical: int
    age: int

class PredictionResponse(BaseModel):
    """Response model for predictions"""
    predicted_value: float = Field(..., description="Predicted market value")
    currency: str = Field(default="EUR", description="Currency of the prediction")
    formatted_value: str = Field(..., description="Human-readable formatted value")

class PlayerCardResponse(BaseModel):
    """Complete response including player data and prediction"""
    player_data: PlayerInput
    prediction: PredictionResponse