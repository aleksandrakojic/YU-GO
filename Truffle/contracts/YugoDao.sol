// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.11;

import "./interfaces/IYugo.sol";
import "./interfaces/IGrantEscrow.sol";

/**  
* @title Smart Contract for the DAO
* @notice This Smart contract is the center piece of the application.  
* @notice This contract allows you to create a contest, create an action, vote for an action, tally the votes  
*/
contract YugoDao {

    struct Organisation {
        address ethAddress;
        bool isRegistered;
        uint[] themes;
        uint country;
        mapping (address => bool) participants;
    }

    struct Theme {
        uint id;
        string name;
    }

    struct Country {
        uint id;
        string name;
    }

    struct Action {
        string name;
        uint voteNumber;
        uint requiredFunds;
        bool isCreated;
    }

    /**
    * @notice Contest
    * @dev A participant can only create one action
    */
    struct Contest {
        string name;    
        uint[] themeIDs;
        uint[] countryIDs;
        uint applicationEndDate;
        uint votingEndDate;
        uint fundsAvailable;
        bool isCreated;
        address[] winningActionAddresses;
        mapping(address => bool) hasVoted;
        mapping(address => Action) actions;
    }

    event OrganizationRegistered(address addressOrga);
    event ParticipantWhitelisted(address addressParticipant, address addressOrganization); 
    event ParticipantRemoved(address addressOrga, address addressParticipant);
    event ContestCreated(address addressOrga, string name, uint funds);
    event ActionCreated(address addressContestCreator, address addressActionCreator, string actionName, uint requiredFunds);
    event VoteTallied(address winner, string actionName, uint nbVotes, uint requiredFunds);
    event HasVotedForAction(address addressContestCreator, address addressActionCreator, address voterAddress); 
    event ActionDeleted(address addressContestCreator, address addressActioncreator, string actionName);

    mapping (address => Contest) contests;
    mapping (address => Organisation) organisation;
    mapping (uint => Country)  private countries;
    mapping (uint => Theme)  private thematics;

    string[] private themeList = [
        "education",
        "trafficking",
        "domestic violence",
        "women's movement",
        "campaigns",
        "roma women",
        "identity",
        "lobbing",
        "marginalized groups",
        "sexual harassment",
        "women's rights"
    ];

     string[] private countryList = [
        "Serbia",
        "Croatia",
        "Montenegro",
        "Bosnia and Hercegovina",
        "Slovenia",
        "Macedonia"
    ];

    IYugo public immutable yugo;
    IGrantEscrow public immutable escrow;

    /**
    * @notice Set smart contracts' address from migration
    * @param _yugo Address of the YugoToken contract
    * @param _escrow Address of the GrantEscrow contract
    */
    constructor(address _yugo, address _escrow) {
        setThematics();
        setCountries();
        yugo = IYugo(_yugo);
        escrow = IGrantEscrow(_escrow);
    }

    /**
    * @notice used when sender not authorized for an operation.
    */
    error Unauthorized();

   /**
    * @notice Modifier 
    * @dev Check if _account not equals sender then revert 
    */
    modifier onlyBy(address _account)
    {
        if (msg.sender != _account)
            revert Unauthorized();
        _;
    }

    /**
    * @notice Populate thematics array
    * @dev FOR TESTING : Only used in the controller, to initialise the thematics array. Should implement addThematics() so that the thematics are not fixed.
    */
    function setThematics() private {
        uint numThemes = themeList.length;
        for (uint i=0; i < numThemes-1; i++) {
            Theme memory theme;
            theme.id = i;
            theme.name = themeList[i];
            thematics[i] = theme;
        }
    }

    /**
    * @notice Populate thematics array
    * @dev Only used in the controller, to initialise the countries array.
    */
    function setCountries() private {
        uint numCountries = countryList.length;
        for (uint i=0; i < numCountries-1; i++) {
            Country memory country;
            country.id = i;
            country.name = countryList[i];
            countries[i] = country;
        }
    }

    /**
    * @notice Return the list of thematics
    * @return themeList List of thematics
    */
    function getThematics() external view returns(string[] memory) {        
        return themeList;
    }

    /**
    * @notice Return the list of countries
    * @return countryList List of countries
    */
    function getCountries() external view returns(string[] memory) {        
        return countryList;
    }
    
    /**
    * @notice Registers an Organisation
    * @dev Creates a mapping for the sender in organisation
    * @dev Emit OrganizationRegistered event
    * @param thematicIds List of thematics id
    * @param countryId Country id
    * 
    */
    function registerOrganisation(uint[] memory thematicIds, uint countryId) external {
        require(!organisation[msg.sender].isRegistered, 'Organisation already registered');
        require(thematicIds.length > 0 && countryId >= 0, 'You must provide thematics and country');
        organisation[msg.sender].ethAddress = msg.sender;
        organisation[msg.sender].themes = thematicIds;
        organisation[msg.sender].country = countryId;
        organisation[msg.sender].isRegistered = true;
        emit OrganizationRegistered(msg.sender);
    }

    /**
    * @notice Returns if organisation is registered
    * @dev - is executed by outside callers and internal functions
    * @param _orga Address of organisation
    * @return State of isRegistered, true if organisation is registered
    */
    function organisationRegistrationStatus(address _orga) public view returns(bool) {
        return organisation[_orga].isRegistered;
    }
    
    /**
    * @notice Returns true if the participant is whitelisted
    * @dev Can be called either by an organisation or a participant
    * @param _addrOrganisation  Organisation's address
    * @param _addrParticipant  Participant's address
    * @return True if the address exists, false if not
     */
    function participantIsWhiteListed(address _addrOrganisation, address _addrParticipant) external view returns(bool) {
        return organisation[_addrOrganisation].participants[_addrParticipant];
    }

    /**
    * @notice allows the organisation (msg.sender) to delete a member from its whitelist
    * @dev Emit ParticipantRemoved event
    * @param _addrToDelete  the ethAddress of the participant to be deleted 
    */
    function removeFromWhitelist(address _addrToDelete) external {
        require(organisation[msg.sender].participants[_addrToDelete]==true, 'the address you entered does not exist');
        delete organisation[msg.sender].participants[_addrToDelete];
        emit ParticipantRemoved(msg.sender, _addrToDelete);
    }

    /**
    * @notice Adds a particapants to a organisation
    * @dev Emit ParticipantWhitelisted event
    * @param _addrOrga address of organisation
    * @param _addrParticipant address of particapant 
    */
    function addParticipant(address _addrOrga, address _addrParticipant ) external {
        //TODO: verify with oracle _addrParticipant is not an organisation address
        require(organisation[_addrOrga].ethAddress == msg.sender, 'You are not the owner of the organization');
        require(!organisation[_addrOrga].participants[_addrParticipant], 'Address already whitelisted for this organization');
        organisation[_addrOrga].participants[_addrParticipant] = true;
        emit ParticipantWhitelisted(_addrParticipant, _addrOrga);
    }

    /**
    * @notice Add a contest
    * @dev Emit ContestCreated event
    * @param _name Name of the contest
    * @param _themeIds List of thematics IDs
    * @param _eligibleCountryIds List of country IDs
    * @param _applicationEndDate End Date of application period 
    * @param _votingEndDate End Date of voting period 
    * @param _funds Value of funds 
    */
    function addContest(string memory _name, uint[] memory _themeIds, uint[] memory _eligibleCountryIds, uint _applicationEndDate, uint _votingEndDate, uint _funds) external payable {
        require(yugo.balanceOf(msg.sender) > 0, "you need Yugo governance token to create a contest");
        require(!contests[msg.sender].isCreated, 'Organisation already created a contest');
        require(_funds == msg.value, "Amount of funds in escrow is different from the data you provided");
        contests[msg.sender].name = _name;
        contests[msg.sender].themeIDs = _themeIds;
        contests[msg.sender].countryIDs = _eligibleCountryIds;
        contests[msg.sender].applicationEndDate = _applicationEndDate;
        contests[msg.sender].votingEndDate = _votingEndDate;
        contests[msg.sender].fundsAvailable = _funds;
        contests[msg.sender].isCreated = true;
        (bool success,) = address(escrow).call{value: msg.value}(
            abi.encodeWithSignature("depositGrant(address)", msg.sender)
        );
        require(success, "Deposit failed.");
        // escrow.call{from: msg.sender, value: msg.value}("");
        emit ContestCreated(msg.sender, _name, _funds);
    }

    /**
    * @notice Creates an action
    * @dev Emit ActionCreated event
    * @param _creatorOfContest Address of creator 
    * @param _name Name of Action
    * @param _requiredFunds Value of funds
    */
    function createAction(address _creatorOfContest, string memory _name, uint _requiredFunds) external {
        // require(yugo.balanceOf(msg.sender) > 0, "you need Yugo governance token to create an action");
        uint currentTime = block.timestamp;
        require(currentTime < contests[_creatorOfContest].applicationEndDate, 'Voting has started. You cannot add a action');
        require(_creatorOfContest != msg.sender, 'Contest creator cannot propose actions');
        require(contests[_creatorOfContest].isCreated, 'This organization does not have open contest');
        require(!contests[_creatorOfContest].actions[msg.sender].isCreated, 'You have already created an action');
        require(_requiredFunds <= contests[_creatorOfContest].fundsAvailable, 'Funds required are superior to funds available');
       
        
        
        //Verify if action creator country is eligible to participate
        uint[] memory eligibleCountries = contests[_creatorOfContest].countryIDs;
        uint orgaCountry = organisation[msg.sender].country;
        bool countryFound=false;
        for (uint i=0; i<eligibleCountries.length; i++) {
            if(eligibleCountries[i]==orgaCountry){
                countryFound=true;
                break;
            }
        }
        //Verify at least one theme from the orga wanting to create an action is in the contest themes 
        uint[] memory eligibleThemes = contests[_creatorOfContest].themeIDs;
        uint[] memory orgaThemes = organisation[msg.sender].themes;
        bool themeFound=false;
        for (uint i=0; i<eligibleThemes.length; i++) {
            for (uint j=0; i<orgaThemes.length; i++) {
                if(eligibleThemes[i]==orgaThemes[j]){
                    themeFound=true;
                    break;
                }
            }
        }
        require(countryFound == true, "You are not eligible to participate in this contest");
        require(themeFound == true, "Themes of your organisation are not eligible for this contest");
        contests[_creatorOfContest].actions[msg.sender].name = _name;
        contests[_creatorOfContest].actions[msg.sender].requiredFunds = _requiredFunds;
        contests[_creatorOfContest].actions[msg.sender].isCreated = true;
        emit ActionCreated(_creatorOfContest, msg.sender, _name, _requiredFunds);
    }

    /**
    * @notice Deletes an action
    * @dev Emit ActionCreated event
    * @dev requires the msg.sender to be the action's owner
    * @dev can only be deleted before the application end date
    * @dev Struct Action is reinitialise before delete to avoid to avoid a sort of "pointer rewinding" effect
    * @param _creatorOfContest Address of creator 
    */
    function deleteActions(address _creatorOfContest) external {
        require(contests[_creatorOfContest].actions[msg.sender].isCreated, 'you did not create any action for this contest');
        uint currentTime = block.timestamp; //NOTE: test currentTime might change for check bool applicationsClosed == false
        require(currentTime < contests[_creatorOfContest].applicationEndDate, 'Votes have started.You cannot delete this action');
        string memory actionName = contests[_creatorOfContest].actions[msg.sender].name;
        contests[_creatorOfContest].actions[msg.sender] = Action('', 0, 0, false); 
        delete contests[_creatorOfContest].actions[msg.sender]; 
        emit ActionDeleted(_creatorOfContest, msg.sender, actionName);
    }

    /**
    * @notice Vote for a Action
    * @dev At each vote, we compare voteNumber of the winning Action with newly voted one. If truee, then push in array
    * @dev Emit HasVotedForAction event
    * @param _creatorOfContest Address of Contest creator 
    * @param _actionCreator Address of Action creator
    * @param _orgaOfMember Address of the participant's organisation
    */
    function voteForAction(address _creatorOfContest, address _actionCreator, address _orgaOfMember) external {
        uint currentTime = block.timestamp; //NOTE: test currentTime might change for check bool timeToVote == true
        require(currentTime >= contests[_creatorOfContest].applicationEndDate, 'Voting has not started');
        require(currentTime < contests[_creatorOfContest].votingEndDate, 'Voting is closed');
        require(msg.sender != _creatorOfContest && msg.sender != _actionCreator, 'You can not vote for this action');
        require(!contests[_creatorOfContest].hasVoted[msg.sender], 'You have already voted');
        require(yugo.balanceOf(_orgaOfMember) > 0, "you need Yugo governance token to create a contest");
        
        contests[_creatorOfContest].actions[_actionCreator].voteNumber += 1;
        contests[_creatorOfContest].hasVoted[msg.sender] = true;

        if(contests[_creatorOfContest].winningActionAddresses.length == 0){
            contests[_creatorOfContest].winningActionAddresses.push(_actionCreator);
        }else if(contests[_creatorOfContest].actions[contests[_creatorOfContest].winningActionAddresses[0]].voteNumber < contests[_creatorOfContest].actions[_actionCreator].voteNumber){
            delete contests[_creatorOfContest].winningActionAddresses;
            contests[_creatorOfContest].winningActionAddresses.push(_actionCreator);
        }else if(contests[_creatorOfContest].actions[contests[_creatorOfContest].winningActionAddresses[0]].voteNumber == contests[_creatorOfContest].actions[_actionCreator].voteNumber){
            contests[_creatorOfContest].winningActionAddresses.push(_actionCreator);
        }
        emit HasVotedForAction(_creatorOfContest, _actionCreator, msg.sender);
        delete currentTime;
    }

    /**
    * @notice Tally the vote
    * @dev Emit VoteTallied event
    * @param _creatorOfContest Address of Contest creator 
    */
    function tallyVotes(address _creatorOfContest) external view returns (address, string memory, uint, uint){
        //NOTE Future will allow multiple winners
        uint currentTime = block.timestamp;
        require(currentTime > contests[_creatorOfContest].votingEndDate, "Voting has not finished yet");
        address winner = contests[_creatorOfContest].winningActionAddresses[0];
        // emit VoteTallied(
        //     winner,
        //     contests[_creatorOfContest].actions[winner].name, 
        //     contests[_creatorOfContest].actions[winner].voteNumber, 
        //     contests[_creatorOfContest].actions[winner].requiredFunds
        //     );
        return (winner,
            contests[_creatorOfContest].actions[winner].name,
            contests[_creatorOfContest].actions[winner].voteNumber, 
            contests[_creatorOfContest].actions[winner].requiredFunds
        );
    }

    /**
    * @notice returns the first winner of the array winningActionAddresses
    * @dev used in interface IYugoDao
    * @param _creatorOfContest Address of Contest creator 
    */
    function getContestWinner(address _creatorOfContest) view public returns(address, uint) {
        address _winner = contests[_creatorOfContest].winningActionAddresses[0];
        uint _requiredFunds = contests[_creatorOfContest].actions[_winner].requiredFunds;
        return (_winner, _requiredFunds);
    }
    
}   