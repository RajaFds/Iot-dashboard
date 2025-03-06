import { getTransports } from "./blockchain.js"; // Ensure blockchain.js exists

async function checkData() {
  console.log("Fetching data from blockchain...");
  const data = await getTransports();
  console.log("Blockchain Data:", data);
}

checkData();
