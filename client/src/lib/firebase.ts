import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration with real credentials
const firebaseConfig = {
  apiKey: "AIzaSyDaGa9ut78fDSdsUyCo0FFJmxrYiDCj46E",
  authDomain: "salary-planner-84f78.firebaseapp.com",
  projectId: "salary-planner-84f78",
  storageBucket: "salary-planner-84f78.firebasestorage.app",
  messagingSenderId: "451949648417",
  appId: "1:451949648417:web:021abc92ea9deeb7586160",
  measurementId: "G-E7Z387TNEQ"
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
