import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { gsap } from "gsap";
import ImageUpload from "./ImageUpload";

const ProfileOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Form state
  const [formData, setFormData] = useState({
    // Basic Info
    dateOfBirth: "",
    gender: "",
    religion: "",
    height: { feet: "", inches: "" },
    bio: "",
    
    // Location
    location: {
      city: "",
      state: "",
      country: "",
      coordinates: []
    },
    
    // Professional Info
    profession: "",
    company: {
      name: "",
      position: "",
      isCurrentlyWorking: false
    },
    ctcRange: "",
    education: {
      college: "",
      degree: "",
      graduationYear: "",
      isStudent: false
    },
    
    // Photos
    photos: [],
    
    // Social Links
    socialLinks: {
      instagram: "",
      linkedin: "",
      twitter: "",
      github: "",
      leetcode: "",
      portfolio: ""
    },
    
    // Skills & Interests
    skills: [],
    interests: [],
    
    // Preferences
    preferences: {
      ageRange: { min: 18, max: 35 },
      distance: 50,
      genders: ["Male", "Female", "Other"],
      religions: [],
      professions: []
    }
  });

  const [availableSkills] = useState([
    "JavaScript", "Python", "React", "Node.js", "Java", "C++", "TypeScript",
    "Angular", "Vue.js", "Django", "Flask", "Express.js", "MongoDB", "MySQL",
    "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS", "Azure", "GCP",
    "Git", "GraphQL", "REST APIs", "Microservices", "Machine Learning",
    "Data Science", "DevOps", "Cybersecurity", "Mobile Development",
    "UI/UX Design", "Product Management", "Agile", "Scrum"
  ]);

  const steps = [
    { title: "Basic Information", icon: "👤" },
    { title: "Location", icon: "📍" },
    { title: "Professional Details", icon: "💼" },
    { title: "Education", icon: "🎓" },
    { title: "Photos", icon: "📸" },
    { title: "Social Links", icon: "🔗" },
    { title: "Skills & Interests", icon: "⚡" },
    { title: "Preferences", icon: "⚙️" }
  ];

  // Check if user profile is already complete
  useEffect(() => {
    if (user?.onboardingCompleted) {
      navigate("/app/feed");
    }
  }, [user, navigate]);

  // Animation on mount
  useEffect(() => {
    gsap.fromTo('.onboarding-container', 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
  }, []);

  // Initialize onboarding data and resume from correct step
  useEffect(() => {
    const initializeOnboarding = async () => {
      try {
        // Get onboarding status from backend
        const response = await axios.get(`${BASE_URL}/onboarding/status`, {
          withCredentials: true
        });
        
        const { onboardingStep, user: userData, currentStepData } = response.data;
        
        // Resume from the correct step
        const resumeStep = location.state?.currentStep ?? onboardingStep ?? 0;
        setCurrentStep(resumeStep);
        
        // Pre-populate form data if available
        if (userData) {
          setFormData(prev => ({
            ...prev,
            ...userData,
            dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : '',
            skills: userData.skills || [],
            interests: userData.interests || [],
            photos: userData.photos || [],
            socialLinks: userData.socialLinks || {
              github: '',
              linkedin: '',
              twitter: '',
              portfolio: ''
            },
            preferences: userData.preferences || prev.preferences
          }));
        }
        
        // Pre-populate current step data
        if (currentStepData) {
          setFormData(prev => ({ ...prev, ...currentStepData }));
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize onboarding:', error);
        setIsInitialized(true); // Still show the form even if fetch fails
      }
    };
    
    initializeOnboarding();
  }, [location]);

  // Get user's location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              coordinates: [position.coords.longitude, position.coords.latitude]
            }
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const keys = field.split('.');
      if (keys.length === 1) {
        return { ...prev, [field]: value };
      } else if (keys.length === 2) {
        return {
          ...prev,
          [keys[0]]: {
            ...prev[keys[0]],
            [keys[1]]: value
          }
        };
      } else if (keys.length === 3) {
        return {
          ...prev,
          [keys[0]]: {
            ...prev[keys[0]],
            [keys[1]]: {
              ...prev[keys[0]][keys[1]],
              [keys[2]]: value
            }
          }
        };
      }
      return prev;
    });
  };

  const addSkill = (skill) => {
    if (!formData.skills.includes(skill) && formData.skills.length < 10) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const removeSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 0: // Basic Info
        return formData.dateOfBirth && formData.gender && formData.bio.length >= 20;
      case 1: // Location
        return formData.location.city && formData.location.country;
      case 2: // Professional
        return formData.profession;
      case 3: // Education
        return formData.education.college || formData.education.isStudent;
      case 4: // Photos
        return formData.photos.length > 0;
      case 5: // Social Links
        return true; // Optional
      case 6: // Skills
        return formData.skills.length >= 3;
      case 7: // Preferences
        return true;
      default:
        return true;
    }
  };

  const nextStep = async () => {
    if (validateStep(currentStep)) {
      setLoading(true);
      
      try {
        // Save current step progress
        const stepData = getCurrentStepData(currentStep);
        
        const response = await axios.post(
          `${BASE_URL}/onboarding/step/${currentStep}`,
          stepData,
          { withCredentials: true }
        );
        
        if (response.data.onboardingCompleted) {
          // Onboarding is complete, redirect to main app
          dispatch(addUser(response.data.user));
          navigate('/app/feed');
          return;
        }
        
        // Move to next step
        setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
        setError("");
        
        // Animate step transition
        gsap.fromTo('.step-content',
          { x: 50, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
        );
        
      } catch (error) {
        console.error('Error saving step:', error);
        setError(error.response?.data?.message || 'Failed to save progress. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      setError("Please complete all required fields before proceeding.");
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    setError("");
    
    // Animate step transition
    gsap.fromTo('.step-content',
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
    );
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getCurrentStepData = (step) => {
    switch (step) {
      case 0: // Basic Information
        return {
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          religion: formData.religion,
          height: formData.height,
          bio: formData.bio
        };
      case 1: // Location
        return {
          location: formData.location
        };
      case 2: // Professional Details
        return {
          profession: formData.profession,
          company: formData.company,
          ctcRange: formData.ctcRange
        };
      case 3: // Education
        return {
          education: formData.education
        };
      case 4: // Photos
        return {
          photos: formData.photos
        };
      case 5: // Social Links
        return {
          socialLinks: formData.socialLinks
        };
      case 6: // Skills & Interests
        return {
          skills: formData.skills,
          interests: formData.interests
        };
      case 7: // Preferences
        return {
          preferences: formData.preferences
        };
      default:
        return {};
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      setError("Please complete all required fields before submitting.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Save final step and complete onboarding
      const stepData = getCurrentStepData(currentStep);
      
      const response = await axios.post(
        `${BASE_URL}/onboarding/step/${currentStep}`,
        stepData,
        { withCredentials: true }
      );

      if (response.data.onboardingCompleted) {
        dispatch(addUser(response.data.user));
        
        // Success animation
        gsap.to('.onboarding-container', {
          scale: 0.9,
          opacity: 0.8,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          onComplete: () => {
            navigate("/app/feed");
          }
        });
      }
    } catch (error) {
      console.error("Profile update error:", error);
      setError(
        error.response?.data?.message || 
        "Failed to update profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Show loading while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen relative">
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900 via-slate-900 to-black"></div>
        </div>
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-16 h-16 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg">Loading your onboarding progress...</p>
          </div>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Information
        return (
          <div className="space-y-6 step-content">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Gender * (Cannot be changed later)
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
              >
                <option value="" className="bg-slate-800">Select Gender</option>
                <option value="Male" className="bg-slate-800">Male</option>
                <option value="Female" className="bg-slate-800">Female</option>
                <option value="Other" className="bg-slate-800">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Religion
              </label>
              <select
                value={formData.religion}
                onChange={(e) => handleInputChange('religion', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
              >
                <option value="" className="bg-slate-800">Select Religion</option>
                <option value="Hindu" className="bg-slate-800">Hindu</option>
                <option value="Muslim" className="bg-slate-800">Muslim</option>
                <option value="Christian" className="bg-slate-800">Christian</option>
                <option value="Sikh" className="bg-slate-800">Sikh</option>
                <option value="Jain" className="bg-slate-800">Jain</option>
                <option value="Buddhist" className="bg-slate-800">Buddhist</option>
                <option value="Other" className="bg-slate-800">Other</option>
                <option value="Prefer not to say" className="bg-slate-800">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Height
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <select
                    value={formData.height.feet}
                    onChange={(e) => handleInputChange('height.feet', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="" className="bg-slate-800">Feet</option>
                    {[3, 4, 5, 6, 7, 8].map(ft => (
                      <option key={ft} value={ft} className="bg-slate-800">{ft} ft</option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    value={formData.height.inches}
                    onChange={(e) => handleInputChange('height.inches', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="" className="bg-slate-800">Inches</option>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(inch => (
                      <option key={inch} value={inch} className="bg-slate-800">{inch} in</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Bio * (Minimum 20 characters)
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                rows="4"
                placeholder="Tell everyone about yourself..."
                maxLength="500"
              />
              <p className="text-sm text-white/60 mt-1">
                {formData.bio.length}/500 characters
              </p>
            </div>
          </div>
        );

      case 1: // Location
        return (
          <div className="space-y-6 step-content">
            <div className="text-center">
              <button
                onClick={getLocation}
                className="mb-6 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25"
              >
                📍 Use Current Location
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                City *
              </label>
              <input
                type="text"
                value={formData.location.city}
                onChange={(e) => handleInputChange('location.city', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your city"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                State/Province
              </label>
              <input
                type="text"
                value={formData.location.state}
                onChange={(e) => handleInputChange('location.state', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your state/province"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Country *
              </label>
              <input
                type="text"
                value={formData.location.country}
                onChange={(e) => handleInputChange('location.country', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your country"
              />
            </div>
          </div>
        );

      case 2: // Professional Details
        return (
          <div className="space-y-6 step-content">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Profession *
              </label>
              <select
                value={formData.profession}
                onChange={(e) => handleInputChange('profession', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
              >
                <option value="" className="bg-slate-800">Select Profession</option>
                <option value="Software Engineer" className="bg-slate-800">Software Engineer</option>
                <option value="Frontend Developer" className="bg-slate-800">Frontend Developer</option>
                <option value="Backend Developer" className="bg-slate-800">Backend Developer</option>
                <option value="Full Stack Developer" className="bg-slate-800">Full Stack Developer</option>
                <option value="Mobile Developer" className="bg-slate-800">Mobile Developer</option>
                <option value="DevOps Engineer" className="bg-slate-800">DevOps Engineer</option>
                <option value="Data Scientist" className="bg-slate-800">Data Scientist</option>
                <option value="ML Engineer" className="bg-slate-800">ML Engineer</option>
                <option value="Product Manager" className="bg-slate-800">Product Manager</option>
                <option value="Designer" className="bg-slate-800">Designer</option>
                <option value="Student" className="bg-slate-800">Student</option>
                <option value="Freelancer" className="bg-slate-800">Freelancer</option>
                <option value="Entrepreneur" className="bg-slate-800">Entrepreneur</option>
                <option value="Other" className="bg-slate-800">Other</option>
              </select>
            </div>

            <div>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="currentlyWorking"
                  checked={formData.company.isCurrentlyWorking}
                  onChange={(e) => handleInputChange('company.isCurrentlyWorking', e.target.checked)}
                  className="w-4 h-4 text-pink-600 bg-white/10 border-white/20 rounded focus:ring-pink-500 focus:ring-2"
                />
                <label htmlFor="currentlyWorking" className="ml-2 text-sm font-medium text-white">
                  Currently Working
                </label>
              </div>

              {formData.company.isCurrentlyWorking && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-white mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={formData.company.name}
                      onChange={(e) => handleInputChange('company.name', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter company name"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-white mb-2">
                      Position
                    </label>
                    <input
                      type="text"
                      value={formData.company.position}
                      onChange={(e) => handleInputChange('company.position', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                      placeholder="Your position/role"
                    />
                  </div>
                </>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                CTC Range (Optional)
              </label>
              <select
                value={formData.ctcRange}
                onChange={(e) => handleInputChange('ctcRange', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
              >
                <option value="" className="bg-slate-800">Select CTC Range</option>
                <option value="0-3 LPA" className="bg-slate-800">0-3 LPA</option>
                <option value="3-6 LPA" className="bg-slate-800">3-6 LPA</option>
                <option value="6-10 LPA" className="bg-slate-800">6-10 LPA</option>
                <option value="10-15 LPA" className="bg-slate-800">10-15 LPA</option>
                <option value="15-25 LPA" className="bg-slate-800">15-25 LPA</option>
                <option value="25+ LPA" className="bg-slate-800">25+ LPA</option>
                <option value="Prefer not to say" className="bg-slate-800">Prefer not to say</option>
              </select>
            </div>
          </div>
        );

      case 3: // Education
        return (
          <div className="space-y-6 step-content">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="isStudent"
                checked={formData.education.isStudent}
                onChange={(e) => handleInputChange('education.isStudent', e.target.checked)}
                className="w-4 h-4 text-pink-600 bg-white/10 border-white/20 rounded focus:ring-pink-500 focus:ring-2"
              />
              <label htmlFor="isStudent" className="ml-2 text-sm font-medium text-white">
                Currently a Student
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                College/University *
              </label>
              <input
                type="text"
                value={formData.education.college}
                onChange={(e) => handleInputChange('education.college', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your college/university"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Degree
              </label>
              <input
                type="text"
                value={formData.education.degree}
                onChange={(e) => handleInputChange('education.degree', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                placeholder="e.g., B.Tech Computer Science"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                {formData.education.isStudent ? "Expected Graduation Year" : "Graduation Year"}
              </label>
              <select
                value={formData.education.graduationYear}
                onChange={(e) => handleInputChange('education.graduationYear', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
              >
                <option value="" className="bg-slate-800">Select Year</option>
                {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() + 5 - i).map(year => (
                  <option key={year} value={year} className="bg-slate-800">{year}</option>
                ))}
              </select>
            </div>
          </div>
        );

      case 4: // Photos
        return (
          <div className="space-y-6 step-content">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Add Your Photos</h3>
              <p className="text-white/60">Upload at least one photo to continue • Max 5 photos</p>
            </div>
            
            <ImageUpload 
              images={formData.photos} 
              setImages={(photos) => handleInputChange('photos', photos)}
              maxImages={5}
            />
          </div>
        );

      case 5: // Social Links
        return (
          <div className="space-y-6 step-content">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Social Links</h3>
              <p className="text-white/60">Connect your social profiles (optional)</p>
            </div>

            {Object.entries(formData.socialLinks).map(([platform, value]) => (
              <div key={platform}>
                <label className="block text-sm font-medium text-white mb-2 capitalize">
                  {platform === 'github' ? 'GitHub' : platform === 'linkedin' ? 'LinkedIn' : platform === 'leetcode' ? 'LeetCode' : platform}
                </label>
                <input
                  type="url"
                  value={value}
                  onChange={(e) => handleInputChange(`socialLinks.${platform}`, e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                  placeholder={`Your ${platform} profile URL`}
                />
              </div>
            ))}
          </div>
        );

      case 6: // Skills & Interests
        return (
          <div className="space-y-6 step-content">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Your Skills</h3>
              <p className="text-white/60 mb-4">Select at least 3 skills</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                {availableSkills.map(skill => (
                  <button
                    key={skill}
                    onClick={() => formData.skills.includes(skill) ? removeSkill(skill) : addSkill(skill)}
                    className={`px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                      formData.skills.includes(skill)
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              
              <p className="text-sm text-white/60">
                Selected: {formData.skills.length}/10 skills
              </p>
            </div>
          </div>
        );

      case 7: // Preferences
        return (
          <div className="space-y-6 step-content">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Dating Preferences</h3>
              <p className="text-white/60">Help us find your perfect match</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Age Range: {formData.preferences.ageRange.min} - {formData.preferences.ageRange.max} years
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/60 mb-1">Min Age</label>
                  <input
                    type="range"
                    min="18"
                    max="60"
                    value={formData.preferences.ageRange.min}
                    onChange={(e) => handleInputChange('preferences.ageRange.min', parseInt(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1">Max Age</label>
                  <input
                    type="range"
                    min="18"
                    max="60"
                    value={formData.preferences.ageRange.max}
                    onChange={(e) => handleInputChange('preferences.ageRange.max', parseInt(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Distance: {formData.preferences.distance} km
              </label>
              <input
                type="range"
                min="5"
                max="500"
                value={formData.preferences.distance}
                onChange={(e) => handleInputChange('preferences.distance', parseInt(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Auth-style Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900 via-slate-900 to-black"></div>
        
        {/* Animated Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute w-96 h-96 -top-48 -right-48 bg-gradient-radial from-pink-500/30 via-purple-500/20 to-transparent rounded-full animate-pulse"></div>
          <div className="absolute w-80 h-80 -bottom-40 -left-40 bg-gradient-radial from-blue-500/30 via-cyan-500/20 to-transparent rounded-full animate-pulse" style={{animationDelay: '3s'}}></div>
          <div className="absolute w-72 h-72 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-radial from-indigo-500/25 via-purple-500/15 to-transparent rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
        </div>

        {/* Code Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 bg-repeat"
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
               backgroundSize: '60px 60px'
             }}>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="onboarding-container w-full max-w-4xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <svg width="60" height="60" viewBox="0 0 32 32" className="mr-4">
                <circle cx="16" cy="16" r="16" fill="#e91e63"/>
                <path d="M16 24l-6.5-6.5c-1.5-1.5-1.5-4 0-5.5s4-1.5 5.5 0l1 1 1-1c1.5-1.5 4-1.5 5.5 0s1.5 4 0 5.5L16 24z" fill="white"/>
                <path d="M8 10l-2 2 2 2M24 10l2 2-2 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h1 className="text-3xl font-bold text-white">Complete Your Profile</h1>
            </div>
            <p className="text-white/60">Let's set up your developer dating profile</p>
          </div>

          {/* Main Container */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
            
            {/* Step Navigation */}
            <div className="border-b border-white/20 overflow-x-auto">
              <div className="flex min-w-max">
                {steps.map((step, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`flex-1 min-w-40 px-4 py-4 text-sm font-medium transition-all duration-300 ${
                      index === currentStep
                        ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-white border-b-2 border-pink-500'
                        : index < currentStep
                        ? 'text-green-400 hover:bg-white/5'
                        : 'text-white/60 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg">{step.icon}</span>
                      <span className="hidden sm:inline">{step.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white/5 h-1">
              <div 
                className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-500"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>

            {/* Step Content */}
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">{steps[currentStep].title}</h2>
                <p className="text-sm text-white/60">Step {currentStep + 1} of {steps.length}</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200">
                  {error}
                </div>
              )}

              {/* Step Content */}
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    currentStep === 0
                      ? 'bg-white/5 text-white/40 cursor-not-allowed'
                      : 'bg-white/10 text-white hover:bg-white/20 hover:scale-105'
                  }`}
                >
                  Previous
                </button>

                <button
                  onClick={currentStep === steps.length - 1 ? handleSubmit : nextStep}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium transition-all duration-300 hover:from-pink-600 hover:to-purple-700 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : currentStep === steps.length - 1 ? (
                    'Complete Profile'
                  ) : (
                    'Next'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
        
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ec4899, #8b5cf6);
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(236, 72, 153, 0.3);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ec4899, #8b5cf6);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 8px rgba(236, 72, 153, 0.3);
        }
      `}</style>
    </div>
  );
};

export default ProfileOnboarding; 