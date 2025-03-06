const { ethers } = require("hardhat");

async function main() {
    // Get contract factory
    const TransportData = await ethers.getContractFactory("TransportData");

    // Deploy contract
    const contract = await TransportData.deploy();
    await contract.waitForDeployment();  // Alternative to deployed()

    // Get contract address
    const contractAddress = await contract.getAddress();
    console.log("Contract deployed at:", contractAddress);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
