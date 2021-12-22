// SPDX-License-Identifier: MIT
pragma solidity >=0.4.25 <0.7.0;


contract Main {

    struct Voter {
        string firstName;
        string lastName;
        string mail;
    }

    struct Organization {
      string name;
      address owner;
      mapping(address => Voter) registeredVoter;
      address[] whiteList;
    }

    struct Action {
      string name;
      string description;
      uint budget;
      address[] voters;
    }

    struct Concours {
        Organization parentOrg;
        Action[] actions;
        uint256 tsActionRegistrationStart;
        uint256 tsActionRegistrationEnd;
        uint256 tsVotingStart;
        uint256 tsVontingEnd;
        address[] whiteList;
    }

    struct Localization {
        string name;
    }

    struct Themes {
        string name;
    }


    event LocalisationAdded(string name);
    event ThemesAdded(string name);
    event ActionAdded(address ownerAddress); 

    event AdressWhitelisted(address voterAddress, uint idOrganization); 
    event VoterRegistered(address voterAddress); 
    event OrganizationRegistered(address ownerAddress);
    event Voted(address voterAddress); 

    Organization[] organizations;
    Theme[] themes;
    Localization[] localizations;



    /*modifier onlyVoters() { 
        require(voters[msg.sender], "You're not a voter");
        _;
    }*/

    
    ////////////////// GET //////////////////

    function getLocalizations() external view returns (Localization[] memory) {
        return localizations;
    }

    function getOrganizations() external view returns (Organization[] memory) {
        return organizations;
    }

    function getThemes() external view returns (Themes[] memory) {
        return themes;
    }

    /////////////////////////////////////////


    function checkOrgaWhitelistForAddress(uint _idOrga, address _addr) internal returns (bool) {
        bool found = false;
        for(uint i = 0; i<= organizations[_idOrga].whiteList.length - 1 ; i++){
            if(organizations[_idOrga].whiteList[i]) == _addr{
                found = true;
            }
        }
        return found;
    }


    function addLocalization(string _name) external { //securité a faire
        Localization memory localization;
        localization.name = _name;
    }

    function addTheme(string _name) external { //securité a faire
        Theme memory theme;
        theme.name = _name;
    }

    function addVoter(address _addr, uint _idOrga) external {
        require(organizations[_idOrga].owner == msg.sender, 'You are not the owner of the organization');
        require( !checkOrgaWhitelistForAddress(_idOrga, _addr), 'Address already whitelisted for this organization');
        organizations[_idOrga].whiteList.push(_addr);
        emit AdressWhitelisted(_addr, _idOrga);
    }

    /*function addActionToConcours(address _addr, uint _idConcour) external {
        require(organizations[_idOrga].owner == msg.sender, 'You are not the owner of the organization');
        require( !checkOrgaWhitelistForAddress(_idOrga, _addr), 'Address already whitelisted for this organization');

        Theme memory theme;
        organizations[_idOrga].whiteList.push(_addr);
        emit AdressWhitelisted(_addr, _idOrga);
    }*/








    function registerVoter(uint _idOrga, string _firstname, string _lastname, string _mail) external {
        require( checkOrgaWhitelistForAddress(_idOrga, msg.sender), 'Address is not whitelisted');
        Voter memory voter;
        voter.firstname = _firstname;
        voter.lastname = _lastname;
        voter.mail = _mail;

        organizations[_idOrga].registeredVoter[msg.sender] = voter;
        emit VoterRegistered(_addr);
    }



}