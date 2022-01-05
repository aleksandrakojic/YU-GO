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

    event AddressSet (address addrSetTo, address setter);
    event YugoTransfer (address recipient, uint256 amount);
    event Received(address organisation, uint value);
    event TokenPurchasedBy(address organisation);

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

    function sendEth(address payable _to) public payable onlyOwner {
        bool sent = _to.send(msg.value);
        require(sent, "Failed to send Ether");
    }

    function setYugoAddress(address _addy) external onlyOwner {
        yugo = IYugo(_addy);
        emit AddressSet(_addy, msg.sender);
    }

    function setYugoDaoAddress(address _addydao) external onlyOwner {
        yugoDao = IYugoDao(_addydao);
        emit AddressSet(_addydao, msg.sender);
    }

    function yugoBalanceOf(address account) public view returns (uint256) {
        return yugo.balanceOf(account);
    }

    // function purchaseToken() external payable {
    //     require(yugoDao.organisationRegistrationStatus(msg.sender) == true, 'you need to be registered to purchase the token');
    //     require(yugo.balanceOf(msg.sender) == 0, "you already purchased a token");
    //     require(msg.value == yugoTokenCost, "you do not have enough ETH");
    //     // require(!EthLedger)
    //     _deposit(msg.sender, msg.value);
    //     // _transferYugo(msg.sender);
    //     emit TokenPurchasedBy(msg.sender);
    // }

    function transferYugo() external {
        require(EthLedger[msg.sender] == yugoTokenCost, "no ETH was received");
        uint256 amount = 1*10**yugo.decimals();
        yugo.transfer(msg.sender, amount);
        emit YugoTransfer(msg.sender, amount);
    }

    // function transferWinningAction() {}

    // function verifyByOracle

}