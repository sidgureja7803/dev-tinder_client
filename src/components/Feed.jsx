import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import Navbar from './Navbar';
import EditProfile from './EditProfile';
import { gsap } from 'gsap';
import TinderCard from 'react-tinder-card';
import styles from './Feed.module.css';

const Feed = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector((store) => store.user);
  const [showEditProfile, setShowEditProfile] = useState(!user?.about || !user?.age || !user?.gender);
  const [lastDirection, setLastDirection] = useState(null);

  // Create refs array for each card
  const childRefs = useMemo(
    () => Array(users.length).fill(0).map(i => React.createRef()),
    [users.length]
  );

  useEffect(() => {
    fetchUsers();
    // Animate the feed container on mount
    gsap.from('.feed-container', {
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: 'power3.out'
    });
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/feed`, {
        withCredentials: true
      });
      setUsers(response.data.data || []);
    } catch (err) {
      setError('Failed to fetch potential matches');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const swiped = async (direction, userId, index) => {
    setLastDirection(direction);
    
    if (direction === 'right') {
      try {
        await axios.post(`${BASE_URL}/like/${userId}`, {}, {
          withCredentials: true
        });
      } catch (err) {
        console.error('Error liking user:', err);
      }
    }
  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`);
  };

  const swipe = async (dir) => {
    if (users.length > 0) {
      const currentIndex = users.length - 1;
      if (childRefs[currentIndex]?.current) {
        await childRefs[currentIndex].current.swipe(dir);
      }
    }
  };

  if (showEditProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-800">
        <Navbar />
        <EditProfile user={user} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-800 flex items-center justify-center">
        <Navbar />
        <div className="loading loading-spinner loading-lg text-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-800">
      <Navbar />
      <div className="feed-container container mx-auto px-4 py-8">
        {error ? (
          <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">
            {error}
          </div>
        ) : users.length > 0 ? (
          <div className="relative h-[70vh] flex items-center justify-center">
            <div className={styles.cardContainer}>
              {users.map((currentUser, index) => (
                <TinderCard
                  ref={childRefs[index]}
                  key={currentUser._id}
                  onSwipe={(dir) => swiped(dir, currentUser._id, index)}
                  onCardLeftScreen={() => outOfFrame(currentUser.firstName, index)}
                  className={styles.swipe}
                  preventSwipe={['up', 'down']}
                >
                  <div className={styles.card}>
                    <img
                      src={currentUser.photoUrl || 'https://via.placeholder.com/400x400'}
                      alt={`${currentUser.firstName}'s profile`}
                      className={styles.cardImage}
                    />
                    <div className={styles.cardContent}>
                      <h2 className="text-3xl font-bold text-white">
                        {currentUser.firstName} {currentUser.lastName}, {currentUser.age}
                      </h2>
                      <p className="text-gray-200">{currentUser.gender}</p>
                      <p className="text-gray-200 mt-2">{currentUser.about}</p>
                      {currentUser.skills && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {currentUser.skills.map((skill, i) => (
                            <span
                              key={i}
                              className={styles.skillTag}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </TinderCard>
              ))}
            </div>

            <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-4 pb-8">
              <button
                onClick={() => swipe('left')}
                className="btn btn-circle btn-lg bg-red-500 hover:bg-red-600 border-none transform hover:scale-110 transition-transform"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <button
                onClick={() => swipe('right')}
                className="btn btn-circle btn-lg bg-green-500 hover:bg-green-600 border-none transform hover:scale-110 transition-transform"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-6xl mb-4">😢</div>
            <h2 className="text-2xl font-bold text-white mb-4">No more matches found</h2>
            <p className="text-gray-200 mb-6">We've run out of potential matches for you. Check back later!</p>
            <button onClick={fetchUsers} className="btn btn-primary">
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
