import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ProspectFinderView from './components/ProspectFinderView';
import MarketAnalysisView from './components/MarketAnalysisView';
import ProspectListView from './components/ProspectListView';
import Login from './components/Login';
import axios from 'axios';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeView, setActiveView] = useState('prospect-finder');
  const [sidebarClosed, setSidebarClosed] = useState(false);
  const [prospectFilterExpanded, setProspectFilterExpanded] = useState(true);
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [searchType, setSearchType] = useState('prospects'); // 'prospects' or 'companies'
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

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUsername = localStorage.getItem('username');
    
    if (storedUserId && storedUsername) {
      setCurrentUser({
        userId: parseInt(storedUserId),
        username: storedUsername
      });
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setCurrentUser(null);
    setIsLoggedIn(false);
    setActiveView('prospect-finder');
  };

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

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

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
          userId={currentUser.userId}
          onSearch={handleSearch}
          searchType={searchType}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
        
        <div className="main-content">
          {activeView === 'prospect-finder' && (
            <ProspectFinderView 
              filters={filters} 
              userId={currentUser.userId} 
              triggerSearch={triggerSearch}
              searchType={searchType}
              setSearchType={setSearchType}
            />
          )}
          {activeView === 'market-analysis' && (
            <MarketAnalysisView userId={currentUser.userId} />
          )}
          {activeView === 'prospect-list' && (
            <ProspectListView userId={currentUser.userId} />
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;
