import React from 'react';
import { positionOptions, footOptions } from '../services/api';
import { countries } from '../constants/countries';
import './PlayerForm.css';

const PlayerForm = ({ 
  playerData, 
  onChange, 
  onSubmit, 
  onValidationError,
  isLoading = false, 
  isFormDirty = false, 
  canSubmit = true 
}) => {
  const handleInputChange = (field, value) => {
    // For numeric fields, preserve the exact input value as string
    // Only convert to number when needed for validation or submission
    const numericFields = [
      'height_cm', 'weight_kg', 'overall_rating', 'potential', 'weak_foot',
      'pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical', 'age'
    ];
    
    if (numericFields.includes(field)) {
      // Store the raw value as-is to preserve user input exactly
      // The input will handle display, and we'll parse only when needed
      onChange(field, value);
    } else {
      onChange(field, value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required numeric fields before submission
    const validationErrors = [];
    
    // Check age
    const age = typeof playerData.age === 'string' ? parseFloat(playerData.age) : playerData.age;
    if (!age || isNaN(age) || age < 16 || age > 45) {
      validationErrors.push('Age must be between 16-45 years');
    }
    
    // Check height
    const height = typeof playerData.height_cm === 'string' ? parseFloat(playerData.height_cm) : playerData.height_cm;
    if (!height || isNaN(height) || height < 150 || height > 210) {
      validationErrors.push('Height must be between 150-210 cm');
    }
    
    // Check weight
    const weight = typeof playerData.weight_kg === 'string' ? parseFloat(playerData.weight_kg) : playerData.weight_kg;
    if (!weight || isNaN(weight) || weight < 50 || weight > 120) {
      validationErrors.push('Weight must be between 50-120 kg');
    }
    
    if (validationErrors.length > 0) {
      if (onValidationError) {
        onValidationError(validationErrors);
      } else {
        // Fallback to alert if toast function not provided
        alert(
          'Please fix the following issues before calculating:\n\n' + 
          validationErrors.join('\n')
        );
      }
      return; // Prevent submission
    }
    
    if (canSubmit && onSubmit) {
      onSubmit();
    }
  };

  // Validation function - shows warnings but doesn't prevent typing
  const getValidationMessage = (field, value) => {
    // Don't show validation for empty fields
    if (!value || value === '') return null;
    
    // Parse the value as number, handle both string and number inputs
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return null;
    
    switch (field) {
      case 'height_cm':
        if (numValue < 150 || numValue > 210) {
          return `⚠️ Recommended range: 150-210 cm (current: ${numValue} cm)`;
        }
        break;
      case 'weight_kg':
        if (numValue < 50 || numValue > 120) {
          return `⚠️ Recommended range: 50-120 kg (current: ${numValue} kg)`;
        }
        break;
      case 'age':
        if (numValue < 16 || numValue > 45) {
          return `⚠️ Recommended range: 16-45 years (current: ${numValue} years)`;
        }
        break;
    }
    return null;
  };

  const renderSlider = (field, label, min, max, step = 1) => {
    const value = playerData[field] || min;
    const percentage = ((value - min) / (max - min)) * 100;
    
    // Get color based on value
    const getSliderColor = (val, maximum) => {
      const percent = (val / maximum) * 100;
      if (percent >= 85) return '#00ff41';
      if (percent >= 75) return '#ffff00';
      if (percent >= 65) return '#ffa500';
      return '#ff4444';
    };

    // Handle click on slider track
    const handleSliderClick = (e) => {
      const slider = e.currentTarget;
      const rect = slider.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const sliderWidth = rect.width;
      const clickPercentage = Math.min(Math.max(clickX / sliderWidth, 0), 1);
      const newValue = Math.round(min + (max - min) * clickPercentage);
      handleInputChange(field, newValue);
    };

    return (
      <div className="form-group slider-group">
        <label className="form-label">
          {label}
          <span className="slider-value" style={{ color: getSliderColor(value, max) }}>
            {value}
          </span>
        </label>
        <div className="slider-container">
          <div 
            className="slider-track"
            onClick={handleSliderClick}
            style={{
              background: `linear-gradient(to right, ${getSliderColor(value, max)} 0%, ${getSliderColor(value, max)} ${percentage}%, #34495e ${percentage}%, #34495e 100%)`
            }}
          >
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="slider"
              disabled={isLoading}
            />
          </div>
          <div className="slider-labels">
            <span>{min}</span>
            <span>{max}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderSelectField = (field, label, options) => {
    return (
      <div className="form-group">
        <label className="form-label">{label}</label>
        <select
          value={playerData[field] || ''}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="form-select"
          disabled={isLoading}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const renderTextField = (field, label, placeholder = '', maxLength = 50) => {
    return (
      <div className="form-group">
        <label className="form-label">{label}</label>
        <input
          type="text"
          value={playerData[field] || ''}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className="form-input"
          disabled={isLoading}
        />
      </div>
    );
  };

  const renderNumberField = (field, label, min, max, placeholder = '') => {
    const value = playerData[field] || '';
    // Only show validation warnings for values outside range, but don't clamp
    const validationMessage = getValidationMessage(field, value);
    
    return (
      <div className="form-group">
        <label className="form-label">{label}</label>
        <div className="numeric-input-container">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={value}
            onChange={(e) => {
              // Allow only numeric input and preserve exact user typing
              const inputValue = e.target.value;
              // Allow empty string, digits, and decimal point
              if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
                handleInputChange(field, inputValue);
              }
            }}
            onKeyDown={(e) => {
              // Allow: backspace, delete, tab, escape, enter, period
              if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
                  // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                  (e.keyCode === 65 && e.ctrlKey === true) ||
                  (e.keyCode === 67 && e.ctrlKey === true) ||
                  (e.keyCode === 86 && e.ctrlKey === true) ||
                  (e.keyCode === 88 && e.ctrlKey === true) ||
                  // Allow: home, end, left, right, down, up
                  (e.keyCode >= 35 && e.keyCode <= 40)) {
                return;
              }
              // Ensure that it's a number and stop the keypress
              if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
              }
            }}
            placeholder={placeholder}
            className={`form-input numeric-input ${validationMessage ? 'form-input-warning' : ''}`}
            disabled={isLoading}
          />
          <div className="input-range-info">
            <span className="range-text">{min}-{max}</span>
          </div>
        </div>
        {validationMessage && (
          <span className="validation-warning">{validationMessage}</span>
        )}
      </div>
    );
  };

  const renderNationalityField = () => {
    return (
      <div className="form-group">
        <label className="form-label">Nationality</label>
        <select
          value={playerData.nationality || ''}
          onChange={(e) => handleInputChange('nationality', e.target.value)}
          className="form-select nationality-select"
          disabled={isLoading}
        >
          <option value="">Select Nationality</option>
          {countries.map(country => (
            <option key={country.code} value={country.name}>
              {country.flag} {country.name}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <form className="player-form" onSubmit={handleSubmit}>
      <h2 className="form-title">Player Editor</h2>
      
      {/* Personal Information */}
      <div className="form-section">
        <h3 className="section-title">Personal Information</h3>
        <div className="form-row">
          {renderTextField('player_name', 'First Name', 'Enter first name')}
          {renderTextField('player_surname', 'Last Name', 'Enter last name')}
        </div>
        <div className="form-row">
          {renderNationalityField()}
          {renderNumberField('age', 'Age', 16, 45, 'Enter age')}
        </div>
      </div>

      {/* Physical Attributes */}
      <div className="form-section">
        <h3 className="section-title">Physical Attributes</h3>
        <div className="form-row">
          {renderNumberField('height_cm', 'Height (cm)', 150, 210, 'Enter height')}
          {renderNumberField('weight_kg', 'Weight (kg)', 50, 120, 'Enter weight')}
        </div>
      </div>

      {/* Position & Preferences */}
      <div className="form-section">
        <h3 className="section-title">Position & Preferences</h3>
        <div className="form-row">
          {renderSelectField('best_position', 'Best Position', positionOptions)}
          {renderSelectField('preferred_foot', 'Preferred Foot', footOptions)}
        </div>
      </div>

      {/* Player Ratings */}
      <div className="form-section">
        <h3 className="section-title">Player Ratings</h3>
        <div className="form-row">
          {renderSlider('overall_rating', 'Overall Rating', 1, 99)}
          {renderSlider('potential', 'Potential', 1, 99)}
        </div>
        {renderSlider('weak_foot', 'Weak Foot', 1, 5)}
      </div>

      {/* Player Attributes */}
      <div className="form-section">
        <h3 className="section-title">Player Attributes</h3>
        {renderSlider('pace', 'Pace', 1, 99)}
        {renderSlider('shooting', 'Shooting', 1, 99)}
        {renderSlider('passing', 'Passing', 1, 99)}
        {renderSlider('dribbling', 'Dribbling', 1, 99)}
        {renderSlider('defending', 'Defending', 1, 99)}
        {renderSlider('physical', 'Physical', 1, 99)}
      </div>

      {isLoading && (
        <div className="form-loading">
          <div className="loading-spinner"></div>
          <span>Calculating prediction...</span>
        </div>
      )}

      {/* Submit Button */}
      <div className="form-submit-section">
        <button 
          type="submit" 
          className={`submit-button ${!canSubmit || isLoading ? 'disabled' : ''} ${isFormDirty ? 'dirty' : ''}`}
          disabled={!canSubmit || isLoading}
        >
          {isLoading ? (
            <>
              <div className="button-spinner"></div>
              Calculating...
            </>
          ) : (
            <>
              📊 Calculate Market Value
              {isFormDirty && <span className="dirty-indicator">*</span>}
            </>
          )}
        </button>
        
        {isFormDirty && (
          <p className="form-hint">
            💡 Changes detected. Click "Calculate Market Value" to update prediction.
          </p>
        )}
        
        {!canSubmit && (
          <p className="form-error">
            ⚠️ Backend server not connected. Cannot calculate predictions.
          </p>
        )}
      </div>
    </form>
  );
};

export default PlayerForm;