# Tinder Clone App

A full-stack Tinder-like application with real-time swiping functionality, OTP verification, Firebase authentication, and modern UI enhancements using Three.js and GSAP.

## Features

- 🔥 Tinder-like swiping UI (right for like, left for pass)
- 🔒 User authentication with email/password and Google Sign-in
- ✉️ Email verification via OTP
- 🔑 Forgot password functionality
- 💬 Real-time chat with matches
- 💰 Premium subscription options
- 🎨 Modern UI with Three.js background animations
- ⚡ Smooth transitions with GSAP animations

## Tech Stack

### Frontend
- React with Vite
- Redux Toolkit for state management
- React Router for navigation
- Three.js for 3D animations
- GSAP for animations
- Firebase Authentication
- Tailwind CSS & DaisyUI for styling

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Socket.io for real-time communication
- JWT for authentication
- Nodemailer for email verification
- bcrypt for password hashing

## Setup Instructions

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB
- Firebase account

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=7777
   JWT_SECRET=your_jwt_secret_key
   MONGODB_URI=mongodb://localhost:27017/tinder-clone
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-email-app-password
   FRONTEND_URL=http://localhost:5173
   ```

4. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   ```

4. Start the frontend development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## Usage Guide

1. **Sign Up**: Create an account with email and password or Google Sign-in
2. **Verify Email**: Enter the OTP sent to your email
3. **Complete Profile**: Add your details, bio, and profile photo
4. **Start Swiping**: Swipe right to like, left to pass
5. **Check Matches**: View your connections and chat with matches
6. **Upgrade to Premium**: Access additional features 

## License
MIT 
