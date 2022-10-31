require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");
require('solidity-coverage');
require("@nomiclabs/hardhat-truffle5");
require('dotenv').config();


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks:{
    goerli:{
      url:`https://goerli.infura.io/v3/${process.env.INFURA_ID}`,
      accounts: [process.env.PRIVATE_KEY],
    }
  },
  settings: {          // See the solidity docs for advice about optimization and evmVersion
    optimizer: {
      enabled: false,
      runs: 200
    },

   },
  gasReporter:{
    enabled:true,
    currency:'USD'
 },


};
