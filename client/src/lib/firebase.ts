import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration with real credentials
const firebaseConfig = {
  apiKey: "AIzaSyAagH27wc8nriBzABRgfeUVtVSvkJCL_jI",
  authDomain: "payflow-39bc5.firebaseapp.com",
  projectId: "payflow-39bc5",
  storageBucket: "payflow-39bc5.firebasestorage.app",
  messagingSenderId: "753867273681",
  appId: "1:753867273681:web:278676b9e5b217f09cdcf0"
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
