// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IYugoDao.sol";
import "./interfaces/IVerifySignature.sol";

contract GrantEscrow is Ownable {
    IYugoDao private yugodao;
    IVerifySignature private verifSign;

    event AddressesSet(address yugodao, address verifySign);
    event GrantDeposited(uint grant, address depositor);
    event GrantWithdrawn(uint grant, address recipient);

    mapping(address => uint) Grants;
    mapping (address =>  mapping (address => bool)) UnlockFunds;

    function setContractsAddresses(address _dao, address _verifSign) external onlyOwner {
        yugodao = IYugoDao(_dao);
        verifSign = IVerifySignature(_verifSign);
        emit AddressesSet(_dao, _verifSign);
    }

    modifier onlyRegisteredOrga(address _orga) {
        require(yugodao.organisationRegistrationStatus(_orga), 'You are not registered');
        _;
    }

    receive() external payable {
        depositGrant(msg.sender, msg.value);
    } 

    /**
    * @notice Adds ETH in escrow
    * @dev only available for registered organisations
    * @dev Emit GrantDeposited event
    */
    function depositGrant(address _orga, uint _amount) public payable onlyRegisteredOrga(_orga) {
        Grants[_orga] = _amount;
        emit GrantDeposited(_amount, _orga);
    }

    /**
    * @notice Withdraws grant from escrow
    * @dev only available for registered organisations
    * @dev requires the Granter to have signed the transaction
    * @param _contestCreator address of the organisation who created the contest
    * @dev Re-entrancy - changing the state of signatureVerified to false ensures that the function can not
    * be run multiple times in parallel. A second call would not pass the require.  
    */
    function withdrawGrant(address _contestCreator) external onlyRegisteredOrga(msg.sender) {
        // TODO: verify() msg is signed for msg.sender
        (address _winner, uint _requiredFunds ) = yugodao.getContestWinner(_contestCreator);
        require(msg.sender == _winner, "you cannot withdraw, seems like you did not win the contest");
        require(verifSign.canWithdraw(_contestCreator, msg.sender), "You cannot withdraw the grant at this time; agreement is not yet signed");
        //TODO: pass boolean back to false
        payable(msg.sender).transfer(_requiredFunds);
        emit GrantWithdrawn(_requiredFunds, msg.sender);
    }

    function fundsInEscrow(address _contestCreator) view external returns(uint){
        return Grants[_contestCreator];
    }

}

