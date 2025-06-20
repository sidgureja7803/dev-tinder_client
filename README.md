# MergeMates - Developer Dating Platform

A full-stack dating application specifically designed for developers, featuring AI-powered matching, real-time chat, and modern UI with advanced animations. **Completely free** - no premium subscriptions, no payment walls, just pure developer love! 💕

## 🚀 Features

### Core Features (All Free!)
- 🔥 **Tinder-style Swiping**: Intuitive swipe interface (right for like, left for pass)
- 🤖 **AI-Powered Matching**: Advanced compatibility scoring based on 50+ factors
- 💬 **Real-time Chat**: Instant messaging with WebSocket integration
- 🔒 **Dual Authentication**: Email/password and Google Sign-in via Firebase
- ✉️ **Email Verification**: Secure OTP verification system
- 🔑 **Password Recovery**: Forgot password functionality
- 🎯 **Smart Preferences**: Advanced filtering and matching criteria
- 📱 **Fully Responsive**: Seamless experience on mobile, tablet, and desktop

### Developer-Specific Features
- 💻 **Tech Stack Matching**: Match based on programming languages and frameworks
- 🔗 **GitHub/LinkedIn Integration**: Showcase your professional profiles
- 🎓 **Education & Experience**: Match by career level and educational background
- 📍 **Location-based Matching**: Find developers in your area
- ⭐ **Super Likes**: Stand out with special notifications
- ↶ **Undo Swipes**: Take back accidental swipes
- 🚀 **Profile Boost**: Increase your visibility

### AI & Chatbot
- 🤖 **MergeBot Assistant**: AI chatbot for dating tips and app guidance
- 🎯 **Matchmaking Insights**: AI-generated compatibility analysis
- 📈 **Profile Optimization**: AI-powered profile improvement suggestions
- 💡 **Smart Conversation Starters**: AI-generated icebreakers

## 🛠 Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Tailwind CSS & DaisyUI** for modern styling
- **GSAP** for smooth animations
- **Three.js** for 3D background effects
- **Firebase Auth** for authentication
- **Socket.io Client** for real-time communication

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Socket.io** for real-time features
- **Firebase Admin SDK** for authentication
- **JWT** for session management
- **bcrypt** for password hashing
- **Nodemailer** for email services
- **Node-cron** for scheduled tasks

### AI & Services
- **Novita AI** with Llama-3.1-70B model (optional)
- Fallback responses when API is not configured
- Smart caching and error handling

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB (local or Atlas)
- Firebase project
- Gmail account (for email services)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   ```bash
   cp env.sample .env
   ```
   Fill in your actual values in `.env` file (see Environment Variables section below)

4. **Start the backend:**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:7777`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   ```bash
   cp env.sample .env
   ```
   Fill in your Firebase configuration in `.env` file

4. **Start the frontend:**
   ```bash
   npm run dev
   ```
   Application will run on `http://localhost:5173`

## 🌍 Production Deployment

### Frontend (Vercel/Netlify)
1. Build the application: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables in your hosting platform
4. Update CORS origins in backend

### Backend (Railway/Heroku/AWS)
1. Ensure all environment variables are set
2. Set `NODE_ENV=production`
3. Update `FRONTEND_URL` to your deployed frontend URL
4. Configure MongoDB Atlas for database

## 📧 Email Service Setup

### Gmail SMTP Setup
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account Settings → Security
   - Select "App passwords" under 2-Step Verification
   - Generate password for "Mail"
3. Use this 16-character password as `EMAIL_PASSWORD`

## 🔑 Environment Variables

### Frontend (client/.env)
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:7777

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# AI Services (Optional - chatbot works with fallbacks)
VITE_NOVITA_AI_API_KEY=your_novita_api_key
VITE_NOVITA_AI_BASE_URL=https://api.novita.ai/v3/openai
VITE_NOVITA_AI_MODEL=meta-llama/llama-3.1-70b-instruct
```

### Backend (server/.env)
```env
# Application
NODE_ENV=development
PORT=7777
APP_NAME=MergeMates

# Database
DB_CONNECTION_SECRET=mongodb://localhost:27017/mergemates

# Security
JWT_SECRET=your_super_secret_jwt_key
COOKIE_SECRET=your_cookie_secret

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your_project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_PRIVATE_KEY_ID=your_key_id
FIREBASE_CLIENT_X509_CERT_URL=your_cert_url

# Email Configuration
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=your_16_char_app_password
EMAIL_FROM=team@mergemates.com

# AI Services (Optional)
NOVITA_AI_API_KEY=your_novita_api_key

# CORS
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,https://mergemates.com
```

## 🎯 Usage Guide

1. **Sign Up**: Create account with email/password or Google Sign-in
2. **Verify Email**: Enter OTP sent to your email
3. **Complete Profile**: Add bio, skills, photos, and preferences
4. **Start Swiping**: Swipe right to like, left to pass
5. **Chat with Matches**: Real-time messaging with your connections
6. **Use AI Assistant**: Get help from MergeBot for dating tips
7. **Optimize Profile**: Use AI insights to improve your profile

## 🤖 AI Features

### Chatbot (MergeBot)
- **Smart Responses**: Context-aware conversation assistance
- **Fallback System**: Works without API key using predefined responses
- **Developer Focus**: Understands coding culture and tech terminology

### Backend AI (Optional)
- **Enhanced Matching**: AI-powered compatibility analysis
- **Profile Insights**: Detailed optimization recommendations
- **Smart Suggestions**: Personalized match recommendations

**Note**: All AI features have fallback systems and work without API keys, though responses will be more basic.

## 📁 Project Structure

```
MergeMates/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── utils/         # Utilities and Redux store
│   │   └── firebase/      # Firebase configuration
│   └── env.sample         # Environment template
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── models/        # MongoDB models
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Utilities
│   │   └── config/        # Configuration files
│   └── env.sample         # Environment template
└── README.md             # This file
```

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Firebase authentication integration
- CORS protection
- Rate limiting
- Input validation and sanitization
- Secure cookie handling

## 🌟 Why MergeMates?

- **Developer-First**: Built by developers, for developers
- **Completely Free**: No hidden costs, premium tiers, or payment walls
- **AI-Powered**: Smart matching and conversation assistance
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Real-time**: Instant messaging and live updates
- **Privacy-Focused**: Secure authentication and data protection

## 📞 Support

If you encounter any issues or need help with deployment, please check the environment setup guide or create an issue in the repository.

## 📄 License

MIT License - feel free to use this project as a foundation for your own applications!

---

**Made with ❤️ for the developer community** 
