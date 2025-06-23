import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate, Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { 
  signInWithPopup, 
  GoogleAuthProvider,
  GithubAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification
} from "firebase/auth";
import { auth } from "../firebase/config";
import { gsap } from "gsap";
import '../styles/auth.css';

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];
  if (password.length < minLength) errors.push("Password must be at least 8 characters long");
  if (!hasUpperCase) errors.push("Password must contain at least one uppercase letter");
  if (!hasLowerCase) errors.push("Password must contain at least one lowercase letter");
  if (!hasNumbers) errors.push("Password must contain at least one number");
  if (!hasSpecialChar) errors.push("Password must contain at least one special character");

  return {
    isValid: errors.length === 0,
    errors
  };
};

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const { errors } = validatePassword(newPassword);
    setPasswordErrors(errors);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !emailId || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!agreedToTerms) {
      setError("Please agree to the terms and conditions");
      return;
    }

    const { isValid, errors } = validatePassword(password);
    if (!isValid) {
      setPasswordErrors(errors);
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const res = await axios.post(
        `${BASE_URL}/signup`,
        { 
          firstName,
          lastName,
          emailId,
          password
        }
      );

      // Animate success
      gsap.to(".auth-form", {
        scale: 1.02,
        duration: 0.2,
        ease: "power1.out",
        onComplete: () => {
          gsap.to(".auth-form", {
            scale: 1,
            duration: 0.2,
            ease: "power1.in",
            onComplete: () => {
              if (res.data.data) {
                dispatch(addUser(res.data.data));
              }
              // Store email in localStorage as backup
              localStorage.setItem('pendingEmail', emailId);
              navigate("/verify-otp", { state: { email: emailId } });
            }
          });
        }
      });
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      const res = await axios.post(
        `${BASE_URL}/oauth/google`,
        { 
          emailId: result.user.email,
          firstName: result.user.displayName?.split(' ')[0] || '',
          lastName: result.user.displayName?.split(' ').slice(1).join(' ') || '',
          photoUrl: result.user.photoURL
        }
      );
      
      dispatch(addUser(res.data.data));
      navigate("/verify-otp", { state: { email: result.user.email } });
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError(err.response?.data?.message || "Google sign-in failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const result = await signInWithPopup(auth, githubProvider);
      
      const res = await axios.post(
        `${BASE_URL}/oauth/github`,
        { 
          emailId: result.user.email,
          firstName: result.user.displayName?.split(' ')[0] || 'GitHub',
          lastName: result.user.displayName?.split(' ').slice(1).join(' ') || 'User',
          photoUrl: result.user.photoURL
        }
      );
      
      dispatch(addUser(res.data.data));
      navigate("/verify-otp", { state: { email: result.user.email } });
    } catch (err) {
      console.error("GitHub sign-in error:", err);
      setError(err.response?.data?.message || "GitHub sign-in failed");
    } finally {
      setIsLoading(false);
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
        <form className="auth-form" onSubmit={handleSignup}>
          <h2>Create Account</h2>
          <p className="form-subtitle">Join the developer community today</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <div className="input-container">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <div className="input-container">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-container">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                id="email"
                name="email"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
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
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="••••••••••"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
              </button>
            </div>
            {passwordErrors.length > 0 && (
              <div className="password-requirements">
                {passwordErrors.map((error, index) => (
                  <div key={index} className="requirement-item">
                    <i className="fas fa-times"></i>
                    <span>{error}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-container">
              <i className="fas fa-lock"></i>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <i className={showConfirmPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
              </button>
            </div>
            {password && confirmPassword && password !== confirmPassword && (
              <div className="password-mismatch">
                <i className="fas fa-times"></i>
                <span>Passwords do not match</span>
              </div>
            )}
          </div>
          
          <div className="terms-container">
            <input 
              type="checkbox" 
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
            />
            <label htmlFor="terms">
              I agree to the <a href="#" className="terms-link">Terms of Service</a> and <a href="#" className="terms-link">Privacy Policy</a>
            </label>
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading || passwordErrors.length > 0 || (password !== confirmPassword) || !agreedToTerms}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
          
          <div className="auth-divider">
            <span>or</span>
          </div>
          
          <div className="social-login">
            <button type="button" className="social-button github" onClick={handleGithubSignIn} disabled={isLoading}>
              <i className="fab fa-github"></i>
              GitHub
            </button>
            <button type="button" className="social-button google" onClick={handleGoogleSignIn} disabled={isLoading}>
              <i className="fab fa-google"></i>
              Google
            </button>
          </div>
        </form>
        
        <p className="auth-redirect">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup; 