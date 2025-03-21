import React from 'react'
import { initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, setPersistence, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.REACT_APP_AUTH_DOMAIN || "your-app.firebaseapp.com",
  projectId: process.env.REACT_APP_PROJECT_ID || "your-app-id",
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET || "your-app.appspot.com",
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID || "your-messaging-sender-id",
  appId: process.env.REACT_APP_APP_ID || "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Google provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Enable persistence
setPersistence(auth, browserLocalPersistence);

const db = getFirestore(app);

export { app, auth, db, googleProvider };
