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

    describe('#depositGrant', function () {
        context('caller is not YugoDao', function () {
            it('should revert', async function () {
                let amount = web3.utils.toWei('10', "ether")
                await expectRevert(
                    escrow.depositGrant(unknownOrga, amount, {from: unknownOrga}),
                    'Only YugoDao, VerifySignature or GrantEscrow (this) contract can call this function'
                );
            });
        });

        // Recent changes in depositGrant function make it callable only by YugoDao 
      //   context('caller is YugoDao', function () {
      //     it('should emit the GrantDeposited event', async function () {
      //       let amount = web3.utils.toWei('10', "ether")
      //       let tx = await escrow.depositGrant(contestCreator, amount, {from: yugoDao.address});
      //       await expectEvent(tx, 'GrantDeposited', {grant: amount, depositor: contestCreator});
      //     });
      //   });
      });

    //NOTE: recent changes in the withdrawGrant function implies to change the test (in progress)
    // describe('#withdrawGrant, claim funds from the contest', function () {
    //     context('signature is verified', function () {
    //         it('should emit the GrantWithdrawn event', async function () {
    //             let orga1 = orga.one;
    //             let orga2 = orga.two;
    //             let amount = web3.utils.toWei('10', "ether")
    //             let tx = await escrow.withdrawGrant(orga1.address, {to: escrow.address, from: orga2.address});
    //             await expectEvent(tx, 'GrantWithdrawn', {grant: amount, recipient: orga2.address});
    //         });
    //     });
    // });

});