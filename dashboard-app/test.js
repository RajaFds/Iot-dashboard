import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider("https://fittest-frosty-friday.ethereum-sepolia.quiknode.pro/76b990199da1642b0f3ad1cd5a1986bbc7a6ccf8/");

async function checkConnection() {
    try {
        const blockNumber = await provider.getBlockNumber();
        console.log("✅ Connected to Sepolia! Latest Block:", blockNumber);
    } catch (error) {
        console.error("❌ RPC Connection Failed:", error);
    }
}

checkConnection();
