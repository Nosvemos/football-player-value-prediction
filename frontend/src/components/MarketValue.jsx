import React from 'react';
import './MarketValue.css';

const MarketValue = ({ prediction, isLoading = false, error = null }) => {
  return (
    <div className="market-value-container">
      <div className="market-value-header">
        <h3 className="market-value-title">
          💰 Predicted Market Value
        </h3>
      </div>
      
      <div className="market-value-content">
        {isLoading ? (
          <div className="market-value-loading">
            <div className="loading-spinner"></div>
            <span className="loading-text">Calculating Market Value...</span>
          </div>
        ) : error ? (
          <div className="market-value-error">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
          </div>
        ) : prediction ? (
          <div className="market-value-result">
            <div className="value-main">
              <span className="value-amount">{prediction.formatted_value}</span>
              <span className="value-currency">{prediction.currency}</span>
            </div>
            <div className="value-details">
              <span className="value-raw">
                Raw Value: €{prediction.predicted_value.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        ) : (
          <div className="market-value-placeholder">
            <span className="placeholder-icon">🎯</span>
            <span className="placeholder-text">
              Fill in player stats and click "Calculate" to see market value
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketValue;