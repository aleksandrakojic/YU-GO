const Manager = artifacts.require("YugoManager");
const Token = artifacts.require("Yugo");
const YugoDao = artifacts.require('YugoDao');
const GrantEscrow = artifacts.require('GrantEscrow');
const VerifySignature = artifacts.require('VerifySignature');

let manager, token, dao, escrow, verifSign;

module.exports = async function(deployer) {
  //::::: Deploy Manager :::::|
  await deployer.deploy(Manager);
  manager = await Manager.deployed();

  //::::: Deploy Token :::::|
  await deployer.deploy(Token, manager.address);
  token = await Token.deployed()

   //::::: Deploy GrantEscrow :::::|
   await deployer.deploy(GrantEscrow);
   escrow = await GrantEscrow.deployed();

   //::::: Deploy VerifySignature :::::|
   await deployer.deploy(VerifySignature);
   verifSign = await VerifySignature.deployed();

  //::::: Deploy YugoDao :::::|
  await deployer.deploy(YugoDao, token.address, escrow.address, verifSign.address);
  dao = await YugoDao.deployed();

  //::::: Set Token and YugoDao addresses in Manager :::::|
  await manager.setContractsAddresses(token.address, dao.address);

  //::::: Set YugoDao addresses in VerifySignature :::::|
  await verifSign.setYugoDaoAddress(dao.address);

   //::::: Set YugoDao addresses in GrantEscrow :::::|
  await escrow.setContractsAddresses(dao.address, verifSign.address);

  
};