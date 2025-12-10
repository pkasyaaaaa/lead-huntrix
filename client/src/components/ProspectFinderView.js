import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProspectFinderView = ({ filters, userId, showListView = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(false);

  const suggestions = [
    'I want to promote my new HR training program.',
    'Who should I target for my new handmade clothes?',
    'Help me find people interested in solar installation services.',
    'Target the audience that are interested in maid services'
  ];

  useEffect(() => {
    fetchProspects();
  }, [filters, userId]);

  const fetchProspects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        user_id: userId
      });

      if (filters.jobTitles && filters.jobTitles.length > 0) {
        params.append('job_titles', filters.jobTitles.join(','));
      }
      if (filters.managementLevels && filters.managementLevels.length > 0) {
        params.append('management_levels', filters.managementLevels.join(','));
      }
      if (filters.departments && filters.departments.length > 0) {
        params.append('departments', filters.departments.join(','));
      }
      if (filters.locations && filters.locations.length > 0) {
        params.append('locations', filters.locations.join(','));
      }
      if (filters.industries && filters.industries.length > 0) {
        params.append('industries', filters.industries.join(','));
      }
      if (filters.skills && filters.skills.length > 0) {
        params.append('skills', filters.skills.join(','));
      }
      if (searchQuery) {
        params.append('search_query', searchQuery);
      }

      const response = await axios.get(`/api/prospects?${params.toString()}`);
      if (response.data.success) {
        setProspects(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching prospects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchProspects();
  };

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
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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

      {loading && (
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '24px', color: '#007bff' }}></i>
          <p style={{ marginTop: '10px', color: '#666' }}>Loading prospects...</p>
        </div>
      )}

      {!loading && prospects.length > 0 && (
        <div style={{ marginTop: '40px', width: '100%', maxWidth: '900px' }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>
            Found {prospects.length} prospects
          </h3>
          <div style={{ display: 'grid', gap: '15px' }}>
            {prospects.map((prospect) => (
              <div
                key={prospect.id}
                style={{
                  padding: '20px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  transition: 'all 0.2s'
                }}
              >
                <h4 style={{ marginBottom: '8px', color: '#007bff' }}>{prospect.name}</h4>
                <p style={{ marginBottom: '5px', fontSize: '14px' }}>
                  <strong>Position:</strong> {prospect.job_title} at {prospect.company_name}
                </p>
                <p style={{ marginBottom: '5px', fontSize: '14px' }}>
                  <strong>Location:</strong> {prospect.location}
                </p>
                <p style={{ marginBottom: '5px', fontSize: '14px' }}>
                  <strong>Industry:</strong> {prospect.industry}
                </p>
                {prospect.skills && (
                  <p style={{ marginBottom: '5px', fontSize: '14px' }}>
                    <strong>Skills:</strong> {prospect.skills}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && prospects.length === 0 && searchQuery && (
        <div style={{ marginTop: '40px', textAlign: 'center', color: '#666' }}>
          <p>No prospects found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ProspectFinderView;
