const Main = artifacts.require("Main");
const Yugo = artifacts.require("Yugo");

module.exports = function(deployer) {
  deployer.deploy(Main);
  deployer.deploy(Yugo);
};