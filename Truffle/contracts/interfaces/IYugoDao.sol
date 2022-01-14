// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

interface IYugoDao {
    event OrganizationRegistered(address addressOrga);

    function registerOrganisation(uint[] memory thematicIds, uint countryId) external;
    function organisationRegistrationStatus(address _orga) external returns(bool);
}