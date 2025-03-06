import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcRKMtdw_Y2H9pN45O2-Lgr6JiUNw43Ug",
  authDomain: "webs-4b0a6.firebaseapp.com",
  projectId: "webs-4b0a6",
  storageBucket: "webs-4b0a6.appspot.com",
  messagingSenderId: "151713797176",
  appId: "1:151713797176:web:8d9af79cce5348399242cd",
  measurementId: "G-QBKH9QW37F"
};

// ✅ Check if Firebase is already initialized before initializing
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// Function to Generate Random Sensor Data
const generateSensorData = () => ({
  location: `Warehouse ${Math.floor(Math.random() * 3) + 1}`,
  temperature: (Math.random() * (30 - 20) + 20).toFixed(2),
  humidity: (Math.random() * (80 - 50) + 50).toFixed(2),
  pH: (Math.random() * (9 - 5) + 5).toFixed(2)
});

// Function to Add Sensor Data to Firestore
const addSensorData = async () => {
  try {
    const sensorData = generateSensorData();
    await addDoc(collection(db, "sensorData"), sensorData);
    console.log("✅ Sensor data added:", sensorData);
  } catch (error) {
    console.error("❌ Error adding data:", error);
  }
};

// Display that React is running
console.log("🔥 IoT Sensor Dashboard Running...");

// Render the App component
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
