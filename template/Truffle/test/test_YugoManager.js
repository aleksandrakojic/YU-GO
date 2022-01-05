const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const { expect, assert } = require('chai');
const managerAbstraction = artifacts.require('YugoManager');
const yugoAbstraction = artifacts.require('Yugo');
const yugoDaoAbstraction = artifacts.require('YugoDao');

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
    
    let manager;
    let yugo;
    let yugoDao;

   let logAddresses = async function() {
    console.log('admin address:', admin);
    console.log('manager address:', manager.address);
    console.log('yugo address:', yugo.address);
    console.log('orga1 address:', orga1);
   }

    before('create an instance of the contract', async function createInstance() {
      //instantiate main contract from abstraction
      manager = await managerAbstraction.new({ from: admin });
      yugo = await yugoAbstraction.new(manager.address,{ from: admin });
      yugoDao = await yugoDaoAbstraction.new({ from: admin });
      await logAddresses();
    });

    describe('#set Addresses dans YugoManager', function () {
      context('set Yugo token address', function () {
        it('should emit the AddressSet event', async function () {
          const setYugo = await manager.setYugoAddress(yugo.address, {from: admin})
          expectEvent(setYugo, 'AddressSet', {addrSetTo: yugo.address, setter: admin})
        });
      });
      context('set YugoDao address', function () {
        it('should emit the AddressSet event', async function () {
          const setYugoDao = await manager.setYugoDaoAddress(yugoDao.address, {from: admin})
          expectEvent(setYugoDao, 'AddressSet', {addrSetTo: yugoDao.address, setter: admin})
        });
      });
    });
    describe('#balanceOf() Manager', function () {
        context('calling balanceOf directly on Yugo', function () {
          it('Manager balance in Yugo equals all tokens', async function () {
            const amount = new BN('500000000000000000000');
            const balance = await yugo.balanceOf(manager.address, {from: admin});
            expect(balance).to.be.bignumber.equal(amount);
          });
        });
        context('calling balanceOf directly from Manager', function () {
          it('Manager balance equals all tokens', async function () {
            const amount = new BN('500000000000000000000');
            const balance2 = await manager.yugoBalanceOf(manager.address, {from: admin});
            expect(balance2).to.be.bignumber.equal(amount);
          });
        });
    });
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
    describe('orga1 buys Yugo token', function () {
      context('registered orga1 purchased a token for the first time', function () {
        it('should emit the Received event', async function () {
          let _value = web3.utils.toWei('0.1', "ether")
          // let tx = manager.purchaseToken({from: organisations.orga1.address, value: _value});
          let tx = await web3.eth.sendTransaction({to:manager.address, from:organisations.orga1.address, value: web3.utils.toWei('0.1', "ether")});
          // await expectEvent(tx, 'Received', {organisation: organisations.orga1.address, value: _value});
          // await expectEvent(tx, 'TokenPurchasedBy', {organisation: organisations.orga1.address})
        });
        it('balance of manager contract should have 0.1 ETH', async function () {
          let balance = await web3.eth.getBalance(manager.address)
          assert(balance, web3.utils.toWei('0.1', "ether"))
        })
      });
    })
    describe('#transferYugo()', function () {
      context('transfer a token to an orga', function () {
        it('should emit the YugoTransfer event', async function () {
          let _orga1addr = organisations.orga1.address;
          const tx = await manager.transferYugo({from: _orga1addr})
          const tokenAmount = new BN('1000000000000000000');
          expectEvent(tx, 'YugoTransfer', {recipient : _orga1addr, amount: tokenAmount })
        });
        it('balanceof orga should have received 1 token', async function () {
          let _orga1addr = organisations.orga1.address;
          const amount = new BN('1000000000000000000');
          const balanceOrga1 = await manager.yugoBalanceOf(_orga1addr);
          expect(balanceOrga1).to.be.bignumber.equal(amount);
        });
      });
    });

})