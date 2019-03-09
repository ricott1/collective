const FundingToken = artifacts.require("FundingToken");

module.exports = function(deployer) {
  deployer.deploy(FundingToken);
};
