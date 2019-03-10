const Power = artifacts.require('Power');
const BancorBondingCurve = artifacts.require('BancorBondingCurve');
const CappedGasPrice = artifacts.require('CappedGasPrice');
const ContinuousToken = artifacts.require('ContinuousToken');
const FundingToken = artifacts.require("FundingToken");

module.exports = function(deployer) {
	deployer.deploy(Power)
	deployer.deploy(BancorBondingCurve)
	deployer.deploy(CappedGasPrice)
	deployer.deploy(ContinuousToken, 10000)
	deployer.deploy(FundingToken, 10000, 60)
}
