const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect, assert } = require('chai');
const { networkInterfaces } = require('os');
const yugoDaoAbstraction = artifacts.require('YugoDao');
const yugoAbstraction = artifacts.require('Yugo');
const managerAbstraction = artifacts.require('YugoManager');

contract('test_main', async function (accounts) {
  const admin = accounts[0];
  const foundation = accounts[8];
  const organisations = {
    orga1: {
      address: accounts[1],
      members: { 0: accounts[2], 1: accounts[3] },
      country: 0
    },
    orga2: {
      address: accounts[4],
      members: { 0: accounts[5], 1: accounts[6] },
      country: 1
    }
  };
  const unknownOrga = accounts[7];
  let yugoDao, yugo, manager;
  before('create an instance of the contract', async function createInstance() {
    //instantiate main contract from abstraction
    // manager = await managerAbstraction.new({ from: admin });
    // yugo = await yugoAbstraction.new(manager.address, { from: admin });
    // yugoDao = await yugoDaoAbstraction.new(yugo.address, { from: admin });
    yugoDao = await yugoDaoAbstraction.new({ from: admin });
    //await yugoDao.sendTransaction({to:yugoDao.address, from:foundation, value: web3.utils.toWei('100', "ether")});
  });

  /**
   * The following function tests registerOrganisation().
   * It tests that:
   * it emits the orgaRegistered event
   * it reverts if orga was already registered
   */
  describe('#registerOrganisation() with orga1', function () {
    context('with wrong parameters', async function () {
      it('no thematics, should revert ', async function () {
        let _orga1addr = organisations.orga1.address;
        let idCountry = 0;
        let idThematic = [];
        await expectRevert(
          yugoDao.registerOrganisation(idThematic, idCountry, { from: _orga1addr }),
          'Organisation must have thematics'
        );
      });
      it('no country, should revert', async function () {
        let _orga1addr = organisations.orga1.address;
        let idCountry = -1;
        let idThematic = [0];
        await expectRevert(
          yugoDao.registerOrganisation(idThematic, idCountry, { from: _orga1addr }),
          'value out-of-bounds'
        );
      });
    });
    context('orga1 was not yet registred', function () {
      it('should emit orgaRegistered', async function () {
        let _orga1addr = organisations.orga1.address;
        let idCountry = 0;
        let idThematic = [0];
        let tx = await yugoDao.registerOrganisation(idThematic, idCountry, { from: _orga1addr });
        await expectEvent(tx, 'OrganizationRegistered', { addressOrga: _orga1addr });
      });
    });
    context('orga1 is already registered', async function () {
      it('should revert', async function () {
        let _orga1addr = organisations.orga1.address;
        let idCountry = 0;
        let idThematic = [0];
        await expectRevert(
          yugoDao.registerOrganisation(idThematic, idCountry, { from: _orga1addr }),
          'Organisation already registered'
        );
      });
    });
  });

  /**
   * The following function tests addParticipant().
   * It tests that:
   * the event AddressWhitelisted is called
   * it reverts if the caller is not a registered orga
   * it reverts if the participant has already been whitelisted
   */
  describe('#addParticipant()', function () {
    context('with correct parameters', function () {
      it('should emit ParticipantWhitelisted for each address', async function () {
        let _orga1 = organisations.orga1;
        for (const member of Object.values(_orga1.members)) {
          let tx = await yugoDao.addParticipant(_orga1.address, member, { from: _orga1.address });
          await expectEvent(tx, 'ParticipantWhitelisted', {
            addressParticipant: member,
            addressOrganization: _orga1.address
          });
        }
      });
    });
    context('caller address is not the orga address', function () {
      it('it should revert', async function () {
        let _orga1addr = organisations.orga1.address;
        let _orga2 = organisations.orga2;
        await expectRevert(
          yugoDao.addParticipant(_orga2.address, _orga2.members[0], { from: _orga1addr }),
          'You are not the owner of the organization'
        );
      });
    });
    context('member address already been whitelisted', function () {
      it('it should revert', async function () {
        let _orga1 = organisations.orga1;
        await expectRevert(
          yugoDao.addParticipant(_orga1.address, _orga1.members[0], { from: _orga1.address }),
          'Address already whitelisted for this organization'
        );
      });
    });
  });

  /**
   * The following tests the addContest
   * It tests that :
   * revert  voting session not over
   * should emit ContestCreated
   */
  describe('#addContest()', function () {
    context('with correct address', function () {
      it('should emit ContestCreated', async function () {
        let _orga1 = organisations.orga1;
        let _contest = {
          name: 'test',
          themes: [0, 1],
          countries: [0, 1],
          applicationEndDate: Date.now() + 1000,
          votingEndDate: Date.now() + 9000,
          funds: new BN(9000)
        };
        let tx = await yugoDao.addContest(
          _contest.name,
          _contest.themes,
          _contest.countries,
          _contest.applicationEndDate,
          _contest.votingEndDate,
          _contest.funds,
          { from: _orga1.address }
        );

        await expectEvent(tx, 'ContestCreated', {
          addressOrga: _orga1.address,
          name: _contest.name,
          funds: _contest.funds
        });
      });
    });
    context('contest already created by orga', function () {
      it('should revert', async function () {
        let _orga1 = organisations.orga1;
        let _contest = {
          name: 'test',
          themes: [0, 1],
          countries: [0, 1],
          applicationEndDate: Date.now() + 1000,
          votingEndDate: Date.now() + 9000,
          funds: new BN(9000)
        };

        await expectRevert(
          yugoDao.addContest(
            _contest.name,
            _contest.themes,
            _contest.countries,
            _contest.applicationEndDate,
            _contest.votingEndDate,
            _contest.funds,
            { from: _orga1.address }
          ),
          'Organisation already created a contest'
        );
      });
    });
  });

  /**
   * The following tests the createAction
   * It tests that :
   * revert if no eligible country
   * should emit ActionCreated if good param
   * revert if no already action created for contest
   */

  describe('#createAction()', function () {
    context('no country eligible', function () {
      it('should revert', async function () {
        let _orga1 = organisations.orga1;
        let _orga2 = organisations.orga2;

        let _orga2addr = _orga2.address;
        let idCountry = 2;
        let idThematic = [0];

        let tx = await yugoDao.registerOrganisation(idThematic, idCountry, { from: _orga2addr });
        await expectEvent(tx, 'OrganizationRegistered', { addressOrga: _orga2addr });

        let _action = {
          name: 'test',
          funds: new BN(9000)
        };

        await expectRevert(
          yugoDao.createAction(_orga2.address, _action.name, _action.funds, { from: _orga2.address }),
          'You are not eligible to participate in this contest'
        );
      });
    });

    context('with correct param', function () {
      it('should emit ActionCreated', async function () {
        let _orga1 = organisations.orga1;
        let _action = {
          name: 'test',
          funds: new BN(9000)
        };
        let tx = await yugoDao.createAction(_orga1.address, _action.name, _action.funds, { from: _orga1.address });

        await expectEvent(tx, 'ActionCreated', {
          addressContestCreator: _orga1.address,
          addressActionCreator: _orga1.address,
          actionName: _action.name,
          requiredFunds: _action.funds
        });
      });
    });

    context('action already created for this contest', function () {
      it('should revert ActionCreated', async function () {
        let _orga1 = organisations.orga1;
        let _action = {
          name: 'test',
          funds: new BN(9000)
        };

        await expectRevert(
          yugoDao.createAction(_orga1.address, _action.name, _action.funds, { from: _orga1.address }),
          'You have already created an action'
        );
      });
    });
  });

  /**
   * The following tests the voteForAction
   * It tests that :
   * revert  voter cant be actionCreator or contestCreator
   * should emit HasVotedForAction
   * revert cant vote multiple times
   */
  describe('#voteForAction()', function () {
    context('voter cant be actionCreator or contestCreator', function () {
      it('should revert', async function () {
        let _orga1 = organisations.orga1;

        await expectRevert(
          yugoDao.voteForAction(_orga1.address, _orga1.address, { from: _orga1.address }),
          'You can not vote for this action'
        );
      });
    });
    context('correct params', function () {
      it('should emit HasVotedForAction', async function () {
        let _orga1 = organisations.orga1;

        let tx = await yugoDao.voteForAction(_orga1.address, _orga1.address, { from: _orga1.members[0] });

        await expectEvent(tx, 'HasVotedForAction', {
          addressContestCreator: _orga1.address,
          addressActionCreator: _orga1.address,
          voterAddress: _orga1.members[0]
        });
      });
    });

    context('cant vote multiple times', function () {
      it('should revert', async function () {
        let _orga1 = organisations.orga1;

        await expectRevert(
          yugoDao.voteForAction(_orga1.address, _orga1.address, { from: _orga1.members[0] }),
          'You have already voted'
        );
      });
    });
  });

  /**
   * The following tests the tallyVote
   * It tests that :
   * revert if voting session not over
   * should emit VoteTallied if over
   */
  describe('#tallyVote()', function () {
    context('voting session not finished', function () {
      it('should revert', async function () {
        let _orga1 = organisations.orga1;

        await expectRevert(
          yugoDao.tallyVote(_orga1.address, { from: _orga1.members[0] }),
          'Voting has not finished yet'
        );
      });
    });

    /*context('voting session has finished', function () {
      it('should emit VoteTallied', async function () {
        let _orga2 = organisations.orga2;
        let _contest = {
          name: 'test',
          themes: [0, 1],
          countries: [0, 1],
          applicationEndDate: Date.now() + 1000,
          votingEndDate: Date.now() - (Date.now() - 10000),
          funds: new BN(9000)
        };
        let tx = await yugoDao.addContest(
          _contest.name,
          _contest.themes,
          _contest.countries,
          _contest.applicationEndDate,
          _contest.votingEndDate,
          _contest.funds,
          { from: _orga2.address }
        );

        await expectEvent(tx, 'ContestCreated', {
          addressOrga: _orga2.address,
          name: _contest.name,
          funds: _contest.funds
        });

        let tx2 = await yugoDao.tallyVote(_orga2.address, { from: _orga2.address });

        await expectEvent(tx2, 'VoteTallied', {
          addressContestCreator: _orga2.address,
          addressActionCreator: _orga2.address,
          nbVotes: 0
        });
      });
    });*/
  });

  /**
   * The following function tests participantIsWhiteListed()
   * It tests that:
   * it returns true if participant is in the whitelist
   * it returns false if the caller is not in the whitelist
   * it reverts if organisation givern by the caller is not yet registered
   */
  describe('#participantIsWhiteListed()', function () {
    context('with correct members address', function () {
      it('should return true for each member address', async function () {
        let _orga1 = organisations.orga1;
        for (const member of Object.values(_orga1.members)) {
          let isWhitelisted = await yugoDao.participantIsWhiteListed(_orga1.address, member, { from: _orga1.address });
          assert.equal(isWhitelisted, true, `${member} is not in the whitelist`);
        }
      });
    });
    context('caller is not in the whitelist', function () {
      it('should return false', async function () {
        let _orga1 = organisations.orga1;
        let _orga2 = organisations.orga2;
        let isWhitelisted = await yugoDao.participantIsWhiteListed(_orga1.address, _orga2.members[0], {
          from: _orga1.address
        });
        assert.equal(isWhitelisted, false, `${_orga2.members[0]} is in the whitelist`);
      });
    });
    context('orga chosen is not registered', function () {
      it('should return revert', async function () {
        let _orga1 = organisations.orga1;

        let isWhitelisted = await yugoDao.participantIsWhiteListed(unknownOrga, _orga1.address, {
          from: _orga1.members[0]
        });
        assert.equal(isWhitelisted, false, `${_orga1.members[0]} is in the whitelist`);
      });
    });
  }); //end participantIsWhitelised
}); //end contract
