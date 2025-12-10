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
    jobTitle: '',
    companyName: '',
    location: ''
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
    const prospectTitle = (prospect.job_title || '').toLowerCase();
    const companyName = (prospect.company_name || '').toLowerCase();
    const location = (prospect.location || '').toLowerCase();

    return (
      prospectName.includes(filters.prospect.toLowerCase()) &&
      prospectTitle.includes(filters.jobTitle.toLowerCase()) &&
      companyName.includes(filters.companyName.toLowerCase()) &&
      location.includes(filters.location.toLowerCase())
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
              <th>
                <div className="column-header">
                  <span>Company Name</span>
                  <input
                    type="text"
                    placeholder="Filter by company..."
                    value={filters.companyName}
                    onChange={(e) => handleFilterChange('companyName', e.target.value)}
                    className="column-filter"
                  />
                </div>
              </th>
              <th>
                <div className="column-header">
                  <span>Location</span>
                  <input
                    type="text"
                    placeholder="Filter by location..."
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="column-filter"
                  />
                </div>
              </th>
              <th>
                <div className="column-header">
                  <span>LinkedIn</span>
                </div>
              </th>
              <th>
                <div className="column-header">
                  <span>Email</span>
                </div>
              </th>
              <th>
                <div className="column-header">
                  <span>Phone Number</span>
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
                <td>{prospect.name}</td>
                <td>{prospect.job_title}</td>
                <td>{prospect.company_name}</td>
                <td>{prospect.location}</td>
                <td>
                  {prospect.linkedin_url ? (
                    <a href={prospect.linkedin_url} target="_blank" rel="noopener noreferrer">
                      {prospect.linkedin_url}
                    </a>
                  ) : '-'}
                </td>
                <td>{prospect.email ? (Array.isArray(prospect.email) ? prospect.email.join(', ') : prospect.email) : '-'}</td>
                <td>{prospect.phone_number ? (Array.isArray(prospect.phone_number) ? prospect.phone_number.join(', ') : prospect.phone_number) : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProspectListView;
