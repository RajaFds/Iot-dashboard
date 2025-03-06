import React, { useState, useEffect } from "react";
import { db } from "./firebaseConfig.js";
import { ref, onValue } from "firebase/database";
import "./TableStyles.css";

const ExoticTransportTable = () => {
  const [transportData, setTransportData] = useState([]);

  useEffect(() => {
    const transportRef = ref(db, "ExoticTransport");

    onValue(transportRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert object to an array of transport details
        const formattedData = Object.values(data);
        setTransportData(formattedData);
      } else {
        setTransportData([]);
      }
    });
  }, []);

  return (
    <div className="table-container">
      <h2>🦐 Exotic Transport Products</h2>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Time</th>
            <th>Vehicle</th>
            <th>Temperature (°C)</th>
            <th>Humidity (%)</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {transportData.map((details, index) => (
            <tr key={index}>
              <td>{details?.product || "N/A"}</td>  {/* Fixed Field */}
              <td>{details?.time || "N/A"}</td>
              <td>{details?.vehicle || "N/A"}</td>
              <td>{details?.temperature || "N/A"}</td>
              <td>{details?.humidity || "N/A"}</td>
              <td>{details?.location || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExoticTransportTable;
