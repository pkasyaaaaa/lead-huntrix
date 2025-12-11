import React from 'react';

export default function ProspectFinderResults({ prospects, loading, onBack, searchQuery, setSearchQuery, onSearch }) {
  const clearSearch = () => {
    setSearchQuery('');
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
              <button className="add-to-list-btn">
                <i className="fas fa-plus"></i> Add to list
              </button>
              <button className="download-btn">
                <i className="fas fa-download"></i> Download
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
                    <input type="checkbox" />
                  </th>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Company</th>
                  <th>Email</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {prospects.map((prospect) => (
                  <tr key={prospect.id}>
                    <td className="checkbox-column">
                      <input type="checkbox" />
                    </td>
                    <td>
                      <div className="prospect-name">
                        <div className="avatar">
                            <img
                                src={"https://ui-avatars.com/api/?name=" +  encodeURIComponent(prospect.name || "p") + "&size=40&background=ddd&color=555"} 
                                alt={prospect.name}
                                className="avatar-img"
                            />
                        </div>
                        <div>
                          <div className="name-text">{prospect.name}</div>
                          <div className="job-title">{prospect.job_title}</div>
                        </div>
                      </div>
                    </td>
                    <td>{prospect.job_title || 'N/A'}</td>
                    <td>
                      <div className="company-info">
                        <div className="company-logo">
                          <img
                            src={
                              prospect.company_logo_url ||
                              "https://ui-avatars.com/api/?name=" + encodeURIComponent(prospect.company_name || "C") + "&size=40&background=ddd&color=555"
                            }
                            alt={prospect.company_name || "Company Logo"}
                            className="company-logo-img"
                          />
                        </div>
                        <div>
                          <div className="company-name">{prospect.company_name || 'N/A'}</div>
                          <div className="company-details">Details</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {prospect.email ? (
                        Array.isArray(prospect.email) ? prospect.email[0] : prospect.email
                      ) : (
                        <div className="locked-field">
                          <i className="fas fa-lock"></i> Available
                        </div>
                      )}
                    </td>
                    <td>{prospect.location || 'N/A'}</td>
                  </tr>
                ))}
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
    </div>
  );
}
