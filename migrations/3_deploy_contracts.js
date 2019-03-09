const FundingToken = artifacts.require("FundingToken");

module.exports = function(deployer) {
  deployer.deploy(FundingToken, 10000, 16);
};
