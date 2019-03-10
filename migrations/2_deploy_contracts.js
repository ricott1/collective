const Power = artifacts.require('Power')
const BancorBondingCurve = artifacts.require('BancorBondingCurve')
const CappedGasPrice = artifacts.require('CappedGasPrice')
const ContinuousToken = artifacts.require('ContinuousToken')
const FundingToken = artifacts.require('FundingToken')
const TestToken = artifacts.require('TestToken')

module.exports = function(deployer) {
	deployer.deploy(Power)
	deployer.deploy(BancorBondingCurve)
	deployer.deploy(CappedGasPrice)
	deployer.deploy(ContinuousToken, 10000)
	deployer.deploy(FundingToken, 10000, 60).then(instance => {
		console.log(FundingToken.address)
	})
	deployer.deploy(TestToken, '0x146B81CdcB7eBCFa1A32896034BfB8290Ca5971c')
}
