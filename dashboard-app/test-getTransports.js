import { getTransports } from "./blockchain.js";

async function test() {
  console.log("🔗 Fetching blockchain transport data...");
  const transports = await getTransports();
  console.log("📦 Retrieved Transport Data:", transports);
}

test();
