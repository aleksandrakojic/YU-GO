// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./interfaces/IYugoDao.sol";

contract GrantEscrow {
    IYugoDao private yugodao;

    bool private signatureVerified = true; //TODO: VerifySignature.sol

    event GrantDeposited(uint grant, address depositor);
    event GrantWithdrawn(uint grant, address recipient);

    mapping(address => uint) public Grants;

    constructor(address _YugoDao) {
        yugodao = IYugoDao(_YugoDao);
    }

    modifier onlyRegisteredOrga() {
        require(yugodao.organisationRegistrationStatus(msg.sender), 'You are not registered');
        _;
    }

    receive() external payable {
        depositGrant();
    }

    /**
    * @notice Adds ETH in escrow
    * @dev only available for registered organisations
    * @dev Emit GrantDeposited event
    */
    function depositGrant() public payable onlyRegisteredOrga {
        Grants[msg.sender] = msg.value;
        emit GrantDeposited(msg.value, msg.sender);
    }

    /**
    * @notice Withdraws grant from escrow
    * @dev only available for registered organisations
    * @dev requires the Granter to have signed the transaction
    * @param _contestCreator address of the organisation who created the contest
    * @dev Re-entrancy - changing the state of signatureVerified to false ensures that the function can not
    * be run multiple times in parallel. A second call would not pass the require.  
    */
    function withdrawGrant(address _contestCreator) external onlyRegisteredOrga {
        // TODO: verify() msg is signed for msg.sender
        require(signatureVerified, "You cannot withdraw the grant at this time");
        signatureVerified = false;
        //TODO: amount = required funds in Action
        uint256 amount = Grants[_contestCreator];
        payable(msg.sender).transfer(amount);
        emit GrantWithdrawn(amount, msg.sender);
    }

}

