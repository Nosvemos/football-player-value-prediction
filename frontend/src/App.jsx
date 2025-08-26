import React, { useState, useEffect, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PlayerCard from './components/PlayerCard';
import PlayerForm from './components/PlayerForm';
import MarketValue from './components/MarketValue';
import { apiService, defaultPlayerData } from './services/api';
import './App.css';

function App() {
  const [playerData, setPlayerData] = useState(defaultPlayerData);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [isFormDirty, setIsFormDirty] = useState(false);

  const getPrediction = useCallback(async (data) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await apiService.predictPlayerValue(data);
      setPrediction(result);
      setIsFormDirty(false);
    } catch (err) {
      console.error('Prediction error:', err);
      setError(err.message);
      setPrediction(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check backend health on mount
  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        await apiService.healthCheck();
        setBackendStatus('connected');
        // No automatic initial prediction - user must click Calculate button
      } catch (err) {
        console.error('Backend health check failed:', err);
        setBackendStatus('disconnected');
        setError('Cannot connect to backend server. Please ensure the server is running on http://localhost:8000');
      }
    };

    checkBackendHealth();
  }, []); // Removed playerData and getPrediction dependencies

  // Handle form changes (live UI updates, but no auto-predictions)
  const handlePlayerDataChange = (field, value) => {
    const newData = { ...playerData, [field]: value };
    setPlayerData(newData); // This updates the UI live (PlayerCard updates immediately)
    setIsFormDirty(true); // Mark form as having unsaved changes
    // Note: Predictions are only triggered by explicit button click in handleFormSubmit
  };

  // Handle manual form submission
  const handleFormSubmit = () => {
    if (backendStatus === 'connected') {
      getPrediction(playerData);
    } else {
      setError('Cannot submit: Backend server is not connected.');
    }
  };

  // Show validation toast messages
  const showValidationToast = (errors) => {
    toast.error(
      <div>
        <strong>Validation Errors</strong>
        <div style={{ marginTop: '8px', lineHeight: '1.4' }}>
          {errors.map((error, index) => (
            <div key={index} style={{ marginBottom: '4px' }}>
              {error}
            </div>
          ))}
        </div>
      </div>,
      {
        position: 'top-center',
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        icon: false, // Remove the default error icon
      }
    );
  };

  // Retry connection
  const retryConnection = async () => {
    setBackendStatus('checking');
    setError(null);
    
    try {
      await apiService.healthCheck();
      setBackendStatus('connected');
      // No automatic prediction - user must click Calculate button
    } catch (err) {
      setBackendStatus('disconnected');
      setError('Still cannot connect to backend server.');
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">
          <span className="app-icon">⚽</span>
          Football Player Card Generator
        </h1>
        <p className="app-subtitle">
          Create custom player cards with AI-powered market value predictions
        </p>
        
        {/* Backend Status Indicator */}
        <div className={`status-indicator ${backendStatus}`}>
          <span className="status-dot"></span>
          <span className="status-text">
            {backendStatus === 'checking' && 'Connecting to server...'}
            {backendStatus === 'connected' && 'Server connected'}
            {backendStatus === 'disconnected' && 'Server disconnected'}
          </span>
          {backendStatus === 'disconnected' && (
            <button className="retry-button" onClick={retryConnection}>
              Retry
            </button>
          )}
        </div>
      </header>

      <main className="app-main">
        {/* Error Display */}
        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span className="error-message">{error}</span>
            <button 
              className="error-close" 
              onClick={() => setError(null)}
              aria-label="Close error"
            >
              ×
            </button>
          </div>
        )}

        <div className="app-content">
          {/* Player Form */}
          <div className="form-container">
            <PlayerForm
              playerData={playerData}
              onChange={handlePlayerDataChange}
              onSubmit={handleFormSubmit}
              onValidationError={showValidationToast}
              isLoading={isLoading}
              isFormDirty={isFormDirty}
              canSubmit={backendStatus === 'connected'}
            />
          </div>

          {/* Player Card and Market Value */}
          <div className="card-container">
            <PlayerCard
              playerData={playerData}
            />
            <MarketValue
              prediction={prediction}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Powered by <strong>CatBoost ML</strong> • 
          Built with <strong>React</strong> & <strong>FastAPI</strong>
        </p>
        <p className="footer-note">
          Note: This is a demonstration application. 
          Market values are ML-generated predictions for educational purposes.
        </p>
        <p className="dataset-reference">
          Dataset: <a 
            href="https://www.kaggle.com/datasets/sametozturkk/ea-sports-fc-25-real-player-data-sofifa-merge" 
            target="_blank" 
            rel="noopener noreferrer"
            className="dataset-link"
          >
            EA Sports FC 25 Real Player Data (Kaggle)
          </a>
        </p>
      </footer>
      
      {/* Toast Container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          backgroundColor: '#1a1a2e',
          color: '#ecf0f1',
          border: '1px solid rgba(52, 152, 219, 0.3)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
        }}
      />
    </div>
  );
}

export default App;
