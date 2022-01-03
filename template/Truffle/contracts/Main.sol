// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.11;

contract Main {

    struct Organisation {
        string name;
        address ethAddress;
        bool isRegistered;
        mapping (address => bool) participants;
        uint[] themes;
        uint country;
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
        mapping(address => bool) hasVoted;
        uint requiredFunds;
        bool isCreated;
    }

    struct Contest {
        string name;
        mapping(address => Action) actions;
        uint[] themeIDs;
        uint[] countryIDs;
        uint applicationEndDate;
        uint votingEndDate;
        uint availableFunds;
        bool isCreated;
    }

    event OrganizationRegistered(address addressOrga);
    event ParticipantWhitelisted(address addressParticipant, address addressOrganization); 
    event ParticipantRemoved(address addressOrga, address addressParticipant);
    event ContestCreated(address addressOrga, string name, uint funds);
    event ActionCreated(address addressContestCreator, address addressActionCreator, string actionName, uint requiredFunds);
    event hasVotedForAction(address addressContestCreator, address addressActionCreator, address voterAddress); // demande LIam ?

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

    constructor() {
        setThematics();
        setCountries();
    }

    // Sender not authorized for this operation.
    error Unauthorized();

    // Prepends a check that only passes
    // if the function is called from
    // a certain address.
    modifier onlyBy(address _account)
    {
        if (msg.sender != _account)
            revert Unauthorized();
        _;
    }

    function setThematics() private {
        uint numThemes = themeList.length;
        for (uint i=0; i < numThemes-1; i++) {
            Theme memory theme;
            theme.id = i;
            theme.name = themeList[i];
            thematics[i] = theme;
        }
    }

    function setCountries() private {
        uint numCountries = countryList.length;
        for (uint i=0; i < numCountries-1; i++) {
            Country memory country;
            country.id = i;
            country.name = countryList[i];
            countries[i] = country;
        }
    }

    function getThematics() public view returns(string[] memory) {        
        return themeList;
    }

    function getCountries() public view returns(string[] memory) {        
        return countryList;
    }

     function registerOrganisation(uint[] memory thematicIds, uint countryId) external {
         // TODO: send token of gouvernance to metamask
        require(!organisation[msg.sender].isRegistered, 'Organisation already registered.');
        require(thematicIds.length > 0, 'Organisation must have thematics');
        require(countryId >= 0, 'Organisation must have a country');
        organisation[msg.sender].ethAddress = msg.sender;
        organisation[msg.sender].themes = thematicIds;
        organisation[msg.sender].country = countryId;
        organisation[msg.sender].isRegistered = true;
        emit OrganizationRegistered(msg.sender);
    }
    
    /**
    * @notice this function returns true if the participant is whitelisted
    * @notice it can be called either by an organisation or a participant
    * @param _addrOrganisation - organisation's address
    * @param _addrParticipant - participant's address
    * @return true if the address exists, false if not
     */
    function participantIsWhiteListed(address _addrOrganisation, address _addrParticipant) external view returns(bool) {
        return organisation[_addrOrganisation].participants[_addrParticipant];
    }

    /**
    * @notice allows the organisation (msg.sender) to delete a member from its whtelist
    * @param _addrToDelete - the ethAddress of the participant to be deleted 
     */
    function removeFromWhitelist(address _addrToDelete) external {
        require(organisation[msg.sender].participants[_addrToDelete]==true, 'the address you entered does not exist');
        delete organisation[msg.sender].participants[_addrToDelete];
        emit ParticipantRemoved(msg.sender, _addrToDelete);
    }

    function addParticipant(address _addrOrga, address _addrParticipant ) external {
        require(organisation[_addrOrga].ethAddress == msg.sender, 'You are not the owner of the organization');
        require(!organisation[_addrOrga].participants[_addrParticipant], 'Address already whitelisted for this organization');
        organisation[_addrOrga].participants[_addrParticipant] = true;
        emit ParticipantWhitelisted(_addrParticipant, _addrOrga);
    }

    function addContest(string memory _name, uint[] memory _themeIds, uint[] memory _eligibleCountryIds, uint _applicationEndDate, uint _votingEndDate, uint _funds) external {
        // TODO: verify if balance of gouv token is > 0 in metamask
        require(!contests[msg.sender].isCreated, 'Organisation already created a contest.');
        contests[msg.sender].name = _name;
        contests[msg.sender].themeIDs = _themeIds;
        contests[msg.sender].countryIDs = _eligibleCountryIds;
        contests[msg.sender].applicationEndDate = _applicationEndDate;
        contests[msg.sender].votingEndDate = _votingEndDate;
        contests[msg.sender].availableFunds = _funds;
        contests[msg.sender].isCreated = true;
        emit ContestCreated(msg.sender, _name, _funds);
    }

    function createAction(address _creatorOfContest, string memory _name, uint _requiredFunds) external {
        // TODO : add country and theme verification
        require(contests[msg.sender].isCreated, 'This organization does not have open contest.');
        require(!contests[_creatorOfContest].actions[msg.sender].isCreated, 'You have already created an action.');
        contests[_creatorOfContest].actions[msg.sender].name = _name;
        contests[_creatorOfContest].actions[msg.sender].requiredFunds = _requiredFunds;
        emit ActionCreated(_creatorOfContest, msg.sender, _name, _requiredFunds);
    }

    function voteForAction(address _contestCreator, address _actionCreator) external {
        // TODO: verify if its time to vote
        require(msg.sender != _contestCreator && msg.sender != _actionCreator, 'You can not vote for this action');
        require(!contests[_contestCreator].actions[_actionCreator].hasVoted[msg.sender], 'You have already voted!');
        contests[_contestCreator].actions[_actionCreator].voteNumber += 1;
        contests[_contestCreator].actions[_actionCreator].hasVoted[msg.sender] = true;
        emit hasVotedForAction(_contestCreator, _actionCreator, msg.sender);
    }
    
    // TODO: function for tallying votes with time counter / controller 
}   