import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { useState, useEffect } from "react";
import { useSprings, animated, to } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";
import { gsap } from "gsap";

const UserCard = ({ user, onSwipe, skillMatch = 0, onAutoSwipe }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about, interests, bio, occupation, education } = user;
  const dispatch = useDispatch();
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [displayedPhoto, setDisplayedPhoto] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Handle multiple photos (using placeholder if user has no photos)
  const photos = photoUrl ? (Array.isArray(photoUrl) ? photoUrl : [photoUrl]) : ["https://via.placeholder.com/400x500"];

  // Reset state when user changes
  useEffect(() => {
    setSwipeDirection(null);
    setShowDetails(false);
    setMatchResult(null);
    setDisplayedPhoto(0);
  }, [_id]);

  useEffect(() => {
    // Check for auto-swipe when user changes
    const checkAutoSwipe = async () => {
      const wasAutoSwiped = await onAutoSwipe(user);
      if (!wasAutoSwiped) {
        // Only animate in if not auto-swiped
        gsap.from('.user-card', {
          scale: 0.8,
          opacity: 0,
          duration: 0.5,
          ease: 'back.out(1.7)'
        });
      }
    };
    
    checkAutoSwipe();
  }, [user, onAutoSwipe]);

  const handleSendRequest = async (action, userId) => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${BASE_URL}/match/swipe/${userId}`,
        { action },
        { withCredentials: true }
      );
      
      // Check if it's a match
      if (res.data.data && res.data.data.matchId) {
        setMatchResult(res.data.data);
        
        // Show match animation
        showMatchAnimation(res.data.data);
      } else {
        // Just remove from feed and move to next
        dispatch(removeUserFromFeed(userId));
        if (onSwipe) onSwipe(); 
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Show match animation
  const showMatchAnimation = (matchData) => {
    // Create a modal that shows the match
    const matchModal = document.createElement('div');
    matchModal.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50';
    matchModal.innerHTML = `
      <div class="bg-gradient-to-r from-pink-500 to-purple-600 p-8 rounded-xl text-white text-center max-w-md mx-4 transform scale-0">
        <h2 class="text-4xl font-bold mb-6">It's a Match!</h2>
        <p class="mb-6">You and ${matchData.matchedWith.firstName} have liked each other</p>
        <div class="flex justify-center items-center gap-8 mb-6">
          <div class="w-24 h-24 rounded-full overflow-hidden border-4 border-white">
            <img src="${photoUrl || 'https://via.placeholder.com/400x500'}" class="w-full h-full object-cover" alt="You" />
          </div>
          <div class="w-24 h-24 rounded-full overflow-hidden border-4 border-white">
            <img src="${matchData.matchedWith.photoUrl || 'https://via.placeholder.com/400x500'}" class="w-full h-full object-cover" alt="${matchData.matchedWith.firstName}" />
          </div>
        </div>
        ${matchData.mutualInterests && matchData.mutualInterests.length > 0 ?
          `<p class="text-sm mb-4">You both like: ${matchData.mutualInterests.join(', ')}</p>` :
          ''}
        <div class="flex gap-4 justify-center">
          <button class="bg-white text-pink-600 px-6 py-2 rounded-full font-bold">Send Message</button>
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
    
    // Add event listener to keep swiping button
    matchModal.querySelector('#keepSwiping').addEventListener('click', () => {
      gsap.to(modal, {
        scale: 0,
        duration: 0.3,
        onComplete: () => {
          document.body.removeChild(matchModal);
          dispatch(removeUserFromFeed(_id));
          if (onSwipe) onSwipe();
        }
      });
    });
  };

  const [props, api] = useSprings(1, i => ({
    x: 0,
    y: 0,
    rotation: 0,
    scale: 1,
    config: { friction: 50, tension: 800 }
  }));

  const bind = useGesture({
    onDrag: ({ down, movement: [mx], direction: [xDir], velocity }) => {
      if (isLoading) return;
      
      const trigger = velocity > 0.2;
      const dir = xDir < 0 ? -1 : 1;
      
      // Set the swipe direction for UI indicator
      if (down && Math.abs(mx) > 50) {
        setSwipeDirection(mx > 0 ? 'right' : 'left');
      } else if (!down) {
        setSwipeDirection(null);
      }
      
      // If card is released and moved past threshold, process swipe
      if (!down && trigger) {
        // Right swipe = like, Left swipe = pass
        const action = dir === 1 ? "like" : "pass";
        handleSwipe(action);
      }
      
      // Set the animation values
      api.start({
        x: down ? mx : 0,
        rotation: down ? mx / 10 : 0,
        scale: down ? 1.05 : 1,
        immediate: down
      });
    }
  });

  const handleSwipe = async (action) => {
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      await onSwipe(action);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle next photo
  const nextPhoto = (e) => {
    e.stopPropagation();
    if (displayedPhoto < photos.length - 1) {
      setDisplayedPhoto(current => current + 1);
    }
  };

  // Handle previous photo
  const prevPhoto = (e) => {
    e.stopPropagation();
    if (displayedPhoto > 0) {
      setDisplayedPhoto(current => current - 1);
    }
  };

  // Toggle profile details
  const toggleDetails = () => {
    setShowDetails(prev => !prev);
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 50) return 'text-blue-500';
    if (percentage >= 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <animated.div 
      {...bind()}
      className="user-card bg-white w-80 sm:w-96 shadow-2xl rounded-xl overflow-hidden relative cursor-grab active:cursor-grabbing"
      style={{ 
        x: props[0].x,
        y: props[0].y,
        rotate: props[0].rotation,
        scale: props[0].scale,
        touchAction: 'none'
      }}
    >
      {/* Swipe indicators */}
      {swipeDirection && (
        <div 
          className={`absolute top-5 ${swipeDirection === 'right' ? 'right-5' : 'left-5'} z-10 transform -rotate-12 border-4 rounded-lg px-2 py-1 text-xl font-bold ${
            swipeDirection === 'right' 
              ? 'border-green-500 text-green-500' 
              : 'border-red-500 text-red-500'
          }`}
        >
          {swipeDirection === 'right' ? 'LIKE' : 'NOPE'}
        </div>
      )}
      
      {/* Skill match indicator */}
      <div className="absolute top-4 right-4 z-10">
        <div className={`px-3 py-1 rounded-full bg-white shadow-lg ${getMatchColor(skillMatch)}`}>
          <span className="font-bold">{Math.round(skillMatch)}%</span>
          <span className="text-sm ml-1">match</span>
        </div>
      </div>

      {/* Photo gallery */}
      <div className="relative h-96 overflow-hidden">
        {/* Photo indicators */}
        {photos.length > 1 && (
          <div className="absolute top-2 left-0 right-0 z-10 flex justify-center">
            {photos.map((_, index) => (
              <div 
                key={index} 
                className={`w-2 h-2 rounded-full mx-1 ${index === displayedPhoto ? 'bg-white' : 'bg-white bg-opacity-50'}`}
              />
            ))}
          </div>
        )}
        
        {/* Navigation arrows */}
        {photos.length > 1 && (
          <>
            <button 
              onClick={prevPhoto} 
              disabled={displayedPhoto === 0}
              className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-70 p-1 rounded-full ${displayedPhoto === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-70 hover:opacity-100'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={nextPhoto} 
              disabled={displayedPhoto === photos.length - 1}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-70 p-1 rounded-full ${displayedPhoto === photos.length - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-70 hover:opacity-100'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Photo */}
        <img 
          src={photos[displayedPhoto]} 
          alt={`${firstName} ${lastName}`}
          className="object-cover h-full w-full"
        />
        
        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
          <h2 className="text-2xl font-bold">{firstName}{lastName ? ` ${lastName}` : ''}{age ? `, ${age}` : ''}</h2>
          {occupation && <p className="text-sm opacity-90">{occupation}</p>}
          {education && <p className="text-sm opacity-90">{education}</p>}
          
          {/* Skills */}
          {user.skills && user.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {user.skills.slice(0, 3).map((skill, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 text-xs rounded-full bg-white/20 backdrop-blur-sm"
                >
                  {skill}
                </span>
              ))}
              {user.skills.length > 3 && (
                <span className="px-2 py-1 text-xs rounded-full bg-white/20 backdrop-blur-sm">
                  +{user.skills.length - 3}
                </span>
              )}
            </div>
          )}
          
          {/* Info button */}
          <button 
            onClick={toggleDetails}
            className="absolute bottom-4 right-4 bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Profile details panel (slide up when active) */}
      <div 
        className={`absolute inset-0 bg-white transform transition-transform duration-300 ease-in-out ${
          showDetails ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="p-4 h-full overflow-y-auto">
          <button 
            onClick={toggleDetails}
            className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <h3 className="text-xl font-bold text-gray-800 mb-2">{firstName}'s Profile</h3>
          
          {bio && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-600 mb-1">Bio</h4>
              <p className="text-gray-700">{bio}</p>
            </div>
          )}
          
          {about && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-600 mb-1">About</h4>
              <p className="text-gray-700">{about}</p>
            </div>
          )}
          
          {interests && interests.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-600 mb-1">Interests</h4>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest, index) => (
                  <span key={index} className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-xs">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-600 mb-1">Basic Info</h4>
            <div className="grid grid-cols-2 gap-2">
              {age && (
                <div>
                  <span className="text-xs text-gray-500">Age</span>
                  <p className="text-gray-700">{age}</p>
                </div>
              )}
              {gender && (
                <div>
                  <span className="text-xs text-gray-500">Gender</span>
                  <p className="text-gray-700">{gender.charAt(0).toUpperCase() + gender.slice(1)}</p>
                </div>
              )}
              {occupation && (
                <div>
                  <span className="text-xs text-gray-500">Work</span>
                  <p className="text-gray-700">{occupation}</p>
                </div>
              )}
              {education && (
                <div>
                  <span className="text-xs text-gray-500">Education</span>
                  <p className="text-gray-700">{education}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="p-4 bg-white flex justify-around">
        {/* Pass button */}
        <button
          className="btn btn-circle bg-gray-100 hover:bg-gray-200 text-gray-600 w-14 h-14 flex items-center justify-center shadow-md"
          onClick={() => handleSwipe("pass")}
          disabled={isLoading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Super Like button */}
        <button
          className="btn btn-circle bg-blue-500 hover:bg-blue-600 text-white w-12 h-12 flex items-center justify-center shadow-md"
          onClick={() => handleSwipe("superlike")}
          disabled={isLoading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        
        {/* Like button */}
        <button
          className="btn btn-circle bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white w-14 h-14 flex items-center justify-center shadow-md"
          onClick={() => handleSwipe("like")}
          disabled={isLoading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
    </animated.div>
  );
};

export default UserCard;
