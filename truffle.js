// var bip39 = require("bip39");
// var hdkey = require('ethereumjs-wallet/hdkey');
// var ProviderEngine = require("web3-provider-engine");
// var WalletSubprovider = require('web3-provider-engine/subproviders/wallet.js');
// var Web3Subprovider = require("web3-provider-engine/subproviders/web3.js");
// var Web3 = require("web3");
// const FilterSubprovider = require('web3-provider-engine/subproviders/filters.js');

// // Get our mnemonic and create an hdwallet
// var mnemonic = "piano file obey immense polar rack great subject clutch camera maid ostrich";
// var hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));

// // Get the first account using the standard hd path.
// var wallet_hdpath = "m/44'/60'/0'/0/";
// var wallet = hdwallet.derivePath(wallet_hdpath + "0").getWallet();
// var address = "0x" + wallet.getAddress().toString("hex");

// var providerUrl = "https://testnet.infura.io";
// var engine = new ProviderEngine();
// // filters
// engine.addProvider(new FilterSubprovider());

// engine.addProvider(new WalletSubprovider(wallet, {}));
// engine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(providerUrl)));
// engine.start(); // Required by the provider engine.

// module.exports = {
//   networks: {
//     // ropsten: {
//     //   network_id: 3,    // Official ropsten network id
//     //   provider: engine, // Use the custom provider
//     //   from: address,     // Use the address derived address
//     //   gas: 4444444
//     // },
//     development: {
//       host: "localhost",
//       port: 8545, // This is the conventional port. If you're using the Ganache Blockchain, change port value to the Ganache default port 7545. If you're using Truffle develop network, change port value to 9545
//       network_id: "*", // Match any network id. You may need to replace * with your network Id
//       from: "", // Add your unlocked account within the double quotes
//       gas: 444444400
//     }
//   },
//   compilers: {
//     solc: {
//       version: "0.5.2",
//     },
//   },
// };


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


// trumpet hill program satisfy steak fringe lady print celery ripple foot goat
