const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const { expect, assert } = require('chai');
const { networkInterfaces } = require('os');
const {setup} = require("./setup.js")

contract('test_GrantEscrow', async function (accounts) {

    let getBlockTimestamp,admin, orga, unknownOrga, foundation, yugo, yugoDao, manager, escrow, contestCreator, actionCreator, contest, action;

    before('create an instance of the contract', async function createInstance() {

      [getBlockTimestamp, admin, orga, unknownOrga, foundation, yugo, yugoDao, manager, escrow, contestCreator, actionCreator, contest, action] = await setup(accounts)

      });
      
    /**
   * The following tests the depositGrant function
   * It tests that:
   * The function reverts when caller is not one of Yugo's trusted contracts
   */
    describe('#depositGrant', function () {
        context('caller is not YugoDao', function () {
            it('should revert', async function () {
                let amount = web3.utils.toWei('10', "ether")
                await expectRevert(
                    escrow.depositGrant(unknownOrga, amount, {from: unknownOrga}),
                    'Only trusted YUGO contracts can call this function'
                );
            });
        });
      });
});