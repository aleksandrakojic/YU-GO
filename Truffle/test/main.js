const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect, assert } = require('chai');
const mainAbstraction = artifacts.require('Main');

contract('test_main', async function(accounts) { 

    const admin = accounts[0];
    const organisations = {
        orga1 : {
            address: accounts[1],
            members: {0: accounts[2], 1: accounts[3]}
            },
        orga2 : {
            address: accounts[4],
            members: {0: accounts[5], 1: accounts[6]}
            }
    }
    const unknownOrga = accounts[7];
    let main;

    before('create an instance of the contract', async function createInstance() {
        //instantiate main contract from abstraction
        main = await mainAbstraction.new({from: admin});
    })

    /**
     * The following function tests registerOrganisation().
     * It tests that:
        * it emits the orgaRegistered event
        * it reverts if orga was already registered
     */
    describe('#registerOrganisation() with orga1', function() {
        context('orga1 was not yet registred', function() {
            it('should emit orgaRegistered', async function() {
                let _orga1addr = organisations.orga1.address;
                let tx = await main.registerOrganisation({from: _orga1addr})
                await expectEvent(tx, 'orgaRegistered', {addressOrga: _orga1addr});
            })
        })
        context('orga1 is already registered', async function() {
            it('should revert', async function() {
                let _orga1addr = organisations.orga1.address;
                await expectRevert(
                    main.registerOrganisation({from: _orga1addr}),
                    'Organisation already registered')
            })
        })
    })

    /**
     * The following function tests addParticipant().
     * It tests that:
        * the event AddressWhitelisted is called
        * it reverts if the caller is not a registered orga
        * it reverts if the participant has already been whitelisted
     */
    describe('#addParticipant()', function() {
        context('with correct parameters', function() {
            it('should emit AddressWhitelisted for each address', async function () {
                let _orga1 = organisations.orga1;
                for (const member of Object.values(_orga1.members)) {
                    let tx = await main.addParticipant(_orga1.address, member, {from: _orga1.address});
                    await expectEvent(tx, 'AddressWhitelisted', {addressParticipant: member, addressOrganization: _orga1.address});
                }
            })
        })
        context('caller address is not the orga address', function() {
            it('it should revert', async function() {
                let _orga1addr = organisations.orga1.address;
                let _orga2 = organisations.orga2;
                await expectRevert(
                    main.addParticipant(_orga2.address, _orga2.members[0], {from: _orga1addr}), 
                    'You are not the owner of the organization')
            })
        }) 
        context('member address already been whitelisted', function() {
            it('it should revert', async function() {
                let _orga1 = organisations.orga1;
                await expectRevert(
                    main.addParticipant(_orga1.address, _orga1.members[0], {from: _orga1.address}), 
                    'Address already whitelisted for this organization')
            })
        }) 

    })

    /**
     * The following function tests participantIsWhiteListed()
     * It tests that:
     * it returns true if participant is in the whitelist
     * it returns false if the caller is not in the whitelist
     * it reverts if organisation givern by the caller is not yet registered
     */
    describe('#participantIsWhiteListed()', function() {
        context('with correct members address', function() {
            it('should return true for each member address', async function () {
                let _orga1 = organisations.orga1;
                for (const member of Object.values(_orga1.members)) {
                    let isWhitelisted = await main.participantIsWhiteListed(_orga1.address, {from: member});
                    assert.equal(isWhitelisted, true, `${member} is not in the whitelist`);
                }
            })
        }) 
        context('caller is not in the whitelist', function() {
            it('should return false', async function () {
                let _orga1 = organisations.orga1;
                let _orga2 = organisations.orga2;
                let isWhitelisted = await main.participantIsWhiteListed(_orga1.address, {from: _orga2.members[0]});
                assert.equal(isWhitelisted, false, `${_orga2.members[0]} is in the whitelist`);
            })
        }) 
        context('orga chosen is not registered', function() {
            it('should return revert', async function () {  
                let _orga1 = organisations.orga1;
                await expectRevert(
                    main.participantIsWhiteListed(unknownOrga, {from: _orga1.members[0]}),
                    'organisation not registered'
                )
            }) 
        })

    }) //end participantIsWhitelised

}) //end contract