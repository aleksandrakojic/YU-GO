const YugoDao = artifacts.require('YugoDao');
// const Token = artifacts.require("Yugo");

module.exports = function (deployer) {
  // let token = await Token.deployed()
  // deployer.deploy(YugoDao, token.address);
  deployer.deploy(YugoDao);
};
