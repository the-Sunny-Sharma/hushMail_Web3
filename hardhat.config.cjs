/** @type import('hardhat/config').HardhatUserConfig */
require("dotenv").config(); // Make sure this is at the top of your config file.

require("@nomicfoundation/hardhat-toolbox");

// require("@nomicfoundation/hardhat-toolbox");
// require("dotenv").config(); // Load environment variables

// import "@nomicfoundation/hardhat-toolbox";
// import dotenv from "dotenv";

// dotenv.config(); // Load environment variables

const SEPOLIA_URL = process.env.SEPOLIA_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!PRIVATE_KEY) {
  throw new Error("Please set your PRIVATE_KEY in a .env file");
}

module.exports = {
  solidity: "0.8.27",
  networks: {
    sepolia: {
      url: SEPOLIA_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};
