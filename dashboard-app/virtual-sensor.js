

import admin from "firebase-admin";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read Firebase service account JSON
const serviceAccount = JSON.parse(fs.readFileSync(path.join(__dirname, "serviceAccountKey.json"), "utf8"));

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://webs-4b0a6-default-rtdb.firebaseio.com/",
});

const db = admin.database();

// Configure Nodemailer for Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "vindcome@gmail.com", // Replace with your Gmail
    pass: "cqsg wrlt osoh wzhx", // Use App Password, NOT your real password
  },
  tls: {
    rejectUnauthorized: false, // Fix for self-signed certificate error
  },
});

// Store previous values for both Medical and Exotic transports
let previousValues = {
  MedicalTransport: {
    Transport1: { temperature: 3, humidity: 50 },
    Transport2: { temperature: 3, humidity: 50 }
  },
  ExoticTransport: {
    Transport1: { temperature: -18, humidity: 30 },
    Transport2: { temperature: -18, humidity: 30 }
  }
};

let updateCount = 0; // Counter to track updates
let lastAlertTime = {
  MedicalTransport: { Transport1: 0, Transport2: 0 },
  ExoticTransport: { Transport1: 0, Transport2: 0 }
};

// Function to generate random sensor values with fluctuations
function generateRandomData(transportType, transportName) {
  let { temperature, humidity } = previousValues[transportType][transportName];

  // Different min/max values for Medical and Exotic transports
  const limits = transportType === "MedicalTransport"
    ? { minTemp: 2, maxTemp: 10, minHumidity: 40, maxHumidity: 80 }
    : { minTemp: -20, maxTemp: -15, minHumidity: 20, maxHumidity: 50 };

  // **Minor fluctuations every 5 sec**
  if (updateCount % 4 !== 0) {
    let tempChange = (Math.random() > 0.5 ? 0.5 : -0.5);
    let humidityChange = (Math.random() > 0.5 ? 3 : -3);

    temperature = Math.max(limits.minTemp, Math.min(limits.maxTemp, temperature + tempChange));
    humidity = Math.max(limits.minHumidity, Math.min(limits.maxHumidity, humidity + humidityChange));
  }

  // **Major spike every 20 sec, then reset**
  if (updateCount % 4 === 0) {
    temperature = limits.maxTemp - 0.5 + Math.random() * 1.5; // Force spike close to max
    humidity = limits.maxHumidity - 4 + Math.random() * 4;
  } else if (updateCount % 4 === 1) {  
    temperature = limits.minTemp + 1;
    humidity = limits.minHumidity + 5;
  }

  // Store updated values
  previousValues[transportType][transportName] = { temperature, humidity };

  return {
    temperature: temperature.toFixed(1),
    humidity: Math.floor(humidity),
  };
}

// Function to send email alerts (only on major fluctuations)
async function sendEmailAlert(transportType, transportName, subject, message) {
  const now = Date.now();

  // Prevent sending alerts too frequently (every 20 sec per transport)
  if (now - lastAlertTime[transportType][transportName] < 20000) {
    console.log(`⏳ Skipping alert for ${transportType} - ${transportName} (Cooldown active)`);
    return;
  }

  const mailOptions = {
    from: "vindcome@gmail.com",
    to: "abaarath@gmail.com",
    subject: subject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Alert Email Sent: ${subject}`);

    // Update last alert time
    lastAlertTime[transportType][transportName] = now;
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
}

// Function to check alert conditions
function checkAlert(transportType, transportName, data) {
  const tempLimit = transportType === "MedicalTransport" ? 8 : -16;
  const humidityLimit = transportType === "MedicalTransport" ? 75 : 45;

  if (data.temperature > tempLimit || data.humidity > humidityLimit) {
    sendEmailAlert(
      transportType,
      transportName,
      `⚠️ High Temp/Humidity Alert - ${data.medicine}`,
      `Medicine: ${data.medicine}\nLocation: ${data.location}\nTemperature: ${data.temperature}°C\nHumidity: ${data.humidity}%\nTime: ${data.transportTime}`
    );
  }
}

// Function to update Firebase with simulated data
function updateFirebase() {
  updateCount++;

  // Medical Transport Data
  const medicalTransportData = {
    Transport1: { 
      medicine: "Vaccine A", 
      transportTime: new Date().toLocaleTimeString(), 
      vehicle: "Truck 1", 
      location: "Chennai",
      ...generateRandomData("MedicalTransport", "Transport1")  
    },
    Transport2: { 
      medicine: "Insulin", 
      transportTime: new Date().toLocaleTimeString(), 
      vehicle: "Van 3", 
      location: "Bangalore",
      ...generateRandomData("MedicalTransport", "Transport2")  
    }
  };

  // Exotic Transport Data
  const exoticTransportData = {
    Transport1: { 
      product: "Caviar", 
      time: new Date().toLocaleTimeString(), 
      vehicle: "Cold Truck 2", 
      location: "Mumbai",
      ...generateRandomData("ExoticTransport", "Transport1")  
    },
    Transport2: { 
      product: "Wagyu Beef", 
      time: new Date().toLocaleTimeString(), 
      vehicle: "Cold Van 5", 
      location: "Delhi",
      ...generateRandomData("ExoticTransport", "Transport2")  
    }
  };

  // Update Firebase
  db.ref("MedicalTransport").set(medicalTransportData);
  db.ref("ExoticTransport").set(exoticTransportData);

  console.log("✅ Database updated at", new Date().toLocaleTimeString());
  console.log("Added to blockchain");

  // Check alert conditions
  Object.entries(medicalTransportData).forEach(([transportName, data]) => {
    checkAlert("MedicalTransport", transportName, data);
  });
  Object.entries(exoticTransportData).forEach(([transportName, data]) => {
    checkAlert("ExoticTransport", transportName, data);
  });
}

// Update Firebase every 5 seconds
setInterval(updateFirebase, 5000);
