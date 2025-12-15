import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Try real API first
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('firstName', formData.firstName);
        localStorage.setItem('lastName', formData.lastName);
        
        setLoading(false);
        navigate('/company-info');
      } else {
        setError(data.message || 'Sign up failed');
        setLoading(false);
      }
    } catch (err) {
      // Fallback to mock data if backend is not running
      console.log('Backend unavailable, using mock data for testing');
      if (formData.firstName && formData.lastName && formData.email && formData.phone && formData.password) {
        // Save mock user data
        localStorage.setItem('token', 'mock_token_' + Date.now());
        localStorage.setItem('userId', '1');
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('firstName', formData.firstName);
        localStorage.setItem('lastName', formData.lastName);
        
        setLoading(false);
        navigate('/company-info');
      } else {
        setError('Please fill in all fields');
        setLoading(false);
      }
    }
  };

  const handleGoogleSignUp = () => {
    try {
      // Try real API first
      window.location.href = 'http://localhost:5000/api/auth/google';
    } catch (err) {
      // Fallback to mock data
      localStorage.setItem('token', 'mock_google_token_' + Date.now());
      localStorage.setItem('userId', '1');
      localStorage.setItem('userEmail', 'google@example.com');
      localStorage.setItem('firstName', 'Google');
      localStorage.setItem('lastName', 'User');
      navigate('/company-info');
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

      <div className="auth-content">
        <div className="form-container">
          <h1>Create an account</h1>

          {error && <div className="error-message">{error}</div>}

          <button className="google-btn" onClick={handleGoogleSignUp}>
            <span>📧</span> Sign up with Google
          </button>

          <div className="divider">OR</div>

          <form onSubmit={handleSignUp}>
            <div className="form-row">
              <div className="form-group">
                <label>First name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Last name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Business email address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@company.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="form-footer">
            <p>Already have an account? <a href="/login">Log in</a></p>
          </div>

          <p className="terms-text">
            By signing up you agree to Elite Lead Hunter's Terms and Conditions and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
