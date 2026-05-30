// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // 1. Added the Auth service module

const firebaseConfig = {
  apiKey: "AIzaSyBY7Y4VZJ6EmEtkAgDH0G6jpfHLMiEtL8A",
  authDomain: "jurisai-portal.firebaseapp.com",
  projectId: "jurisai-portal",
  storageBucket: "jurisai-portal.firebasestorage.app",
  messagingSenderId: "348460862729",
  appId: "1:348460862729:web:19a6b65839cb2e6b0bd7d8",
  measurementId: "G-V0TQB5D9F7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 2. Initialize and export Auth for your Login component
export const auth = getAuth(app);