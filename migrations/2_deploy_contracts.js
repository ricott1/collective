var DB = artifacts.require("./DB.sol");

module.exports = function(deployer) {
  deployer.deploy(Power);
  deployer.deploy(BancorBondingCurve);
  deployer.deploy(CappedGasPrice);
  deployer.deploy(ContinuousToken, 10000);
};
