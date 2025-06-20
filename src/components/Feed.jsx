import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import Navbar from './NavBar';
import EditProfile from './EditProfile';
import { gsap } from 'gsap';
import TinderCard from 'react-tinder-card';
import styles from './Feed.module.css';

const Feed = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [swipeCount, setSwipeCount] = useState(0);
  const [swipeLimit, setSwipeLimit] = useState(null);
  const [dailyLimitReached, setDailyLimitReached] = useState(false);
  const [lastSwipedUser, setLastSwipedUser] = useState(null);
  const user = useSelector((store) => store.user);
  const [showEditProfile, setShowEditProfile] = useState(
    !user?.about || !user?.age || !user?.gender || !user?.profileComplete
  );
  const [matchResult, setMatchResult] = useState(null);

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
      
      if (response.data.limitReached) {
        setDailyLimitReached(true);
        setUsers([]);
      } else {
        setUsers(response.data.data || []);
        setSwipeLimit(response.data.remaining);
      }
    } catch (err) {
      if (err.response?.data?.limitReached) {
        setDailyLimitReached(true);
        setError(err.response.data.message);
      } else {
        setError('Failed to fetch potential matches');
      }
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
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

  const calculateCompatibility = (currentUser, targetUser) => {
    let score = 0;
    let factors = 0;

    // Age compatibility (20 points max)
    if (currentUser.preferences?.ageRange && targetUser.dateOfBirth) {
      const targetAge = calculateAge(targetUser.dateOfBirth);
      if (targetAge >= currentUser.preferences.ageRange.min && 
          targetAge <= currentUser.preferences.ageRange.max) {
        score += 20;
      }
      factors++;
    }

    // Location compatibility (15 points max)
    if (currentUser.location && targetUser.location) {
      score += 15; // Simplified - in real app, calculate distance
      factors++;
    }

    // Skills/Interests compatibility (25 points max)
    if (currentUser.skills && targetUser.skills) {
      const commonSkills = currentUser.skills.filter(skill => 
        targetUser.skills.includes(skill)
      );
      score += Math.min((commonSkills.length / Math.max(currentUser.skills.length, targetUser.skills.length)) * 25, 25);
      factors++;
    }

    // Education compatibility (15 points max)
    if (currentUser.education?.level && targetUser.education?.level) {
      if (currentUser.education.level === targetUser.education.level) {
        score += 15;
      } else {
        score += 8; // Partial match
      }
      factors++;
    }

    // Profession compatibility (15 points max)
    if (currentUser.profession && targetUser.profession) {
      if (currentUser.profession === targetUser.profession) {
        score += 15;
      } else {
        score += 5; // Different but professional match
      }
      factors++;
    }

    // Religion compatibility (10 points max)
    if (currentUser.preferences?.religion && targetUser.religion) {
      if (currentUser.preferences.religion.includes(targetUser.religion)) {
        score += 10;
      }
      factors++;
    }

    return factors > 0 ? Math.round(score / factors * 4) : 50; // Scale to 100 and provide default
  };

  const showMatchAnimation = (matchData) => {
    setMatchResult(matchData);
    
    // Create match modal with GSAP animation
    const matchModal = document.createElement('div');
    matchModal.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50';
    matchModal.innerHTML = `
      <div class="bg-gradient-to-r from-pink-500 to-purple-600 p-8 rounded-xl text-white text-center max-w-md mx-4 transform scale-0">
        <div class="text-6xl mb-4">💖</div>
        <h2 class="text-4xl font-bold mb-6">It's a Match!</h2>
        <p class="mb-6">You and ${matchData.matchedWith.firstName} have liked each other</p>
        <div class="flex justify-center items-center gap-8 mb-6">
          <div class="w-24 h-24 rounded-full overflow-hidden border-4 border-white">
            <img src="${user.photos?.[0]?.url || user.photoUrl || 'https://via.placeholder.com/400x500'}" 
                 class="w-full h-full object-cover" alt="You" />
          </div>
          <div class="text-4xl">💕</div>
          <div class="w-24 h-24 rounded-full overflow-hidden border-4 border-white">
            <img src="${matchData.matchedWith.photoUrl || 'https://via.placeholder.com/400x500'}" 
                 class="w-full h-full object-cover" alt="${matchData.matchedWith.firstName}" />
          </div>
        </div>
        ${matchData.mutualInterests && matchData.mutualInterests.length > 0 ?
          `<p class="text-sm mb-4">You both like: ${matchData.mutualInterests.join(', ')}</p>` :
          ''}
        <div class="flex gap-4 justify-center">
          <button class="bg-white text-pink-600 px-6 py-2 rounded-full font-bold" id="sendMessage">Send Message</button>
          <button class="border border-white text-white px-6 py-2 rounded-full font-bold" id="keepSwiping">Keep Swiping</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(matchModal);
    
    // Animate in
    const modal = matchModal.querySelector('div');
    gsap.to(modal, {
      scale: 1,
      duration: 0.5,
      ease: "back.out(1.7)"
    });
    
    // Add event listeners
    matchModal.querySelector('#keepSwiping').addEventListener('click', () => {
      gsap.to(modal, {
        scale: 0,
        duration: 0.3,
        onComplete: () => {
          document.body.removeChild(matchModal);
          setMatchResult(null);
        }
      });
    });

    matchModal.querySelector('#sendMessage').addEventListener('click', () => {
      // Navigate to chat - you'll need to implement this
      window.location.href = `/app/chat/${matchData.matchId}`;
    });
  };

  const swiped = async (direction, userId, index) => {
    if (direction === 'right') {
      setLastSwipedUser(users[index]);
      
      try {
        const response = await axios.post(`${BASE_URL}/match/swipe/${userId}`, 
          { action: 'like' }, 
          { withCredentials: true }
        );
        
        setSwipeCount(prev => prev + 1);
        setSwipeLimit(response.data.remaining);
        
        // Check if it's a match
        if (response.data.data && response.data.data.matchId) {
          showMatchAnimation(response.data.data);
        }
        
        // Check if limit reached
        if (response.data.limitReached) {
          setDailyLimitReached(true);
        }
      } catch (err) {
        if (err.response?.data?.limitReached) {
          setDailyLimitReached(true);
          setError(err.response.data.message);
        }
        console.error('Error liking user:', err);
      }
    } else if (direction === 'left') {
      try {
        const response = await axios.post(`${BASE_URL}/match/swipe/${userId}`, 
          { action: 'pass' }, 
          { withCredentials: true }
        );
        
        setSwipeCount(prev => prev + 1);
        setSwipeLimit(response.data.remaining);
        
        if (response.data.limitReached) {
          setDailyLimitReached(true);
        }
      } catch (err) {
        console.error('Error passing user:', err);
      }
    }
  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`);
  };

  const swipe = async (dir) => {
    if (users.length > 0 && !dailyLimitReached) {
      const currentIndex = users.length - 1;
      if (childRefs[currentIndex]?.current) {
        await childRefs[currentIndex].current.swipe(dir);
      }
    }
  };

  const undoLastSwipe = async () => {
    if (!user.isPremium) {
      alert('Undo feature is only available for premium users!');
      return;
    }
    
    if (lastSwipedUser) {
      // Add the user back to the front of the stack
      setUsers(prev => [...prev, lastSwipedUser]);
      setLastSwipedUser(null);
      
      // Animate the card back in
      gsap.from('.user-card', {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        ease: 'back.out(1.7)'
      });
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

  if (dailyLimitReached) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-800">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="text-6xl mb-4">⏰</div>
          <h2 className="text-3xl font-bold text-white mb-4">Daily Swipe Limit Reached!</h2>
          <p className="text-gray-200 mb-6">
            You've reached your daily limit of swipes. Upgrade to premium for unlimited swipes!
          </p>
          <div className="space-y-4">
            <button 
              onClick={() => window.location.href = '/app/premium'} 
              className="btn btn-primary btn-lg"
            >
              Upgrade to Premium
            </button>
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-outline text-white border-white hover:bg-white hover:text-purple-900"
            >
              Check Again Tomorrow
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-800">
      <Navbar />
      
      {/* Swipe Counter */}
      <div className="container mx-auto px-4 pt-4">
        <div className="flex justify-between items-center bg-white bg-opacity-20 rounded-lg p-3 mb-4">
          <div className="text-white">
            <span className="font-semibold">
              {user.isPremium ? 'Unlimited Swipes' : `${swipeLimit} swipes remaining`}
            </span>
          </div>
          
          {!user.isPremium && (
            <button 
              onClick={() => window.location.href = '/app/premium'}
              className="btn btn-sm btn-primary"
            >
              Go Premium
            </button>
          )}
          
          {user.isPremium && lastSwipedUser && (
            <button 
              onClick={undoLastSwipe}
              className="btn btn-sm btn-secondary"
            >
              ↶ Undo
            </button>
          )}
        </div>
      </div>

      <div className="feed-container container mx-auto px-4 py-8">
        {error ? (
          <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">
            {error}
          </div>
        ) : users.length > 0 ? (
          <div className="relative h-[70vh] flex items-center justify-center">
            <div className={styles.cardContainer}>
              {users.map((currentUser, index) => {
                const compatibility = calculateCompatibility(user, currentUser);
                const age = calculateAge(currentUser.dateOfBirth) || currentUser.age;
                const primaryPhoto = currentUser.photos?.find(p => p.isPrimary)?.url || 
                                   currentUser.photos?.[0]?.url || 
                                   currentUser.photoUrl || 
                                   'https://via.placeholder.com/400x400';

                return (
                  <TinderCard
                    ref={childRefs[index]}
                    key={currentUser._id}
                    onSwipe={(dir) => swiped(dir, currentUser._id, index)}
                    onCardLeftScreen={() => outOfFrame(currentUser.firstName, index)}
                    className={styles.swipe}
                    preventSwipe={['up', 'down']}
                  >
                    <div className={`${styles.card} user-card`}>
                      <img
                        src={primaryPhoto}
                        alt={`${currentUser.firstName}'s profile`}
                        className={styles.cardImage}
                      />
                      
                      {/* Compatibility Badge */}
                      <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full px-3 py-1">
                        <span className={`font-bold ${
                          compatibility >= 80 ? 'text-green-600' :
                          compatibility >= 60 ? 'text-blue-600' :
                          compatibility >= 40 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {compatibility}% match
                        </span>
                      </div>

                      {/* Verified Badge */}
                      {currentUser.isVerified && (
                        <div className="absolute top-4 left-4 bg-blue-500 rounded-full p-2">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}

                      <div className={styles.cardContent}>
                        <h2 className="text-3xl font-bold text-white mb-2">
                          {currentUser.firstName} {currentUser.lastName?.charAt(0)}.
                          {age && `, ${age}`}
                        </h2>
                        
                        {/* Enhanced Profile Info */}
                        <div className="space-y-2 mb-4">
                          {currentUser.profession && (
                            <p className="text-gray-200 flex items-center">
                              <span className="mr-2">💼</span>
                              {currentUser.profession}
                              {currentUser.company && ` at ${currentUser.company}`}
                            </p>
                          )}
                          
                          {currentUser.education?.institution && (
                            <p className="text-gray-200 flex items-center">
                              <span className="mr-2">🎓</span>
                              {currentUser.education.institution}
                            </p>
                          )}
                          
                          {currentUser.location?.city && (
                            <p className="text-gray-200 flex items-center">
                              <span className="mr-2">📍</span>
                              {currentUser.location.city}
                              {currentUser.location.state && `, ${currentUser.location.state}`}
                            </p>
                          )}
                          
                          {currentUser.height && (
                            <p className="text-gray-200 flex items-center">
                              <span className="mr-2">📏</span>
                              {currentUser.height.feet}'{currentUser.height.inches}"
                            </p>
                          )}
                        </div>

                        {currentUser.bio && (
                          <p className="text-gray-200 mb-4 italic">"{currentUser.bio}"</p>
                        )}

                        {currentUser.skills && currentUser.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {currentUser.skills.slice(0, 6).map((skill, i) => (
                              <span
                                key={i}
                                className={`${styles.skillTag} ${
                                  user.skills?.includes(skill) ? 'bg-green-500' : 'bg-blue-500'
                                }`}
                              >
                                {skill}
                                {user.skills?.includes(skill) && ' ✓'}
                              </span>
                            ))}
                            {currentUser.skills.length > 6 && (
                              <span className={styles.skillTag}>
                                +{currentUser.skills.length - 6} more
                              </span>
                            )}
                          </div>
                        )}

                        {/* Social Links */}
                        {currentUser.socialLinks && Object.keys(currentUser.socialLinks).length > 0 && (
                          <div className="flex gap-2 justify-center mt-4">
                            {currentUser.socialLinks.github && (
                              <span className="text-white text-sm">💻 GitHub</span>
                            )}
                            {currentUser.socialLinks.linkedin && (
                              <span className="text-white text-sm">💼 LinkedIn</span>
                            )}
                            {currentUser.socialLinks.leetcode && (
                              <span className="text-white text-sm">🧩 LeetCode</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </TinderCard>
                );
              })}
            </div>

            <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-4 pb-8">
              <button
                onClick={() => swipe('left')}
                disabled={dailyLimitReached}
                className="btn btn-circle btn-lg bg-red-500 hover:bg-red-600 border-none transform hover:scale-110 transition-transform disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {user.isPremium && (
                <button
                  onClick={() => swipe('up')}
                  className="btn btn-circle btn-lg bg-blue-500 hover:bg-blue-600 border-none transform hover:scale-110 transition-transform"
                >
                  ⭐
                </button>
              )}
              
              <button
                onClick={() => swipe('right')}
                disabled={dailyLimitReached}
                className="btn btn-circle btn-lg bg-green-500 hover:bg-green-600 border-none transform hover:scale-110 transition-transform disabled:opacity-50"
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
            <p className="text-gray-200 mb-6">
              We've run out of potential matches for you. Try adjusting your preferences or check back later!
            </p>
            <div className="space-y-4">
              <button 
                onClick={() => window.location.href = '/app/preferences'} 
                className="btn btn-primary"
              >
                Adjust Preferences
              </button>
              <button onClick={fetchUsers} className="btn btn-outline text-white border-white hover:bg-white hover:text-purple-900">
                Refresh
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
