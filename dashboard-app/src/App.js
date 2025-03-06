import React from "react";
import TransportTable from "./TransportTable.js";
import WarehouseTable from "./WarehouseTable.js";

function App() {
  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <h1 style={styles.title}>IoT Sensor Dashboard</h1>
      </nav>

      <div style={styles.content}>
        {/* Transport Section */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>🚚 Transport</h2>
          <TransportTable />
        </section>

        {/* Warehouse Section */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>🏢 Warehouse</h2>
          <WarehouseTable />
        </section>
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    backgroundColor: "#121212",
    color: "#fff",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  navbar: {
    padding: "20px",
    backgroundColor: "#1E1E1E",
    textAlign: "center",
    borderBottom: "2px solid #00bcd4",
  },
  title: {
    margin: 0,
    color: "#00bcd4",
  },
  content: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  section: {
    marginBottom: "30px",
    padding: "20px",
    backgroundColor: "#1E1E1E",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 188, 212, 0.2)",
  },
  sectionTitle: {
    color: "#00bcd4",
    borderBottom: "2px solid #00bcd4",
    paddingBottom: "5px",
    marginBottom: "15px",
  },
};

export default App;
