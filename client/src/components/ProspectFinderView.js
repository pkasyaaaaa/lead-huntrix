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

      // Build Lusha API filter object
      const lushaFilters = {
        contacts: {
          include: {}
        },
        companies: {
          include: {}
        }
      };

      // Contact filters
      if (filters.departments && filters.departments.length > 0) {
        lushaFilters.contacts.include.departments = filters.departments;
      }
      if (filters.managementLevels && filters.managementLevels.length > 0) {
        lushaFilters.contacts.include.seniority = filters.managementLevels;
      }
      if (filters.jobTitles && filters.jobTitles.length > 0) {
        lushaFilters.contacts.include.jobTitles = filters.jobTitles;
      }
      if (filters.locations && filters.locations.length > 0) {
        // Assuming locations are for contacts
        lushaFilters.contacts.include.locations = filters.locations.map(loc => ({ country: loc }));
      }

      // Company filters
      if (filters.companyNames && filters.companyNames.length > 0) {
        lushaFilters.companies.include.names = filters.companyNames;
      }
      if (filters.industries && filters.industries.length > 0) {
        lushaFilters.companies.include.mainIndustriesIds = filters.industries;
      }
      if (filters.companySizes && filters.companySizes.length > 0) {
        // Assuming sizes are structured as {min, max} from Lusha
        lushaFilters.companies.include.sizes = filters.companySizes;
      }
      if (filters.companyRevenues && filters.companyRevenues.length > 0) {
        lushaFilters.companies.include.revenues = filters.companyRevenues;
      }
      
      // Add search query if provided
      if (searchQuery) {
        lushaFilters.companies.include.searchText = searchQuery;
      }

      // Call Lusha API through our backend
      const response = await axios.post('/api/lusha/search/contacts', {
        filters: lushaFilters,
        page: 0,
        size: 50
      });

      if (response.data && response.data.contacts) {
        setProspects(response.data.contacts);
      } else {
        setProspects([]);
      }
    } catch (error) {
      console.error('Error fetching prospects from Lusha:', error);
      setProspects([]);
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
