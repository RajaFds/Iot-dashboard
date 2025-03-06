import { addTransport } from "./blockchain.js";

async function testAddTransport() {
  console.log("Adding data to blockchain...");

  await addTransport(
    "Pharmaceuticals",  // Product
    "Truck-101",        // Vehicle
    "Chennai",          // Location
    4,                  // Temperature (in °C)
    75,                 // Humidity (%)
    new Date().toISOString()  // Timestamp
  );

  console.log("✅ Data added! Now re-run checkBlockchain.js to verify.");
}

testAddTransport();
