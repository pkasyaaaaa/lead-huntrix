import React, { useState } from 'react';

const suggestions = [
  'I want to promote my new HR training program.',
  'Who should I target for my new handmade clothes?',
  'Help me find people interested in solar installation services.',
  'Target the audience that are interested in maid services'
];

export default function ProspectFinderSearch({ searchQuery, setSearchQuery, onSearch }) {
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="prospect-finder-view">
      <div className="search-container">
        <div className="search-title">
          Keyword Search to find your lead
          <span className="info-icon" title="Search for prospects using keywords">
            <i className="fas fa-info-circle"></i>
          </span>
        </div>
        <div className="search-box">
          <span className="search-icon"><i className="fas fa-search"></i></span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSearch()}
            placeholder="Try any keyword and explore related companies & staff"
          />
          <button className="clear-btn" onClick={clearSearch}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div className="suggestions-container">
        <div className="suggestions-title">AI-powered search suggestions</div>
        <div className="suggestions-grid">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="suggestion-card"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
