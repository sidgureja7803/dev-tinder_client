import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { gsap } from "gsap";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) return "Password must be at least 8 characters long";
    if (!hasUpperCase) return "Password must contain at least one uppercase letter";
    if (!hasLowerCase) return "Password must contain at least one lowercase letter";
    if (!hasNumbers) return "Password must contain at least one number";
    if (!hasSpecialChar) return "Password must contain at least one special character";
    return null;
  };

  const handleSendOTP = async () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post(`${BASE_URL}/forgot-password`, { emailId: email });
      
      // Animate transition
      gsap.to(".form-container", {
        y: 20,
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          setStep(2);
          gsap.to(".form-container", {
            y: 0,
            opacity: 1,
            duration: 0.3
          });
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post(`${BASE_URL}/verify-forgot-password-otp`, {
        emailId: email,
        otp
      });

      // Animate transition
      gsap.to(".form-container", {
        y: 20,
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          setStep(3);
          gsap.to(".form-container", {
            y: 0,
            opacity: 1,
            duration: 0.3
          });
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post(`${BASE_URL}/reset-password`, {
        emailId: email,
        newPassword
      });

      // Animate success
      gsap.to(".form-container", {
        scale: 1.05,
        duration: 0.2,
        ease: "power1.out",
        onComplete: () => {
          gsap.to(".form-container", {
            scale: 1,
            duration: 0.2,
            ease: "power1.in",
            onComplete: () => {
              navigate("/login");
            }
          });
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError("");

    try {
      await axios.post(`${BASE_URL}/resend-forgot-password-otp`, { emailId: email });
      // Show success message
      gsap.to(".resend-message", {
        opacity: 1,
        duration: 0.3,
        onComplete: () => {
          setTimeout(() => {
            gsap.to(".resend-message", { opacity: 0, duration: 0.3 });
          }, 3000);
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 to-pink-800 px-4">
      <div className="form-container max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            {step === 1 && "Forgot Password"}
            {step === 2 && "Enter OTP"}
            {step === 3 && "Reset Password"}
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {step === 1 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your email"
                />
                <button
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="mt-4 w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                />
                <button
                  onClick={handleVerifyOTP}
                  disabled={loading}
                  className="mt-4 w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
                <button
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="mt-2 w-full text-sm text-purple-600 hover:text-purple-500"
                >
                  Resend OTP
                </button>
                <div className="resend-message mt-2 text-center text-green-500 opacity-0">
                  OTP has been resent successfully!
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Confirm new password"
                  />
                </div>
                <button
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 