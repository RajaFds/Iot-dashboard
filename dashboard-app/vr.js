import admin from "firebase-admin";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { addTransport } from "./blockchain.js"; // ✅ Import blockchain function
import "dotenv/config";

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

// ✅ Store previous values for Medical Transport
let previousValues = {
  MedicalTransport: {
    Transport1: { temperature: 5, humidity: 50 },
    Transport2: { temperature: 5, humidity: 50 }
  }
};

let updateCount = 0;
let lastAlertTime = {
  MedicalTransport: { Transport1: 0, Transport2: 0 }
};

// ✅ Function to generate valid sensor data
function generateRandomData(transportType, transportName) {
  if (!previousValues[transportType]) previousValues[transportType] = {};
  if (!previousValues[transportType][transportName]) previousValues[transportType][transportName] = { temperature: 5, humidity: 50 };

  let { temperature, humidity } = previousValues[transportType][transportName];

  const limits = { minTemp: 2, maxTemp: 10, minHumidity: 40, maxHumidity: 80 };

  if (updateCount % 4 !== 0) {
    let tempChange = Math.random() > 0.5 ? 1 : -1;
    let humidityChange = Math.random() > 0.5 ? 5 : -5;

    temperature = Math.max(limits.minTemp, Math.min(limits.maxTemp, temperature + tempChange));
    humidity = Math.max(limits.minHumidity, Math.min(limits.maxHumidity, humidity + humidityChange));
  }

  if (updateCount % 4 === 0) {
    temperature = limits.maxTemp - 0.5 + Math.random() * 1.5;
    humidity = limits.maxHumidity - 4 + Math.random() * 4;
  }

  previousValues[transportType][transportName] = { temperature, humidity };

  return {
    temperature: Math.round(Math.max(0, temperature)), // ✅ Ensure non-negative values
    humidity: Math.round(Math.max(0, humidity))
  };
}

// ✅ Function to send email alerts
async function sendEmailAlert(transportType, transportName, subject, message) {
  const now = Date.now();
  if (now - lastAlertTime[transportType][transportName] < 20000) {
    console.log(`⏳ Skipping alert for ${transportType} - ${transportName} (Cooldown active)`);
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "abaarath@gmail.com",
    subject,
    text: message,
  };

  try {
    await nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      tls: { rejectUnauthorized: false }
    }).sendMail(mailOptions);

    console.log(`✅ Alert Email Sent: ${subject}`);
    lastAlertTime[transportType][transportName] = now;
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
}

// ✅ Function to check alert conditions
function checkAlert(transportType, transportName, data) {
  const tempLimit = 8, humidityLimit = 75;
  if (data.temperature > tempLimit || data.humidity > humidityLimit) {
    sendEmailAlert(
      transportType, transportName,
      `⚠️ High Temp/Humidity Alert - ${data.product}`,
      `Product: ${data.product}\nLocation: ${data.location}\nTemperature: ${data.temperature}°C\nHumidity: ${data.humidity}%\nTime: ${data.timestamp}`
    );
  }
}

// ✅ Function to update Firebase & Blockchain
async function updateFirebaseAndBlockchain() {
  updateCount++;

  const medicalTransportData = {
    Transport1: {
      product: "Vaccine A",
      timestamp: new Date().toISOString(),
      vehicle: "Truck 1",
      location: "Chennai",
      ...generateRandomData("MedicalTransport", "Transport1")
    },
    Transport2: {
      product: "Insulin",
      timestamp: new Date().toISOString(),
      vehicle: "Van 3",
      location: "Bangalore",
      ...generateRandomData("MedicalTransport", "Transport2")
    }
  };

  // ✅ Update Firebase
  await db.ref("MedicalTransport").set(medicalTransportData);
  console.log("✅ Firebase updated at", new Date().toLocaleTimeString());

  // ✅ Send data to Blockchain
  for (const [transportName, data] of Object.entries(medicalTransportData)) {
    try {
      console.log(`🚀 Sending ${transportName} to Blockchain...`);
      console.log("📦 Blockchain Data:", JSON.stringify(data, null, 2));
      await addTransport(data);
    } catch (error) {
      console.error(`❌ Failed to send ${transportName} to blockchain:`, error);
    }
  }

  // ✅ Check alerts
  Object.entries(medicalTransportData).forEach(([transportName, data]) => checkAlert("MedicalTransport", transportName, data));
}

// ✅ Update every 5 seconds
setInterval(updateFirebaseAndBlockchain, 5000);
