import axios from 'axios';

// Environment-aware API configuration
const getApiBaseUrl = () => {
  // Check if we're in development
  if (import.meta.env.DEV) {
    return 'http://localhost:8000';
  }
  
  // In production, use environment variables or relative paths
  const baseUrl = import.meta.env.VITE_API_URL;
  if (baseUrl) {
    return baseUrl;
  }
  
  // For Vercel deployment, use relative path to serverless functions
  if (window.location.hostname.includes('vercel.app')) {
    return `${window.location.origin}/api`;
  }
  
  // For Railway or other deployments
  return window.location.origin;
};

// Create axios instance with base configuration
const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Increased timeout for serverless cold starts
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('Making API request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Health check
  async healthCheck() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw new Error(`Health check failed: ${error.message}`);
    }
  },

  // Get available positions
  async getPositions() {
    try {
      const response = await api.get('/positions');
      return response.data.positions;
    } catch (error) {
      throw new Error(`Failed to fetch positions: ${error.message}`);
    }
  },

  // Predict player value
  async predictPlayerValue(playerData) {
    try {
      const response = await api.post('/predict', playerData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message;
      throw new Error(`Prediction failed: ${errorMessage}`);
    }
  },

  // Create complete player card with prediction
  async createPlayerCard(playerData) {
    try {
      const response = await api.post('/player-card', playerData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message;
      throw new Error(`Player card creation failed: ${errorMessage}`);
    }
  },
};

// Default player data for initialization
export const defaultPlayerData = {
  // Required fields for model
  height_cm: 180,
  weight_kg: 75,
  best_position: 'ST',
  overall_rating: 75,
  potential: 80,
  preferred_foot: 'Right',
  weak_foot: 3,
  pace: 75,
  shooting: 75,
  passing: 75,
  dribbling: 75,
  defending: 50,
  physical: 75,
  age: 25,
  
  // Optional display fields
  player_name: '',
  player_surname: '',
  nationality: '',
};

// Position options with labels
export const positionOptions = [
  { value: 'ST', label: 'ST - Striker' },
  { value: 'CF', label: 'CF - Centre Forward' },
  { value: 'CAM', label: 'CAM - Central Attacking Midfielder' },
  { value: 'CM', label: 'CM - Central Midfielder' },
  { value: 'CDM', label: 'CDM - Central Defensive Midfielder' },
  { value: 'LW', label: 'LW - Left Winger' },
  { value: 'RW', label: 'RW - Right Winger' },
  { value: 'LM', label: 'LM - Left Midfielder' },
  { value: 'RM', label: 'RM - Right Midfielder' },
  { value: 'LB', label: 'LB - Left Back' },
  { value: 'RB', label: 'RB - Right Back' },
  { value: 'LWB', label: 'LWB - Left Wing Back' },
  { value: 'RWB', label: 'RWB - Right Wing Back' },
  { value: 'CB', label: 'CB - Centre Back' },
];

// Preferred foot options
export const footOptions = [
  { value: 'Right', label: 'Right' },
  { value: 'Left', label: 'Left' },
];

export default api;