import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { addUser } from '../utils/userSlice';
import { gsap } from 'gsap';

const Profile = () => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileStats, setProfileStats] = useState(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    profession: '',
    company: '',
    ctc: '',
    skills: [],
    height: { feet: '', inches: '' },
    religion: '',
    socialLinks: {
      instagram: '',
      linkedin: '',
      github: '',
      leetcode: '',
      twitter: ''
    }
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
        profession: user.profession || '',
        company: user.company || '',
        ctc: user.ctc || '',
        skills: user.skills || [],
        height: {
          feet: user.height?.feet || '',
          inches: user.height?.inches || ''
        },
        religion: user.religion || '',
        socialLinks: {
          instagram: user.socialLinks?.instagram || '',
          linkedin: user.socialLinks?.linkedin || '',
          github: user.socialLinks?.github || '',
          leetcode: user.socialLinks?.leetcode || '',
          twitter: user.socialLinks?.twitter || ''
        }
      });
    }
    
    fetchProfileStats();
    
    // Animate profile sections on mount
    gsap.from('.profile-section', {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out'
    });
  }, [user]);

  const fetchProfileStats = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/feed/stats`, {
        withCredentials: true
      });
      setProfileStats(response.data.data);
    } catch (err) {
      console.error('Error fetching profile stats:', err);
    }
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSkillChange = (e) => {
    const value = e.target.value;
    const skills = value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setFormData(prev => ({
      ...prev,
      skills
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await axios.put(`${BASE_URL}/profile/update`, formData, {
        withCredentials: true
      });
      
      dispatch(addUser(response.data.data));
      setEditing(false);
      
      // Success animation
      gsap.from('.success-indicator', {
        scale: 0,
        duration: 0.5,
        ease: 'back.out(1.7)'
      });
      
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploadingPhoto(true);
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await axios.post(`${BASE_URL}/profile/upload-photo`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      dispatch(addUser(response.data.data));
      setShowPhotoModal(false);
    } catch (err) {
      console.error('Error uploading photo:', err);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/profile/photo/${photoId}`, {
        withCredentials: true
      });
      
      dispatch(addUser(response.data.data));
    } catch (err) {
      console.error('Error deleting photo:', err);
      alert('Failed to delete photo. Please try again.');
    }
  };

  const handleSetPrimaryPhoto = async (photoId) => {
    try {
      const response = await axios.put(`${BASE_URL}/profile/photo/${photoId}/primary`, {}, {
        withCredentials: true
      });
      
      dispatch(addUser(response.data.data));
    } catch (err) {
      console.error('Error setting primary photo:', err);
      alert('Failed to set primary photo. Please try again.');
    }
  };

  const primaryPhoto = user?.photos?.find(p => p.isPrimary)?.url || 
                      user?.photos?.[0]?.url || 
                      user?.photoUrl || 
                      'https://via.placeholder.com/400x400';

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        {/* Header */}
        <div className="profile-section bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <div className="flex gap-3">
              {!editing ? (
                <button 
                  onClick={() => setEditing(true)}
                  className="btn btn-primary"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button 
                    onClick={handleSave}
                    disabled={loading}
                    className="btn btn-success"
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    onClick={() => setEditing(false)}
                    className="btn btn-outline text-white border-white"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Photo */}
            <div className="text-center">
              <div className="relative inline-block">
                <img 
                  src={primaryPhoto}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                {user?.isPremium && (
                  <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-2">
                    <span className="text-white font-bold text-sm">👑</span>
                  </div>
                )}
                {user?.isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <button 
                onClick={() => setShowPhotoModal(true)}
                className="btn btn-sm btn-outline text-white border-white mt-3"
              >
                Manage Photos
              </button>
            </div>

            {/* Basic Info */}
            <div className="col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  {editing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                    />
                  ) : (
                    <p className="text-lg">{user?.firstName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  {editing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                    />
                  ) : (
                    <p className="text-lg">{user?.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Age</label>
                  <p className="text-lg">{calculateAge(user?.dateOfBirth) || user?.age}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Gender</label>
                  <p className="text-lg capitalize">{user?.gender}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Personal Information */}
          <div className="profile-section bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 text-white">
            <h2 className="text-xl font-bold mb-4">Personal Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                {editing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="textarea textarea-bordered w-full"
                    rows="3"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-200">{user?.bio || 'No bio added yet'}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Height (ft)</label>
                  {editing ? (
                    <input
                      type="number"
                      name="height.feet"
                      value={formData.height.feet}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      min="4"
                      max="7"
                    />
                  ) : (
                    <p>{user?.height?.feet || '-'}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Height (in)</label>
                  {editing ? (
                    <input
                      type="number"
                      name="height.inches"
                      value={formData.height.inches}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      min="0"
                      max="11"
                    />
                  ) : (
                    <p>{user?.height?.inches || '-'}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Religion</label>
                {editing ? (
                  <select
                    name="religion"
                    value={formData.religion}
                    onChange={handleInputChange}
                    className="select select-bordered w-full"
                  >
                    <option value="">Select Religion</option>
                    <option value="hinduism">Hinduism</option>
                    <option value="islam">Islam</option>
                    <option value="christianity">Christianity</option>
                    <option value="sikhism">Sikhism</option>
                    <option value="buddhism">Buddhism</option>
                    <option value="jainism">Jainism</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                ) : (
                  <p className="capitalize">{user?.religion || 'Not specified'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <p className="text-gray-200">
                  {user?.location?.city && user?.location?.state 
                    ? `${user.location.city}, ${user.location.state}`
                    : 'Location not set'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="profile-section bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 text-white">
            <h2 className="text-xl font-bold mb-4">Professional Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Profession</label>
                {editing ? (
                  <select
                    name="profession"
                    value={formData.profession}
                    onChange={handleInputChange}
                    className="select select-bordered w-full"
                  >
                    <option value="">Select Profession</option>
                    <option value="software-engineer">Software Engineer</option>
                    <option value="data-scientist">Data Scientist</option>
                    <option value="product-manager">Product Manager</option>
                    <option value="designer">Designer</option>
                    <option value="marketing">Marketing</option>
                    <option value="sales">Sales</option>
                    <option value="student">Student</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <p className="capitalize">{user?.profession?.replace('-', ' ') || 'Not specified'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Company</label>
                {editing ? (
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="Your company name"
                  />
                ) : (
                  <p>{user?.company || 'Not specified'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">CTC (Annual)</label>
                {editing ? (
                  <select
                    name="ctc"
                    value={formData.ctc}
                    onChange={handleInputChange}
                    className="select select-bordered w-full"
                  >
                    <option value="">Select CTC Range</option>
                    <option value="0-3">0-3 LPA</option>
                    <option value="3-6">3-6 LPA</option>
                    <option value="6-10">6-10 LPA</option>
                    <option value="10-15">10-15 LPA</option>
                    <option value="15-25">15-25 LPA</option>
                    <option value="25+">25+ LPA</option>
                  </select>
                ) : (
                  <p>{user?.ctc ? `${user.ctc} LPA` : 'Not specified'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Education</label>
                <p className="text-gray-200">
                  {user?.education?.institution || 'Not specified'}
                  {user?.education?.degree && ` • ${user.education.degree}`}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Skills</label>
                {editing ? (
                  <textarea
                    name="skills"
                    value={formData.skills.join(', ')}
                    onChange={handleSkillChange}
                    className="textarea textarea-bordered w-full"
                    rows="3"
                    placeholder="JavaScript, React, Node.js, Python..."
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {user?.skills?.length > 0 ? user.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="bg-blue-500 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    )) : (
                      <p className="text-gray-200">No skills added yet</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="profile-section bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 mt-6 text-white">
          <h2 className="text-xl font-bold mb-4">Social Links</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(formData.socialLinks).map(([platform, url]) => (
              <div key={platform}>
                <label className="block text-sm font-medium mb-2 capitalize">
                  {platform}
                </label>
                {editing ? (
                  <input
                    type="url"
                    name={`socialLinks.${platform}`}
                    value={url}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder={`Your ${platform} URL`}
                  />
                ) : (
                  url ? (
                    <a 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:text-blue-200 break-all"
                    >
                      View Profile
                    </a>
                  ) : (
                    <p className="text-gray-400">Not added</p>
                  )
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Profile Statistics */}
        {profileStats && (
          <div className="profile-section bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 mt-6 text-white">
            <h2 className="text-xl font-bold mb-4">Profile Statistics</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {profileStats.swipesSent.likes + profileStats.swipesSent.superLikes}
                </div>
                <div className="text-sm text-gray-300">Likes Sent</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {profileStats.swipesReceived.likes + profileStats.swipesReceived.superLikes}
                </div>
                <div className="text-sm text-gray-300">Likes Received</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {profileStats.matchRate}%
                </div>
                <div className="text-sm text-gray-300">Match Rate</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">
                  {profileStats.profileCompletion}%
                </div>
                <div className="text-sm text-gray-300">Profile Complete</div>
              </div>
            </div>
          </div>
        )}

        {/* Photo Management Modal */}
        {showPhotoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold">Manage Photos</h3>
                  <button 
                    onClick={() => setShowPhotoModal(false)}
                    className="btn btn-circle btn-sm"
                  >
                    ✕
                  </button>
                </div>
                
                {/* Upload New Photo */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Upload New Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploadingPhoto || (user?.photos?.length >= 5)}
                    className="file-input file-input-bordered w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Max 5 photos, 5MB each. Current: {user?.photos?.length || 0}/5
                  </p>
                </div>

                {/* Existing Photos */}
                <div className="grid grid-cols-3 gap-4">
                  {user?.photos?.map((photo, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={photo.url}
                        alt={`Profile ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      {photo.isPrimary && (
                        <div className="absolute top-1 left-1 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                          Primary
                        </div>
                      )}
                      <div className="absolute top-1 right-1 flex gap-1">
                        {!photo.isPrimary && (
                          <button
                            onClick={() => handleSetPrimaryPhoto(photo.id)}
                            className="bg-blue-500 text-white text-xs px-2 py-1 rounded"
                          >
                            Set Primary
                          </button>
                        )}
                        <button
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="bg-red-500 text-white text-xs px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
