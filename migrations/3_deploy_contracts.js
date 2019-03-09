const FundingToken = artifacts.require("FundingToken");
const Subscription = artifacts.require("Subscription");
var ftaddr;


module.exports = function(deployer) {
  deployer.deploy(FundingToken, 10000, 16).then(() => FundingToken.deployed())
    .then(_instance => console.log(_instance.address));
  //deployer.deploy(Subscription, )
};


