import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { gsap } from "gsap";
import SkillSelector from "./SkillSelector";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "");
  const [age, setAge] = useState(user?.age || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [about, setAbout] = useState(user?.about || "");
  const [selectedSkills, setSelectedSkills] = useState(
    user?.skills?.map(skill => ({ value: skill.toLowerCase(), label: skill, color: '#8b5cf6' })) || []
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const saveProfile = async () => {
    if (!firstName || !lastName || !age || !gender || !about || selectedSkills.length === 0) {
      setError("Please fill in all fields and select at least one skill");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.patch(
        `${BASE_URL}/profile/edit`,
        {
          firstName,
          lastName,
          photoUrl,
          age,
          gender,
          about,
          skills: selectedSkills.map(skill => skill.label)
        },
        { withCredentials: true }
      );

      dispatch(addUser(res.data.data));

      // Animate success
      const container = document.querySelector('.edit-profile-container');
      await gsap.to(container, {
        scale: 1.02,
        duration: 0.2,
        ease: "power1.out"
      });
      await gsap.to(container, {
        scale: 1,
        duration: 0.2,
        ease: "power1.in"
      });

      navigate("/app/feed");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-800 py-12 px-4">
      <div className="edit-profile-container max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Complete Your Profile</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo URL</label>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                <SkillSelector
                  selectedSkills={selectedSkills}
                  onChange={setSelectedSkills}
                  maxSkills={10}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="4"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
                {error}
              </div>
            )}

            <button
              onClick={saveProfile}
              disabled={loading}
              className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </div>

          <div className="md:w-1/2 bg-gray-50 p-8">
            <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-200">
              <img
                src={photoUrl || "https://via.placeholder.com/400x400"}
                alt="Profile Preview"
                className="object-cover"
              />
            </div>
            <div className="mt-6 p-4 bg-white rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-900">{firstName} {lastName}</h3>
              {age && <p className="text-gray-600">Age: {age}</p>}
              {gender && <p className="text-gray-600">Gender: {gender}</p>}
              {selectedSkills.length > 0 && (
                <div className="mt-2">
                  <h4 className="text-sm font-medium text-gray-700">Skills</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedSkills.map(skill => (
                      <span
                        key={skill.value}
                        className="px-2 py-1 rounded-full text-sm"
                        style={{
                          backgroundColor: `${skill.color}22`,
                          color: skill.color
                        }}
                      >
                        {skill.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {about && (
                <div className="mt-2">
                  <h4 className="text-sm font-medium text-gray-700">About</h4>
                  <p className="text-gray-600 mt-1">{about}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
