// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IYugo.sol";
import "./interfaces/IYugoDao.sol";

/**
* @notice This smart contract allows you to purchase and claim your Yugo Token 
*/
contract YugoManager is Ownable {

    IYugo private yugo;
    IYugoDao private yugoDao;

    uint yugoTokenCost = 0.1 ether; 
    mapping (address => uint) EthLedger;
    mapping (address => bool) EligibleToClaimYugo;
    bool internal locked;
    bool private AllAddrSet;

    modifier noReentrant() {
        require(!locked, "No re-entrancy");
        locked = true;
        _;
        locked = false;
    }

    event YugoTransfer (address recipient, uint256 amount);
    event Received(address organisation, uint value);
    event TokenPurchasedBy(address organisation);
    event FundsTransferedToWinner(address organisation);
    event ContractsAddrSet(address yugo, address yugodao);

    // receive() external payable {
    //     purchaseYugo();
    // }

    /**
    * @notice Set smart contract addresses of YugoDao and VerifySignature
    * @param _yugo Address of YugoToken
    * @param _dao Address of YugoDao
    */
    function setContractsAddresses(address _yugo, address _dao) external onlyOwner {
        require(!AllAddrSet, "All contracts have already been set");
        AllAddrSet = true;
        yugo = IYugo(_yugo);
        yugoDao = IYugoDao(_dao);
        emit ContractsAddrSet(_yugo, _dao);
    }
        
     /**
    * @notice receives ETH
    * @dev verifies that the organisation is registered
    * @dev verifies that the caller did not purchase a token before (token are burned at subscription deadline). 
    * @dev verifies that the ETH sent equals the token price
    */
    receive() external payable {
        require(yugoDao.organisationRegistrationStatus(msg.sender) == true, 'you need to be registered to purchase the token');
        require(EthLedger[msg.sender] == 0, 'you have made a deposit');
        require(yugo.balanceOf(msg.sender) == 0, "you already purchased a token");
        require(msg.value == yugoTokenCost, "wrong ETH amount");
        EthLedger[msg.sender] = msg.value; // specifies that ETH was deposited
        EligibleToClaimYugo[msg.sender] = true; //specifies that Yugo can now be claimed by the caller
        emit Received(msg.sender, msg.value);
    }

    /**
    * @notice sends ETH to pay for the project expenditures, only the admin can call it.  
    * @param _to - the address of a staff member
    * @param _amount - the amount to send to the recipient
    * @dev requires success
    */
    function withdrawEth(address payable _to, uint _amount) public payable onlyOwner {
        (bool success, ) = _to.call{value: _amount}("");
        require(success, "Failed to send Ether");
    }

    /**
    * @notice checks the Yugo balance of an account
    * @return a balance type uint256
    */
    function yugoBalanceOf(address account) public view returns (uint256) {
        return yugo.balanceOf(account);
    }

    /**
    * @notice Checks if an organisation has purchased a token 
    * @return _ledgerState boolean true if organisation has purchased a yugo token
    */
    function hasEthDeposit() external view returns(bool _ledgerState) {        
        return EthLedger[msg.sender] == yugoTokenCost;
    }

    /**
    * @notice claim Yugo token 
    * @dev the ETH ledger of the caller must show that the token was purchased
    * @dev The Yugo Ledger of the caller must be at 0. <br />
    * Either because it is a first time purchase or because the period of validity of the token has passed
    * and must be renewed. <br />
    * @dev Re-entrancy - the noReentrant modifier ensures that the function can not
    * be run multiple times in parallel. The function is locked until it finishes.  <br />
    * @dev Pull-Over-Push - the token was not sent after purchase but the buyer was marked as 
    * eligible to claim the token. Afterwards, the condition of eligibility is updated before 
    * the transfer. 
    */
    function transferYugo() external noReentrant {
        require(EthLedger[msg.sender] == yugoTokenCost, "no ETH was received");
        require(EligibleToClaimYugo[msg.sender] == true, "You already received your Yugo");
        EligibleToClaimYugo[msg.sender] = false;
        uint256 amount = 1*10**yugo.decimals();
        yugo.transfer(msg.sender, amount);
        emit YugoTransfer(msg.sender, amount);
    }


    // TODO:function verifyByOracle orga

}