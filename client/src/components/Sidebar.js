import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Sidebar = ({
  activeView,
  onViewChange,
  sidebarClosed,
  onToggleSidebar,
  prospectFilterExpanded,
  onToggleProspectFilter,
  filters,
  setFilters,
  userId,
  onSearch
}) => {
  const FULL_LOGO_SRC = '/image/logo.png';
  const SIDE_LOGO_SRC = '/image/side_logo.png';

  // State for filter options from Lusha API
  const [filterOptions, setFilterOptions] = useState({
    departments: [],
    seniority: [],
    industries: [],
    sizes: [],
    revenues: [],
    countries: []
  });

  const [loadingFilters, setLoadingFilters] = useState({
    departments: false,
    seniority: false,
    industries: false,
    sizes: false,
    revenues: false
  });

  // Helper to extract string values from API responses
  const extractValues = (data) => {
    if (!Array.isArray(data)) return [];
    return data.map(item => {
      if (typeof item === 'string') return item;
      if (typeof item === 'object' && item !== null) {
        return item.name || item.label || item.value || item.title || JSON.stringify(item);
      }
      return String(item);
    });
  };

  // Fetch departments from Lusha API
  const fetchDepartments = async () => {
    if (filterOptions.departments.length > 0) return; // Already loaded
    
    setLoadingFilters(prev => ({ ...prev, departments: true }));
    try {
      const response = await axios.get('/api/lusha/filters/contacts/departments');
      const values = extractValues(response.data);
      setFilterOptions(prev => ({ ...prev, departments: values }));
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoadingFilters(prev => ({ ...prev, departments: false }));
    }
  };

  // Fetch seniority levels from Lusha API
  const fetchSeniority = async () => {
    if (filterOptions.seniority.length > 0) return; // Already loaded
    
    setLoadingFilters(prev => ({ ...prev, seniority: true }));
    try {
      const response = await axios.get('/api/lusha/filters/contacts/seniority');
      const values = extractValues(response.data);
      setFilterOptions(prev => ({ ...prev, seniority: values }));
    } catch (error) {
      console.error('Error fetching seniority:', error);
    } finally {
      setLoadingFilters(prev => ({ ...prev, seniority: false }));
    }
  };

  // Fetch industries from Lusha API
  const fetchIndustries = async () => {
    if (filterOptions.industries.length > 0) return; // Already loaded
    
    setLoadingFilters(prev => ({ ...prev, industries: true }));
    try {
      const response = await axios.get('/api/lusha/filters/companies/industries');
      const values = extractValues(response.data);
      setFilterOptions(prev => ({ ...prev, industries: values }));
    } catch (error) {
      console.error('Error fetching industries:', error);
    } finally {
      setLoadingFilters(prev => ({ ...prev, industries: false }));
    }
  };

  // Fetch company sizes from Lusha API
  const fetchSizes = async () => {
    if (filterOptions.sizes.length > 0) return; // Already loaded
    
    setLoadingFilters(prev => ({ ...prev, sizes: true }));
    try {
      const response = await axios.get('/api/lusha/filters/companies/sizes');
      const values = extractValues(response.data);
      setFilterOptions(prev => ({ ...prev, sizes: values }));
    } catch (error) {
      console.error('Error fetching sizes:', error);
    } finally {
      setLoadingFilters(prev => ({ ...prev, sizes: false }));
    }
  };

  // Fetch company revenues from Lusha API
  const fetchRevenues = async () => {
    if (filterOptions.revenues.length > 0) return; // Already loaded
    
    setLoadingFilters(prev => ({ ...prev, revenues: true }));
    try {
      const response = await axios.get('/api/lusha/filters/companies/revenues');
      const values = extractValues(response.data);
      setFilterOptions(prev => ({ ...prev, revenues: values }));
    } catch (error) {
      console.error('Error fetching revenues:', error);
    } finally {
      setLoadingFilters(prev => ({ ...prev, revenues: false }));
    }
  };

  // Fetch countries from Lusha API
  const fetchCountries = async () => {
    if (filterOptions.countries.length > 0) return; // Already loaded
    
    try {
      const response = await axios.get('/api/lusha/filters/contacts/countries');
      const values = extractValues(response.data);
      setFilterOptions(prev => ({ ...prev, countries: values }));
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const handleSearch = () => {
    // Change view to prospect-finder when search is clicked
    onViewChange('prospect-finder');
    
    if (onSearch) {
      onSearch(filters);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      jobTitles: [],
      managementLevels: [],
      departments: [],
      locations: [],
      companyNames: [],
      industries: [],
      companySizes: [],
      companyRevenues: [],
      skills: []
    });
  };

  const addChip = (filterKey, value) => {
    if (!value.trim()) return;
    const currentValues = filters[filterKey] || [];
    if (!currentValues.includes(value.trim())) {
      setFilters({
        ...filters,
        [filterKey]: [...currentValues, value.trim()]
      });
    }
  };

  const removeChip = (filterKey, value) => {
    setFilters({
      ...filters,
      [filterKey]: filters[filterKey].filter(item => item !== value)
    });
  };

  const ChipInput = ({ filterKey, placeholder, datalistOptions = null, onFocus = null }) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        addChip(filterKey, inputValue.replace(',', ''));
        setInputValue('');
      }
    };

    const handleBlur = () => {
      if (inputValue.trim()) {
        addChip(filterKey, inputValue);
        setInputValue('');
      }
    };

    const handleFocus = () => {
      if (onFocus) {
        onFocus();
      }
    };

    return (
      <div className="chip-container">
        {(filters[filterKey] || []).map((chip, index) => (
          <div key={index} className="chip">
            {chip}
            <span className="chip-delete" onClick={() => removeChip(filterKey, chip)}>
              <i className="fas fa-times"></i>
            </span>
          </div>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          list={datalistOptions ? `${filterKey}-options` : undefined}
        />
        {datalistOptions && (
          <datalist id={`${filterKey}-options`}>
            {datalistOptions.map((option, index) => (
              <option key={index} value={option} />
            ))}
          </datalist>
        )}
      </div>
    );
  };

  return (
    <div className={`sidebar ${sidebarClosed ? 'closed' : ''}`}>
      <div className="logo">
        <img
          src={sidebarClosed ? SIDE_LOGO_SRC : FULL_LOGO_SRC}
          alt="Company Logo"
        />
      </div>

      <div className="prospect-finder-wrapper">
        <div
          className={`menu-item prospect-finder-menu ${prospectFilterExpanded ? 'expanded' : ''} ${activeView === 'prospect-finder' ? 'active' : ''}`}
          onClick={() => {
            onViewChange('prospect-finder');
            onToggleProspectFilter();
          }}
        >
          <span className="icon"><i className="fas fa-users"></i></span>
          <span>Prospect Finder</span>
          <span className="chevron"><i className="fas fa-chevron-down"></i></span>
        </div>

        <div
          className="filter-group-content"
          style={{
            maxHeight: prospectFilterExpanded && !sidebarClosed ? '500px' : '0'
          }}
        >
          <div className="filter-item">
            <span className="icon"><i className="fas fa-user-tie"></i></span>
            <div className="filter-item-content">
              <label>Job title</label>
              <ChipInput
                filterKey="jobTitles"
                placeholder="Enter one or more job titles"
              />
            </div>
          </div>

          <div className="filter-item">
            <span className="icon"><i className="fas fa-sitemap"></i></span>
            <div className="filter-item-content">
              <label>Management Level (Seniority)</label>
              <ChipInput
                filterKey="managementLevels"
                placeholder="Select management level"
                datalistOptions={filterOptions.seniority}
                onFocus={fetchSeniority}
              />
              {loadingFilters.seniority && <small>Loading...</small>}
            </div>
          </div>

          <div className="filter-item">
            <span className="icon"><i className="fas fa-object-group"></i></span>
            <div className="filter-item-content">
              <label>Department</label>
              <ChipInput
                filterKey="departments"
                placeholder="Select department"
                datalistOptions={filterOptions.departments}
                onFocus={fetchDepartments}
              />
              {loadingFilters.departments && <small>Loading...</small>}
            </div>
          </div>

          <div className="filter-item">
            <span className="icon"><i className="fas fa-map-marker-alt"></i></span>
            <div className="filter-item-content">
              <label>Location</label>
              <ChipInput
                filterKey="locations"
                placeholder="Select prospect's location"
              />
            </div>
          </div>

          <div className="filter-item">
            <span className="icon"><i className="fas fa-building"></i></span>
            <div className="filter-item-content">
              <label>Company Name</label>
              <ChipInput
                filterKey="companyNames"
                placeholder="Enter company names"
              />
            </div>
          </div>

          <div className="filter-item">
            <span className="icon"><i className="fas fa-industry"></i></span>
            <div className="filter-item-content">
              <label>Industry</label>
              <ChipInput
                filterKey="industries"
                placeholder="Select industry"
                datalistOptions={filterOptions.industries}
                onFocus={fetchIndustries}
              />
              {loadingFilters.industries && <small>Loading...</small>}
            </div>
          </div>

          <div className="filter-item">
            <span className="icon"><i className="fas fa-user-friends"></i></span>
            <div className="filter-item-content">
              <label>Size</label>
              <select 
                value={filters.companySizes?.[0] || ""} 
                onChange={(e) => {
                  if (e.target.value) {
                    setFilters({ ...filters, companySizes: [e.target.value] });
                  } else {
                    setFilters({ ...filters, companySizes: [] });
                  }
                }}
                onFocus={fetchSizes}
              >
                <option value="">Choose number of employees</option>
                {filterOptions.sizes.map((size, index) => (
                  <option key={index} value={size}>{size}</option>
                ))}
              </select>
              {loadingFilters.sizes && <small>Loading...</small>}
            </div>
          </div>

          <div className="filter-item">
            <span className="icon"><i className="fas fa-dollar-sign"></i></span>
            <div className="filter-item-content">
              <label>Revenue</label>
              <select 
                value={filters.companyRevenues?.[0] || ""} 
                onChange={(e) => {
                  if (e.target.value) {
                    setFilters({ ...filters, companyRevenues: [e.target.value] });
                  } else {
                    setFilters({ ...filters, companyRevenues: [] });
                  }
                }}
                onFocus={fetchRevenues}
              >
                <option value="">Select company's revenue range</option>
                {filterOptions.revenues.map((revenue, index) => (
                  <option key={index} value={revenue}>{revenue}</option>
                ))}
              </select>
              {loadingFilters.revenues && <small>Loading...</small>}
            </div>
          </div>

          <div className="filter-buttons">
            <button className="search-btn" onClick={handleSearch}>
              <i className="fas fa-search"></i> Search
            </button>
            <button className="clear-btn" onClick={handleClearFilters}>
              <i className="fas fa-times"></i> Clear Filter
            </button>
          </div>
        </div>
      </div>

      <div className="bottom-links">
        <div
          className={`menu-item market-analysis-menu ${activeView === 'market-analysis' ? 'active' : ''}`}
          onClick={() => onViewChange('market-analysis')}
        >
          <span className="icon"><i className="fas fa-chart-bar"></i></span>
          <span>Market Analysis</span>
          <span className="arrow"><i className="fas fa-chevron-right"></i></span>
        </div>
        <div
          className={`menu-item ${activeView === 'prospect-list' ? 'active' : ''}`}
          onClick={() => onViewChange('prospect-list')}
        >
          <span className="icon"><i className="fas fa-list-ul"></i></span>
          <span>Your Prospect list</span>
          <span className="arrow"><i className="fas fa-chevron-right"></i></span>
        </div>
      </div>

      <button className="toggle-btn" onClick={onToggleSidebar}>
        <i className={`fas fa-chevron-${sidebarClosed ? 'right' : 'left'}`}></i>
      </button>
    </div>
  );
};

export default Sidebar;
