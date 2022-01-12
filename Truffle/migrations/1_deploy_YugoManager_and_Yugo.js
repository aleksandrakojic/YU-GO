const Manager = artifacts.require("YugoManager");
const Token = artifacts.require("Yugo");
const YugoDao = artifacts.require('YugoDao');

let manager, token, dao;

module.exports = async function(deployer) {
  //::::: Deploy Manager :::::|
  await deployer.deploy(Manager);
  manager = await Manager.deployed();

  //::::: Deploy Token :::::|
  await deployer.deploy(Token, manager.address);
  token = await Token.deployed()

  //::::: Deploy YugoDao :::::|
  await deployer.deploy(YugoDao, token.address);
  dao = await YugoDao.deployed()

  //::::: Set Token and YugoDao addresses in Manager :::::|
  await manager.setContractsAddresses(token.address, dao.address)
  
};