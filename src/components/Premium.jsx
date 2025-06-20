import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { gsap } from "gsap";

const Premium = () => {
  const [userPremiumStatus, setUserPremiumStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [whoLikedMe, setWhoLikedMe] = useState([]);
  const [showWhoLikedMe, setShowWhoLikedMe] = useState(false);
  const [boostStatus, setBoostStatus] = useState(null);
  const user = useSelector((store) => store.user);

  useEffect(() => {
    verifyPremiumUser();
    if (user?.isPremium) {
      fetchWhoLikedMe();
      checkBoostStatus();
    }
    
    // Animate premium cards on mount
    gsap.from('.premium-card', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out'
    });
  }, [user]);

  const verifyPremiumUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "/premium/verify", {
        withCredentials: true,
      });
      setUserPremiumStatus(res.data);
    } catch (err) {
      console.error('Error verifying premium status:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWhoLikedMe = async () => {
    try {
      const res = await axios.get(BASE_URL + "/premium/who-liked-me", {
        withCredentials: true,
      });
      setWhoLikedMe(res.data.data || []);
    } catch (err) {
      console.error('Error fetching who liked me:', err);
    }
  };

  const checkBoostStatus = async () => {
    try {
      const res = await axios.get(BASE_URL + "/premium/boost-status", {
        withCredentials: true,
      });
      setBoostStatus(res.data.data);
    } catch (err) {
      console.error('Error checking boost status:', err);
    }
  };

  const handleBuyClick = async (type) => {
    try {
      const order = await axios.post(
        BASE_URL + "/payment/create",
        {
          membershipType: type,
        },
        { withCredentials: true }
      );

      const { amount, keyId, currency, notes, orderId } = order.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: "Dev Tinder",
        description: "Connect to other developers",
        order_id: orderId,
        prefill: {
          name: notes.firstName + " " + notes.lastName,
          email: notes.emailId,
          contact: "9999999999",
        },
        theme: {
          color: "#F37254",
        },
        handler: () => {
          verifyPremiumUser();
          // Show success animation
          gsap.to('.premium-success', {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: 'back.out(1.7)'
          });
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Error creating payment:', err);
      alert('Payment initiation failed. Please try again.');
    }
  };

  const activateBoost = async () => {
    try {
      const res = await axios.post(BASE_URL + "/premium/activate-boost", {}, {
        withCredentials: true,
      });
      
      setBoostStatus(res.data.data);
      
      // Show boost activation animation
      const boostAnimation = document.createElement('div');
      boostAnimation.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50';
      boostAnimation.innerHTML = `
        <div class="bg-gradient-to-r from-yellow-400 to-orange-500 p-8 rounded-xl text-white text-center transform scale-0">
          <div class="text-6xl mb-4">🚀</div>
          <h2 class="text-3xl font-bold mb-4">Boost Activated!</h2>
          <p class="mb-4">Your profile is now boosted for 30 minutes</p>
          <button class="bg-white text-orange-600 px-6 py-2 rounded-full font-bold" id="closeBoost">Got it!</button>
        </div>
      `;
      
      document.body.appendChild(boostAnimation);
      
      gsap.to(boostAnimation.querySelector('div'), {
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.7)"
      });
      
      boostAnimation.querySelector('#closeBoost').addEventListener('click', () => {
        gsap.to(boostAnimation.querySelector('div'), {
          scale: 0,
          duration: 0.3,
          onComplete: () => document.body.removeChild(boostAnimation)
        });
      });
    } catch (err) {
      console.error('Error activating boost:', err);
      alert('Failed to activate boost. Please try again.');
    }
  };

  const getAISuggestions = async () => {
    try {
      const res = await axios.get(BASE_URL + "/feed/ai-insights", {
        withCredentials: true,
      });
      
      // Create a nice modal display for AI insights
      const insights = res.data.insights;
      const topMatches = res.data.topMatches;
      
      // For now, show in an alert - could be enhanced with a proper modal
      let message = `🤖 AI Matchmaking Insights:\n\n${insights}\n\n`;
      
      if (topMatches.length > 0) {
        message += `🎯 Top Compatible Matches:\n`;
        topMatches.forEach((match, index) => {
          message += `${index + 1}. ${match.user.firstName} - ${match.compatibility}% compatible\n`;
          if (match.commonSkills.length > 0) {
            message += `   Shared: ${match.commonSkills.join(', ')}\n`;
          }
        });
      }
      
      alert(message);
    } catch (err) {
      console.error('Error getting AI suggestions:', err);
      if (err.response?.data?.upgradeRequired) {
        alert('AI insights are a premium feature! Upgrade to Gold or Platinum to access personalized matchmaking recommendations.');
      } else {
        alert('Error getting AI suggestions. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-800 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-white"></div>
      </div>
    );
  }

  // Premium Features for Current Users
  if (userPremiumStatus?.isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              ✨ Premium Features
            </h1>
            <div className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full">
              <span className="mr-2">👑</span>
              <span className="font-semibold">
                {userPremiumStatus.membershipType?.toUpperCase() || 'PREMIUM'} MEMBER
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Who Liked Me */}
            <div className="premium-card bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 text-white">
              <div className="text-4xl mb-4 text-center">💕</div>
              <h3 className="text-xl font-bold mb-3 text-center">Who Liked Me</h3>
              <p className="text-gray-200 text-center mb-4">
                See {whoLikedMe.length} people who liked you
              </p>
              <button 
                onClick={() => setShowWhoLikedMe(true)}
                className="btn btn-primary w-full"
              >
                View Likes
              </button>
            </div>

            {/* Profile Boost */}
            <div className="premium-card bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 text-white">
              <div className="text-4xl mb-4 text-center">🚀</div>
              <h3 className="text-xl font-bold mb-3 text-center">Profile Boost</h3>
              <p className="text-gray-200 text-center mb-4">
                {boostStatus?.isActive ? 
                  `Active for ${boostStatus.remainingMinutes} minutes` :
                  'Be seen by more people'
                }
              </p>
              <button 
                onClick={activateBoost}
                disabled={boostStatus?.isActive || (boostStatus?.usedToday >= boostStatus?.dailyLimit)}
                className="btn btn-secondary w-full disabled:opacity-50"
              >
                {boostStatus?.isActive ? 'Boost Active' : 
                 boostStatus?.usedToday >= boostStatus?.dailyLimit ? 'Daily Limit Reached' :
                 'Activate Boost'}
              </button>
            </div>

            {/* AI Suggestions */}
            <div className="premium-card bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 text-white">
              <div className="text-4xl mb-4 text-center">🤖</div>
              <h3 className="text-xl font-bold mb-3 text-center">AI Suggestions</h3>
              <p className="text-gray-200 text-center mb-4">
                Get personalized match recommendations
              </p>
              <button 
                onClick={getAISuggestions}
                className="btn btn-accent w-full"
              >
                Get Suggestions
              </button>
            </div>

            {/* Unlimited Swipes */}
            <div className="premium-card bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 text-white">
              <div className="text-4xl mb-4 text-center">∞</div>
              <h3 className="text-xl font-bold mb-3 text-center">Unlimited Swipes</h3>
              <p className="text-gray-200 text-center mb-4">
                Swipe as much as you want
              </p>
              <div className="text-center">
                <span className="inline-flex items-center bg-green-500 text-white px-3 py-1 rounded-full">
                  ✓ Active
                </span>
              </div>
            </div>

            {/* Undo Swipes */}
            <div className="premium-card bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 text-white">
              <div className="text-4xl mb-4 text-center">↶</div>
              <h3 className="text-xl font-bold mb-3 text-center">Undo Swipes</h3>
              <p className="text-gray-200 text-center mb-4">
                Take back your last swipe
              </p>
              <div className="text-center">
                <span className="inline-flex items-center bg-green-500 text-white px-3 py-1 rounded-full">
                  ✓ Active
                </span>
              </div>
            </div>

            {/* Priority Support */}
            <div className="premium-card bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 text-white">
              <div className="text-4xl mb-4 text-center">🎧</div>
              <h3 className="text-xl font-bold mb-3 text-center">Priority Support</h3>
              <p className="text-gray-200 text-center mb-4">
                Get faster help when you need it
              </p>
              <button className="btn btn-outline text-white border-white w-full">
                Contact Support
              </button>
            </div>
          </div>

          {/* Membership Info */}
          <div className="mt-8 bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 text-white">
            <h3 className="text-xl font-bold mb-3">Membership Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-gray-300">Plan Type</p>
                <p className="font-semibold">{userPremiumStatus.membershipType?.toUpperCase() || 'PREMIUM'}</p>
              </div>
              <div>
                <p className="text-gray-300">Status</p>
                <p className="font-semibold text-green-400">Active</p>
              </div>
              <div>
                <p className="text-gray-300">Renewal</p>
                <p className="font-semibold">Auto-renewing</p>
              </div>
            </div>
          </div>
        </div>

        {/* Who Liked Me Modal */}
        {showWhoLikedMe && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold">People Who Liked You</h3>
                  <button 
                    onClick={() => setShowWhoLikedMe(false)}
                    className="btn btn-circle btn-sm"
                  >
                    ✕
                  </button>
                </div>
                
                {whoLikedMe.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {whoLikedMe.map((person, index) => (
                      <div key={index} className="text-center">
                        <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-2">
                          <img 
                            src={person.photoUrl || 'https://via.placeholder.com/200x200'} 
                            alt={person.firstName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="font-semibold">{person.firstName}</p>
                        <p className="text-sm text-gray-600">{person.age}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">💔</div>
                    <p className="text-gray-600">No one has liked you yet. Keep swiping!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Premium Plans for Non-Premium Users
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Upgrade to Premium
          </h1>
          <p className="text-xl text-gray-200">
            Unlock powerful features to find your perfect match faster
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <div className="premium-card bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 text-white relative">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <div className="text-4xl font-bold mb-4">₹0</div>
              <p className="text-gray-300">Perfect for getting started</p>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <span className="text-green-400 mr-3">✓</span>
                Limited swipes per day
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-3">✓</span>
                Basic matching
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-3">✓</span>
                Send messages to matches
              </li>
              <li className="flex items-center">
                <span className="text-red-400 mr-3">✗</span>
                See who liked you
              </li>
              <li className="flex items-center">
                <span className="text-red-400 mr-3">✗</span>
                Undo swipes
              </li>
            </ul>
            
            <button 
              disabled 
              className="btn btn-outline w-full opacity-50"
            >
              Current Plan
            </button>
          </div>

          {/* Gold Plan */}
          <div className="premium-card bg-gradient-to-b from-yellow-400 to-orange-500 rounded-xl p-8 text-white relative transform scale-105 shadow-2xl">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                MOST POPULAR
              </span>
            </div>
            
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Gold</h3>
              <div className="text-4xl font-bold mb-4">₹499</div>
              <p className="text-yellow-100">3 months • Best value</p>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <span className="text-white mr-3">✓</span>
                Unlimited swipes
              </li>
              <li className="flex items-center">
                <span className="text-white mr-3">✓</span>
                See who liked you
              </li>
              <li className="flex items-center">
                <span className="text-white mr-3">✓</span>
                Undo last swipe
              </li>
              <li className="flex items-center">
                <span className="text-white mr-3">✓</span>
                Profile boost (1 per week)
              </li>
              <li className="flex items-center">
                <span className="text-white mr-3">✓</span>
                AI match suggestions
              </li>
              <li className="flex items-center">
                <span className="text-white mr-3">✓</span>
                Priority support
              </li>
            </ul>
            
            <button
              onClick={() => handleBuyClick("gold")}
              className="btn btn-white text-orange-600 w-full font-bold hover:bg-yellow-100"
            >
              Choose Gold
            </button>
          </div>

          {/* Platinum Plan */}
          <div className="premium-card bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 text-white relative">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Platinum</h3>
              <div className="text-4xl font-bold mb-4">₹799</div>
              <p className="text-gray-300">6 months • Maximum features</p>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <span className="text-green-400 mr-3">✓</span>
                Everything in Gold
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-3">✓</span>
                Profile boost (3 per week)
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-3">✓</span>
                Advanced AI matching
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-3">✓</span>
                Super likes (5 per day)
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-3">✓</span>
                Hide advertisements
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-3">✓</span>
                VIP support
              </li>
            </ul>
            
            <button
              onClick={() => handleBuyClick("platinum")}
              className="btn btn-primary w-full"
            >
              Choose Platinum
            </button>
          </div>
        </div>

        {/* Features Showcase */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center text-white">
            <div className="text-4xl mb-3">∞</div>
            <h4 className="font-bold mb-2">Unlimited Swipes</h4>
            <p className="text-gray-300 text-sm">Never run out of potential matches</p>
          </div>
          
          <div className="text-center text-white">
            <div className="text-4xl mb-3">💕</div>
            <h4 className="font-bold mb-2">See Who Likes You</h4>
            <p className="text-gray-300 text-sm">Know who's interested before you swipe</p>
          </div>
          
          <div className="text-center text-white">
            <div className="text-4xl mb-3">↶</div>
            <h4 className="font-bold mb-2">Undo Swipes</h4>
            <p className="text-gray-300 text-sm">Take back accidental left swipes</p>
          </div>
          
          <div className="text-center text-white">
            <div className="text-4xl mb-3">🚀</div>
            <h4 className="font-bold mb-2">Profile Boost</h4>
            <p className="text-gray-300 text-sm">Get 10x more profile views</p>
          </div>
        </div>

        {/* Success Animation Container */}
        <div className="premium-success fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 opacity-0 scale-0 pointer-events-none">
          <div className="bg-gradient-to-r from-green-400 to-blue-500 p-8 rounded-xl text-white text-center max-w-md mx-4">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-4">Welcome to Premium!</h2>
            <p className="mb-4">You now have access to all premium features</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-white text-blue-600 px-6 py-2 rounded-full font-bold"
            >
              Start Exploring
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;
