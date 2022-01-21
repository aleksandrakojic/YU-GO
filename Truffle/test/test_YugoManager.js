const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
// const web3 = require('web3')
// or:
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const { expect, assert } = require('chai');
const managerAbstraction = artifacts.require('YugoManager');
const yugoAbstraction = artifacts.require('Yugo');
const yugoDaoAbstraction = artifacts.require('YugoDao');
const GrantEscrowAbstraction = artifacts.require('GrantEscrow');
const VerifySignatureAbstraction = artifacts.require('VerifySignature');

contract('test_manager', async function (accounts) {
    const admin = accounts[0];
    const orga1 = accounts[1];
    const organisations = {
      orga1: {
        address: accounts[1],
        members: { 0: accounts[2], 1: accounts[3] }
      },
      orga2: {
        address: accounts[4],
        members: { 0: accounts[5], 1: accounts[6] }
      }
    };
    
    let manager, yugo, yugoDao;

    before('create an instance of the contract', async function createInstance() {
      //instantiate main contract from abstraction
      manager = await managerAbstraction.new({ from: admin });
      yugo = await yugoAbstraction.new(manager.address, { from: admin });
      escrow = await GrantEscrowAbstraction.new({ from: admin });
      verifSign = await VerifySignatureAbstraction.new({from: admin});
      yugoDao = await yugoDaoAbstraction.new(yugo.address, escrow.address, verifSign.address, { from: admin });
      //set yugo and yugoDao addresses in manager
      await manager.setContractsAddresses(yugo.address, yugoDao.address, {from: admin})
    });

    /**
   * The following function sets the address of Yugo and YuGoDao in YugoManager
   * It tests that:
   * the event ContractsAddrSet is emitted 
   */
    describe('#set Addresses dans YugoManager', function () {
      context('set Yugo token et YugoDao addresses', function () {
        it('should emit the ContractsAddrSet event', async function () {
          const setAddresses = await manager.setContractsAddresses(yugo.address, yugoDao.address, {from: admin})
          expectEvent(setAddresses, 'ContractsAddrSet', {yugo: yugo.address, yugodao: yugoDao.address})
        });
      });
    });

   /**
   * The following checks the Yugobalance of YugoManager right after migration
   * It tests that :
   * Yugo token balance is correct when calling Yugo directly or through the manager
   */
    describe('#balanceOf() Manager', function () {
        context('calling balanceOf directly on Yugo', function () {
          it('Manager balance in Yugo equals all tokens', async function () {
            const amount = web3.utils.toWei('500', "ether");
            const balance = await yugo.balanceOf(manager.address, {from: admin});
            expect(balance).to.be.bignumber.equal(amount);
          });
        });
        context('calling balanceOf directly from Manager', function () {
          it('Manager balance equals all tokens', async function () {
            const amount = web3.utils.toWei('500', "ether");
            const balance2 = await manager.yugoBalanceOf(manager.address, {from: admin});
            expect(balance2).to.be.bignumber.equal(amount);
          });
        });
    });

    /**
   * The following tests the registerOrganisation
   * It tests that :
   * the OrganizationRegistered event is emitted
   */
    describe('#registerOrganisation() with orga1', function () {
      context('if orga1 was not yet registred', function () {
        it('should emit orgaRegistered', async function () {
          let _orga1addr = organisations.orga1.address;
          let thematicIds = [1,4];
          let countryId = 3;
          let tx = await yugoDao.registerOrganisation(thematicIds, countryId, { from: _orga1addr });
          await expectEvent(tx, 'OrganizationRegistered', { addressOrga: _orga1addr });
        });
      });
    });

    /**
   * The following tests the purchase of the yugoo token by the organisation
   * It tests that :
   * the Received event is emitted
   * YugoManager balance has received the ETH
   */
    describe('orga1 buys Yugo token', function () {
      context('registered orga1 purchased a token for the first time', function () {
        it('should emit the Received event', async function () {
          let _value = web3.utils.toWei('0.1', "ether")
          let tx = await manager.purchaseYugo({to:manager.address, from:organisations.orga1.address, value: _value});
          await expectEvent(tx, 'Received', {organisation: organisations.orga1.address, value: _value});
        });
        it('balance of manager contract should have 0.1 ETH', async function () {
          let balance = await web3.eth.getBalance(manager.address)
          assert(balance, web3.utils.toWei('0.1', "ether"))
        })
      });
    })

     /**
   * The following tests the transferYugo function
   * It tests that :
   * the YugoTransfer event is emitted
   * Organisation balance of Yugo is correct
   */
    describe('#transferYugo()', function () {
      context('transfer a token to an orga', function () {
        it('should emit the YugoTransfer event', async function () {
          let _orga1addr = organisations.orga1.address;
          const tx = await manager.transferYugo({from: _orga1addr})
          const tokenAmount = web3.utils.toWei('1');
          expectEvent(tx, 'YugoTransfer', {recipient : _orga1addr, amount: tokenAmount })
        });
        it('balanceof orga should have received 1 token', async function () {
          let _orga1addr = organisations.orga1.address;
          const amount = web3.utils.toWei('1');
          const balanceOrga1 = await manager.yugoBalanceOf(_orga1addr);
          expect(balanceOrga1).to.be.bignumber.equal(amount);
        });
      });
    });

})