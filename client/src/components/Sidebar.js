import React, { useState } from 'react';

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

  const ChipInput = ({ filterKey, placeholder, datalistOptions = null }) => {
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
              <label>Management Level</label>
              <ChipInput
                filterKey="managementLevels"
                placeholder="Select management level"
                datalistOptions={['Entry Level', 'Manager', 'Director', 'VP', 'C-Level']}
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
                datalistOptions={['Sales', 'Marketing', 'HR', 'Finance', 'Technology']}
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
              <ChipInput
                filterKey="industries"
                placeholder="Select industry"
                datalistOptions={['Technology', 'Finance', 'Healthcare', 'Retail', 'Design']}
              />
            </div>
          </div>

          <div className="filter-item">
            <span className="icon"><i className="fas fa-bolt"></i></span>
            <div className="filter-item-content">
              <label>Skills</label>
              <ChipInput
                filterKey="skills"
                placeholder="Enter Prospect Expertise"
              />
            </div>
          </div>

          <div className="filter-item">
            <span className="icon"><i className="fas fa-user-friends"></i></span>
            <div className="filter-item-content">
              <label>Size</label>
              <select defaultValue="">
                <option value="" disabled>Choose number of employees</option>
                <option>1-50</option>
                <option>51-200</option>
                <option>201-1000</option>
                <option>1000+</option>
              </select>
            </div>
          </div>

          <div className="filter-item">
            <span className="icon"><i className="fas fa-dollar-sign"></i></span>
            <div className="filter-item-content">
              <label>Revenue</label>
              <select defaultValue="">
                <option value="" disabled>Select company's revenue range</option>
                <option>$1M - $10M</option>
                <option>$10M - $100M</option>
                <option>$100M - $1B</option>
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
