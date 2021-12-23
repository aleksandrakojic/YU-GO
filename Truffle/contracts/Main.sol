// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.25 <0.8.8;

contract Main {
    struct Participant {
        address ethAddress;
        address organisation;
        bool isRegistered;
    }

    struct Orga {
        address ethAddress;
        bool isRegistered;
        mapping (address => bool)  participantIsOkay;
        mapping (address => Participant) participant;
    }


    event AddressWhitelisted(address addressParticipant, address addressOrganization); 
    event removedFromWhitelist(address addressParticipant);

    mapping (address => Orga) organisations;

    mapping (uint => string)  thematics;

    function participantIsWhiteListed(address _addrOrganisation) external view returns(bool) {
        return organisations[_addrOrganisation].participantIsOkay[msg.sender];
    }

    function removeFromWhitelist(address _addrOrga) external {
        organisations[_addrOrga].participantIsOkay[msg.sender] = false;
        emit removedFromWhitelist(msg.sender);
    }

    function addParticipant(address _addrOrga, address _addrParticipant ) external {
        // require(organisations[_addrOrga].ethAddress == msg.sender, 'You are not the owner of the organization');
        // require( !organisations[_addrOrga].participantIsOkay[_addr], 'Address already whitelisted for this organization');
        organisations[_addrOrga].participantIsOkay[_addrParticipant] = true;
        emit AddressWhitelisted(_addrParticipant, _addrOrga);
    }

}   