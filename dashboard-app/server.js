const cron = require("node-cron");
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to Generate Random Sensor Data
const generateSensorData = () => ({
  location: `Warehouse ${Math.floor(Math.random() * 3) + 1}`,
  temperature: (Math.random() * (30 - 20) + 20).toFixed(2), // 20°C - 30°C
  humidity: (Math.random() * (80 - 50) + 50).toFixed(2), // 50% - 80%
  pH: (Math.random() * (9 - 5) + 5).toFixed(2) // pH range 5-9
});

// Function to Add Sensor Data to Firestore
const addSensorData = async () => {
  try {
    const sensorData = generateSensorData();
    await addDoc(collection(db, "sensorData"), sensorData);
    console.log("✅ Sensor data added successfully:", sensorData);
  } catch (error) {
    console.error("❌ Error adding data:", error);
  }
};

// Run every 10 seconds (Simulating real-time sensor updates)
cron.schedule("*/10 * * * * *", addSensorData);

console.log("🔥 IoT Sensor Data Logger Running... (Updating every 10s)");
