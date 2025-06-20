import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { addUser } from '../utils/userSlice';
import NavBar from './NavBar';

const EnhancedPreferences = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [preferences, setPreferences] = useState({
    ageRange: { min: 18, max: 35 },
    genders: [],
    professions: [],
    experienceLevels: [],
    educationLevels: [],
    religions: [],
    skills: [],
    maxDistance: 50
  });

  // Predefined options
  const professionOptions = [
    "Software Engineer", "Frontend Developer", "Backend Developer", 
    "Full Stack Developer", "Mobile Developer", "DevOps Engineer", 
    "Data Scientist", "ML Engineer", "Product Manager", "Designer", 
    "Student", "Freelancer", "Entrepreneur", "Other"
  ];

  const experienceOptions = [
    "Fresher", "0-2 years", "2-5 years", "5-10 years", "10+ years"
  ];

  const educationOptions = [
    "High School", "Diploma", "Bachelor's", "Master's", "PhD", "Other"
  ];

  const religionOptions = [
    "Hindu", "Muslim", "Christian", "Sikh", "Jain", "Buddhist", "Other", "Any"
  ];

  const skillOptions = [
    "JavaScript", "Python", "React", "Node.js", "Java", "C++", "TypeScript",
    "Angular", "Vue.js", "Django", "Flask", "Express.js", "MongoDB", "MySQL",
    "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS", "Azure", "GCP",
    "Git", "GraphQL", "REST APIs", "Microservices", "Machine Learning",
    "Data Science", "DevOps", "Cybersecurity", "Mobile Development",
    "UI/UX Design", "Product Management", "Agile", "Scrum"
  ];

  const genderOptions = ["Male", "Female", "Other"];

  // Load current preferences
  useEffect(() => {
    if (user?.preferences) {
      setPreferences({
        ageRange: user.preferences.ageRange || { min: 18, max: 35 },
        genders: user.preferences.genders || [],
        professions: user.preferences.professions || [],
        experienceLevels: user.preferences.experienceLevels || [],
        educationLevels: user.preferences.educationLevels || [],
        religions: user.preferences.religions || [],
        skills: user.preferences.skills || [],
        maxDistance: user.preferences.maxDistance || 50
      });
    }
  }, [user]);

  const handleMultiSelect = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleAgeChange = (type, value) => {
    setPreferences(prev => ({
      ...prev,
      ageRange: {
        ...prev.ageRange,
        [type]: parseInt(value)
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.patch(
        `${BASE_URL}/profile/edit`,
        { preferences },
        { withCredentials: true }
      );

      dispatch(addUser(response.data));
      setSuccess('Preferences updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update preferences');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const resetToDefaults = () => {
    setPreferences({
      ageRange: { min: 18, max: 35 },
      genders: ["Male", "Female", "Other"],
      professions: [],
      experienceLevels: [],
      educationLevels: [],
      religions: [],
      skills: [],
      maxDistance: 50
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              🎯 Matching Preferences
            </h1>
            <p className="text-xl text-gray-300">
              Customize your preferences to find your perfect match
            </p>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="alert alert-success mb-6">
              <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="alert alert-error mb-6">
              <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="grid gap-8">
            {/* Age Range */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">📅 Age Range</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2">Minimum Age</label>
                  <input
                    type="range"
                    min="18"
                    max="60"
                    value={preferences.ageRange.min}
                    onChange={(e) => handleAgeChange('min', e.target.value)}
                    className="range range-primary w-full"
                  />
                  <div className="text-center text-white mt-2 font-semibold">
                    {preferences.ageRange.min} years
                  </div>
                </div>
                <div>
                  <label className="block text-white mb-2">Maximum Age</label>
                  <input
                    type="range"
                    min="18"
                    max="60"
                    value={preferences.ageRange.max}
                    onChange={(e) => handleAgeChange('max', e.target.value)}
                    className="range range-primary w-full"
                  />
                  <div className="text-center text-white mt-2 font-semibold">
                    {preferences.ageRange.max} years
                  </div>
                </div>
              </div>
            </div>

            {/* Gender Preferences */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">👥 Gender Preferences</h2>
              <div className="flex flex-wrap gap-3">
                {genderOptions.map(gender => (
                  <button
                    key={gender}
                    onClick={() => handleMultiSelect('genders', gender)}
                    className={`btn ${
                      preferences.genders.includes(gender)
                        ? 'btn-primary'
                        : 'btn-outline btn-primary'
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>

            {/* Distance */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">📍 Maximum Distance</h2>
              <input
                type="range"
                min="1"
                max="500"
                value={preferences.maxDistance}
                onChange={(e) => setPreferences(prev => ({ ...prev, maxDistance: parseInt(e.target.value) }))}
                className="range range-primary w-full"
              />
              <div className="text-center text-white mt-2 font-semibold">
                {preferences.maxDistance} km
              </div>
            </div>

            {/* Profession Preferences */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">💼 Preferred Professions</h2>
              <p className="text-gray-300 mb-4">Select the professions you're interested in (leave empty for all)</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {professionOptions.map(profession => (
                  <button
                    key={profession}
                    onClick={() => handleMultiSelect('professions', profession)}
                    className={`btn btn-sm ${
                      preferences.professions.includes(profession)
                        ? 'btn-primary'
                        : 'btn-outline btn-primary'
                    }`}
                  >
                    {profession}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">🚀 Experience Levels</h2>
              <p className="text-gray-300 mb-4">Select preferred experience levels</p>
              <div className="flex flex-wrap gap-3">
                {experienceOptions.map(level => (
                  <button
                    key={level}
                    onClick={() => handleMultiSelect('experienceLevels', level)}
                    className={`btn ${
                      preferences.experienceLevels.includes(level)
                        ? 'btn-secondary'
                        : 'btn-outline btn-secondary'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Education Level */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">🎓 Education Levels</h2>
              <p className="text-gray-300 mb-4">Select preferred education levels</p>
              <div className="flex flex-wrap gap-3">
                {educationOptions.map(level => (
                  <button
                    key={level}
                    onClick={() => handleMultiSelect('educationLevels', level)}
                    className={`btn ${
                      preferences.educationLevels.includes(level)
                        ? 'btn-accent'
                        : 'btn-outline btn-accent'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Religion */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">🕊️ Religion Preferences</h2>
              <p className="text-gray-300 mb-4">Select preferred religions (select "Any" for no preference)</p>
              <div className="flex flex-wrap gap-3">
                {religionOptions.map(religion => (
                  <button
                    key={religion}
                    onClick={() => handleMultiSelect('religions', religion)}
                    className={`btn ${
                      preferences.religions.includes(religion)
                        ? 'btn-warning'
                        : 'btn-outline btn-warning'
                    }`}
                  >
                    {religion}
                  </button>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">⚡ Preferred Skills</h2>
              <p className="text-gray-300 mb-4">Select skills you'd like your matches to have</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {skillOptions.map(skill => (
                  <button
                    key={skill}
                    onClick={() => handleMultiSelect('skills', skill)}
                    className={`btn btn-xs ${
                      preferences.skills.includes(skill)
                        ? 'btn-info'
                        : 'btn-outline btn-info'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button
                onClick={resetToDefaults}
                className="btn btn-outline btn-warning"
              >
                🔄 Reset to Defaults
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="btn btn-primary btn-wide"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    💾 Save Preferences
                  </>
                )}
              </button>
            </div>

            {/* Preference Summary */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">📋 Current Preferences Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                <div>
                  <strong>Age Range:</strong> {preferences.ageRange.min} - {preferences.ageRange.max} years
                </div>
                <div>
                  <strong>Max Distance:</strong> {preferences.maxDistance} km
                </div>
                <div>
                  <strong>Genders:</strong> {preferences.genders.length > 0 ? preferences.genders.join(', ') : 'All'}
                </div>
                <div>
                  <strong>Professions:</strong> {preferences.professions.length > 0 ? `${preferences.professions.length} selected` : 'All'}
                </div>
                <div>
                  <strong>Experience:</strong> {preferences.experienceLevels.length > 0 ? `${preferences.experienceLevels.length} selected` : 'All'}
                </div>
                <div>
                  <strong>Education:</strong> {preferences.educationLevels.length > 0 ? `${preferences.educationLevels.length} selected` : 'All'}
                </div>
                <div>
                  <strong>Religion:</strong> {preferences.religions.length > 0 ? preferences.religions.join(', ') : 'All'}
                </div>
                <div>
                  <strong>Skills:</strong> {preferences.skills.length > 0 ? `${preferences.skills.length} selected` : 'All'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPreferences; 