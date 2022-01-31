// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IYugoDao.sol";
import "./interfaces/IVerifySignature.sol";
import "hardhat/console.sol";

/**
* @notice This smart contracthandles the ETH deposited in escrow when a contest is created.
*/
contract GrantEscrow is Ownable {
    IYugoDao private yugodao;
    IVerifySignature private verifSign;

    bool private AllAddrSet;

    event AddressesSet(address yugodao, address verifySign);
    event GrantDeposited(uint grant, address depositor);
    event GrantWithdrawn(uint amountWithdrawn, address recipient, uint balanceBefore, uint balanceAfter);

    mapping(address => uint) public Grants;
    mapping (address =>  mapping (address => bool)) public UnlockFunds;

    modifier onlyRegisteredOrga(address _caller) {
        require(yugodao.organisationRegistrationStatus(_caller), 'You are not registered');
        _;
    }

    modifier restrictedToContracts() {
        require(msg.sender == address(yugodao) || msg.sender == address(verifSign) || msg.sender == address(this), 'Only trusted YUGO contracts can call this function');
        _;
    }

    // receive() external payable {
    //     depositGrant(msg.sender, msg.value);
    // } 

    /**
    * @notice Set smart contract addresses of YugoDao and VerifySignature
    * @param _dao Address of YugoDao
    * @param _verifSign Address of VerifySignature
    */
    function setContractsAddresses(address _dao, address _verifSign) external onlyOwner {
        require(!AllAddrSet, "All contracts have already been set");
        AllAddrSet = true;
        yugodao = IYugoDao(_dao);
        verifSign = IVerifySignature(_verifSign);
        emit AddressesSet(_dao, _verifSign);
    }

    /**
    * @notice Adds ETH in escrow
    * @dev only available for registered organisations
    * @dev function also called by fallback receive()
    */
    function depositGrant(address _contestCreator) external payable restrictedToContracts { //only internal, create another function pour call exterieur
        Grants[_contestCreator] = msg.value;
        emit GrantDeposited(msg.value, _contestCreator);
    }

    /**
    * @notice Withdraws grant from escrow. <br />
    * @dev only available for registered organisations.  <br />
    * @dev requires the Granter to have signed the transaction.  <br />
    * @param _contestCreator address of the organisation who created the contest.  <br />
    * @dev Re-entrancy - changing the state of unlockFunds in VerifySignature to false ensures that the function can not
    * be run multiple times in parallel. A second call would not pass the require.  
    */
    function withdrawGrant(address _contestCreator) external {
        console.log('In GrantEscrow.sol, msg.sender = ', msg.sender);
        (address _winner, uint _requiredFunds ) = yugodao.getContestWinner(_contestCreator);
        require(msg.sender == _winner, "you cannot withdraw, seems like you did not win the contest");
        require(UnlockFunds[_contestCreator][msg.sender], "You cannot withdraw the grant at this time; agreement is not yet signed");
        require(Grants[_contestCreator] >= _requiredFunds, 'Not enough funds left in grant');
        UnlockFunds[_contestCreator][msg.sender] = false;
        uint256 newContestCreatorBalance = Grants[_contestCreator] - _requiredFunds;
        uint newActionCreatorBalance = Grants[_contestCreator] - newContestCreatorBalance;
        Grants[_contestCreator] = newContestCreatorBalance;
        Grants[msg.sender] = newActionCreatorBalance;
        uint actionCreatorBalanceBefore = msg.sender.balance;
        (bool success, ) = msg.sender.call{value: Grants[msg.sender]}("");
        require(success, "Transfer failed.");
        uint actionCreatorBalanceAfter = msg.sender.balance;
        // payable(msg.sender).transfer(Grants[msg.sender]);
        emit GrantWithdrawn(newActionCreatorBalance , msg.sender, actionCreatorBalanceBefore,actionCreatorBalanceAfter );
    }

        /**
    * @notice Return the amount put in escrow by the contest creator
    * @param _contestCreator address of the organisation who created the contest 
    */
    function fundsInEscrow(address _contestCreator) view external returns(uint){
        return Grants[_contestCreator];
    }

     /**
    * @notice Set the authorisation to withdraw funds 
    * @dev can only be called by trusted contracts, in this case: VerifySignature.sol
    * @param _from The address of the Grant Orga 
    * @param _to The address of the recipient
    * @param _state true: the recipient can withdraw
    */
    function setWithdrawStatus(address _from, address _to, bool _state) public returns(bool) {
        require(msg.sender == address(verifSign), 'you are not authorised to call this function');
        UnlockFunds[_from][_to] = _state;
        return UnlockFunds[_from][_to];
    }

    /**
    * @notice Checks the boolean of mapping unlockFunds 
    * @dev called from GrantEscrow when claiming funds in escrow
    * @param _from The address of the Grant Orga 
    * @param _to The address of the recipient
    */
    function canWithdraw(address _from, address _to) public view returns(bool) {
        return UnlockFunds[_from][_to];
    }

}

