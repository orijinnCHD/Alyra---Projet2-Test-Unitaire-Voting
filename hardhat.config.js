
require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");
require('solidity-coverage');
require("@nomiclabs/hardhat-truffle5");
require('dotenv').config();


const GOERLI_RPC_URL = process.env.GOERLI_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

module.exports ={
  solidity:"0.8.17",
  defaultNetwork:"hardhat",
  networks:{
    goerli:{
      url:GOERLI_RPC_URL,
      accounts:[PRIVATE_KEY],
      chaindId:5
    },
    localhost:{
      url:"http://127.0.0.1:8545",
      chainId:31337
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
}
