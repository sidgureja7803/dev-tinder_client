import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { gsap } from 'gsap';
import '../styles/auth.css';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/signup');
      return;
    }

    // Animate the component
    gsap.from('.auth-form-container', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out'
    });
  }, [email, navigate]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${BASE_URL}/verify-otp`, {
        emailId: email,
        otp: otpString
      });

      if (response.data.data) {
        // Show success animation
        await gsap.to('.auth-form', {
          scale: 1.05,
          duration: 0.2,
          ease: 'power1.out'
        });
        await gsap.to('.auth-form', {
          scale: 1,
          duration: 0.2,
          ease: 'power1.in'
        });

        // Store user data
        if (response.data.data) {
          localStorage.setItem('user', JSON.stringify(response.data.data));
          localStorage.setItem('token', 'logged-in');
        }

        // Navigate based on onboarding status
        if (response.data.data.requiresOnboarding) {
          navigate('/onboarding');
        } else {
          navigate('/app/feed');
        }
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to verify OTP');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await axios.post(`${BASE_URL}/resend-otp`, { emailId: email });
      setError('');
      setResendMessage('OTP has been resent successfully!');
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setResendMessage('');
      }, 3000);
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to resend OTP');
      }
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
            <path d="M8 10l-2 2 2 2M24 10l2 2-2 2" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h1>Merge Mates</h1>
        </div>
        <div className="auth-form">
          <h2>Verify Your Email</h2>
          <p className="form-subtitle">
            We've sent a verification code to<br />
            <strong>{email}</strong>
          </p>

          <div className="otp-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                maxLength="1"
                value={digit}
                onChange={e => handleChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                className="otp-input"
              />
            ))}
          </div>

          {error && <div className="error-message">{error}</div>}
          {resendMessage && <div className="success-message">{resendMessage}</div>}

          <button
            onClick={handleVerify}
            disabled={loading}
            className="auth-button"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>

          <div className="resend-container">
            <p>Didn't receive the code?</p>
            <button
              onClick={handleResendOTP}
              className="resend-button"
            >
              Resend OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification; 