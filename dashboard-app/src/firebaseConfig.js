

import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, get } from "firebase/database"; // ✅ Import ref properly

const firebaseConfig = {
  apiKey: "AIzaSyBcRKMtdw_Y2H9pN45O2-Lgr6JiUNw43Ug",
  authDomain: "webs-4b0a6.firebaseapp.com",
  databaseURL: "https://webs-4b0a6-default-rtdb.firebaseio.com/",
  projectId: "webs-4b0a6",
  storageBucket: "webs-4b0a6.appspot.com",
  messagingSenderId: "151713797176",
  appId: "1:151713797176:web:8d9af79cce5348399242cd",
  measurementId: "G-QBKH9QW37F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, onValue, get }; // ✅ Now `ref` is defined before export
