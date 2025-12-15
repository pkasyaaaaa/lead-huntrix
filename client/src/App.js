import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ProspectFinderView from './components/ProspectFinderView';
import MarketAnalysisView from './components/MarketAnalysisView';
import ProspectListView from './components/ProspectListView';
import axios from 'axios';
import './App.css';

function App() {
  const [activeView, setActiveView] = useState('prospect-finder');
  const [sidebarClosed, setSidebarClosed] = useState(false);
  const [prospectFilterExpanded, setProspectFilterExpanded] = useState(true);
  const [userId] = useState(1); // Default user ID
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [filters, setFilters] = useState({
    jobTitles: [],
    locations: [],
    managementLevels: [],
    departments: [],
    companyNames: [],
    industries: [],
    companySizes: [],
    companyRevenues: [],
    skills: []
  });

  const toggleSidebar = () => {
    setSidebarClosed(!sidebarClosed);
  };

  const toggleProspectFilter = () => {
    if (sidebarClosed) {
      setSidebarClosed(false);
      setTimeout(() => {
        setProspectFilterExpanded(true);
      }, 350);
    } else {
      setProspectFilterExpanded(!prospectFilterExpanded);
    }
  };

  const handleViewChange = (view) => {
    setActiveView(view);
    if (view !== 'prospect-finder') {
      setProspectFilterExpanded(false);
    }
    if (sidebarClosed) {
      setSidebarClosed(false);
    }
  };

  const handleSearch = (searchFilters) => {
    // Toggle triggerSearch to trigger the search
    setTriggerSearch(prev => !prev);
    console.log('Search triggered with filters:', searchFilters);
  };

  return (
    <Router>
      <div className="app">
        <Sidebar
          activeView={activeView}
          onViewChange={handleViewChange}
          sidebarClosed={sidebarClosed}
          onToggleSidebar={toggleSidebar}
          prospectFilterExpanded={prospectFilterExpanded}
          onToggleProspectFilter={toggleProspectFilter}
          filters={filters}
          setFilters={setFilters}
          userId={userId}
          onSearch={handleSearch}
        />
        
        <div className="main-content">
          {activeView === 'prospect-finder' && (
            <ProspectFinderView filters={filters} userId={userId} triggerSearch={triggerSearch} />
          )}
          {activeView === 'market-analysis' && (
            <MarketAnalysisView userId={userId} />
          )}
          {activeView === 'prospect-list' && (
            <ProspectListView userId={userId} />
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;
