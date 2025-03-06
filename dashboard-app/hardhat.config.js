

require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify"); // <-- Add this

require("dotenv").config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: "https://fittest-frosty-friday.ethereum-sepolia.quiknode.pro/76b990199da1642b0f3ad1cd5a1986bbc7a6ccf8/",
      accounts: [process.env.PRIVATE_KEY]
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY
    }
  }
};
