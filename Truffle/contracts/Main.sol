// SPDX-License-Identifier: GPL-3.0
pragma solidity  0.8.11;

contract Main {
    struct Participant {
        address ethAddress;
        address organisation;
        bool isRegistered;
    }

    struct Orga {
        address ethAddress;
        bool isRegistered;
        mapping (address => bool) participantIsWhitelisted;
        mapping (address => Participant) participant;
    }

    event orgaRegistered(address addressOrga);
    event AddressWhitelisted(address addressParticipant, address addressOrganization); 
    event removedFromWhitelist(address addressParticipant);

    mapping (address => Orga) private organisations;
    mapping (uint => string) private thematics;

    function registerOrganisation() external {
        require(organisations[msg.sender].isRegistered == false, 'Organisation already registered');
        organisations[msg.sender].ethAddress = msg.sender;
        organisations[msg.sender].isRegistered = true;
        emit orgaRegistered(msg.sender);
    }

    function participantIsWhiteListed(address _addrOrganisation) external view returns(bool) {
        require(organisations[_addrOrganisation].isRegistered == true, 'organisation not registered');
        return organisations[_addrOrganisation].participantIsWhitelisted[msg.sender];
    }

    function removeFromWhitelist(address _addrOrga) external {
        organisations[_addrOrga].participantIsWhitelisted[msg.sender] = false;
        emit removedFromWhitelist(msg.sender);
    }

    function addParticipant(address _addrOrga, address _addrParticipant ) external {
        require(organisations[_addrOrga].ethAddress == msg.sender, 'You are not the owner of the organization');
        require(!organisations[_addrOrga].participantIsWhitelisted[_addrParticipant], 'Address already whitelisted for this organization');
        organisations[_addrOrga].participantIsWhitelisted[_addrParticipant] = true;
        emit AddressWhitelisted(_addrParticipant, _addrOrga);
    }


}   