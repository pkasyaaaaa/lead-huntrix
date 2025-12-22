import React, { useState, useEffect } from 'react';
import axios from 'axios';
import industryData from '../data/industryData.json';

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

  // Predefined filter options (to avoid using Lusha API quota)
  const PREDEFINED_DEPARTMENTS = [
    'Business Development',
    'Consulting',
    'Customer Service',
    'Engineering & Technical',
    'Finance',
    'General Management',
    'Health Care & Medical',
    'Human Resources',
    'Information Technology',
    'Legal',
    'Marketing',
    'Operations',
    'Other',
    'Product',
    'Research & Analytics',
    'Sales'
  ];

  // Seniority mapping: display text -> Lusha ID (must match ProspectFinderView.js)
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

  const PREDEFINED_SENIORITY = Object.keys(SENIORITY_MAPPING);

  // Predefined company sizes (exact format for Lusha API)
  const PREDEFINED_SIZES = [
    { min: 1, max: 10, label: '1-10' },
    { min: 11, max: 50, label: '11-50' },
    { min: 51, max: 200, label: '51-200' },
    { min: 201, max: 500, label: '201-500' },
    { min: 501, max: 1000, label: '501-1000' },
    { min: 1001, max: 5000, label: '1001-5000' },
    { min: 5001, max: 10000, label: '5001-10000' },
    { min: 10001, max: 100000, label: '10001-100000' },
    { min: 100001, label: '100001+' }
  ];

    // Predefined company revenue (exact format for Lusha API)
    const PREDEFINED_REVENUES = [
      { min: 1, max: 1000000, label: '1 - 1M' },
      { min: 1000000, max: 5000000, label: '1M - 5M' },
      { min: 5000000, max: 10000000, label: '5M - 10M' },
      { min: 10000000, max: 50000000, label: '10M - 50M' },
      { min: 50000000, max: 100000000, label: '50M - 100M' },
      { min: 100000000, max: 250000000, label: '100M - 250M' },
      { min: 250000000, max: 500000000, label: '250M - 500M' },
      { min: 500000000, max: 1000000000, label: '500M - 1B' },
      { min: 1000000000, max: 10000000000, label: '1B - 10B' },
      { min: 500000000, max: 10000000000, label: '500M - 10B' },
      { min: 10000000000, max: 100000000000, label: '10B - 100B' },
      { min: 100000000000, label: '100B+' }
    ];

  // State for filter options from Lusha API
  const [filterOptions, setFilterOptions] = useState({
    departments: PREDEFINED_DEPARTMENTS,
    seniority: PREDEFINED_SENIORITY,
    sizes: PREDEFINED_SIZES,
    industries: [],
    revenues: PREDEFINED_REVENUES,
    countries: []
  });

  // State for expanded industries
  const [expandedIndustries, setExpandedIndustries] = useState({});

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

  // Departments, Seniority, and Company Sizes are now predefined - no need to fetch

  // State for showing industry tree
  const [showIndustryTree, setShowIndustryTree] = useState(false);

  // Industry tree component with checkboxes
  const IndustryTree = () => {
    const toggleMainIndustry = (mainIndustryName) => {
      setExpandedIndustries(prev => ({
        ...prev,
        [mainIndustryName]: !prev[mainIndustryName]
      }));
    };

    const handleMainIndustryCheck = (mainIndustryName, checked) => {
      const currentIndustries = filters.industries || [];
      const mainIndustryLabel = `${mainIndustryName} (Main)`;
      
      if (checked) {
        // Add main industry if not already added
        if (!currentIndustries.includes(mainIndustryLabel)) {
          setFilters({
            ...filters,
            industries: [...currentIndustries, mainIndustryLabel]
          });
        }
      } else {
        // Remove main industry
        setFilters({
          ...filters,
          industries: currentIndustries.filter(ind => ind !== mainIndustryLabel)
        });
      }
    };

    const handleSubIndustryCheck = (subIndustryName, checked) => {
      const currentIndustries = filters.industries || [];
      const subIndustryLabel = `${subIndustryName} (Sub)`;
      
      if (checked) {
        // Add sub industry
        if (!currentIndustries.includes(subIndustryLabel)) {
          setFilters({
            ...filters,
            industries: [...currentIndustries, subIndustryLabel]
          });
        }
      } else {
        // Remove sub industry
        setFilters({
          ...filters,
          industries: currentIndustries.filter(ind => ind !== subIndustryLabel)
        });
      }
    };

    const isMainIndustryChecked = (mainIndustryName) => {
      return (filters.industries || []).includes(`${mainIndustryName} (Main)`);
    };

    const isSubIndustryChecked = (subIndustryName) => {
      return (filters.industries || []).includes(`${subIndustryName} (Sub)`);
    };

    return (
      <div className="industry-tree" style={{ 
        maxHeight: '200px', 
        overflowY: 'auto', 
        border: '1px solid #e0e0e0', 
        borderRadius: '4px', 
        padding: '4px',
        fontSize: '13px',
        backgroundColor: '#fafafa'
      }}>
        {industryData.map((industry, index) => (
          <div key={index} style={{ marginBottom: '2px' }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '2px 0' }}>
              <button
                onClick={() => toggleMainIndustry(industry.main_industry)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0 2px',
                  fontSize: '10px',
                  width: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {expandedIndustries[industry.main_industry] ? '▼' : '▶'}
              </button>
              <input
                type="checkbox"
                checked={isMainIndustryChecked(industry.main_industry)}
                onChange={(e) => handleMainIndustryCheck(industry.main_industry, e.target.checked)}
                style={{ marginRight: '6px', width: '14px', height: '14px', cursor: 'pointer' }}
              />
              <label style={{ cursor: 'pointer', fontSize: '12px', fontWeight: '500', flex: 1 }} onClick={() => toggleMainIndustry(industry.main_industry)}>
                {industry.main_industry}
              </label>
            </div>
            {expandedIndustries[industry.main_industry] && industry.sub_industries && (
              <div style={{ marginLeft: '18px' }}>
                {industry.sub_industries.map((subInd, subIndex) => (
                  <div key={subIndex} style={{ display: 'flex', alignItems: 'center', padding: '2px 0' }}>
                    <input
                      type="checkbox"
                      checked={isSubIndustryChecked(subInd.value)}
                      onChange={(e) => handleSubIndustryCheck(subInd.value, e.target.checked)}
                      style={{ marginRight: '6px', marginLeft: '16px', width: '14px', height: '14px', cursor: 'pointer' }}
                    />
                    <label style={{ cursor: 'pointer', fontSize: '11px', flex: 1 }}>
                      {subInd.value}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Load industries from imported JSON data (no longer needed for flat list, but keep for reference)
  useEffect(() => {
    try {
      console.log('Loading industries from imported data');
      
      // Extract both main industries and sub-industries with subtle labels
      const allIndustries = [];
      
      industryData.forEach(item => {
        // Add main industry with label
        allIndustries.push(`${item.main_industry} (Main)`);
        
        // Add sub-industries with label
        if (item.sub_industries && Array.isArray(item.sub_industries)) {
          item.sub_industries.forEach(subInd => {
            if (subInd.value) {
              allIndustries.push(`${subInd.value} (Sub)`);
            }
          });
        }
      });
      
      console.log('Loaded industries (main + sub):', allIndustries);
      setFilterOptions(prev => ({ ...prev, industries: allIndustries }));
    } catch (error) {
      console.error('Error loading industries:', error);
    }
  }, []);

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
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);

    // Filter suggestions based on user input
    useEffect(() => {
      console.log('ChipInput - datalistOptions:', datalistOptions);
      console.log('ChipInput - inputValue:', inputValue);
      
      if (datalistOptions && datalistOptions.length > 0) {
        if (inputValue.trim()) {
          // Filter based on input
          const filtered = datalistOptions.filter(option =>
            option.toLowerCase().includes(inputValue.toLowerCase())
          );
          console.log('Filtered suggestions:', filtered);
          setFilteredSuggestions(filtered);
        } else {
          // Show all options when input is empty
          setFilteredSuggestions(datalistOptions);
        }
      } else {
        setFilteredSuggestions([]);
      }
    }, [inputValue, datalistOptions]);

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        if (filteredSuggestions.length > 0) {
          // Use first suggestion if available
          addChip(filterKey, filteredSuggestions[0]);
        } else {
          addChip(filterKey, inputValue.replace(',', ''));
        }
        setInputValue('');
        setShowSuggestions(false);
      }
    };

    const handleBlur = () => {
      // Delay to allow click on suggestion
      setTimeout(() => {
        if (inputValue.trim() && filteredSuggestions.length > 0) {
          addChip(filterKey, filteredSuggestions[0]);
          setInputValue('');
        } else if (inputValue.trim()) {
          addChip(filterKey, inputValue);
          setInputValue('');
        }
        setShowSuggestions(false);
      }, 200);
    };

    const handleFocus = () => {
      if (onFocus) {
        onFocus();
      }
      if (datalistOptions && datalistOptions.length > 0) {
        setShowSuggestions(true);
      }
    };

    const handleSuggestionClick = (suggestion) => {
      addChip(filterKey, suggestion);
      setInputValue('');
      setShowSuggestions(false);
    };

    return (
      <div className="chip-container" style={{ position: 'relative' }}>
        {(filters[filterKey] || []).map((chip, index) => {
          // Determine chip color class based on industry type
          const isIndustry = filterKey === 'industries';
          const isMain = isIndustry && chip.includes('(Main)');
          const isSub = isIndustry && chip.includes('(Sub)');
          const chipClass = isMain ? 'chip industry-main' : isSub ? 'chip industry-sub' : 'chip';
          const displayText = chip.replace(/\s*\((Main|Sub)\)/, '');
          
          return (
            <div key={index} className={chipClass}>
              {displayText}
              <span className="chip-delete" onClick={() => removeChip(filterKey, chip)}>
                <i className="fas fa-times"></i>
              </span>
            </div>
          );
        })}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
        />
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="autocomplete-suggestions" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {filteredSuggestions.map((suggestion, index) => {
              // Check if suggestion has (Main) or (Sub) label
              const hasLabel = suggestion.includes('(Main)') || suggestion.includes('(Sub)');
              const mainText = hasLabel ? suggestion.replace(/\s*\((Main|Sub)\)/, '') : suggestion;
              const labelText = suggestion.includes('(Main)') ? 'Main' : suggestion.includes('(Sub)') ? 'Sub' : null;
              const labelClass = labelText ? labelText.toLowerCase() : '';
              
              return (
                <div
                  key={index}
                  className="suggestion-item"
                  onMouseDown={(e) => e.preventDefault()} // Prevent blur
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <span>{mainText}</span>
                  {labelText && <span className={`suggestion-label ${labelClass}`}>{labelText}</span>}
                </div>
              );
            })}
          </div>
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
              />
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
              />
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
              <div style={{ position: 'relative' }}>
                {/* Display selected industries as chips */}
                <div className="chip-container">
                  {(filters.industries || []).map((industry, index) => {
                    const isMain = industry.includes('(Main)');
                    const isSub = industry.includes('(Sub)');
                    const chipClass = isMain ? 'chip industry-main' : isSub ? 'chip industry-sub' : 'chip';
                    const displayText = industry.replace(/\s*\((Main|Sub)\)/, '');
                    
                    return (
                      <div key={index} className={chipClass}>
                        {displayText}
                        <span className="chip-delete" onClick={() => {
                          setFilters({
                            ...filters,
                            industries: filters.industries.filter(ind => ind !== industry)
                          });
                        }}>
                          <i className="fas fa-times"></i>
                        </span>
                      </div>
                    );
                  })}
                  <input
                    type="text"
                    placeholder="Select industry"
                    onFocus={() => setShowIndustryTree(true)}
                    onBlur={() => setTimeout(() => setShowIndustryTree(false), 300)}
                    readOnly
                    style={{ cursor: 'pointer' }}
                  />
                </div>
                {/* Show industry tree on focus */}
                {showIndustryTree && (
                  <div 
                    style={{ position: 'absolute', zIndex: 1000, width: '100%', marginTop: '4px' }}
                    onMouseDown={(e) => e.preventDefault()} // Prevent blur when clicking inside
                  >
                    <IndustryTree />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="filter-item">
            <span className="icon"><i className="fas fa-user-friends"></i></span>
            <div className="filter-item-content">
              <label>Size</label>
              <select 
                value={filters.companySizes?.[0] ? JSON.stringify(filters.companySizes[0]) : ""} 
                onChange={(e) => {
                  if (e.target.value) {
                    const sizeObj = JSON.parse(e.target.value);
                    setFilters({ ...filters, companySizes: [sizeObj] });
                  } else {
                    setFilters({ ...filters, companySizes: [] });
                  }
                }}
              >
                <option value="">Choose number of employees</option>
                {filterOptions.sizes.map((size, index) => (
                  <option key={index} value={JSON.stringify({ min: size.min, max: size.max })}>
                    {size.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-item">
            <span className="icon"><i className="fas fa-dollar-sign"></i></span>
            <div className="filter-item-content">
              <label>Revenue</label>
              <select 
                value={filters.revenues?.[0] ? JSON.stringify(filters.revenues[0]) : ""} 
                onChange={(e) => {
                  if (e.target.value) {
                    const sizeObj = JSON.parse(e.target.value);
                    setFilters({ ...filters, revenues: [sizeObj] });
                  } else {
                    setFilters({ ...filters, revenues: [] });
                  }
                }}
              >
                <option value="">Choose revenue range</option>
                {filterOptions.revenues.map((revenue, index) => (
                  <option key={index} value={JSON.stringify({ min: revenue.min, max: revenue.max })}>
                    {revenue.label}
                  </option>
                ))}
              </select>
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
