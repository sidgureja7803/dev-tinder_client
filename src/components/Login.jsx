import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import '../styles/auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailId: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPasswordFix, setShowPasswordFix] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [fixMessage, setFixMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // DEBUG: Log what we're sending
    console.log('🚀 Sending login data:', formData);
    console.log('📍 API URL:', `${BASE_URL}/login`);
    
    try {
      const response = await axios.post(`${BASE_URL}/login`, formData);
      
      if (response.data.data) {
        const userData = response.data.data;
        
        // Store user data in localStorage
        localStorage.setItem('token', 'logged-in'); // Simple token for now
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Check if user needs verification
        if (response.data.requiresVerification) {
          // Store email in localStorage as backup
          localStorage.setItem('pendingEmail', userData.emailId);
          navigate('/verify-otp', { state: { email: userData.emailId } });
          return;
        }
        
        // Check if user needs onboarding
        if (userData.requiresOnboarding) {
          navigate('/onboarding');
          return;
        }
        
        // Navigate to main app
        navigate('/app/feed');
      }
    } catch (err) {
      if (err.response?.data?.requiresVerification) {
        // Store email in localStorage as backup
        localStorage.setItem('pendingEmail', err.response.data.emailId);
        navigate('/verify-otp', { state: { email: err.response.data.emailId } });
        return;
      }
      
      // If login fails due to password issues, show password fix option
      if (err.response?.status === 401) {
        setError('Login failed. If you created your account before today, you might need to reset your password due to security improvements.');
        setShowPasswordFix(true);
      } else {
        setError(err.response?.data?.message || 'Login failed. Please try again.');
      }
    }
  };

  const handlePasswordFix = async (e) => {
    e.preventDefault();
    setFixMessage('');
    
    try {
      const response = await axios.post(`${BASE_URL}/fix-password`, {
        emailId: formData.emailId,
        newPassword: newPassword
      });
      
      setFixMessage('✅ ' + response.data.message);
      setShowPasswordFix(false);
      setFormData({ ...formData, password: newPassword });
      setNewPassword('');
    } catch (err) {
      setFixMessage('❌ ' + (err.response?.data?.message || 'Failed to update password'));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="code-pattern"></div>
      </div>
      <div className="auth-form-container">
        <div className="logo-container">
          <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">          
            <circle cx="16" cy="16" r="16" fill="#e91e63"/>
            <path d="M16 24l-6.5-6.5c-1.5-1.5-1.5-4 0-5.5s4-1.5 5.5 0l1 1 1-1c1.5-1.5 4-1.5 5.5 0s1.5 4 0 5.5L16 24z" fill="white"/>
            <path d="M8 10l-2 2 2 2M24 10l2 2-2 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h1>Merge Mates</h1>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Sign In</h2>
          <p className="form-subtitle">Sign in to continue your developer journey</p>
          
          {error && <div className="error-message">{error}</div>}
          {fixMessage && <div className={fixMessage.startsWith('✅') ? 'success-message' : 'error-message'}>{fixMessage}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-container">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                id="email"
                name="emailId"
                value={formData.emailId}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-container">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••"
                required
              />
            </div>
          </div>
          
          <div className="form-actions">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>
          
          <button type="submit" className="auth-button">Sign In</button>
          
          {showPasswordFix && (
            <div className="password-fix-section">
              <h3>Reset Your Password</h3>
              <p>Due to security improvements, you need to reset your password:</p>
              <form onSubmit={handlePasswordFix}>
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <div className="input-container">
                    <i className="fas fa-key"></i>
                    <input
                      type="password"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="auth-button" style={{backgroundColor: '#28a745'}}>
                  Update Password
                </button>
              </form>
            </div>
          )}
          
          <div className="auth-divider">
            <span>or</span>
          </div>
          
          <div className="social-login">
            <button type="button" className="social-button github">
              <i className="fab fa-github"></i>
              GitHub
            </button>
            <button type="button" className="social-button google">
              <i className="fab fa-google"></i>
              Google
            </button>
          </div>
        </form>
        
        <p className="auth-redirect">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;