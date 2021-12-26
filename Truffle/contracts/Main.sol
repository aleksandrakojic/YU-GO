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

    mapping (address => Orga) organisations;

    mapping (uint => string)  thematics;

    //::::::::::::::::::::::::::::::::::::::::::::::
    string test = "in Main.sol";
    function testConnection() public view returns(string memory) {
        return test;
    }
     //::::::::::::::::::::::::::::::::::::::::::::::

    function participantIsWhiteListed(address _addrParticipant) external view returns(bool) {
        // require(organisations[msg.sender].ethAddress, 'not an orga address');
        return organisations[msg.sender].participantIsOkay[_addrParticipant];
    }

    // function whitelistMember(address _addrOrganisation, address _addrParticipant, bool _value) external  {
    //     // require(Organisations[msg.sender].isRegistered == true );
    //     organisations[msg.sender].participantIsOkay[_addrParticipant] = true;

    // }

    function addParticipant(address _addrOrga, address _addr ) external {
        //require(organisations[_addrOrga].ethAddress == msg.sender, 'You are not the owner of the organization');
        //require( !organisations[_addrOrga].participantIsOkay[_addr], 'Address already whitelisted for this organization');
        organisations[_addrOrga].participantIsOkay[_addr] = true;
        emit AddressWhitelisted(_addr, _addrOrga);
    }

}   