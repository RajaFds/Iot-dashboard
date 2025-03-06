import React, { useState, useEffect } from "react";
import { ethers } from "ethers";  // 🔥 Import ethers.js
import { db } from "./firebaseConfig.js";
import { ref, onValue } from "firebase/database";
import { addTransport, getTransports } from "./utils/blockchain.js";

const MedicalTransportTable = () => {
  const [transportData, setTransportData] = useState([]);
  const [blockchainData, setBlockchainData] = useState([]);

  useEffect(() => {
    const transportRef = ref(db, "MedicalTransport");

    onValue(transportRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedData = Object.values(data);
        setTransportData(formattedData);

        try {
          // 🔥 Fetch Blockchain Data to avoid duplicate entries
          const existingBlockchainData = await getTransports();

          // 🛠 Get MetaMask Signer
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();

          for (const entry of formattedData) {
            // ✅ Prevent duplicate blockchain entries
            const alreadyExists = existingBlockchainData.some(
              (b) =>
                b.product === entry.medicine &&
                b.vehicle === entry.vehicle &&
                b.location === entry.location
            );

            if (!alreadyExists) {
              console.log("Adding to blockchain:", entry);
              await addTransport(signer, {
                product: entry.medicine,
                vehicle: entry.vehicle,
                location: entry.location,
                temperature: parseInt(entry.temperature),
                humidity: parseInt(entry.humidity),
                timestamp: entry.transportTime
              });
            } else {
              console.log("Skipping duplicate entry:", entry);
            }
          }
        } catch (error) {
          console.error("Error syncing with blockchain:", error);
        }
      } else {
        setTransportData([]);
      }
    });
  }, []);

  // Fetch stored blockchain data
  useEffect(() => {
    const fetchBlockchainData = async () => {
      const blockchainEntries = await getTransports();
      setBlockchainData(blockchainEntries);
    };
    fetchBlockchainData();
  }, []);

  return (
    <div className="table-container">
      <h2>🚑 Medical Transport Data</h2>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Medicine Name</th>
            <th>Transport Time</th>
            <th>Vehicle</th>
            <th>Temperature (°C)</th>
            <th>Humidity (%)</th>
            <th>Location</th>
            <th>Blockchain Verified</th>
          </tr>
        </thead>
        <tbody>
          {transportData.map((details, index) => (
            <tr key={index}>
              <td>{details?.medicine || "N/A"}</td>
              <td>{details?.transportTime || "N/A"}</td>
              <td>{details?.vehicle || "N/A"}</td>
              <td>{details?.temperature || "N/A"}</td>
              <td>{details?.humidity || "N/A"}</td>
              <td>{details?.location || "N/A"}</td>
              <td>
                {blockchainData.some(
                  (b) =>
                    b.product === details.medicine &&
                    b.vehicle === details.vehicle &&
                    b.location === details.location
                )
                  ? "✅"
                  : "❌"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MedicalTransportTable;
