import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

export default function CompanyInfo() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    businessType: '',
    companySize: '',
    occupation: '',
    primaryGoal: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const businessTypes = [
    'Freelancer',
    'Startup',
    'Small Business (1-50)',
    'Medium Business (51-500)',
    'Large Enterprise (500+)',
    'Agency',
    'Other',
  ];

  const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-1000 employees',
    '1000+ employees',
  ];

  const occupations = [
    'Sales',
    'Marketing',
    'Business Development',
    'HR',
    'Finance',
    'Operations',
    'Executive',
    'Other',
  ];

  const primaryGoals = [
    'Find new leads',
    'Build market research data',
    'Competitive analysis',
    'Recruit talent',
    'Business expansion',
    'Other',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Try real API first
      const response = await fetch('http://localhost:5000/api/auth/company-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('companyName', formData.companyName);
        localStorage.setItem('businessType', formData.businessType);
        localStorage.setItem('companySize', formData.companySize);
        localStorage.setItem('occupation', formData.occupation);
        localStorage.setItem('primaryGoal', formData.primaryGoal);
        
        setLoading(false);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Failed to save company info');
        setLoading(false);
      }
    } catch (err) {
      // Fallback to mock data if backend is not running
      console.log('Backend unavailable, using mock data for testing');
      if (formData.companyName && formData.businessType && formData.companySize && formData.occupation && formData.primaryGoal) {
        // Save company info to localStorage
        localStorage.setItem('companyName', formData.companyName);
        localStorage.setItem('businessType', formData.businessType);
        localStorage.setItem('companySize', formData.companySize);
        localStorage.setItem('occupation', formData.occupation);
        localStorage.setItem('primaryGoal', formData.primaryGoal);
        
        setLoading(false);
        navigate('/dashboard');
      } else {
        setError('Please fill in all fields');
        setLoading(false);
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <div className="logo">Logo</div>
        <nav className="nav-links">
          <a href="#prospect-search">Prospect Search</a>
          <a href="#pricing">Pricing</a>
          <a href="#resources">Resources</a>
        </nav>
        <div className="auth-buttons">
          <button className="log-in-btn">Log in</button>
          <button className="book-demo-btn">Book a demo →</button>
        </div>
      </div>

      <div className="auth-content company-info-layout">
        <div className="company-info-sidebar">
          <h2>Let's kickstart your success</h2>
          <p>Help us tailor your experience by answering a few questions</p>
        </div>

        <div className="form-container company-form">
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Your Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Your company"
                required
              />
            </div>

            <div className="form-group">
              <label>Business Type</label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                {businessTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Company Size</label>
              <select
                name="companySize"
                value={formData.companySize}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                {companySizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Your occupation</label>
              <select
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                {occupations.map((occ) => (
                  <option key={occ} value={occ}>
                    {occ}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>What is your primary goal with Elite Lead Hunter?</label>
              <select
                name="primaryGoal"
                value={formData.primaryGoal}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                {primaryGoals.map((goal) => (
                  <option key={goal} value={goal}>
                    {goal}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Getting started...' : 'Get Started'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
