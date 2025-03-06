import React from "react";
import { initializeApp } from "firebase/app";
import TransportTable from "./TransportTable";
import WarehouseTable from "./WarehouseTable";

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
initializeApp(firebaseConfig);

const Dashboard = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#121212",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "26px", fontWeight: "bold" }}>IoT Sensor Dashboard</h1>

      <TransportTable />
      <WarehouseTable />
    </div>
  );
};

export default Dashboard;
