import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import novitaAI from '../services/novitaAI';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm MergeBot, your AI dating assistant! 🤖💕\n\nI can help you with:\n• Finding compatible matches\n• Profile optimization tips\n• Dating advice for developers\n• App features guidance\n\nWhat would you like to know?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const toggleChat = () => {
    if (!isOpen) {
      setIsOpen(true);
      // Animate in from bottom right
      gsap.fromTo(chatRef.current, 
        { 
          scale: 0.3, 
          opacity: 0, 
          y: 50,
          x: 50,
          transformOrigin: "bottom right" 
        },
        { 
          scale: 1, 
          opacity: 1, 
          y: 0,
          x: 0,
          duration: 0.4, 
          ease: "back.out(1.7)" 
        }
      );
    } else {
      // Animate out to bottom right
      gsap.to(chatRef.current, {
        scale: 0.3,
        opacity: 0,
        y: 50,
        x: 50,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => setIsOpen(false)
      });
    }
  };

  const generateAIResponse = async (userMessage) => {
    try {
      setIsTyping(true);
      
      // Convert messages to conversation history format for AI
      const conversationHistory = messages.slice(1).map(msg => ({
        role: msg.isBot ? 'assistant' : 'user',
        content: msg.text
      }));
      
      // Use Novita AI service
      const response = await novitaAI.generateChatResponse(userMessage, conversationHistory);
      
      setIsTyping(false);
      return response;
    } catch (error) {
      setIsTyping(false);
      console.error('AI Response Error:', error);
      return "I'm having trouble connecting right now. Please try again! 😅";
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    
    // Generate AI response
    const aiResponse = await generateAIResponse(inputText);
    
    const botMessage = {
      id: Date.now() + 1,
      text: aiResponse,
      isBot: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "How does matching work?",
    "Tips for better profile?",
    "Premium features?",
    "Dating advice for devs?"
  ];

  const handleQuickQuestion = (question) => {
    setInputText(question);
    handleSendMessage();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div 
          ref={chatRef}
          className="mb-4 w-80 h-96 bg-gradient-to-br from-slate-900/95 via-blue-900/95 to-cyan-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-cyan-500/30 overflow-hidden"
          style={{ transformOrigin: 'bottom right' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                🤖
              </div>
              <div>
                <div className="font-bold text-white text-sm">MergeBot AI</div>
                <div className="text-xs text-blue-100">Your Dating Assistant</div>
              </div>
            </div>
            <button 
              onClick={toggleChat}
              className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto h-64 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.isBot
                      ? 'bg-blue-600/30 text-blue-100 border border-blue-500/30'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                  }`}
                >
                  <div className="text-sm whitespace-pre-line">{message.text}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-blue-600/30 text-blue-100 border border-blue-500/30 p-3 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="p-4 border-t border-cyan-500/30">
              <div className="text-xs text-cyan-300 mb-2">Quick questions:</div>
              <div className="grid grid-cols-1 gap-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="text-xs text-left p-2 bg-blue-600/20 hover:bg-blue-600/40 rounded-lg text-blue-200 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-cyan-500/30">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 bg-white/10 border border-cyan-500/30 rounded-xl px-3 py-2 text-white placeholder-cyan-300 text-sm focus:outline-none focus:border-cyan-400"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputText.trim()}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-xl transition-colors"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Toggle Button - Clean design without extra circles */}
      <button
        onClick={toggleChat}
        className="group relative w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
      >
        <div className="text-2xl group-hover:scale-110 transition-transform">
          {isOpen ? '💬' : '🤖'}
        </div>
        
        {/* Simple AI Badge */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 text-black text-xs rounded-full flex items-center justify-center font-bold">
          AI
        </div>
      </button>
    </div>
  );
};

export default AIChatbot; 