
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, get } from "firebase/database"; // Import 'get' correctly

const firebaseConfig = {
  apiKey: "AIzaSyBcRKMtdw_Y2H9pN45O2-Lgr6JiUNw43Ug",
  authDomain: "webs-4b0a6.firebaseapp.com",
  projectId: "webs-4b0a6",
  storageBucket: "webs-4b0a6.firebasestorage.app",
  messagingSenderId: "151713797176",
  appId: "1:151713797176:web:8d9af79cce5348399242cd",
  measurementId: "G-QBKH9QW37F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Export Firebase functions
export { database, ref, onValue, set, get };

