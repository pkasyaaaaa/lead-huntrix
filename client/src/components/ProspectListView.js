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
      setSelectAll(false);
    } else {
      setSelectedProspects(filteredProspects.map(p => p.id));
      setSelectAll(true);
    }
  };

  const handleSelectProspect = (prospectId) => {
    let newSelected;
    if (selectedProspects.includes(prospectId)) {
      newSelected = selectedProspects.filter(id => id !== prospectId);
    } else {
      newSelected = [...selectedProspects, prospectId];
    }
    
    setSelectedProspects(newSelected);
    
    // Update selectAll based on filtered results
    const allFiltered = filteredProspects.map(p => p.id);
    setSelectAll(newSelected.length > 0 && newSelected.length === allFiltered.length);
  };

  const handleFilterChange = (column, value) => {
    setFilters({
      ...filters,
      [column]: value
    });
    // Reset select all when filtering
    setSelectAll(false);
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
    if (selectedProspects.length === 0) {
      alert('Please select at least one prospect');
      return;
    }
    console.log('Send email to:', selectedProspects);
    // Add your email functionality here
  };

  const handleSendLinkedIn = () => {
    if (selectedProspects.length === 0) {
      alert('Please select at least one prospect');
      return;
    }
    console.log('Send LinkedIn message to:', selectedProspects);
    // Add your LinkedIn functionality here
  };

  const handleDownload = () => {
    if (selectedProspects.length === 0) {
      alert('Please select at least one prospect to download');
      return;
    }

    const selectedData = filteredProspects.filter(p => selectedProspects.includes(p.id));
    
    // Create CSV
    const headers = ['Name', 'Job Title', 'Company Name', 'Location', 'LinkedIn', 'Email', 'Phone Number'];
    const csvContent = [
      headers.join(','),
      ...selectedData.map(p => [
        `"${p.name || ''}"`,
        `"${p.job_title || ''}"`,
        `"${p.company_name || ''}"`,
        `"${p.location || ''}"`,
        `"${p.linkedin_url || ''}"`,
        `"${Array.isArray(p.email) ? p.email.join('; ') : p.email || ''}"`,
        `"${Array.isArray(p.phone_number) ? p.phone_number.join('; ') : p.phone_number || ''}"`
      ].join(','))
    ].join('\n');
    
    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'prospects.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="prospect-list-view"><div className="loading">Loading prospects...</div></div>;
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
            {filteredProspects.length > 0 ? (
              filteredProspects.map((prospect) => (
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
              ))
            ) : (
              <tr>
                <td colSpan="8" className="empty-state">No prospects found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProspectListView;