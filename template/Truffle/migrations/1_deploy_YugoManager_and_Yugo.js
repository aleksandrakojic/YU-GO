const Manager = artifacts.require("YugoManager");
const Token = artifacts.require("Yugo");

let manager, token;

module.exports = async function(deployer) {
  //::::: Deploy Manager :::::|
  await deployer.deploy(Manager);
  manager = await Manager.deployed();

  //::::: Deploy Token :::::|
  await deployer.deploy(Token,manager.address);
  token = await Token.deployed()
  // await token.transferOwnership(manager.address)

};