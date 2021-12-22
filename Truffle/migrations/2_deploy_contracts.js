const ConvertLib = artifacts.require("ConvertLib");
const Main = artifacts.require("Main");

module.exports = function (deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, Main);
  deployer.deploy(Main);
};
