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

    mapping (uint => string) external Thematics;

    //::::::::::::::::::::::::::::::::::::::::::::::
    string test = "in Main.sol";
    function testConnection() public view returns(string memory) {
        return test;
    }
     //::::::::::::::::::::::::::::::::::::::::::::::

    function participantIsWhiteListed(address _addrParticipant) external view returns(bool) {
        return Organisations[msg.sender].participantIsOkay[_addrParticipant];
    }

    function whitelistMember(address _addrParticipant) external  {
        // require(Organisations[msg.sender].isRegistered == true );
        Organisations[msg.sender].participantIsOkay[_addrParticipant] = true;

    }

}   