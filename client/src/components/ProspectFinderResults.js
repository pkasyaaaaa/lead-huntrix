import React, { useState } from 'react';
import axios from 'axios';
import './ProspectFinderResults.css';

export default function ProspectFinderResults({ prospects, loading, onBack, onRefresh, searchQuery, setSearchQuery, onSearch, requestId, userId, searchType, setSearchType }) {
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
      // Use contactId from the raw prospect data for enrichment
      setSelectedProspects(prospects.map(p => p.contactId));
    } else {
      setSelectedProspects([]);
    }
  };

  const handleSelectProspect = (contactId) => {
    setSelectedProspects(prev => {
      if (prev.includes(contactId)) {
        return prev.filter(id => id !== contactId);
      } else {
        return [...prev, contactId];
      }
    });
  };

  const handleEnrichProspects = async () => {
    if (!requestId) {
      alert('No requestId available. Please perform a new search first.');
      return;
    }
    
    if (selectedProspects.length === 0) {
      alert('Please select at least one prospect to enrich.');
      return;
    }
    
    setEnriching(true);
    console.log('Enriching prospects:', selectedProspects);
    console.log('Using requestId:', requestId);
    
    try {
      const response = await axios.post('/api/lusha/enrich/contacts', {
        requestId: requestId,
        contactIds: selectedProspects,
        userId: userId,
        revealEmails: true, // Set to true to get email data
        revealPhones: false  // Set to false to get phone data
      });
      
      console.log('Enrichment response:', response.data);
      
      if (response.data.success) {
        alert(
          `✅ Enrichment Successful!\n\n` +
          `Contacts saved: ${response.data.savedContacts}\n` +
          `Companies saved: ${response.data.savedCompanies}\n` +
          `Credits charged: ${response.data.creditsCharged}\n\n` +
          `Data has been saved to your prospect list.`
        );
        
        // Clear selection after successful enrichment
        setSelectedProspects([]);
      } else {
        alert('❌ Enrichment failed. Please try again.');
      }
      
    } catch (error) {
      console.error('Error enriching prospects:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      
      let errorMessage = 'Unknown error occurred';
      
      if (error.response?.data) {
        // If error is an object, stringify it
        if (typeof error.response.data.error === 'object') {
          errorMessage = JSON.stringify(error.response.data.error, null, 2);
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = JSON.stringify(error.response.data, null, 2);
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`❌ Enrichment Error:\n\n${errorMessage}`);
    } finally {
      setEnriching(false);
    }
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

  // Helper function to get company data
  const getCompanyData = (company) => {
    return {
      id: company.id || Math.random().toString(),
      name: company.name || 'N/A',
      domain: company.fqdn || company.domain || 'N/A',
      description: company.description || 'N/A',
      logoUrl: company.logoUrl || null,
      location: company.location || 'N/A',
      hasEmployeesCount: company.hasCompanyEmployeesCount || false,
      hasRevenue: company.hasCompanyRevenue || false,
      hasIndustry: company.hasCompanyMainIndustry || false
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

      {/* Tab Switcher */}
      <div className="search-type-tabs" style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '16px',
        borderBottom: '2px solid #e0e0e0'
      }}>
        <button
          onClick={() => setSearchType('prospects')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: searchType === 'prospects' ? '600' : '400',
            color: searchType === 'prospects' ? '#0066cc' : '#666',
            borderBottom: searchType === 'prospects' ? '3px solid #0066cc' : 'none',
            marginBottom: '-2px',
            transition: 'all 0.2s'
          }}
        >
          <i className="fas fa-users" style={{ marginRight: '8px' }}></i>
          Prospects
        </button>
        <button
          onClick={() => setSearchType('companies')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: searchType === 'companies' ? '600' : '400',
            color: searchType === 'companies' ? '#0066cc' : '#666',
            borderBottom: searchType === 'companies' ? '3px solid #0066cc' : 'none',
            marginBottom: '-2px',
            transition: 'all 0.2s'
          }}
        >
          <i className="fas fa-building" style={{ marginRight: '8px' }}></i>
          Companies
        </button>
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
              {searchType === 'prospects' && (
                <button 
                  className="add-to-list-btn"
                  onClick={handleEnrichProspects}
                  disabled={selectedProspects.length === 0 || enriching}
                  title="Enrich selected prospects with additional data"
                >
                  <i className={enriching ? "fas fa-spinner fa-spin" : "fas fa-sparkles"}></i> 
                  {enriching ? ' Enriching...' : ' Enrich Selected'}
                </button>
              )}
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
                  {searchType === 'prospects' ? (
                    <>
                      <th>Name</th>
                      <th>Position</th>
                      <th>Company</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Location</th>
                    </>
                  ) : (
                    <>
                      <th>Company Name</th>
                      <th>Domain</th>
                      <th>Description</th>
                      <th>Location</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {searchType === 'prospects' ? (
                  prospects.map((prospect) => {
                    const data = getProspectData(prospect);
                    const contactId = prospect.contactId;
                    return (
                      <tr key={data.id}>
                        <td className="checkbox-column">
                          <input 
                            type="checkbox"
                            checked={selectedProspects.includes(contactId)}
                            onChange={() => handleSelectProspect(contactId)}
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
                  })
                ) : (
                  prospects.map((company) => {
                    const data = getCompanyData(company);
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
                          <div className="company-info" onClick={() => handleCompanyClick(company)} style={{ cursor: 'pointer' }}>
                            {data.logoUrl && (
                              <div className="company-logo">
                                <img
                                  src={data.logoUrl}
                                  alt={data.name}
                                  className="company-logo-img"
                                  onError={(e) => {
                                    e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(data.name) + "&size=40&background=ddd&color=555";
                                  }}
                                />
                              </div>
                            )}
                            <div>
                              <div className="company-name" title="Click to view company details">{data.name}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          {data.domain !== 'N/A' ? (
                            <a href={`https://${data.domain}`} target="_blank" rel="noopener noreferrer">
                              {data.domain}
                            </a>
                          ) : (
                            <span style={{ color: '#999' }}>N/A</span>
                          )}
                        </td>
                        <td>
                          <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={data.description}>
                            {data.description}
                          </div>
                        </td>
                        <td>{data.location}</td>
                      </tr>
                    );
                  })
                )}
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
              {(selectedCompany.logoUrl || selectedCompany.company?.logoUrl) && (
                <img
                  src={selectedCompany.logoUrl || selectedCompany.company?.logoUrl}
                  alt={selectedCompany.name || selectedCompany.companyName}
                  className="modal-company-logo"
                  onError={(e) => {
                    e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(selectedCompany.name || selectedCompany.companyName) + "&size=80&background=ddd&color=555";
                  }}
                />
              )}
              <div>
                <h2>{selectedCompany.name || selectedCompany.companyName}</h2>
                {(selectedCompany.fqdn || selectedCompany.domain) && (
                  <a href={`https://${selectedCompany.fqdn || selectedCompany.domain}`} target="_blank" rel="noopener noreferrer" className="company-website">
                    <i className="fas fa-globe"></i> {selectedCompany.fqdn || selectedCompany.domain}
                  </a>
                )}
              </div>
            </div>

            <div className="modal-body">
              {(selectedCompany.companyDescription || selectedCompany.description) && (
                <div className="modal-section">
                  <h3><i className="fas fa-info-circle"></i> Description</h3>
                  <p>{selectedCompany.companyDescription || selectedCompany.description}</p>
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
                  {(selectedCompany.companyId || selectedCompany.id) && (
                    <div className="id-item">
                      <span className="id-label">Company ID:</span>
                      <span className="id-value">{selectedCompany.companyId || selectedCompany.id}</span>
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
