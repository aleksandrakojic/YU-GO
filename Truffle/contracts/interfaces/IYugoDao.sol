// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IYugoDao {
    
    event OrganizationRegistered(address addressOrga);

    function registerOrganisation(uint[] memory thematicIds, uint countryId) external;
    function organisationRegistrationStatus(address _orga) external returns(bool);
    function getContestWinner(address _creatorOfContest) view external returns(address, uint);
    function getConfidentialData(address _creatorOfContest) view external returns(uint, string memory);  
}