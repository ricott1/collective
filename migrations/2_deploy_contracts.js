const Power = artifacts.require("Power");
const BancorBondingCurve = artifacts.require("BancorBondingCurve");
const CappedGasPrice = artifacts.require("CappedGasPrice");
const ContinuousToken = artifacts.require("ContinuousToken");

module.exports = function(deployer) {
  deployer.deploy(Power);
  deployer.deploy(BancorBondingCurve);
  deployer.deploy(CappedGasPrice);
  deployer.deploy(ContinuousToken, 10000);
};
