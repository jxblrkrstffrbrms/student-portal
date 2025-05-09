import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDFAPlxgjRhqGi4LlUTYtGvrgQu0Eb7MKs",
  authDomain: "pshs-student-portal.firebaseapp.com",
  databaseURL: "https://pshs-student-portal-default-rtdb.firebaseio.com",
  projectId: "pshs-student-portal",
  storageBucket: "pshs-student-portal.firebasestorage.app",
  messagingSenderId: "528701191387",
  appId: "1:528701191387:web:0abd467425cd2f6e5508fe",
  measurementId: "G-3XTEWFWGH4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
