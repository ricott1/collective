var PrivateKeyProvider = require("truffle-privatekey-provider");
var providerUrl = "http://104.248.242.122:8003";
var privateKey = "828146b3a9105a3e8db44247105ef4e16ee0f15146a7884fc9859e7f03f93ecd";


module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545, // This is the conventional port. If you're using the Ganache Blockchain, change port value to the Ganache default port 7545. If you're using Truffle develop network, change port value to 9545
      network_id: "*", // Match any network id. You may need to replace * with your network Id
      gas: 444444400
    },
    skale: {
      provider:  new PrivateKeyProvider(privateKey, providerUrl),
      gasPrice: 0,
      network_id: "*",
      gas: 268435455
    }
  },

  compilers: {
    solc: {
      version: "0.5.2",
      optimizer: {
        enabled: true,
        runs: 200
      }
    },

  },
};
