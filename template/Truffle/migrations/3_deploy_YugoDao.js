const YugoDao = artifacts.require("YugoDao");

module.exports = function(deployer) {
  deployer.deploy(YugoDao);
};