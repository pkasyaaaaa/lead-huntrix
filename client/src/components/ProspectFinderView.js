import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProspectFinderSearch from './ProspectFinderSearch';
import ProspectFinderResults from './ProspectFinderResults';

const ProspectFinderView = ({ filters, userId, showListView = false, triggerSearch = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (showResults) {
      fetchProspects();
    }
  }, [filters, userId, showResults]);

  // Trigger search when triggerSearch prop changes
  useEffect(() => {
    if (triggerSearch) {
      setShowResults(true);
    }
  }, [triggerSearch]);

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
    setShowResults(true);
    fetchProspects();
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleBackToSearch = () => {
    setShowResults(false);
    setProspects([]);
  };

  // Show results page
  if (showResults) {
    return (
      <ProspectFinderResults
        prospects={prospects}
        loading={loading}
        onBack={handleBackToSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />
    );
  }

  // Show search page
  return (
    <ProspectFinderSearch
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onSearch={handleSearch}
    />
  );
};

export default ProspectFinderView;
