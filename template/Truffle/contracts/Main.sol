// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.11;

contract Main {
    struct Participant {
        address ethAddress;
        address organisation;
        bool isRegistered;
    }

    struct Orga {
        string name;
        address ethAddress;
        bool isRegistered;
        mapping (address => bool) participantIsWhitelisted;
        mapping (address => Participant) participant;
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

    event OrganizationRegistered(address addressOrga);
    event AddressWhitelisted(address addressParticipant, address addressOrganization); 
    event RemovedFromWhitelist(address addressParticipant);

    mapping (address => Orga) organisations;
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

     function registerOrganisation(string memory name, uint[] memory thematicIds, uint countryId) external {
        require(organisations[msg.sender].isRegistered == false, 'Organisation already registered');
        require(thematicIds.length > 0, 'Organisation must have thematics');
        require(countryId >= 0, 'Organisation must have a country');
        organisations[msg.sender].ethAddress = msg.sender;
        organisations[msg.sender].isRegistered = true;
        organisations[msg.sender].themes = thematicIds;
        organisations[msg.sender].country = countryId;
        organisations[msg.sender].name = name;
        emit OrganizationRegistered(msg.sender);
    }

    //::::::::::::::::::::::::::::::::::::::::::::::
    string test = "in Main.sol";
    function testConnection() public view returns(string memory) {
        return test;
    }
     //::::::::::::::::::::::::::::::::::::::::::::::

    function participantIsWhiteListed(address _addrOrganisation) external view returns(bool) {
        require(organisations[_addrOrganisation].isRegistered == true, 'organisation not registered');
        return organisations[_addrOrganisation].participantIsWhitelisted[msg.sender];
    }

    function removeFromWhitelist(address _addrOrga) external {
        organisations[_addrOrga].participantIsWhitelisted[msg.sender] = false;
        emit RemovedFromWhitelist(msg.sender);
    }

    function addParticipant(address _addrOrga, address _addrParticipant ) external {
        require(organisations[_addrOrga].ethAddress == msg.sender, 'You are not the owner of the organization');
        require(!organisations[_addrOrga].participantIsWhitelisted[_addrParticipant], 'Address already whitelisted for this organization');
        organisations[_addrOrga].participantIsWhitelisted[_addrParticipant] = true;
        emit AddressWhitelisted(_addrParticipant, _addrOrga);
    }

}   