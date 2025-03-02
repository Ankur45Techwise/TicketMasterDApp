require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/OejZnBAo05afDV2b-kB7Q-E04VOV4dv3`,
      accounts: [
        `0x33da85d391d345e722ccb28cb5dc8ebb9315eb05c4f70dd8f057336bec6f6b2d`,
      ],
    },
  },
};
