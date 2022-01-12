// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.11;

import "./IYugo.sol";
/**  @title Smart Contract for the DAO
*    @notice This Smart contract stores all vote history 
*/
contract YugoDao {

    struct Organisation {
        string name;
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
        uint availableFunds;
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
    event VoteTallied(address addressContestCreator, address[] addressActionCreator, uint nbVotes);
    event HasVotedForAction(address addressContestCreator, address addressActionCreator, address voterAddress); 

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

    // IYugo public yugo;

    constructor() {
        setThematics();
        setCountries();
        // yugo = IYugo(_Yugo);
    }

    

    /**
    * @dev Sender not authorized for this operation.
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
    function getThematics() public view returns(string[] memory) {        
        return themeList;
    }


    /**
    * @notice Return the list of countries
    * @return countryList List of countries
    */
    function getCountries() public view returns(string[] memory) {        
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
        //require(yugo.balanceOf(msg.sender) == 1*10**yugo.decimals());
        require(!organisation[msg.sender].isRegistered, 'Organisation already registered');
        require(thematicIds.length > 0, 'Organisation must have thematics');
        require(countryId >= 0, 'Organisation must have a country');
        organisation[msg.sender].ethAddress = msg.sender;
        organisation[msg.sender].themes = thematicIds;
        organisation[msg.sender].country = countryId;
        organisation[msg.sender].isRegistered = true;
        emit OrganizationRegistered(msg.sender);
    }

    /**
    * @notice Returns if organisation is registered
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
    function addContest(string memory _name, uint[] memory _themeIds, uint[] memory _eligibleCountryIds, uint _applicationEndDate, uint _votingEndDate, uint _funds) external {
        // TODO: verify if balance of gouv token is > 0 in metamask
        require(!contests[msg.sender].isCreated, 'Organisation already created a contest');
        contests[msg.sender].name = _name;
        contests[msg.sender].themeIDs = _themeIds;
        contests[msg.sender].countryIDs = _eligibleCountryIds;
        contests[msg.sender].applicationEndDate = _applicationEndDate;
        contests[msg.sender].votingEndDate = _votingEndDate;
        contests[msg.sender].availableFunds = _funds;
        contests[msg.sender].isCreated = true;
        emit ContestCreated(msg.sender, _name, _funds);
    }


    /**
    * @notice Creates a action
    * @dev Emit ActionCreated event
    * @param _creatorOfContest Address of creator 
    * @param _name Name of Action
    * @param _requiredFunds Value of funds
    */
    function createAction(address _creatorOfContest, string memory _name, uint _requiredFunds) external {
        // TODO : theme verification
        uint[] memory eligilibleCountries = contests[_creatorOfContest].countryIDs;
        uint orgaCountry = organisation[_creatorOfContest].country;
        bool countryFound=false;
        for (uint i=0; i<eligilibleCountries.length; i++) {
            if(eligilibleCountries[i]==orgaCountry){
                countryFound=true;
                break;
            }
        }
        require(countryFound == true, "You are not eligible to participate in this contest");
        require(contests[_creatorOfContest].isCreated, 'This organization does not have open contest');
        require(!contests[_creatorOfContest].actions[msg.sender].isCreated, 'You have already created an action');
        contests[_creatorOfContest].actions[msg.sender].name = _name;
        contests[_creatorOfContest].actions[msg.sender].requiredFunds = _requiredFunds;
        contests[_creatorOfContest].actions[msg.sender].isCreated = true;
        emit ActionCreated(_creatorOfContest, msg.sender, _name, _requiredFunds);
    }

    function actionStatus(address _contestCreator, address _actionCreator) external view returns(bool){
        return contests[_contestCreator].actions[_actionCreator].isCreated;
    }

    // TODO: function deleteActions() {}


    /**
    * @notice Vote for a Action
    * @dev At each vote, we compare voteNumber of the winning Action with newly voted one. If tie, then push in array
    * @dev Emit HasVotedForAction event
    * @param _contestCreator Address of Contest creator 
    * @param _actionCreator Address of Action creator
    */
    function voteForAction(address _contestCreator, address _actionCreator) external {
        // TODO: verify if its time to vote
        require(msg.sender != _contestCreator && msg.sender != _actionCreator, 'You can not vote for this action');
        require(!contests[_contestCreator].hasVoted[msg.sender], 'You have already voted');
        
        
        contests[_contestCreator].actions[_actionCreator].voteNumber += 1;
        contests[_contestCreator].hasVoted[msg.sender] = true;

        if(contests[_contestCreator].winningActionAddresses.length == 0){
            contests[_contestCreator].winningActionAddresses.push(_actionCreator);
        }else if(contests[_contestCreator].actions[contests[_contestCreator].winningActionAddresses[0]].voteNumber < contests[_contestCreator].actions[_actionCreator].voteNumber){
            delete contests[_contestCreator].winningActionAddresses;
            contests[_contestCreator].winningActionAddresses.push(_actionCreator);
        }else if(contests[_contestCreator].actions[contests[_contestCreator].winningActionAddresses[0]].voteNumber == contests[_contestCreator].actions[_actionCreator].voteNumber){
            contests[_contestCreator].winningActionAddresses.push(_actionCreator);
        }

        emit HasVotedForAction(_contestCreator, _actionCreator, msg.sender);
    }
    

    /**
    * @notice Tally the vote
    * @dev Emit VoteTallied event
    * @param _contestCreator Address of Contest creator 
    */
    function tallyVote(address _contestCreator) external {
        // TODO: tallying votes with time counter / controller / check only callable from manager
        require(block.timestamp > contests[_contestCreator].votingEndDate, "Voting has not finished yet");

        emit VoteTallied(_contestCreator, contests[_contestCreator].winningActionAddresses, contests[_contestCreator].actions[contests[_contestCreator].winningActionAddresses[0]].voteNumber);
    }


    //TODO: pool of liquidity from contest's creator



}   