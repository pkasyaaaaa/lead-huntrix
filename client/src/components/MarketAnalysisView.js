import React, { useState } from 'react';
import axios from 'axios';

const MarketAnalysisView = ({ userId }) => {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisId, setAnalysisId] = useState(null);

  const suggestions = [
    'Analyze the electric scooter market in Southeast Asia.',
    'Give a market overview of premium home fragrance products.',
    'Market insights for mushroom farming.'
  ];

  const handleStartAnalysis = async () => {
    if (!query.trim()) {
      alert('Please enter a query');
      return;
    }

    try {
      setIsAnalyzing(true);
      const response = await axios.post('/api/market-analysis', {
        user_id: userId,
        query: query
      });

      if (response.data.success) {
        setAnalysisId(response.data.data.id);
        // In a real app, you would poll for completion or use WebSocket
        setTimeout(() => {
          // Simulate completion after 3-4 minutes (for demo, we'll use shorter time)
        }, 3000);
      }
    } catch (error) {
      console.error('Error starting market analysis:', error);
      alert('Failed to start market analysis');
      setIsAnalyzing(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
  };

  const handleBackToDashboard = () => {
    setIsAnalyzing(false);
    setAnalysisId(null);
    setQuery('');
  };

  const clearQuery = () => {
    setQuery('');
  };

  if (isAnalyzing) {
    return (
      <div className="market-analysis-view">
        <div className="progress-container">
          <div className="logo">
            <img src="/image/logo.png" alt="Company Logo" />
          </div>
          <span className="icon">
            <i className="fas fa-hourglass-half"></i>
          </span>
          <div className="progress-title">Deep Market Analysis in Progress...</div>
          <div className="progress-subtitle">(3-4 minutes)</div>
          <button className="back-dashboard-btn" onClick={handleBackToDashboard}>
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="market-analysis-view">
      <div className="search-container">
        <div className="search-title">
          Unlock Real-Time Market Signals
          <span className="info-icon" title="Perfect for planning, pitching, and market research.">
            <i className="fas fa-info-circle"></i>
          </span>
        </div>
        <div className="search-box">
          <span className="search-icon"><i className="fas fa-search"></i></span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleStartAnalysis()}
            placeholder="Enter your product or market... e.g., Healthy chocolate drink, Trading course"
          />
          <button className="clear-btn" onClick={clearQuery}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="suggestions-container">
          <div className="suggestions-grid">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-card-ma"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        </div>
        <button
          className="start-analysis-btn"
          onClick={handleStartAnalysis}
          disabled={!query.trim()}
        >
          Start Market Analysis
        </button>
      </div>
    </div>
  );
};

export default MarketAnalysisView;
