import { ethers } from "ethers";
import "dotenv/config";

// ✅ Load Environment Variables
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// ✅ Ensure Environment Variables Exist
if (!RPC_URL || !PRIVATE_KEY || !CONTRACT_ADDRESS) {
  console.error("❌ Missing environment variables! Check your .env file.");
  process.exit(1);
}

// ✅ Contract ABI
const CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "getTransports",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "product", "type": "string" },
          { "internalType": "string", "name": "vehicle", "type": "string" },
          { "internalType": "string", "name": "location", "type": "string" },
          { "internalType": "uint256", "name": "temperature", "type": "uint256" },
          { "internalType": "uint256", "name": "humidity", "type": "uint256" },
          { "internalType": "string", "name": "timestamp", "type": "string" }
        ],
        "internalType": "struct TransportData.Transport[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "product", "type": "string" },
      { "internalType": "string", "name": "vehicle", "type": "string" },
      { "internalType": "string", "name": "location", "type": "string" },
      { "internalType": "uint256", "name": "temperature", "type": "uint256" },
      { "internalType": "uint256", "name": "humidity", "type": "uint256" },
      { "internalType": "string", "name": "timestamp", "type": "string" }
    ],
    "name": "addTransport",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// ✅ Provider & Wallet Setup
const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

// ✅ Function to Add Transport Data to Blockchain
export async function addTransport(transportData) {
  try {
    console.log("\n🚀 Sending transaction to blockchain...");
    console.log("📦 Data:", transportData);

    // Ensure all data fields are present
    if (!transportData.product || !transportData.vehicle || !transportData.location || 
        transportData.temperature === undefined || transportData.humidity === undefined || 
        !transportData.timestamp) {
      throw new Error("❌ Missing required transport data fields!");
    }

    // Send transaction
    const tx = await contract.addTransport(
      transportData.product,
      transportData.vehicle,
      transportData.location,
      transportData.temperature,
      transportData.humidity,
      transportData.timestamp
    );

    console.log(`⏳ Transaction Sent! TX Hash: ${tx.hash}`);
    console.log(`🔗 View on Sepolia Etherscan: https://sepolia.etherscan.io/tx/${tx.hash}`);

    const receipt = await tx.wait();
    console.log(`✅ Transaction Confirmed! Block Number: ${receipt.blockNumber}`);
  } catch (error) {
    console.error("❌ Error Adding Transport:", error);
  }
}
