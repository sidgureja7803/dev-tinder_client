import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { gsap } from 'gsap';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
    gsap.from('.otp-container', {
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
        await gsap.to('.otp-container', {
          scale: 1.05,
          duration: 0.2,
          ease: 'power1.out'
        });
        await gsap.to('.otp-container', {
          scale: 1,
          duration: 0.2,
          ease: 'power1.in'
        });

        // Navigate to onboarding if profile not complete, otherwise feed
        if (response.data.data.onboardingCompleted) {
          navigate('/app/feed');
        } else {
          navigate('/onboarding');
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
      // Show success message
      gsap.to('.resend-message', {
        opacity: 1,
        duration: 0.3,
        onComplete: () => {
          setTimeout(() => {
            gsap.to('.resend-message', { opacity: 0, duration: 0.3 });
          }, 3000);
        }
      });
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to resend OTP');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 to-pink-800 px-4">
      <div className="otp-container bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Verify Your Email</h2>
        <p className="text-center text-gray-600 mb-8">
          We've sent a verification code to<br />
          <span className="font-semibold">{email}</span>
        </p>

        <div className="flex justify-center gap-2 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              maxLength="1"
              value={digit}
              onChange={e => handleChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-2xl font-bold border-2 rounded-lg focus:border-purple-500 focus:outline-none"
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        <div className="space-y-4">
          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>

          <div className="text-center">
            <button
              onClick={handleResendOTP}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Resend OTP
            </button>
            <p className="resend-message text-green-500 mt-2 opacity-0">
              OTP has been resent successfully!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification; 