const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const { expect, assert } = require('chai');
const { networkInterfaces } = require('os');
const yugoDaoAbstraction = artifacts.require('YugoDao');
const yugoAbstraction = artifacts.require('Yugo');
const managerAbstraction = artifacts.require('YugoManager');
const grantEscrowAbstraction = artifacts.require('GrantEscrow');
const VerifySignatureAbstraction = artifacts('VerifySignature');

const setup = async function(accounts){

    const admin = accounts[0];
    const orga = {
        one: {
            address: accounts[1],
            members: { },
            country: 0,
            themes: [0,1]
          },
        two: {
            address: accounts[2],
            members: { },
            country: 0,
            themes: [0,1]
          },
        three: { 
          address: accounts[3],
          members: { 0: accounts[4],  1: accounts[5] },
          country: 0,
          themes: [0,1]
        }
      };
    const foundation = accounts[6];
    let yugo, yugoDao, manager, escrow, verifSign;
    const contestCreator = orga.one.address;
    const actionCreator = orga.two.address
    let contest; 

  const getBlockTimestamp = async () => {
    const blockNum = await web3.eth.getBlockNumber();
    const block = await web3.eth.getBlock(blockNum);
    const timestamp = block.timestamp;
    return timestamp
  }

  //setup contest data on test execution
  (async function () {
    const _timestamp = await getBlockTimestamp();
    const _applicationEndDate = _timestamp + 10; // 1 second
    const _votingEndDate =  _timestamp + 30; // 100 seconds
    contest = {
      seed: "laptop beanie check penguin bridge",
      nonce: 23,
      name: 'Education for all',
      themes: [0, 1],
      countries: [0, 1],
      applicationEndDate: _applicationEndDate, 
      votingEndDate: _votingEndDate,
      funds: web3.utils.toWei('10')
    }
  })();

  // setup action data 
  let action = {
    name: 'newAction',
    funds: web3.utils.toWei('6')
  };

  /**
   * @notice The mine function allows the mining of a new block 
   * with a specified timestamp
   * @param timestamp - the time you want the block to be at
   * @returns Promise
   */
  const mine = (timestamp) => {
    console.log('mining new block')
    return new Promise((resolve, reject) => {
      web3.currentProvider.send({
        jsonrpc: '2.0',
        method: 'evm_mine', // also see "evm_increaseTime"
        id: Date.now(),
        params: [timestamp],
      }, (err, res) => {
        if (err) return reject(err)
        resolve(res)
      })
    })
  }
    // before('create an instance of the contract', async function createInstance() {
        //instantiate main contract from abstraction
    manager = await managerAbstraction.new({ from: admin });
    yugo = await yugoAbstraction.new(manager.address, { from: admin });
    verifSign = await VerifySignatureAbstraction.new({from: admin});
    yugoDao = await yugoDaoAbstraction.new(yugo.address, escrow.address, verifSign.address, { from: admin });
    await manager.setContractsAddresses(yugo.address, yugoDao.address, {from: admin})
    await verifSign.setYugoDaoAddress(yugoDao.address, {from: admin});
    escrow = await grantEscrowAbstraction.new(yugoDao.address, {from: admin})
    //register orga 1, 2 and 3
    for (const _orga of Object.values(orga)) {
      await yugoDao.registerOrganisation(_orga.themes, _orga.country, { from: _orga.address });
    }
    //orga3 adds participants
    for (const member of Object.values(orga.three.members)) {
      await yugoDao.addParticipant(orga.three.address, member, { from: orga.three.address });
    }
    //orga 1, 2 and 3 purchase a token
    let _value = web3.utils.toWei('0.1', "ether")
    for (const _orga of Object.values(orga)) {
      await manager.sendTransaction({to:manager.address, from: _orga.address, value: _value});
    }
    //orga 1, 2 and 3 claim the token
    for (const _orga of Object.values(orga)) {
      await manager.transferYugo({from: _orga.address})
    }
    //orga 1 creates a contest
    await yugoDao.addContest(
      contest.seed,
      contest.nonce,
      contest.name,
      contest.themes,
      contest.countries,
      contest.applicationEndDate,
      contest.votingEndDate,
      contest.funds,
      { from: contestCreator }
    );
    // orga 2 creates an action
    await yugoDao.createAction(contestCreator, action.name, action.funds, { from: actionCreator });




    return [
      getBlockTimestamp,
      admin, 
      orga, 
      foundation,
      yugo,
      yugoDao,
      manager,
      escrow,
      contestCreator,
      actionCreator,
      contest,
      action
    ]

  }

  module.exports = {
    setup
  }