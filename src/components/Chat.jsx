import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { gsap } from "gsap";

const Chat = () => {
  const { targetUserId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [matchInfo, setMatchInfo] = useState(null);
  const [targetUser, setTargetUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isTargetTyping, setIsTargetTyping] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [socket, setSocket] = useState(null);
  
  const user = useSelector((store) => store.user);
  const userId = user?._id;

  // Format time for last seen
  const formatLastSeen = (timestamp) => {
    if (!timestamp) return "Never";
    
    const now = new Date();
    const lastSeenDate = new Date(timestamp);
    const diffInMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    
    return lastSeenDate.toLocaleDateString();
  };

  // Format match timestamp
  const formatMatchTime = (timestamp) => {
    if (!timestamp) return "";
    
    const matchDate = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now - matchDate) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Matched today";
    if (diffInDays === 1) return "Matched yesterday";
    if (diffInDays < 7) return `Matched ${diffInDays} days ago`;
    
    return `Matched on ${matchDate.toLocaleDateString()}`;
  };

  const fetchChatMessages = async () => {
    try {
      const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });

      const chatMessages = chat?.data?.messages.map((msg) => {
        const { senderId, text, createdAt } = msg;
        return {
          firstName: senderId?.firstName,
          lastName: senderId?.lastName,
          text,
          timestamp: createdAt,
          senderId: senderId?._id
        };
      });
      setMessages(chatMessages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  const fetchMatchInfo = async () => {
    try {
      // Fetch match information
      const matchRes = await axios.get(`${BASE_URL}/matches/with/${targetUserId}`, {
        withCredentials: true,
      });
      setMatchInfo(matchRes.data.data);

      // Fetch target user info
      const userRes = await axios.get(`${BASE_URL}/user/${targetUserId}`, {
        withCredentials: true,
      });
      setTargetUser(userRes.data.data);
      setLastSeen(userRes.data.data.lastActive);
      setIsOnline(userRes.data.data.isOnline);
    } catch (error) {
      console.error("Error fetching match info:", error);
    }
  };

  useEffect(() => {
    fetchChatMessages();
    fetchMatchInfo();
  }, [targetUserId]);

  useEffect(() => {
    if (!userId) return;
    
    const socketConnection = createSocketConnection();
    setSocket(socketConnection);

    // Join chat room
    socketConnection.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    // Listen for messages
    socketConnection.on("messageReceived", ({ firstName, lastName, text, senderId, timestamp }) => {
      setMessages((prev) => [...prev, { 
        firstName, 
        lastName, 
        text, 
        senderId,
        timestamp: timestamp || new Date()
      }]);
    });

    // Listen for typing indicators
    socketConnection.on("userTyping", ({ userId: typingUserId, isTyping }) => {
      if (typingUserId === targetUserId) {
        setIsTargetTyping(isTyping);
      }
    });

    // Listen for online status updates
    socketConnection.on("userOnlineStatus", ({ userId: statusUserId, isOnline, lastSeen }) => {
      if (statusUserId === targetUserId) {
        setIsOnline(isOnline);
        setLastSeen(lastSeen);
      }
    });

    return () => {
      socketConnection.disconnect();
    };
  }, [userId, targetUserId, user.firstName]);

  // Handle typing indicator
  useEffect(() => {
    if (!socket) return;

    const typingTimer = setTimeout(() => {
      socket.emit("typing", {
        userId,
        targetUserId,
        isTyping: false
      });
      setIsTyping(false);
    }, 1000);

    return () => clearTimeout(typingTimer);
  }, [newMessage, socket, userId, targetUserId]);

  const handleTyping = (text) => {
    setNewMessage(text);
    
    if (!isTyping && socket) {
      setIsTyping(true);
      socket.emit("typing", {
        userId,
        targetUserId,
        isTyping: true
      });
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !socket) return;

    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
    setIsTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleBlock = async () => {
    try {
      await axios.post(`${BASE_URL}/user/block/${targetUserId}`, {}, {
        withCredentials: true,
      });
      
      setShowBlockModal(false);
      // Show success message and redirect
      gsap.to(".chat-container", {
        opacity: 0,
        duration: 0.3,
        onComplete: () => navigate("/app/connections")
      });
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  const handleReport = async () => {
    if (!reportReason.trim()) return;

    try {
      await axios.post(`${BASE_URL}/user/report/${targetUserId}`, {
        reason: reportReason
      }, {
        withCredentials: true,
      });
      
      setShowReportModal(false);
      setReportReason("");
      // Show success message
      alert("User reported successfully. Thank you for helping us maintain a safe community.");
    } catch (error) {
      console.error("Error reporting user:", error);
    }
  };

  if (!targetUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="chat-container min-h-screen bg-gradient-to-b from-purple-900 to-pink-800">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Chat Header */}
        <div className="bg-white shadow-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/app/connections")}
              className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex items-center">
              <div className="relative">
                <img
                  src={targetUser.primaryPhoto || targetUser.photoUrl}
                  alt={targetUser.firstName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              
              <div className="ml-3">
                <h3 className="font-semibold text-lg">
                  {targetUser.firstName} {targetUser.lastName}
                </h3>
                <div className="text-sm text-gray-600">
                  {isOnline ? (
                    <span className="text-green-600 flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      Online
                    </span>
                  ) : (
                    <span>Last seen {formatLastSeen(lastSeen)}</span>
                  )}
                  {isTargetTyping && (
                    <span className="text-blue-600 block">Typing...</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Match Info & Actions */}
          <div className="flex items-center space-x-2">
            {matchInfo && (
              <div className="text-sm text-gray-600 mr-4">
                {formatMatchTime(matchInfo.matchedAt)}
              </div>
            )}
            
            {/* Dropdown Menu */}
            <div className="relative group">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
                </svg>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity">
                <button
                  onClick={() => navigate(`/app/profile/${targetUserId}`)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  View Profile
                </button>
                <button
                  onClick={() => setShowReportModal(true)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Report User
                </button>
                <button
                  onClick={() => setShowBlockModal(true)}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Block User
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {/* Match Banner */}
          {matchInfo && (
            <div className="text-center mb-6">
              <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full">
                <span className="text-sm font-medium">
                  🎉 You matched with {targetUser.firstName}!
                </span>
              </div>
            </div>
          )}

          {messages.map((msg, index) => {
            const isOwnMessage = msg.senderId === userId;
            return (
              <div
                key={index}
                className={`flex mb-4 ${
                  isOwnMessage ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isOwnMessage
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "bg-white text-gray-800 shadow-md"
                  }`}
                >
                  {!isOwnMessage && (
                    <div className="text-xs font-semibold mb-1">
                      {msg.firstName}
                    </div>
                  )}
                  <div className="text-sm">{msg.text}</div>
                  <div
                    className={`text-xs mt-1 ${
                      isOwnMessage ? "text-purple-100" : "text-gray-500"
                    }`}
                  >
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : ""}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTargetTyping && (
            <div className="flex justify-start mb-4">
              <div className="bg-white text-gray-800 shadow-md max-w-xs px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="bg-white p-4 border-t">
          <div className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={(e) => handleTyping(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="Type a message..."
                rows="1"
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
              {isTyping && (
                <div className="absolute -top-6 left-2 text-xs text-gray-500">
                  Typing...
                </div>
              )}
            </div>
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Block Confirmation Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Block {targetUser.firstName}?</h3>
            <p className="text-gray-600 mb-6">
              Blocked users won't be able to message you or see your profile. This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowBlockModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBlock}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Block
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Report {targetUser.firstName}</h3>
            <p className="text-gray-600 mb-4">
              Help us keep the community safe. What's the issue?
            </p>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows="4"
              placeholder="Describe the issue..."
            />
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportReason("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                disabled={!reportReason.trim()}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
              >
                Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
