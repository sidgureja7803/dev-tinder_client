import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBjgND-PsNuHu9Ojnnn2Qe2NMvjKuT6b8A",
  authDomain: "devtinder-e1df5.firebaseapp.com",
  projectId: "devtinder-e1df5",
  storageBucket: "devtinder-e1df5.firebasestorage.app",
  messagingSenderId: "354337159305",
  appId: "1:354337159305:web:d051853aefd481dfcbee58",
  measurementId: "G-95MHHQMHBX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth }; 