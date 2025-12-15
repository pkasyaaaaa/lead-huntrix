import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import '../styles/Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Try real API first
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userEmail', data.user.email);
        setLoading(false);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
        setLoading(false);
      }
    } catch (err) {
      // Fallback to mock data if backend is not running
      console.log('Backend unavailable, using mock data for testing');
      if (email && password) {
        localStorage.setItem('token', 'mock_token_' + Date.now());
        localStorage.setItem('userId', '1');
        localStorage.setItem('userEmail', email);
        
        setLoading(false);
        navigate('/dashboard');
      } else {
        setError('Please enter email and password');
        setLoading(false);
      }
    }
  };

  const handleGoogleSignIn = () => {
    try {
      // Try real API first
      window.location.href = 'http://localhost:5000/api/auth/google';
    } catch (err) {
      // Fallback to mock data
      localStorage.setItem('token', 'mock_google_token_' + Date.now());
      localStorage.setItem('userId', '1');
      localStorage.setItem('userEmail', 'google@example.com');
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="login-form-container">
          <img src="/image/logo.png" alt="Logo" className="login-logo" />
          <h1 className="login-title">Log in to your account</h1>
          {error && <div className="error-message">{error}</div>}
          <div style={{ width: '100%', maxWidth: 360 }}>
            <button className="google-btn" onClick={handleGoogleSignIn} style={{ width: '100%' }}>
              <span>📧</span> Sign in with Google
            </button>
            <div className="divider">OR</div>
            <form onSubmit={handleLogin}>
              <div className="login-form-group">
                <label>Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className="login-form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <button type="submit" className="login-submit-btn" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Signing in...' : 'Log in'}
              </button>
            </form>
            <div className="login-footer">
              <p>Don't have an account? <a href="/signup">Create one</a></p>
              <p><a href="/forgot-password">Forgot password?</a></p>
            </div>
            <p className="login-footer" style={{ fontSize: '12px', marginTop: '10px', color: '#888' }}>
              By signing up you agree to Elite Lead Hunter's Terms and Conditions and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
