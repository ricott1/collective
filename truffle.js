var PrivateKeyProvider = require("truffle-privatekey-provider");
var providerUrl = "http://104.248.242.122:8003";
var privateKey = "828146b3a9105a3e8db44247105ef4e16ee0f15146a7884fc9859e7f03f93ecd";


module.exports = {
  networks: {
    skale: {
      provider:  new PrivateKeyProvider(privateKey, providerUrl),
      gasPrice: 0,
      gas: 268435454,
      network_id: "*"
    }
  },
  compilers: {
    solc: {
      version: "0.5.2",
    },
  },
};
