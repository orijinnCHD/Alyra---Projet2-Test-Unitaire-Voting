require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");
require('solidity-coverage');
require("@nomiclabs/hardhat-truffle5");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
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
