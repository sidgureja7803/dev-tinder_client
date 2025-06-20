class NovitaAIService {
  constructor() {
    this.apiKey = import.meta.env.VITE_NOVITA_AI_API_KEY;
    this.baseURL = import.meta.env.VITE_NOVITA_AI_BASE_URL || 'https://api.novita.ai/v3/openai';
    this.model = import.meta.env.VITE_NOVITA_AI_MODEL || 'meta-llama/llama-3.1-70b-instruct';
  }

  async generateChatResponse(userMessage, conversationHistory = []) {
    if (!this.apiKey) {
      console.warn('Novita AI API key not configured, using fallback responses');
      return this.getFallbackResponse(userMessage);
    }

    try {
      const systemPrompt = `You are MergeBot, an AI assistant for MergeMates - a dating app exclusively for developers. You are friendly, helpful, and understand developer culture.

Your expertise includes:
- MergeMates app features and functionality
- Developer dating advice and conversation starters
- Tech stack compatibility and matching algorithms
- Profile optimization for programmers
- Premium features explanation (Gold ₹499/3mo, Platinum ₹799/6mo)
- Programming languages, frameworks, and technologies

Personality traits:
- Use developer humor and coding metaphors
- Be encouraging and supportive about finding love
- Reference programming concepts naturally
- Use emojis appropriately (🤖💕🚀💻)
- Keep responses concise but informative
- Be empathetic and understanding

Always provide helpful, relevant responses. If asked about technical implementation details of the app, explain features from a user perspective rather than revealing internal workings.`;

      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-10), // Last 10 messages for context
        { role: 'user', content: userMessage }
      ];

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages,
          max_tokens: 500,
          temperature: 0.7,
          stream: false
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Sorry, I had trouble processing that. Could you try again?';
    } catch (error) {
      console.error('Novita AI API Error:', error);
      return this.getFallbackResponse(userMessage);
    }
  }

  getFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Matchmaking related
    if (lowerMessage.includes('match') || lowerMessage.includes('compatible') || lowerMessage.includes('find')) {
      return "🎯 Great question about matching!\n\nOur AI considers:\n• Programming languages & tech stack\n• Professional level & experience\n• Location & preferences\n• Interests & hobbies\n• Profile completeness\n\nTip: Complete your profile 100% for better matches! What's your main tech stack?";
    }
    
    // Profile related
    if (lowerMessage.includes('profile') || lowerMessage.includes('bio') || lowerMessage.includes('photo')) {
      return "📸 Profile optimization tips:\n\n✅ Use a clear, professional photo\n✅ Mention your favorite technologies\n✅ Share interesting projects\n✅ Add your GitHub/LinkedIn\n✅ Be authentic about your coding journey\n\nA complete profile gets 3x more matches! Need help with any specific section?";
    }
    
    // Dating advice
    if (lowerMessage.includes('date') || lowerMessage.includes('conversation') || lowerMessage.includes('talk')) {
      return "💬 Dating tips for developers:\n\n• Start with tech interests you share\n• Ask about their favorite projects\n• Discuss coding challenges you've solved\n• Share your learning journey\n• Don't make it all about work!\n\nRemember: You're both humans, not just code! 😊";
    }
    
    // Premium features
    if (lowerMessage.includes('premium') || lowerMessage.includes('gold') || lowerMessage.includes('platinum')) {
      return "⭐ Premium Features:\n\n🥇 Gold (₹499/3mo):\n• Unlimited swipes\n• See who liked you\n• Undo swipes\n• Profile boost\n\n💎 Platinum (₹799/6mo):\n• All Gold features\n• Super likes\n• AI match suggestions\n• Priority support\n\nWorth it for serious developers! Want to upgrade?";
    }
    
    // Technical help
    if (lowerMessage.includes('help') || lowerMessage.includes('how') || lowerMessage.includes('feature')) {
      return "🛠️ I can help with:\n\n• Swiping & matching\n• Chat features\n• Profile settings\n• Premium benefits\n• Privacy controls\n• Account management\n\nWhat specific feature do you need help with?";
    }
    
    // Default responses with personality
    const responses = [
      "That's interesting! 🤔 As a fellow tech enthusiast, I'd love to help you more. Could you be more specific about what you're looking for?",
              "Great question! 💡 I'm here to make your MergeMates experience amazing. What aspect of developer dating can I assist you with?",
      "I love helping developers find love! 💕 Tell me more about what you'd like to know - matchmaking, profiles, or dating tips?",
      "As your AI dating assistant, I'm here to help! 🚀 Whether it's finding matches or optimizing your profile, I've got you covered. What's on your mind?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  async generateMatchmakingInsights(userProfile, potentialMatches) {
    if (!this.apiKey) {
      return this.getFallbackMatchmakingInsights(userProfile, potentialMatches);
    }

    try {
      const prompt = `As an AI matchmaking expert for MergeMates, analyze this developer's profile and suggest the best matches from the given candidates.

User Profile:
- Tech Stack: ${userProfile.skills?.join(', ') || 'Not specified'}
- Experience: ${userProfile.profession || 'Not specified'}
- Location: ${userProfile.location || 'Not specified'}
- Education: ${userProfile.education || 'Not specified'}
- Interests: ${userProfile.interests?.join(', ') || 'Coding, Technology'}

Potential Matches: ${potentialMatches.length} candidates

Please provide:
1. Top 3 match recommendations with compatibility reasons
2. Conversation starter suggestions for each
3. Overall compatibility insights

Keep it concise and developer-focused.`;

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 600,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || this.getFallbackMatchmakingInsights(userProfile, potentialMatches);
    } catch (error) {
      console.error('Matchmaking AI Error:', error);
      return this.getFallbackMatchmakingInsights(userProfile, potentialMatches);
    }
  }

  getFallbackMatchmakingInsights(userProfile, potentialMatches) {
    return `🎯 AI Matchmaking Analysis\n\nBased on your profile, I've found ${potentialMatches.length} potential matches!\n\n💡 Top recommendations:\n• Look for developers with complementary skills\n• Consider similar experience levels\n• Geographic proximity matters\n• Shared interests beyond coding\n\n🚀 Pro tip: Developers with complete profiles and similar tech stacks tend to have better conversations!\n\nWant me to analyze specific matches for you?`;
  }

  async generateProfileOptimizationTips(userProfile) {
    if (!this.apiKey) {
      return this.getFallbackProfileTips(userProfile);
    }

    try {
      const prompt = `As a MergeMates profile optimization expert, analyze this developer's profile and provide specific improvement suggestions.

Current Profile:
- Name: ${userProfile.firstName || 'Not provided'}
- Bio: ${userProfile.bio || 'Empty'}
- Skills: ${userProfile.skills?.join(', ') || 'None listed'}
- Experience: ${userProfile.profession || 'Not specified'}
- Education: ${userProfile.education || 'Not specified'}
- Photos: ${userProfile.photos?.length || 0} uploaded
- Social Links: ${userProfile.socialLinks ? Object.keys(userProfile.socialLinks).length : 0} connected

Provide:
1. Specific areas for improvement
2. Bio suggestions with developer personality
3. Skills optimization recommendations
4. Photo tips for developers
5. Overall profile score (out of 10)

Keep it encouraging and actionable.`;

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || this.getFallbackProfileTips(userProfile);
    } catch (error) {
      console.error('Profile optimization AI Error:', error);
      return this.getFallbackProfileTips(userProfile);
    }
  }

  getFallbackProfileTips(userProfile) {
    const tips = [];
    let score = 5;

    if (!userProfile.bio || userProfile.bio.length < 50) {
      tips.push("📝 Add a compelling bio that showcases your coding journey and personality");
    } else {
      score += 1;
    }

    if (!userProfile.skills || userProfile.skills.length < 3) {
      tips.push("💻 List your programming languages and technologies");
    } else {
      score += 1;
    }

    if (!userProfile.photos || userProfile.photos.length < 2) {
      tips.push("📸 Upload at least 2-3 clear photos (including a professional headshot)");
    } else {
      score += 1;
    }

    if (!userProfile.socialLinks || Object.keys(userProfile.socialLinks).length < 2) {
      tips.push("🔗 Connect your GitHub, LinkedIn, and other professional profiles");
    } else {
      score += 1;
    }

    if (!userProfile.profession) {
      tips.push("💼 Add your current role and company");
    } else {
      score += 1;
    }

    return `📊 Profile Score: ${score}/10\n\n🎯 Optimization Tips:\n${tips.map(tip => `• ${tip}`).join('\n')}\n\n✨ Remember: Complete profiles get 3x more matches! Each improvement brings you closer to finding your coding soulmate! 💕`;
  }
}

export default new NovitaAIService(); 