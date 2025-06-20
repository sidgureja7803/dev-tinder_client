# MergeMates Environment Setup Guide

## Overview
This guide explains how to set up environment variables for both the frontend (client) and backend (server) of MergeMates.

## Quick Setup

### 1. Backend Environment Setup
```bash
cd server
cp env.sample .env
```

### 2. Frontend Environment Setup  
```bash
cd client
cp env.sample .env
```

### 3. Fill in Required Values
Edit both `.env` files with your actual credentials and configuration.

## Required Environment Variables

### Backend (server/.env)
**Essential Variables (Must be configured):**
- `DB_CONNECTION_SECRET` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `EMAIL_USER` & `EMAIL_PASSWORD` - Gmail SMTP for OTP emails
- `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET` - Payment processing
- `NOVITA_AI_API_KEY` - Novita AI API key for backend AI services
- Firebase Admin SDK variables (see Firebase setup section)

### Frontend (client/.env)
**Essential Variables (Must be configured):**
- All `VITE_FIREBASE_*` variables - Firebase client configuration
- `VITE_API_BASE_URL` - Backend API URL
- `VITE_RAZORPAY_KEY_ID` - Razorpay publishable key
- `VITE_NOVITA_AI_API_KEY` - Novita AI API key for chatbot and matchmaking

## Firebase Configuration

### Get Firebase Credentials

1. **Frontend Configuration:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project → Project Settings → General
   - Scroll to "Your apps" section
   - Copy the config object values to frontend `.env`

2. **Backend Configuration:**
   - Go to Project Settings → Service Accounts
   - Click "Generate new private key"
   - Download the JSON file
   - Copy values to backend `.env` or use the JSON file directly

### Firebase Environment Variables Mapping

**From Firebase Config to Frontend .env:**
```javascript
// Firebase config object
const firebaseConfig = {
  apiKey: "xxx" → VITE_FIREBASE_API_KEY
  authDomain: "xxx" → VITE_FIREBASE_AUTH_DOMAIN
  projectId: "xxx" → VITE_FIREBASE_PROJECT_ID
  storageBucket: "xxx" → VITE_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "xxx" → VITE_FIREBASE_MESSAGING_SENDER_ID
  appId: "xxx" → VITE_FIREBASE_APP_ID
  measurementId: "xxx" → VITE_FIREBASE_MEASUREMENT_ID
}
```

**From Service Account JSON to Backend .env:**
```json
{
  "project_id": "xxx" → FIREBASE_PROJECT_ID
  "private_key_id": "xxx" → FIREBASE_PRIVATE_KEY_ID
  "private_key": "xxx" → FIREBASE_PRIVATE_KEY
  "client_email": "xxx" → FIREBASE_CLIENT_EMAIL
  "client_id": "xxx" → FIREBASE_CLIENT_ID
  "client_x509_cert_url": "xxx" → FIREBASE_CLIENT_X509_CERT_URL
}
```

## AI Services Setup (Novita AI)

1. Create account at [Novita AI](https://novita.ai/)
2. Go to Dashboard → API Keys
3. Generate API key for Llama-3.1-70B model
4. Add to both frontend and backend `.env`:
   - Backend: `NOVITA_AI_API_KEY=your_api_key`
   - Frontend: `VITE_NOVITA_AI_API_KEY=your_api_key`
   - Both: Use base URL `https://api.novita.ai/v3/openai`
   - Both: Use model `meta-llama/llama-3.1-70b-instruct`

## Payment Setup (Razorpay)

1. Create account at [Razorpay](https://razorpay.com/)
2. Go to Dashboard → Settings → API Keys
3. Generate Test/Live keys
4. Add to both frontend and backend `.env`:
   - Backend: `RAZORPAY_KEY_SECRET` (secret key)
   - Frontend: `VITE_RAZORPAY_KEY_ID` (publishable key)

## Email Setup (Gmail SMTP)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Google Account → Security → 2-Step Verification → App passwords
3. Use your Gmail and app password in backend `.env`:
   ```
   EMAIL_USER=your.email@gmail.com
   EMAIL_PASSWORD=your_16_character_app_password
   ```

## Database Setup (MongoDB)

### Local MongoDB:
```
DB_CONNECTION_SECRET=mongodb://localhost:27017/mergemates
```

### MongoDB Atlas:
```
DB_CONNECTION_SECRET=mongodb+srv://username:password@cluster.mongodb.net/mergemates
```

## Development vs Production

### Development Setup:
- Use `http://localhost:7777` for API URL
- Use test keys for Razorpay
- Set `NODE_ENV=development`
- Enable debug features

### Production Setup:
- Use your production domain for API URL
- Use live keys for Razorpay  
- Set `NODE_ENV=production`
- Disable debug features
- Enable security features (HTTPS, CSP, etc.)

## Security Notes

⚠️ **Important Security Guidelines:**

1. **Never commit `.env` files** to version control
2. **Keep Firebase private keys secure** - they're sensitive credentials
3. **Use different keys** for development and production
4. **Rotate secrets regularly** especially in production
5. **Use HTTPS** in production for secure cookie transmission

## Validation Checklist

### Backend (.env) ✅
- [ ] MongoDB connection working
- [ ] JWT secret is long and random
- [ ] Email sending works (test OTP)
- [ ] Razorpay webhooks configured
- [ ] Firebase Admin SDK authenticated

### Frontend (.env) ✅
- [ ] Firebase authentication working
- [ ] API calls reaching backend
- [ ] Payments processing
- [ ] Environment variables accessible in browser

## Testing Environment Setup

```bash
# Test backend environment
cd server
npm run dev

# Test frontend environment  
cd client
npm run dev
```

## Troubleshooting

### Common Issues:

1. **"Firebase not initialized"**
   - Check Firebase configuration variables
   - Verify project ID matches

2. **"JWT Secret not found"**
   - Ensure JWT_SECRET is set in backend .env

3. **"API calls failing"**
   - Check VITE_API_BASE_URL points to correct backend

4. **"Payment gateway error"**
   - Verify Razorpay keys are correct
   - Check if using test vs live mode consistently

5. **"Email not sending"**
   - Verify Gmail app password
   - Check if 2FA is enabled

## Environment File Locations

```
DevTinder/
├── client/
│   ├── env.sample     ← Frontend template
│   └── .env          ← Your frontend config
└── server/
    ├── env.sample    ← Backend template  
    └── .env         ← Your backend config
```

Remember to restart both servers after changing environment variables! 