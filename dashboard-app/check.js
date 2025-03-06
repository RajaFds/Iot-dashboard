import { ethers } from "ethers";

const RPC_URL = "https://fittest-frosty-friday.ethereum-sepolia.quiknode.pro/76b990199da1642b0f3ad1cd5a1986bbc7a6ccf8/";
const provider = new ethers.JsonRpcProvider(RPC_URL);

// Replace with your Sepolia wallet address
const WALLET_ADDRESS = "0xB2EC76F72dc717bB80411C225140F257BF3fdFb3";

async function checkBalance() {
  const balance = await provider.getBalance(WALLET_ADDRESS);
  console.log("💰 Sepolia ETH Balance:", ethers.formatEther(balance));
}

checkBalance();
