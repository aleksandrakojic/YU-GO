// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IYugo.sol";
import "./IYugoDao.sol";

// interface IYugo {
//     function balanceOf(address account) external view returns (uint256);
// }

contract YugoManager is Ownable {

    IYugo public yugo;
    IYugoDao public yugoDao;

    uint yugoTokenCost = 100000000000000000; //0.1 ETH
    mapping (address => uint) EthLedger;

    // event AddressSet (address addrSetTo, address setter);
    event YugoTransfer (address recipient, uint256 amount);
    event Received(address organisation, uint value);
    event TokenPurchasedBy(address organisation);
    event FundsTransferedToWinner(address organisation);
    event ContractsAddrSet(address yugo, address yugodao);

    /**
    * @notice receives ETH
    * @dev verifies that the organisation is registered
    * @dev verifies that the caller did not purchase a token before
    * @dev verifies that the ETH sent equals the token price
    */
    receive() external payable {
        require(yugoDao.organisationRegistrationStatus(msg.sender) == true, 'you need to be registered to purchase the token');
        require(yugo.balanceOf(msg.sender) == 0, "you already purchased a token");
        require(msg.value == yugoTokenCost, "you do not have enough ETH");
        // require(msg.value > 0);
        address sender = msg.sender;
        uint deposited = msg.value;
        // receiver = owner;
        EthLedger[sender] = deposited;
        // receiver.transfer(deposited);
        emit Received(msg.sender, msg.value);
    }

    /**
    * @notice sends ETH to pay the platform staff, only the admin can call it
    * @param _to - the address of a staff member
    * @dev requires success
    */
    function sendEth(address payable _to) public payable onlyOwner {
        bool sent = _to.send(msg.value);
        require(sent, "Failed to send Ether");
    }

    // /**
    // * @notice set the address of the Yugo contract for use with its interface 
    // * @param _addy - the address of the Yugo contract
    // */
    // function setYugoAddress(address _addy) external onlyOwner {
    //     yugo = IYugo(_addy);
    //     emit AddressSet(_addy, msg.sender);
    // }

    // /**
    // * @notice set the address of the YugoDao contract for use with its interface 
    // * @param _addydao - the address of the YugoDao contract
    // */
    // function setYugoDaoAddress(address _addydao) external onlyOwner {
    //     yugoDao = IYugoDao(_addydao);
    //     emit AddressSet(_addydao, msg.sender);
    // }

    /**
    * @notice checks the Yugo balance of an account
    * @return a balance type uint256
    */
    function yugoBalanceOf(address account) public view returns (uint256) {
        return yugo.balanceOf(account);
    }

    function setContractsAddresses(address _yugo, address _dao) external onlyOwner {
        yugo = IYugo(_yugo);
        yugoDao = IYugoDao(_dao);
        emit ContractsAddrSet(_yugo, _dao);
    }

    /**
    * @notice Pull over Push: claim Yugo token 
    * @dev the ledger's balance of the caller must show that the token was purchased
    */
    function transferYugo() external {
        require(EthLedger[msg.sender] == yugoTokenCost, "no ETH was received");
        uint256 amount = 1*10**yugo.decimals();
        yugo.transfer(msg.sender, amount);
        emit YugoTransfer(msg.sender, amount);
    }

    /**
    * @notice transfers funds to winning organisation
    */
    function transferWinningOrganisation() external {
        //TODO
    }

    // TODO:function verifyByOracle orga

}