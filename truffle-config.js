const path = require('path');
var Web3 = require("web3");
// PrivateKeyProvider uses your private key sign the smart contract deployment transaction
let PrivateKeyProvider = require("truffle-privatekey-provider");
let privateKey = "[YOUR_PRIVATE_KEY]";
console.log("truffle-config.js");
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, 'app/src/contracts'),
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*',
    },
    skale: {
            provider: new Web3.providers.HttpProvider(
              "http://104.248.242.122:8003/"
            ),
            gasPrice: 0,
            gas: 8000000,
            network_id: "*"
        }
  },
  compilers: {
    solc: {
      version: '0.5.2',
    },
  },
}
