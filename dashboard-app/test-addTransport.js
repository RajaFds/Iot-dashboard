import { addTransport } from "./blockchain.js";
import { ethers } from "ethers";

// Sepolia RPC URL
const RPC_URL = "https://fittest-frosty-friday.ethereum-sepolia.quiknode.pro/76b990199da1642b0f3ad1cd5a1986bbc7a6ccf8/";
const provider = new ethers.JsonRpcProvider(RPC_URL);

// Replace with your actual Sepolia wallet private key
const signer = new ethers.Wallet("c660e9b70d0e76a6711c3c6c0b91494b434c099b0ab8d3bbbf5bfed7b72b4251", provider);


const testData = {
  product: "Caviar",
  vehicle: "Cold Truck-22",
  location: "Warehouse B",
  temperature: 3,
  humidity: 75,
  timestamp: new Date().toISOString(),
};

async function test() {
  console.log("🚀 Sending transaction to blockchain...");
  await addTransport(signer, testData);
}

test();

0xB2EC76F72dc717bB80411C225140F257BF3fdFb3
