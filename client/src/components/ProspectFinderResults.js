import React, { useState } from 'react';
import './ProspectFinderResults.css';

export default function ProspectFinderResults({ prospects, loading, onBack, onRefresh, searchQuery, setSearchQuery, onSearch }) {
  const [selectedProspects, setSelectedProspects] = useState([]);
  const [enriching, setEnriching] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Debug logging
  console.log('ProspectFinderResults - prospects:', prospects);
  console.log('ProspectFinderResults - loading:', loading);
  console.log('ProspectFinderResults - prospects length:', prospects?.length);

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProspects(prospects.map(p => p.id));
    } else {
      setSelectedProspects([]);
    }
  };

  const handleSelectProspect = (prospectId) => {
    setSelectedProspects(prev => {
      if (prev.includes(prospectId)) {
        return prev.filter(id => id !== prospectId);
      } else {
        return [...prev, prospectId];
      }
    });
  };

  const handleEnrichProspects = async () => {
    // Placeholder for enrichment functionality
    setEnriching(true);
    console.log('Enriching prospects:', selectedProspects);
    
    // TODO: Implement actual enrichment API call here
    // For now, just show a placeholder message
    setTimeout(() => {
      alert('Enrichment feature coming soon! This will enrich the selected prospects with additional data.');
      setEnriching(false);
    }, 1500);
  };

  const handleCompanyClick = (prospect) => {
    setSelectedCompany(prospect);
  };

  const closeCompanyModal = () => {
    setSelectedCompany(null);
  };

  // Helper function to safely get data from Lusha response
  const getProspectData = (prospect) => {
    return {
      id: prospect.contactId || prospect.personId?.toString() || Math.random().toString(),
      name: prospect.name || prospect.fullName || 'N/A',
      jobTitle: prospect.jobTitle || prospect.position || 'N/A',
      companyName: prospect.companyName || prospect.company?.name || 'N/A',
      companyLogo: prospect.logoUrl || prospect.company?.logoUrl || prospect.company?.logo || null,
      email: prospect.email || prospect.emails?.[0] || null,
      phone: prospect.phone || prospect.phoneNumbers?.[0] || null,
      location: prospect.location || prospect.city || prospect.country || 'N/A',
      linkedinUrl: prospect.linkedinUrl || prospect.linkedin || null,
      // Lusha API specific fields
      hasEmail: prospect.hasWorkEmail || prospect.hasEmails || prospect.hasEmail || false,
      hasPhone: prospect.hasPhones || prospect.hasPhone || false,
      hasDirectPhone: prospect.hasDirectPhone || false
    };
  };

  return (
    <div className="prospect-finder-view">
      <div className="search-container">
        <div className="search-box">
          <span className="search-icon"><i className="fas fa-search"></i></span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSearch()}
            placeholder="Try any keyword and explore related companies & staff"
          />
          <button className="clear-btn" onClick={clearSearch}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div className="prospect-results">
      {loading ? (
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '24px', color: '#007bff' }}></i>
          <p style={{ marginTop: '10px', color: '#666' }}>Loading prospects...</p>
        </div>
      ) : prospects.length > 0 ? (
        <>
          <div className="results-header">
            <h3>Total Found: {prospects.length}</h3>
            <div className="header-actions">
              <button 
                className="add-to-list-btn"
                onClick={handleEnrichProspects}
                disabled={selectedProspects.length === 0 || enriching}
                title="Enrich selected prospects with additional data"
              >
                <i className={enriching ? "fas fa-spinner fa-spin" : "fas fa-sparkles"}></i> 
                {enriching ? ' Enriching...' : ' Enrich Selected'}
              </button>
              <button 
                className="download-btn" 
                onClick={onRefresh}
                disabled={loading}
                title="Refresh results from Lusha API (uses credits)"
                style={{ marginRight: '10px' }}
              >
                <i className={loading ? "fas fa-spinner fa-spin" : "fas fa-sync-alt"}></i> Refresh
              </button>
              <button className="download-btn" disabled={selectedProspects.length === 0}>
                <i className="fas fa-download"></i> Download ({selectedProspects.length})
              </button>
            </div>
          </div>

          <div className="tabs-container">
            <button className="tab-btn active">Prospect</button>
            <button className="tab-btn">Companies</button>
          </div>

          <div className="prospect-table-container">
            <table className="prospect-table">
              <thead>
                <tr>
                  <th className="checkbox-column">
                    <input 
                      type="checkbox"
                      checked={selectedProspects.length === prospects.length && prospects.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Company</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {prospects.map((prospect) => {
                  const data = getProspectData(prospect);
                  return (
                    <tr key={data.id}>
                      <td className="checkbox-column">
                        <input 
                          type="checkbox"
                          checked={selectedProspects.includes(data.id)}
                          onChange={() => handleSelectProspect(data.id)}
                        />
                      </td>
                      <td>
                        <div className="prospect-name">
                          <div className="avatar">
                            <img
                              src={"https://ui-avatars.com/api/?name=" + encodeURIComponent(data.name) + "&size=40&background=ddd&color=555"} 
                              alt={data.name}
                              className="avatar-img"
                            />
                          </div>
                          <div>
                            <div className="name-text">{data.name}</div>
                            {data.linkedinUrl && (
                              <a href={data.linkedinUrl} target="_blank" rel="noopener noreferrer" className="linkedin-link">
                                <i className="fab fa-linkedin"></i>
                              </a>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>{data.jobTitle}</td>
                      <td>
                        <div className="company-info" onClick={() => handleCompanyClick(prospect)} style={{ cursor: 'pointer' }}>
                          {data.companyLogo && (
                            <div className="company-logo">
                              <img
                                src={data.companyLogo}
                                alt={data.companyName}
                                className="company-logo-img"
                                onError={(e) => {
                                  e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(data.companyName) + "&size=40&background=ddd&color=555";
                                }}
                              />
                            </div>
                          )}
                          <div>
                            <div className="company-name" title="Click to view company details">{data.companyName}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        {data.email ? (
                          <a href={`mailto:${data.email}`}>{data.email}</a>
                        ) : data.hasEmail ? (
                          <div className="locked-field" title="Email available - click Enrich to reveal">
                            <i className="fas fa-lock"></i> Available
                          </div>
                        ) : (
                          <span style={{ color: '#999' }}>Not available</span>
                        )}
                      </td>
                      <td>
                        {data.phone ? (
                          <span>{data.phone}</span>
                        ) : (data.hasPhone || data.hasDirectPhone) ? (
                          <div className="locked-field" title="Phone available - click Enrich to reveal">
                            <i className="fas fa-lock"></i> Available
                          </div>
                        ) : (
                          <span style={{ color: '#999' }}>Not available</span>
                        )}
                      </td>
                      <td>{data.location}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div style={{ marginTop: '40px', textAlign: 'center', color: '#666' }}>
          <p>No prospects found matching your criteria.</p>
          <button onClick={onBack} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}>
            Back to Search
          </button>
        </div>
      )}
      </div>

      {/* Company Details Modal */}
      {selectedCompany && (
        <div className="company-modal-overlay" onClick={closeCompanyModal}>
          <div className="company-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeCompanyModal}>
              <i className="fas fa-times"></i>
            </button>
            
            <div className="modal-header">
              {selectedCompany.logoUrl && (
                <img
                  src={selectedCompany.logoUrl}
                  alt={selectedCompany.companyName}
                  className="modal-company-logo"
                  onError={(e) => {
                    e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(selectedCompany.companyName) + "&size=80&background=ddd&color=555";
                  }}
                />
              )}
              <div>
                <h2>{selectedCompany.companyName}</h2>
                {selectedCompany.fqdn && (
                  <a href={`https://${selectedCompany.fqdn}`} target="_blank" rel="noopener noreferrer" className="company-website">
                    <i className="fas fa-globe"></i> {selectedCompany.fqdn}
                  </a>
                )}
              </div>
            </div>

            <div className="modal-body">
              {selectedCompany.companyDescription && (
                <div className="modal-section">
                  <h3><i className="fas fa-info-circle"></i> Description</h3>
                  <p>{selectedCompany.companyDescription}</p>
                </div>
              )}

              <div className="modal-section">
                <h3><i className="fas fa-database"></i> Available Data</h3>
                <div className="data-availability-grid">
                  <div className={`data-item ${selectedCompany.hasCompanyEmployeesCount ? 'available' : 'unavailable'}`}>
                    <i className="fas fa-users"></i>
                    <span>Employees Count</span>
                  </div>
                  <div className={`data-item ${selectedCompany.hasCompanyRevenue ? 'available' : 'unavailable'}`}>
                    <i className="fas fa-dollar-sign"></i>
                    <span>Revenue</span>
                  </div>
                  <div className={`data-item ${selectedCompany.hasCompanyMainIndustry ? 'available' : 'unavailable'}`}>
                    <i className="fas fa-industry"></i>
                    <span>Main Industry</span>
                  </div>
                  <div className={`data-item ${selectedCompany.hasCompanySubIndustry ? 'available' : 'unavailable'}`}>
                    <i className="fas fa-sitemap"></i>
                    <span>Sub Industry</span>
                  </div>
                  <div className={`data-item ${selectedCompany.hasCompanyFunding ? 'available' : 'unavailable'}`}>
                    <i className="fas fa-money-bill-wave"></i>
                    <span>Funding</span>
                  </div>
                  <div className={`data-item ${selectedCompany.hasCompanyIntent ? 'available' : 'unavailable'}`}>
                    <i className="fas fa-bullseye"></i>
                    <span>Intent Data</span>
                  </div>
                  <div className={`data-item ${selectedCompany.hasCompanyTechnologies ? 'available' : 'unavailable'}`}>
                    <i className="fas fa-laptop-code"></i>
                    <span>Technologies</span>
                  </div>
                  <div className={`data-item ${selectedCompany.hasCompanyCity ? 'available' : 'unavailable'}`}>
                    <i className="fas fa-map-marker-alt"></i>
                    <span>City</span>
                  </div>
                  <div className={`data-item ${selectedCompany.hasCompanyCountry ? 'available' : 'unavailable'}`}>
                    <i className="fas fa-flag"></i>
                    <span>Country</span>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h3><i className="fas fa-id-badge"></i> Company IDs</h3>
                <div className="company-ids">
                  {selectedCompany.companyId && (
                    <div className="id-item">
                      <span className="id-label">Company ID:</span>
                      <span className="id-value">{selectedCompany.companyId}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-btn primary" onClick={closeCompanyModal}>
                <i className="fas fa-check"></i> Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
