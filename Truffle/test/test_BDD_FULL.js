const { BN, expectEvent, expectRevert } = require("@openzeppelin/test-helpers");
const { web3 } = require("@openzeppelin/test-helpers/src/setup");
// or:
// var Web3 = require('web3');
// var web3 = new Web3(Web3.givenProvider)
const { expect, assert } = require("chai");
const yugoDaoAbstraction = artifacts.require("YugoDao");
const yugoAbstraction = artifacts.require("Yugo");
const managerAbstraction = artifacts.require("YugoManager");
const escrowAbstraction = artifacts.require("GrantEscrow");
const VerifySignatureAbstraction = artifacts.require("VerifySignature");
let catchRevert = require("./exceptions.js").catchRevert;

contract("test_YugoDao", async function (accounts) {
  const admin = accounts[0];
  const organisations = {
    orga1: {
      address: accounts[1],
      members: { 0: accounts[2], 1: accounts[3] },
      country: 0,
      themes: [0, 1],
    },
    orga2: {
      address: accounts[4],
      members: { 0: accounts[5] },
      country: 0,
      themes: [0, 1],
    },
    orga3: {
      address: accounts[6],
      members: { 0: accounts[7] },
      country: 2,
      themes: [0, 1],
    },
    orga4: {
      address: accounts[8],
      country: 0,
      themes: [3, 5],
    },
  };
  const unknownOrga = accounts[9];
  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  let contestCreator = organisations.orga1.address;
  let actionCreator = organisations.orga2.address;
  let yugoDao, yugo, manager, escrow, verifSign;
  let contest;

  const getBlockTimestamp = async () => {
    const blockNum = await web3.eth.getBlockNumber();
    const block = await web3.eth.getBlock(blockNum);
    const timestamp = block.timestamp;
    return timestamp;
  };

  //setup contest data on test execution
  (async function () {
    const _timestamp = await getBlockTimestamp();
    const _applicationEndDate = _timestamp + 30; // 10 second
    const _votingEndDate = _timestamp + 40; // 20 seconds
    contest = {
      name: "Education for all",
      themes: [0, 1],
      countries: [0, 1],
      applicationEndDate: _applicationEndDate,
      votingEndDate: _votingEndDate,
      funds: new BN(web3.utils.toWei("0.000001")),
    };
  })();

  // setup action data
  let action = {
    name: "newAction",
    funds: new BN(web3.utils.toWei("0.000001")),
  };

  const agreement = () => {
    return `Lorem ipsum ${actionCreator} dolor sit amet, consectetur adipiscing elit. Quisque nisl eros, 
    pulvinar facilisis justo mollis, auctor consequat urna. Morbi a bibendum metus. 
    Donec scelerisque sollicitudin ${action.funds} enim eu venenatis. Duis tincidunt laoreet ex, 
    in pretium orci vestibulum eget. Class aptent taciti sociosqu ad litora torquent
    per conubia ${contestCreator} nostra, ${contest.name} per inceptos himenaeos. Duis pharetra luctus lacus ut 
    vestibulum. Maecenas ipsum lacus, ${contest.funds} lacinia quis posuere ut, pulvinar vitae dolor.
    Integer eu nibh at nisi ullamcorper sagittis id vel leo. Integer feugiat 
    faucibus libero, at maximus nisl suscipit posuere. Morbi nec enim nunc. 
    Phasellus bibendum turpis ut ipsum egestas, sed sollicitudin elit convallis. 
    Cras pharetra mi tristique sapien vestibulum lobortis. Nam eget bibendum metus, 
    non dictum mauris. Nulla at tellus sagittis, viverra est a, bibendum metus.`;
  };

  const nonce = 23;

  /**
   * @notice The mine function allows the mining of a new block
   * with a specified timestamp
   * @param timestamp - the time you want the block to be at
   * @returns Promise
   */
  const mine = (timestamp) => {
    console.log("mining new block");
    return new Promise((resolve, reject) => {
      web3.currentProvider.send(
        {
          jsonrpc: "2.0",
          method: "evm_mine", // also see "evm_increaseTime"
          id: Date.now(),
          params: [timestamp],
        },
        (err, res) => {
          if (err) return reject(err);
          resolve(res);
        }
      );
    });
  };

  before("create an instance of the contract", async function createInstance() {
    //|::::: instantiate main contract from abstraction :::::|
    manager = await managerAbstraction.new({ from: admin });
    yugo = await yugoAbstraction.new(manager.address, { from: admin });
    escrow = await escrowAbstraction.new({ from: admin });
    verifSign = await VerifySignatureAbstraction.new({ from: admin });
    yugoDao = await yugoDaoAbstraction.new(yugo.address, escrow.address, {
      from: admin,
    });
    //|::::: set yugo and yugoDao addresses in manager :::::|
    await manager.setContractsAddresses(yugo.address, yugoDao.address, {
      from: admin,
    });
    await verifSign.setYugoDaoAddress(yugoDao.address, escrow.address, {
      from: admin,
    });
    await escrow.setContractsAddresses(yugoDao.address, verifSign.address, {
      from: admin,
    });
  });

  /**
   * The following function tests registerOrganisation().
   * It tests that:
   * It reverts when wrong parameters are given
   * it emits the orgaRegistered event
   * it reverts if orga was already registered
   */
  describe("#registerOrganisation() with orga1", function () {
    context("with wrong parameters", async function () {
      it("no thematics, should revert ", async function () {
        console.log(contest.applicationEndDate);
        let _orga1addr = organisations.orga1.address;
        let idCountry = 0;
        let idThematic = [];
        await expectRevert(
          yugoDao.registerOrganisation(idThematic, idCountry, {
            from: _orga1addr,
          }),
          "You must provide thematics and country"
        );
      });
      it("no country, should revert", async function () {
        let _orga1addr = organisations.orga1.address;
        let idCountry = -1;
        let idThematic = [0];
        await expectRevert(
          yugoDao.registerOrganisation(idThematic, idCountry, {
            from: _orga1addr,
          }),
          "value out-of-bounds"
        );
      });
    });
    context("orga1 was not yet registred", function () {
      it("should emit orgaRegistered", async function () {
        let _orga1addr = organisations.orga1.address;
        let idCountry = 0;
        let idThematic = [0];
        let tx = await yugoDao.registerOrganisation(idThematic, idCountry, {
          from: _orga1addr,
        });
        await expectEvent(tx, "OrganizationRegistered", {
          addressOrga: _orga1addr,
        });
      });
    });
    context("orga1 is already registered", async function () {
      it("should revert", async function () {
        let _orga1addr = organisations.orga1.address;
        let idCountry = 0;
        let idThematic = [0];
        await expectRevert(
          yugoDao.registerOrganisation(idThematic, idCountry, {
            from: _orga1addr,
          }),
          "Organisation already registered"
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
  describe("#addParticipant()", function () {
    context("with correct parameters", function () {
      it("should emit ParticipantWhitelisted for each address", async function () {
        let _orga1 = organisations.orga1;
        for (const member of Object.values(_orga1.members)) {
          let tx = await yugoDao.addParticipant(_orga1.address, member, {
            from: _orga1.address,
          });
          await expectEvent(tx, "ParticipantWhitelisted", {
            addressParticipant: member,
            addressOrganization: _orga1.address,
          });
        }
      });
    });
    context("caller address is not the orga address", function () {
      it("it should revert", async function () {
        let _orga1addr = organisations.orga1.address;
        let _orga2 = organisations.orga2;
        await expectRevert(
          yugoDao.addParticipant(_orga2.address, _orga2.members[0], {
            from: _orga1addr,
          }),
          "You are not the owner of the organization"
        );
      });
    });
    context("member address already been whitelisted", function () {
      it("it should revert", async function () {
        let _orga1 = organisations.orga1;
        await expectRevert(
          yugoDao.addParticipant(_orga1.address, _orga1.members[0], {
            from: _orga1.address,
          }),
          "Address already whitelisted for this organization"
        );
      });
    });
  });

  /**
   * The following function tests participantIsWhiteListed()
   * It tests that:
   * it returns true if participant is in the whitelist
   * it returns false if the caller is not in the whitelist
   * it reverts if organisation givern by the caller is not yet registered
   */
  describe("#participantIsWhiteListed()", function () {
    context("with correct members address", function () {
      it("should return true for each member address", async function () {
        let _orga1 = organisations.orga1;
        for (const member of Object.values(_orga1.members)) {
          let isWhitelisted = await yugoDao.participantIsWhiteListed(
            _orga1.address,
            member,
            { from: _orga1.address }
          );
          assert.equal(
            isWhitelisted,
            true,
            `${member} is not in the whitelist`
          );
        }
      });
    });
    context("Member trying to register is not in the whitelist", function () {
      it("should return false", async function () {
        let _orga1 = organisations.orga1;
        let _orga2 = organisations.orga2;
        let isWhitelisted = await yugoDao.participantIsWhiteListed(
          _orga1.address,
          _orga2.members[0],
          {
            from: _orga1.address,
          }
        );
        assert.equal(
          isWhitelisted,
          false,
          `${_orga2.members[0]} is in the whitelist`
        );
      });
    });
    context("orga selected by member is not registered", function () {
      it("should return revert", async function () {
        let _orga1 = organisations.orga1;
        let isWhitelisted = await yugoDao.participantIsWhiteListed(
          unknownOrga,
          _orga1.members[0],
          {
            from: _orga1.members[0],
          }
        );
        assert.equal(
          isWhitelisted,
          false,
          `${_orga1.members[0]} is in the whitelist`
        );
      });
    });
  });

  /**
   * The following tests the addContest function
   * It tests that :
   * It reverts if an organisation did not purchase a Yugo token
   * An organisation can nuy a token, which emits the Receive events
   * The organisation can claim the token and emit the YugoTransfer event
   * should emit ContestCreated
   * the amount deposited has been stored correctly
   * * It reverts if the same organisation tries to create another contest at the same time
   */
  describe("#addContest()", function () {
    context("orga did not purchase a Yugo token", function () {
      it("should revert", async function () {
        await expectRevert(
          yugoDao.addContest(
            contest.name,
            contest.themes,
            contest.countries,
            contest.applicationEndDate,
            contest.votingEndDate,
            contest.funds,
            { from: contestCreator }
          ),
          "you need Yugo governance token to create a contest"
        );
      });
    });

    context("orga1 buys token first, then creates contest", function () {
      it("should emit Received events", async function () {
        let _value = web3.utils.toWei("0.1", "ether");
        let tx = await manager.sendTransaction({
          to: manager.address,
          from: contestCreator,
          value: _value,
        });
        await expectEvent(tx, "Received", {
          organisation: contestCreator,
          value: _value,
        });
      });
      it("should emit YugoTransfer events", async function () {
        const tx = await manager.transferYugo({ from: contestCreator });
        const tokenAmount = web3.utils.toWei("1");
        expectEvent(tx, "YugoTransfer", {
          recipient: contestCreator,
          amount: tokenAmount,
        });
      });
      it("should emit the ContestCreated event", async function () {
        let tx = await yugoDao.addContest(
          contest.name,
          contest.themes,
          contest.countries,
          contest.applicationEndDate,
          contest.votingEndDate,
          contest.funds,
          { from: contestCreator, value: contest.funds }
        );
        await expectEvent(tx, "ContestCreated", {
          addressOrga: contestCreator,
          name: contest.name,
          funds: contest.funds,
        });
      });
      it("amount deposited is correctly stored in Grants mapping", async function () {
        const deposit = await escrow.fundsInEscrow.call(contestCreator, {
          from: contestCreator,
        });
        assert(deposit == Number(contest.funds), "not deposited");
      });
    });
    context("contest already created by orga", function () {
      it("should revert", async function () {
        await expectRevert(
          yugoDao.addContest(
            contest.name,
            contest.themes,
            contest.countries,
            contest.applicationEndDate,
            contest.votingEndDate,
            contest.funds,
            { from: contestCreator }
          ),
          "Organisation already created a contest"
        );
      });
    });
  });
  describe("register, buy and claim token for orga2, 3 and 4", function () {
    it("all events are emitted", async function () {
      let _ETH = web3.utils.toWei("0.1", "ether"); //ETH to buy Yugo
      const tokenAmount = web3.utils.toWei("1"); //amount of Yugo
      Object.entries(organisations)
        .slice(1)
        .forEach(async ([orga, data]) => {
          let tx1 = await yugoDao.registerOrganisation(
            data.themes,
            data.country,
            { from: data.address }
          );
          expectEvent(tx1, "OrganizationRegistered", {
            addressOrga: data.address,
          });
          let tx2 = await manager.sendTransaction({
            to: manager.address,
            from: data.address,
            value: _ETH,
          });
          expectEvent(tx2, "Received", {
            organisation: data.address,
            value: _ETH,
          });
          let tx3 = await manager.transferYugo({ from: data.address });
          expectEvent(tx3, "YugoTransfer", {
            recipient: data.address,
            amount: tokenAmount,
          });
          let orgaYugoBal = await yugo.balanceOf(data.address, {
            from: data.address,
          });
          expect(orgaYugoBal).to.be.bignumber.equal(tokenAmount);
        });
    });
  });

  /**
   * The following tests the createAction
   * It tests that :
   * revert if a contest creator tries to add its own action
   * It reverts if the organisation is not eligible (country, themes)
   * should emit ActionCreated if good parameters
   * revert if the same organisation tries to create an action again
   */
  describe("#createAction()", function () {
    context("The Grant orga1 tries to create an action", function () {
      it("should revert", async function () {
        await expectRevert(
          yugoDao.createAction(contestCreator, action.name, action.funds, {
            from: contestCreator,
          }),
          "Contest creator cannot propose actions"
        );
      });
    });
    context("Orga3 country is not eligible", function () {
      it("should revert", async function () {
        let orga3 = organisations.orga3;
        //await sleep(1000);
        await expectRevert(
          yugoDao.createAction(contestCreator, action.name, action.funds, {
            from: orga3.address,
          }),
          "You are not eligible to participate in this contest"
        );
      });
    });
    context("Orga4 themes are not eligible", function () {
      it("should revert", async function () {
        let orga4 = organisations.orga4;
        await expectRevert(
          yugoDao.createAction(contestCreator, action.name, action.funds, {
            from: orga4.address,
          }),
          "Themes of your organisation are not eligible for this contest"
        );
      });
    });

    /*context("contest applicationEndDate passed", function () {
      it("currentTime >= applicationEndDate", async function () {
        const futureTimestamp = contest.applicationEndDate + 1;
        mine(futureTimestamp);
        currentTime = await getBlockTimestamp();
        console.log("currentTime after mining: ", currentTime);
        assert(
          currentTime >= contest.applicationEndDate,
          "currentTime >= applicationEndDate"
        );
      });
    });*/

    context("Orga2 has correct parameters", function () {
      it("should emit ActionCreated", async function () {
        let tx = await yugoDao.createAction(
          contestCreator,
          action.name,
          action.funds,
          { from: actionCreator }
        );
        await expectEvent(tx, "ActionCreated", {
          addressContestCreator: contestCreator,
          addressActionCreator: actionCreator,
          actionName: action.name,
          requiredFunds: action.funds,
        });
      });
    });

    context("action already created for this contest", function () {
      it("should revert", async function () {
        await expectRevert(
          yugoDao.createAction(contestCreator, action.name, action.funds, {
            from: actionCreator,
          }),
          "You have already created an action"
        );
      });
    });

    context("application deadline is reached", function () {
      it("should revert", async function () {
        const futureTimestamp = contest.votingEndDate + 1;
        mine(futureTimestamp);
        await expectRevert(
          yugoDao.createAction(contestCreator, action.name, action.funds, {
            from: organisations.orga3.address,
          }),
          "Voting has started. You cannot add a action"
        );
      });
    });
  });

  /**
   * The following tests the voteForAction
   * It tests that :
   * we have passed the applicationEndDate, otherwise we mine another block with a specific timestamp
   * It reverts if the voter is the contest creator or the action creator
   * should emit HasVotedForAction
   * It reverts since you can't vote multiple times
   * It reverts because the deadline to vote has passed
   */
  describe("#voteForAction()", function () {
    context("Application has reached the deadline", function () {
      it("currentTime >= applicationEndDate", async function () {
        let currentTime = await getBlockTimestamp();
        console.log("applicationEndDate: ", contest.applicationEndDate);
        console.log("currentTime: ", currentTime);
        if (currentTime >= contest.applicationEndDate) {
          assert(
            currentTime >= contest.applicationEndDate,
            "currentTime >= applicationEndDate"
          );
        } else {
          const futureTimestamp = contest.applicationEndDate + 1;
          mine(futureTimestamp);
          currentTime = await getBlockTimestamp();
          console.log("currentTime after mining: ", currentTime);
          assert(
            currentTime >= contest.applicationEndDate,
            "currentTime >= applicationEndDate"
          );
        }
      });
    });
    context(
      "only members. Voter cannot be contestCreator or actionCreator",
      function () {
        it("should revert", async function () {
          let currentTime = await getBlockTimestamp();
          console.log("votingEndDate: ", contest.votingEndDate);
          console.log("currentTime: ", currentTime);
          await expectRevert(
            yugoDao.voteForAction(
              contestCreator,
              actionCreator,
              organisations.orga1.address,
              { from: organisations.orga1.address }
            ),
            "You can not vote for this action"
          );
        });
      }
    );
    context("correct params", function () {
      it("should emit HasVotedForAction", async function () {
        let tx = await yugoDao.voteForAction(
          contestCreator,
          actionCreator,
          organisations.orga3.address,
          { from: organisations.orga3.members[0] }
        );
        await expectEvent(tx, "HasVotedForAction", {
          addressContestCreator: contestCreator,
          addressActionCreator: actionCreator,
          voterAddress: organisations.orga3.members[0],
        });
      });
    });
    context("cant vote multiple times", function () {
      it("should revert", async function () {
        await expectRevert(
          yugoDao.voteForAction(
            contestCreator,
            actionCreator,
            organisations.orga3.address,
            { from: organisations.orga3.members[0] }
          ),
          "You have already voted"
        );
      });
    });
    context("Voting deadline is reached", function () {
      it("should revert", async function () {
        const futureTimestamp = contest.votingEndDate + 1;
        mine(futureTimestamp);
        await expectRevert(
          yugoDao.voteForAction(
            contestCreator,
            actionCreator,
            organisations.orga3.address,
            { from: organisations.orga3.members[0] }
          ),
          "Voting is closed"
        );
      });
    });
  });

  /**
   * The following tests the tallyVotes
   * It tests that :
   * the votingEndDate is not reached
   * revert if voting session not over
   * the votingEndDate is not passed
   * should emit VoteTallied event
   */
  describe("#tallyVotes()", function () {
    context("voting session not finished", function () {
      it("currentTime < votingEndDate", async function () {
        const pastTimestamp = contest.votingEndDate - 1;
        mine(pastTimestamp);
        let currentTime = await getBlockTimestamp();
        console.log("votingEndDate: ", contest.votingEndDate);
        console.log("currentTime: ", currentTime);
        assert(
          currentTime < contest.votingEndDate,
          "currentTime is not < votingEndDate"
        );
      });
      it("should revert", async function () {
        await expectRevert(
          yugoDao.tallyVotes(contestCreator, { from: contestCreator }),
          "Voting has not finished yet"
        );
      });
      it("currentTime > votingEndDate", async function () {
        let currentTime = await getBlockTimestamp();
        console.log("votingEndDate: ", contest.votingEndDate);
        console.log("currentTime: ", currentTime);
        if (currentTime > contest.votingEndDate) {
          assert(
            currentTime > contest.votingEndDate,
            "currentTime > votingEndDate"
          );
        } else {
          const futureTimestamp = contest.votingEndDate + 1;
          mine(futureTimestamp);
          currentTime = await getBlockTimestamp();
          console.log("currentTime after mining: ", currentTime);
          assert(
            currentTime > contest.votingEndDate,
            "currentTime > votingEndDate"
          );
        }
      });
      // it('should return the VoteTallied event', async function() {
      it("should return the winner data", async function () {
        // let tx = await yugoDao.tallyVotes(contestCreator, { from: contestCreator });
        // await expectEvent(tx, 'VoteTallied', {
        //   winner: actionCreator,
        //   actionName: action.name,
        //   nbVotes: new BN(1),
        //   requiredFunds: action.funds
        // });
        // console.log('winner: ', tx.logs[0].args.winner);
        // console.log('actionName: ', tx.logs[0].args.actionName);
        // console.log('nbVotes: ', Number(tx.logs[0].args.nbVotes));
        // console.log('requiredFunds: ', Number(tx.logs[0].args.requiredFunds));
        let tx = await yugoDao.tallyVotes.call(contestCreator, {
          from: contestCreator,
        });
        assert(tx[0] == actionCreator, "wrond data");
      });
    });
  });

  /**
   * The following tests the getMessageHash function
   * It tests that :
   * it returns the correct hash
   */
  describe("#getMessageHash()", function () {
    context(
      "contestCreator sends back the agreement + contract address + nonce",
      function () {
        it("should return the right hash", async function () {
          let _agreement = agreement();
          let tx = await verifSign.getMessageHash.call(
            actionCreator,
            action.funds,
            verifSign.address,
            _agreement,
            nonce,
            { from: contestCreator }
          );
          let _hash = web3.utils.soliditySha3(
            actionCreator,
            action.funds,
            verifSign.address,
            _agreement,
            nonce
          );
          assert(tx == _hash, "hash is incorrect");
        });
      }
    );
  });

  /**
   * The following tests the verify function
   * It tests that :
   * the event SignerVerified is emitted
   * It reverts if msg.sender and signer are different
   */
  describe("#verify()", function () {
    context("contestCreator IS the signer of the agreement", function () {
      it("should emit the SignerVerified event", async function () {
        //the private key of accounts[1] = orga1 = the contestCreator
        const privateKey =
          "0x6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1";
        let _agreement = agreement();
        let hash = await verifSign.getMessageHash.call(
          actionCreator,
          action.funds,
          verifSign.address,
          _agreement,
          nonce,
          { from: contestCreator }
        );
        // sign
        const sign = await web3.eth.accounts.sign(hash, privateKey);
        const signature = sign.signature;
        //verify
        let isVerified = await verifSign.verify(
          actionCreator,
          action.funds,
          verifSign.address,
          _agreement,
          nonce,
          signature,
          { from: contestCreator }
        );

        await expectEvent(isVerified, "SignerVerified", {
          signer: contestCreator,
          verified: true,
          signature: signature,
        });
      });
      it("should revert if msg.sender and signer are different", async function () {
        //the private key of accounts[1] = orga1 = the contestCreator
        const privateKey =
          "0x6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1";
        let _agreement = agreement();
        let hash = await verifSign.getMessageHash.call(
          actionCreator,
          action.funds,
          verifSign.address,
          _agreement,
          nonce,
          { from: contestCreator }
        );
        // sign
        const sign = await web3.eth.accounts.sign(hash, privateKey);
        const signature = sign.signature;
        //verify
        await expectRevert(
          verifSign.verify(
            actionCreator,
            action.funds,
            verifSign.address,
            _agreement,
            nonce,
            signature,
            { from: accounts[3] }
          ),
          "wrong signer"
        );
      });
    });
  });

  /**
   * The following tests the withdrawGrant function
   * It tests that :
   * It reverts if msg.sender and signer are different
   * the event GrantWithdrawn is emitted
   */
  describe("#withdrawGrant()", function () {
    context("caller is not the winner", function () {
      it("should revert", async function () {
        await expectRevert(
          escrow.withdrawGrant(contestCreator, { from: accounts[3] }),
          "you cannot withdraw, seems like you did not win the contest"
        );
      });
    });
    context("caller is authorised to withdraw", function () {
      it("should emit the GrantWithdrawn event", async function () {
        const wd = await escrow.withdrawGrant(contestCreator, {
          from: actionCreator,
        });
        console.log("grants :", Number(wd.logs[0].args.amountWithdrawn));
        console.log("recipient :", wd.logs[0].args.recipient);
        await expectEvent(wd, "GrantWithdrawn", {
          amountWithdrawn: action.funds,
          recipient: actionCreator,
        });
      });
    });
  });
});
