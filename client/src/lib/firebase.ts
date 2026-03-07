import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration using environment variables for security
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAagH27wc8nriBzABRgfeUVtVSvkJCL_jI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "payflow-39bc5.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "payflow-39bc5",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "payflow-39bc5.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "753867273681",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:753867273681:web:278676b9e5b217f09cdcf0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Set custom parameters for Google sign-in
googleProvider.addScope('profile');
googleProvider.addScope('email');
