const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const { expect, assert } = require('chai');
const { networkInterfaces } = require('os');
const yugoDaoAbstraction = artifacts.require('YugoDao');
const yugoAbstraction = artifacts.require('Yugo');
const managerAbstraction = artifacts.require('YugoManager');
const grantEscrowAbstraction = artifacts.require('GrantEscrow');

contract('test_GrantEscrow', async function (accounts) {
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
            members: { 0: accounts[5] },
            country: 0,
            themes: [0,1]
          },
        orga3: { address: accounts[6] }
      };
    const foundation = accounts[9];
    let yugo, yugoDao, manager, escrow;

    before('create an instance of the contract', async function createInstance() {
        //instantiate main contract from abstraction
        manager = await managerAbstraction.new({ from: admin });
        yugo = await yugoAbstraction.new(manager.address, { from: admin });
        yugoDao = await yugoDaoAbstraction.new(yugo.address, { from: admin });
        escrow = await grantEscrowAbstraction.new(yugoDao.address, {from: admin})
        //register orga 1 et 2
        let orga1 = organisations.orga1;
        let orga2 = organisations.orga2;
        await yugoDao.registerOrganisation(orga1.themes, orga1.country, { from: orga1.address });
        await yugoDao.registerOrganisation(orga2.themes, orga2.country, { from: orga2.address });
      });

    describe('#depositGrant, Orga deposits the grant', function () {
        context('orga is not registered', function () {
            it('should revert', async function () {
                let orga3 = organisations.orga3;
                let amount = web3.utils.toWei('10', "ether")
                await expectRevert(
                    escrow.sendTransaction({to: escrow.address, from: orga3.address, value: amount}),
                    'You are not registered'
                );
            });
        });
        context('orga is registered', function () {
          it('should emit the GrantDeposited event', async function () {
            let orga1 = organisations.orga1;
            let amount = web3.utils.toWei('10', "ether")
            let tx = await escrow.sendTransaction({to: escrow.address, from: orga1.address, value: amount});
            await expectEvent(tx, 'GrantDeposited', {grant: amount, depositor: orga1.address});
          });
        });
      });
    describe('#withdrawGrant, claim funds from the contest', function () {
        context('signature is verified', function () {
            it('should emit the GrantWithdrawn event', async function () {
                let orga1 = organisations.orga1;
                let orga2 = organisations.orga2;
                let amount = web3.utils.toWei('10', "ether")
                let tx = await escrow.withdrawGrant(orga1.address, {to: escrow.address, from: orga2.address});
                await expectEvent(tx, 'GrantWithdrawn', {grant: amount, recipient: orga2.address});
            });
        });
    });

});