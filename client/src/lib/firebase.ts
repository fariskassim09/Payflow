import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Firebase configuration
// NOTE: For client-side only implementation, these values are exposed in the browser
// For production, consider using environment variables or a backend proxy
const firebaseConfig = {
  apiKey: 'AIzaSyDemoKeyForDevelopment',
  authDomain: 'salary-planner-demo.firebaseapp.com',
  projectId: 'salary-planner-demo',
  storageBucket: 'salary-planner-demo.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abcdef123456',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Set custom parameters for Google sign-in
googleProvider.addScope('profile');
googleProvider.addScope('email');
