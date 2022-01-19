const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const { expect, assert } = require('chai');
const { networkInterfaces } = require('os');
const yugoDaoAbstraction = artifacts.require('YugoDao');
const yugoAbstraction = artifacts.require('Yugo');
const managerAbstraction = artifacts.require('YugoManager');
//|::::: For debugging :::::|
let catchRevert = require("./exceptions.js").catchRevert;
//|::::: For setup :::::|
const {setup} = require("./setup.js")

contract('test_deleteAction', async function (accounts) {

  let getBlockTimestamp,admin, orga, foundation, yugo, yugoDao, manager, escrow, contestCreator, actionCreator, contest, action;

  before('setup the stage', async function createInstance() {
    //instantiate main contract from abstraction
    [getBlockTimestamp, admin, orga, foundation, yugo, yugoDao, manager, escrow, contestCreator, actionCreator, contest, action] = await setup(accounts)
  });
  describe('#deleteActions()', function () {
    context('the msg.sender did not create the action', function () {
      it('should revert', async function() {
        await expectRevert(yugoDao.deleteActions(contestCreator, {from: orga.three.address}),
        'you did not create any action for this contest'
        );
      });
    });
    context('the msg.sender created the action', function () {
      it('should emit the ActionDeleted event', async function () {
        console.log('currentTime: ', await getBlockTimestamp())
        console.log('_applicationEndDate: ', contest.applicationEndDate)
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