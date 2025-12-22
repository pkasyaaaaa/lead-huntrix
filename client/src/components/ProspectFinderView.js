import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProspectFinderSearch from './ProspectFinderSearch';
import ProspectFinderResults from './ProspectFinderResults';
import industryData from '../data/industryData.json';

const ProspectFinderView = ({ filters, userId, showListView = false, triggerSearch = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [cachedFilters, setCachedFilters] = useState(null);
  const [lastTriggerSearch, setLastTriggerSearch] = useState(triggerSearch);
  const [requestId, setRequestId] = useState(null);

  // Load cached results on mount
  useEffect(() => {
    const cached = localStorage.getItem('lusha_search_cache');
    if (cached) {
      try {
        const { results, filters: savedFilters, timestamp, requestId: cachedRequestId } = JSON.parse(cached);
        // Cache expires after 24 hours
        const isExpired = Date.now() - timestamp > 24 * 60 * 60 * 1000;
        
        if (!isExpired && results && results.length > 0) {
          console.log('Loading cached Lusha results:', results.length, 'prospects');
          setProspects(results);
          setCachedFilters(savedFilters);
          if (cachedRequestId) {
            setRequestId(cachedRequestId);
          }
          setShowResults(true);
        }
      } catch (e) {
        console.error('Error loading cache:', e);
        localStorage.removeItem('lusha_search_cache');
      }
    }
  }, []);

  // Only trigger search when triggerSearch value actually changes
  useEffect(() => {
    if (triggerSearch !== lastTriggerSearch) {
      setLastTriggerSearch(triggerSearch);
      setShowResults(true);
      fetchProspects();
    }
  }, [triggerSearch]);

  const fetchProspects = async () => {
    try {
      setLoading(true);

      // Seniority mapping: display text -> Lusha ID (must be numbers, not strings)
      const SENIORITY_MAPPING = {
        'Founder': 10,
        'C-suite': 9,
        'Vice President': 8,
        'partner': 7,
        'Director': 6,
        'Manager': 5,
        'Senior': 4,
        'Entry': 3,
        'Intern': 2,
        'Other': 1
      };

      // Build Lusha API filter object (exact format)
      const lushaFilters = {
        contacts: {
          include: {}
        },
        companies: {
          include: {},
          exclude: {}
        }
      };

      // Contact filters
      if (filters.departments && filters.departments.length > 0) {
        lushaFilters.contacts.include.departments = filters.departments;
      }
      
      if (filters.managementLevels && filters.managementLevels.length > 0) {
        // Convert display names to Lusha IDs
        lushaFilters.contacts.include.seniority = filters.managementLevels.map(
          level => SENIORITY_MAPPING[level] || level
        );
      }
      
      if (filters.jobTitles && filters.jobTitles.length > 0) {
        lushaFilters.contacts.include.jobTitles = filters.jobTitles;
      }
      
      if (filters.locations && filters.locations.length > 0) {
        // Format: [{ country: "Malaysia" }]
        lushaFilters.contacts.include.locations = filters.locations.map(loc => ({
          country: loc
        }));
      }

      // Company filters
      if (filters.companyNames && filters.companyNames.length > 0) {
        lushaFilters.companies.include.names = filters.companyNames;
      }
      
      if (filters.industries && filters.industries.length > 0) {
        // Convert industry names to IDs
        const mainIndustryIds = [];
        const subIndustryIds = [];
        
        filters.industries.forEach(industry => {
          // Remove (Main) or (Sub) label to get the actual name
          const industryName = industry.replace(/\s*\((Main|Sub)\)/, '');
          const isMain = industry.includes('(Main)');
          
          if (isMain) {
            // Find main industry ID
            const mainInd = industryData.find(item => item.main_industry === industryName);
            if (mainInd) {
              mainIndustryIds.push(mainInd.main_industry_id);
            }
          } else {
            // Find sub industry ID
            industryData.forEach(mainInd => {
              const subInd = mainInd.sub_industries?.find(sub => sub.value === industryName);
              if (subInd) {
                subIndustryIds.push(subInd.id);
              }
            });
          }
        });
        
        if (mainIndustryIds.length > 0) {
          lushaFilters.companies.include.mainIndustriesIds = mainIndustryIds;
        }
        if (subIndustryIds.length > 0) {
          lushaFilters.companies.include.subIndustriesIds = subIndustryIds;
        }
      }
      
      if (filters.companySizes && filters.companySizes.length > 0) {
        // Already in correct format: [{ min: 501, max: 1000 }]
        lushaFilters.companies.include.sizes = filters.companySizes;
      }
      
      if (filters.companyRevenues && filters.companyRevenues.length > 0) {
        lushaFilters.companies.include.revenues = filters.companyRevenues;
      }
      
      // Add search query if provided
      if (searchQuery) {
        lushaFilters.contacts.include.searchText = searchQuery;
      }

      console.log('Sending Lusha request:', JSON.stringify({ filters: lushaFilters, page: 0, size: 25 }, null, 2));

      // Call Lusha API through our backend
      const response = await axios.post('/api/lusha/search/contacts', {
        filters: lushaFilters,
        page: 0,
        size: 25
      });

      console.log('=== LUSHA RESPONSE DEBUG ===');
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      console.log('Response.data type:', typeof response.data);
      console.log('Response.data.data:', response.data?.data);
      console.log('Response.data.data length:', response.data?.data?.length);

      // Lusha API returns contacts in response.data.data array
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        console.log('Setting prospects to:', response.data.data);
        setProspects(response.data.data);
        
        // Store requestId for enrichment
        if (response.data.requestId) {
          setRequestId(response.data.requestId);
          console.log('📋 Stored requestId:', response.data.requestId);
        }
        
        // Cache results to localStorage
        const cacheData = {
          results: response.data.data,
          filters: filters,
          timestamp: Date.now(),
          requestId: response.data.requestId
        };
        localStorage.setItem('lusha_search_cache', JSON.stringify(cacheData));
        setCachedFilters(filters);
        console.log('💾 Cached', response.data.data.length, 'prospects to localStorage');
      } else {
        console.log('No contacts found in response, setting empty array');
        setProspects([]);
      }
      console.log('=== END DEBUG ===');
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

  const handleRefresh = () => {
    console.log('🔄 Forcing refresh - clearing cache');
    localStorage.removeItem('lusha_search_cache');
    setCachedFilters(null);
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
        onRefresh={handleRefresh}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        requestId={requestId}
        userId={userId}
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
