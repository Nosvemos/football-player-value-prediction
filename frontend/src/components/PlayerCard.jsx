import React from 'react';
import { getCountryByName } from '../constants/countries';
import './PlayerCard.css';

const PlayerCard = ({ playerData }) => {
  // Get the display name
  const displayName = () => {
    if (playerData.player_name && playerData.player_surname) {
      return `${playerData.player_name} ${playerData.player_surname}`;
    } else if (playerData.player_name) {
      return playerData.player_name;
    } else if (playerData.player_surname) {
      return playerData.player_surname;
    }
    return 'NAME SURNAME';
  };

  // Get position color scheme
  const getPositionColor = (position) => {
    const positionColors = {
      'ST': '#e74c3c',     // Red - Striker
      'CF': '#e74c3c',     // Red - Centre Forward
      'CAM': '#f39c12',    // Orange - Attacking Mid
      'CM': '#2ecc71',     // Green - Central Mid
      'CDM': '#2ecc71',    // Green - Defensive Mid
      'LW': '#9b59b6',     // Purple - Left Wing
      'RW': '#9b59b6',     // Purple - Right Wing
      'LM': '#3498db',     // Blue - Left Mid
      'RM': '#3498db',     // Blue - Right Mid
      'LB': '#34495e',     // Dark Blue - Left Back
      'RB': '#34495e',     // Dark Blue - Right Back
      'LWB': '#34495e',    // Dark Blue - Left Wing Back
      'RWB': '#34495e',    // Dark Blue - Right Wing Back
      'CB': '#95a5a6',     // Gray - Centre Back
    };
    return positionColors[position] || '#3498db';
  };

  // Calculate overall rating color
  const getRatingColor = (rating) => {
    if (rating >= 90) return '#00ff00'; // Bright green
    if (rating >= 85) return '#7fff00'; // Light green
    if (rating >= 80) return '#ffff00'; // Yellow
    if (rating >= 75) return '#ffa500'; // Orange
    if (rating >= 70) return '#ff6600'; // Dark orange
    return '#ff0000'; // Red
  };

  // Get stat bars color based on value
  const getStatColor = (value) => {
    if (value >= 85) return '#00ff41';
    if (value >= 75) return '#ffff00';
    if (value >= 65) return '#ffa500';
    return '#ff4444';
  };

  return (
    <div className="player-card">
      <div className="card-background">
        {/* Card Header */}
        <div className="card-header">
          <div className="ratings-section">
            <div className="overall-rating" style={{ color: getRatingColor(playerData.overall_rating) }}>
              {playerData.overall_rating}
            </div>
            <div className="position" style={{ backgroundColor: getPositionColor(playerData.best_position) }}>
              {playerData.best_position}
            </div>
          </div>
          <div className="position-section">
          </div>
          <div className="foot-section">
            <div className="potential">
              POT: {playerData.potential}
            </div>
            <div className="preferred-foot">
              {playerData.preferred_foot} Foot
            </div>
            <div className="weak-foot-compact">
              WF – {[...Array(playerData.weak_foot)].map((_, i) => '★').join('')}
            </div>
          </div>
        </div>

        {/* Stats Section - moved to bottom */}
        <div className="stats-section-bottom">
          {/* Player Info */}
          <div className="player-info">
            <div className="player-name">
              {displayName()}
            </div>
          </div>
          
          <div className="main-stats-horizontal">
            <div className="stat-horizontal">
              <span className="stat-label">PAC</span>
              <span className="stat-value" style={{ color: getStatColor(playerData.pace) }}>
                {playerData.pace}
              </span>
            </div>
            <div className="stat-horizontal">
              <span className="stat-label">SHO</span>
              <span className="stat-value" style={{ color: getStatColor(playerData.shooting) }}>
                {playerData.shooting}
              </span>
            </div>
            <div className="stat-horizontal">
              <span className="stat-label">PAS</span>
              <span className="stat-value" style={{ color: getStatColor(playerData.passing) }}>
                {playerData.passing}
              </span>
            </div>
            <div className="stat-horizontal">
              <span className="stat-label">DRI</span>
              <span className="stat-value" style={{ color: getStatColor(playerData.dribbling) }}>
                {playerData.dribbling}
              </span>
            </div>
            <div className="stat-horizontal">
              <span className="stat-label">DEF</span>
              <span className="stat-value" style={{ color: getStatColor(playerData.defending) }}>
                {playerData.defending}
              </span>
            </div>
            <div className="stat-horizontal">
              <span className="stat-label">PHY</span>
              <span className="stat-value" style={{ color: getStatColor(playerData.physical) }}>
                {playerData.physical}
              </span>
            </div>
          </div>
          
          {/* Country Flag - at bottom */}
          <div className="country-flag-stats">
            {playerData.nationality && (() => {
              const country = getCountryByName(playerData.nationality);
              return country ? (
                <span className="country-flag-emoji">{country.flag}</span>
              ) : null;
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;