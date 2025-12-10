import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProspectListView.css';

const ProspectListView = ({ userId }) => {
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProspects, setSelectedProspects] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [filters, setFilters] = useState({
    prospect: '',
    jobTitle: ''
  });

  useEffect(() => {
    fetchProspects();
  }, [userId]);

  const fetchProspects = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/prospects?user_id=${userId}`);
      if (response.data.success) {
        setProspects(response.data.data);
      } else {
        setProspects([]);
      }
    } catch (error) {
      console.error('Error fetching prospects:', error);
      setProspects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProspects([]);
    } else {
      setSelectedProspects(filteredProspects.map(p => p.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectProspect = (prospectId) => {
    if (selectedProspects.includes(prospectId)) {
      setSelectedProspects(selectedProspects.filter(id => id !== prospectId));
    } else {
      setSelectedProspects([...selectedProspects, prospectId]);
    }
  };

  const handleFilterChange = (column, value) => {
    setFilters({
      ...filters,
      [column]: value
    });
  };

  const filteredProspects = prospects.filter(prospect => {
    const prospectName = (prospect.name || '').toLowerCase();
    const prospectTitle = (prospect.JobTitle || '').toLowerCase();

    return (
      prospectName.includes(filters.prospect.toLowerCase()) &&
      prospectTitle.includes(filters.jobTitle.toLowerCase())
    );
  });

  const handleSendEmail = () => {
    console.log('Send email to:', selectedProspects);
    // Placeholder for email functionality
  };

  const handleSendLinkedIn = () => {
    console.log('Send LinkedIn message to:', selectedProspects);
    // Placeholder for LinkedIn functionality
  };

  const handleDownload = () => {
    console.log('Download prospect list');
    // Placeholder for download functionality
  };

  if (loading) {
    return <div className="prospect-list-view">Loading...</div>;
  }

  return (
    <div className="prospect-list-view">
      <div className="prospect-list-header">
        <h1>Prospect list</h1>
        <div className="header-actions">
          <button className="action-btn" onClick={handleSendEmail}>
            <i className="fas fa-envelope"></i>
            Send Email
          </button>
          <button className="action-btn" onClick={handleSendLinkedIn}>
            <i className="fab fa-linkedin"></i>
            Send LinkedIn message
          </button>
          <button className="download-btn" onClick={handleDownload}>
            <i className="fas fa-download"></i>
            Download
          </button>
        </div>
      </div>

      <div className="prospect-table-container">
        <table className="prospect-table">
          <thead>
            <tr>
              <th className="checkbox-column">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th>
                <div className="column-header">
                  <span>ID</span>
                </div>
              </th>
              <th>
                <div className="column-header">
                  <span>Name</span>
                  <input
                    type="text"
                    placeholder="Filter by name..."
                    value={filters.prospect}
                    onChange={(e) => handleFilterChange('prospect', e.target.value)}
                    className="column-filter"
                  />
                </div>
              </th>
              <th>
                <div className="column-header">
                  <span>Job Title</span>
                  <input
                    type="text"
                    placeholder="Filter by job title..."
                    value={filters.jobTitle}
                    onChange={(e) => handleFilterChange('jobTitle', e.target.value)}
                    className="column-filter"
                  />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProspects.map((prospect) => (
              <tr key={prospect.id}>
                <td className="checkbox-column">
                  <input
                    type="checkbox"
                    checked={selectedProspects.includes(prospect.id)}
                    onChange={() => handleSelectProspect(prospect.id)}
                  />
                </td>
                <td>{prospect.id}</td>
                <td>{prospect.name}</td>
                <td>{prospect.JobTitle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProspectListView;
