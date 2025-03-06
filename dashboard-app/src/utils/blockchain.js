import { ethers } from "ethers";

// Sepolia RPC URL
const RPC_URL = "https://fittest-frosty-friday.ethereum-sepolia.quiknode.pro/76b990199da1642b0f3ad1cd5a1986bbc7a6ccf8/";

// Contract Address & ABI
const CONTRACT_ADDRESS = "0x421Ae4e1753eA29C8eF2E82C58A0DA907ABa1a7a";
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

// 🔥 Use ethers.JsonRpcProvider
const provider = new ethers.JsonRpcProvider(RPC_URL);

// ✅ Fetch transport data from blockchain
export async function getTransports() {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    const transports = await contract.getTransports();

    console.log("\n🚛 Blockchain Transport Data (Formatted):\n");
    transports.forEach((transport, index) => {
      console.log(`📦 Entry ${index + 1}`);
      console.log(`   🛒 Product: ${transport.product}`);
      console.log(`   🚛 Vehicle: ${transport.vehicle}`);
      console.log(`   📍 Location: ${transport.location}`);
      console.log(`   🌡 Temperature: ${transport.temperature}°C`);
      console.log(`   💧 Humidity: ${transport.humidity}%`);
      console.log(`   ⏰ Timestamp: ${transport.timestamp}`);
      console.log("----------------------------------------");
    });

    return transports;
  } catch (error) {
    console.error("❌ Error fetching blockchain data:", error);
    return [];
  }
}

// ✅ Add Transport Data to Blockchain
export async function addTransport(signer, transportData) {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    const tx = await contract.addTransport(
      transportData.product,
      transportData.vehicle,
      transportData.location,
      transportData.temperature,
      transportData.humidity,
      transportData.timestamp
    );

    console.log(`\n⏳ Transaction sent! Waiting for confirmation...\n🔗 TX Hash: ${tx.hash}`);

    const receipt = await tx.wait();
    console.log(`✅ Transaction confirmed! Block Number: ${receipt.blockNumber}`);

    // Verify transaction on Sepolia Etherscan
    checkTransactionStatus(tx.hash);
  } catch (error) {
    console.error("❌ Error adding transport data:", error);
  }
}

// ✅ Check Transaction Status on Sepolia Explorer
async function checkTransactionStatus(txHash) {
  console.log(`🔎 Check transaction on Sepolia Etherscan:\n🔗 https://sepolia.etherscan.io/tx/${txHash}`);
}
