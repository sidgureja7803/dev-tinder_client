import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { gsap } from "gsap";

const ProfileOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
      setError("");
    } else {
      setError("Please complete all required fields before proceeding.");
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    setError("");
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

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      setError("Please complete all required fields.");
      return;
    }

    // Validate age
    const age = calculateAge(formData.dateOfBirth);
    if (age < 18) {
      setError("You must be at least 18 years old to use this app.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Transform photos array to match the new schema
      const photosData = formData.photos.map((url, index) => ({
        url,
        isPrimary: index === 0,
        uploadedAt: new Date()
      }));

      const submitData = {
        ...formData,
        photos: photosData,
        onboardingCompleted: true,
        age
      };

      const res = await axios.put(
        `${BASE_URL}/profile`,
        submitData,
        { withCredentials: true }
      );

      dispatch(addUser(res.data.data));
      
      // Success animation
      await gsap.to(".onboarding-container", {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      });
      
      navigate("/app/feed");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Information
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender * (Cannot be changed later)
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Religion
              </label>
              <select
                value={formData.religion}
                onChange={(e) => handleInputChange('religion', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Religion</option>
                <option value="Hindu">Hindu</option>
                <option value="Muslim">Muslim</option>
                <option value="Christian">Christian</option>
                <option value="Sikh">Sikh</option>
                <option value="Jain">Jain</option>
                <option value="Buddhist">Buddhist</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <select
                    value={formData.height.feet}
                    onChange={(e) => handleInputChange('height.feet', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Feet</option>
                    {[3, 4, 5, 6, 7, 8].map(ft => (
                      <option key={ft} value={ft}>{ft} ft</option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    value={formData.height.inches}
                    onChange={(e) => handleInputChange('height.inches', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Inches</option>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(inch => (
                      <option key={inch} value={inch}>{inch} in</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio * (Minimum 20 characters)
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="4"
                placeholder="Tell everyone about yourself..."
                maxLength="500"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.bio.length}/500 characters
              </p>
            </div>
          </div>
        );

      case 1: // Location
        return (
          <div className="space-y-6">
            <div className="text-center">
              <button
                onClick={getLocation}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                📍 Use Current Location
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                value={formData.location.city}
                onChange={(e) => handleInputChange('location.city', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your city"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State/Province
              </label>
              <input
                type="text"
                value={formData.location.state}
                onChange={(e) => handleInputChange('location.state', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your state/province"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <input
                type="text"
                value={formData.location.country}
                onChange={(e) => handleInputChange('location.country', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your country"
              />
            </div>
          </div>
        );

      case 2: // Professional Details
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profession *
              </label>
              <select
                value={formData.profession}
                onChange={(e) => handleInputChange('profession', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Profession</option>
                <option value="Software Engineer">Software Engineer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Mobile Developer">Mobile Developer</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="ML Engineer">ML Engineer</option>
                <option value="Product Manager">Product Manager</option>
                <option value="Designer">Designer</option>
                <option value="Student">Student</option>
                <option value="Freelancer">Freelancer</option>
                <option value="Entrepreneur">Entrepreneur</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="currentlyWorking"
                  checked={formData.company.isCurrentlyWorking}
                  onChange={(e) => handleInputChange('company.isCurrentlyWorking', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="currentlyWorking" className="text-sm font-medium text-gray-700">
                  Currently Working
                </label>
              </div>

              {formData.company.isCurrentlyWorking && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={formData.company.name}
                      onChange={(e) => handleInputChange('company.name', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter company name"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position
                    </label>
                    <input
                      type="text"
                      value={formData.company.position}
                      onChange={(e) => handleInputChange('company.position', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Your position/role"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CTC Range (Optional)
                    </label>
                    <select
                      value={formData.ctcRange}
                      onChange={(e) => handleInputChange('ctcRange', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select CTC Range</option>
                      <option value="0-3 LPA">0-3 LPA</option>
                      <option value="3-6 LPA">3-6 LPA</option>
                      <option value="6-10 LPA">6-10 LPA</option>
                      <option value="10-15 LPA">10-15 LPA</option>
                      <option value="15-25 LPA">15-25 LPA</option>
                      <option value="25-50 LPA">25-50 LPA</option>
                      <option value="50+ LPA">50+ LPA</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>
        );

      case 3: // Education
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="isStudent"
                  checked={formData.education.isStudent}
                  onChange={(e) => handleInputChange('education.isStudent', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="isStudent" className="text-sm font-medium text-gray-700">
                  Currently a student
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                College/University *
              </label>
              <input
                type="text"
                value={formData.education.college}
                onChange={(e) => handleInputChange('education.college', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your college/university"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Degree
              </label>
              <input
                type="text"
                value={formData.education.degree}
                onChange={(e) => handleInputChange('education.degree', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Bachelor's in Computer Science"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Graduation Year
              </label>
              <input
                type="number"
                value={formData.education.graduationYear}
                onChange={(e) => handleInputChange('education.graduationYear', e.target.value)}
                min="1980"
                max="2030"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="2024"
              />
            </div>
          </div>
        );

      case 4: // Photos
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Photos * (1-5 photos, first will be primary)
              </label>
              <div className="space-y-4">
                {[0, 1, 2, 3, 4].map((index) => (
                  <div key={index}>
                    <input
                      type="url"
                      value={formData.photos[index] || ""}
                      onChange={(e) => {
                        const newPhotos = [...formData.photos];
                        if (e.target.value) {
                          newPhotos[index] = e.target.value;
                        } else {
                          newPhotos.splice(index, 1);
                        }
                        setFormData(prev => ({ ...prev, photos: newPhotos }));
                      }}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder={index === 0 ? "Primary photo URL (required)" : `Photo ${index + 1} URL (optional)`}
                    />
                    {formData.photos[index] && (
                      <div className="mt-2">
                        <img
                          src={formData.photos[index]}
                          alt={`Preview ${index + 1}`}
                          className="w-32 h-32 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 5: // Social Links
        return (
          <div className="space-y-6">
            <p className="text-gray-600 text-center">Add your social profiles (all optional)</p>
            
            {Object.entries(formData.socialLinks).map(([platform, url]) => (
              <div key={platform}>
                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                  {platform === 'leetcode' ? 'LeetCode' : platform}
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleInputChange(`socialLinks.${platform}`, e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={`Your ${platform} profile URL`}
                />
              </div>
            ))}
          </div>
        );

      case 6: // Skills & Interests
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills * (Select at least 3, max 10)
              </label>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {availableSkills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => addSkill(skill)}
                    disabled={formData.skills.includes(skill) || formData.skills.length >= 10}
                    className={`p-2 text-sm rounded-lg border transition-colors ${
                      formData.skills.includes(skill)
                        ? 'bg-purple-100 border-purple-300 text-purple-700'
                        : 'bg-white border-gray-300 hover:bg-gray-50'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Selected Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-purple-500 hover:text-purple-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 7: // Preferences
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Set Your Preferences
              </h3>
              <p className="text-gray-600">
                You can change these anytime in settings
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age Range: Minimum
                </label>
                <input
                  type="number"
                  min="18"
                  max="100"
                  value={formData.preferences.ageRange.min}
                  onChange={(e) => handleInputChange('preferences.ageRange.min', parseInt(e.target.value))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age Range: Maximum
                </label>
                <input
                  type="number"
                  min="18"
                  max="100"
                  value={formData.preferences.ageRange.max}
                  onChange={(e) => handleInputChange('preferences.ageRange.max', parseInt(e.target.value))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distance (kilometers)
              </label>
              <input
                type="range"
                min="1"
                max="500"
                value={formData.preferences.distance}
                onChange={(e) => handleInputChange('preferences.distance', parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-center text-sm text-gray-500">
                {formData.preferences.distance} km
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-800 py-12 px-4">
      <div className="onboarding-container max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Progress Bar */}
        <div className="bg-gray-50 p-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center ${
                  index < steps.length - 1 ? 'flex-1' : ''
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step.icon}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    index <= currentStep ? 'text-purple-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 rounded ${
                    index < currentStep ? 'bg-purple-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          
          <p className="text-center text-sm text-gray-600 mt-2">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {steps[currentStep].title}
            </h2>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
              {error}
            </div>
          )}

          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-all"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !validateStep(currentStep)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
              >
                {loading ? "Saving..." : "Complete Profile"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOnboarding; 