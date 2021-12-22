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

    mapping (address => Orga) Organisations;

    mapping (uint => string) Thematics;

    //::::::::::::::::::::::::::::::::::::::::::::::
    string test = "in Main.sol";
    function testConnection() public view returns(string memory) {
        return test;
    }
     //::::::::::::::::::::::::::::::::::::::::::::::

     event IsWhitelisted(address participant, bool isWhitelisted);

    function participantIsWhiteListed(address _addrOrganisation, address _addrParticipant) external view returns(bool) {
        bool value = Organisations[_addrOrganisation].participantIsOkay[_addrParticipant];
        return value;
    }

    function whitelistMember(address _addrOrganisation, address _addrParticipant, bool _value) external  {
        // require(Organisations[msg.sender].isRegistered == true );
        // Organisations[msg.sender].participantIsOkay[_addrParticipant] = _value;
        Organisations[_addrOrganisation].participantIsOkay[_addrParticipant] = _value;
        emit IsWhitelisted(_addrParticipant, _value);

    }

}   