const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const { expect, assert } = require('chai');
const { networkInterfaces } = require('os');
const yugoDaoAbstraction = artifacts.require('YugoDao');
const yugoAbstraction = artifacts.require('Yugo');
const managerAbstraction = artifacts.require('YugoManager');
let catchRevert = require("./exceptions.js").catchRevert;

contract('test_deleteAction', async function (accounts) {
  const admin = accounts[0];
  const organisations = {
    orga1: {
      address: accounts[1],
      members: { 0: accounts[2], 1: accounts[3] },
      country: 0,
      themes: [0,1]
    },
    orga2: {
      address: accounts[4],
      members: { 0: accounts[5], 1: accounts[6] },
      country: 1,
      themes: [0,1]
    },
  };
  const randomOrga = accounts[8];
  const foundation = accounts[9];

  let contestCreator = organisations.orga1.address;
  let actionCreator = organisations.orga2.address;

  let yugoDao, yugo, manager;
  let contest = {
    name: 'test',
    themes: [0, 1],
    countries: [0, 1],
    applicationEndDate: Date.now() + 1000,
    votingEndDate: Date.now() + 9000,
    funds: new BN(9000)
  };
  let action = {
    name: 'newAction',
    funds: new BN(9000)
  };

  beforeAll('setup the stage', async function createInstance() {
    //instantiate main contract from abstraction
    manager = await managerAbstraction.new({ from: admin });
    yugo = await yugoAbstraction.new(manager.address, { from: admin });
    yugoDao = await yugoDaoAbstraction.new(yugo.address, { from: admin });
    // set yugo and yugoDao addresses in manager
    await manager.setContractsAddresses(yugo.address, yugoDao.address, {from: admin})
    // register organisations
    await yugoDao.registerOrganisation(
        organisations.orga1.themes,
        organisations.orga1.country, 
        { from: organisations.orga1.address}
    );
    await yugoDao.registerOrganisation(
        organisations.orga2.themes,
        organisations.orga2.country, 
        { from: organisations.orga2.address}
    );
    // orga1 purchases and claims token
    let _value = web3.utils.toWei('0.1', "ether")
    await manager.sendTransaction({to:manager.address, from:contestCreator, value: _value});
    await manager.transferYugo({from: contestCreator})
    ...
  });
  describe('#deleteActions()', function () {
    context('the msg.sender did not create the action', function () {
      it('should revert', async function() {
        await expectRevert(yugoDao.deleteActions(contestCreator, {from: randomOrga}),
        'you did not create any action for this contest'
        );
      });
    });
    context('the msg.sender created the action', function () {
      it('should emit the ActionDeleted event', async function () {
        let delAction = await yugoDao.deleteActions(contestCreator, {from: actionCreator});
        await expectEvent(
          delAction, 
          'ActionDeleted', 
          { 
            addressContestCreator: contestCreator, 
            addressActioncreator: actionCreator,
            actionName: action.name
          }
        );
      });
    });
  });
})