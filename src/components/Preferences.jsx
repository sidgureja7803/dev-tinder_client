import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { gsap } from "gsap";
import NavBar from "./NavBar";

const Preferences = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [preferences, setPreferences] = useState({
    ageRange: {
      min: 18,
      max: 35
    },
    distance: 50,
    genders: ["Male", "Female", "Other"],
    religions: [],
    professions: []
  });

  const [swipeSettings, setSwipeSettings] = useState({
    dailyLimit: 50,
    autoPassAgeOutOfRange: false,
    showOnlyActiveUsers: true
  });

  const religions = [
    "Hindu", "Muslim", "Christian", "Sikh", "Jain", "Buddhist", "Other", "Prefer not to say"
  ];

  const professions = [
    "Software Engineer", "Frontend Developer", "Backend Developer", 
    "Full Stack Developer", "Mobile Developer", "DevOps Engineer", 
    "Data Scientist", "ML Engineer", "Product Manager", "Designer", 
    "Student", "Freelancer", "Entrepreneur", "Other"
  ];

  useEffect(() => {
    if (user?.preferences) {
      setPreferences({
        ageRange: user.preferences.ageRange || { min: 18, max: 35 },
        distance: user.preferences.distance || 50,
        genders: user.preferences.genders || ["Male", "Female", "Other"],
        religions: user.preferences.religions || [],
        professions: user.preferences.professions || []
      });
    }
  }, [user]);

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const toggleArrayValue = (array, value) => {
    if (array.includes(value)) {
      return array.filter(item => item !== value);
    } else {
      return [...array, value];
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.put(
        `${BASE_URL}/profile/preferences`,
        preferences,
        { withCredentials: true }
      );

      dispatch(addUser({ ...user, preferences: res.data.data.preferences }));
      setSuccess("Preferences updated successfully!");

      // Success animation
      gsap.to(".preferences-container", {
        scale: 1.02,
        duration: 0.2,
        ease: "power1.out",
        onComplete: () => {
          gsap.to(".preferences-container", {
            scale: 1,
            duration: 0.2,
            ease: "power1.in"
          });
        }
      });

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update preferences");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-800">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="preferences-container max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
            <h1 className="text-3xl font-bold text-white text-center">
              Matching Preferences
            </h1>
            <p className="text-purple-100 text-center mt-2">
              Customize who you see and who can see you
            </p>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
                {success}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Age Range */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  🎂 Age Range
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Age
                      </label>
                      <input
                        type="number"
                        min="18"
                        max="100"
                        value={preferences.ageRange.min}
                        onChange={(e) => handlePreferenceChange('ageRange.min', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Age
                      </label>
                      <input
                        type="number"
                        min="18"
                        max="100"
                        value={preferences.ageRange.max}
                        onChange={(e) => handlePreferenceChange('ageRange.max', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Looking for people aged {preferences.ageRange.min} to {preferences.ageRange.max}
                  </p>
                </div>
              </div>

              {/* Distance */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  📍 Distance
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Distance
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="500"
                    value={preferences.distance}
                    onChange={(e) => handlePreferenceChange('distance', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>1 km</span>
                    <span className="font-medium">{preferences.distance} km</span>
                    <span>500 km</span>
                  </div>
                </div>
              </div>

              {/* Gender Preferences */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  👥 Looking For
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    {["Male", "Female", "Other"].map((gender) => (
                      <label key={gender} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={preferences.genders.includes(gender)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handlePreferenceChange('genders', [...preferences.genders, gender]);
                            } else {
                              handlePreferenceChange('genders', preferences.genders.filter(g => g !== gender));
                            }
                          }}
                          className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <span className="text-gray-700">{gender}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Religion Preferences */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  🕉️ Religion Preferences
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-3">
                    Select religions you're interested in (leave empty for no preference)
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {religions.map((religion) => (
                      <label key={religion} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={preferences.religions.includes(religion)}
                          onChange={(e) => {
                            handlePreferenceChange('religions', 
                              toggleArrayValue(preferences.religions, religion)
                            );
                          }}
                          className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{religion}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Profession Preferences */}
              <div className="space-y-4 lg:col-span-2">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  💼 Profession Preferences
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-3">
                    Select professions you're interested in (leave empty for no preference)
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {professions.map((profession) => (
                      <label key={profession} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={preferences.professions.includes(profession)}
                          onChange={(e) => {
                            handlePreferenceChange('professions', 
                              toggleArrayValue(preferences.professions, profession)
                            );
                          }}
                          className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{profession}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Features Hint */}
            {false && (
              <div className="mt-8 p-4 bg-gradient-to-r from-yellow-100 to-yellow-200 border-l-4 border-yellow-500 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">✨</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-medium text-yellow-800">
                      Unlock Premium Features
                    </h4>
                    <p className="text-yellow-700">
                      Get unlimited swipes, see who liked you, and access advanced filters with Premium membership.
                    </p>
                    <button
                      onClick={() => navigate('/app/premium')}
                      className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      Upgrade to Premium
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => navigate('/app/profile')}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Preferences"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preferences; 