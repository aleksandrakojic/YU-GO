const Manager = artifact.require("YugoManager")
const Token = artifact.require("Yugo")

let manager, token;

module.exports = async function(deployer) {
  //::::: Deploy Manager :::::|
  await deployer.deploy(Manager);
  manager = await Manager.deloyed();

  //::::: Deploy Token :::::|
  await deployer.deploy(Token);
  token = await Token.deployed({from: manager.address})
  // await token.transferOwnership(manager.address)

};