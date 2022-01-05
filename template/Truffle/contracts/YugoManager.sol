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

    uint yugoTokenCost = 500000000000000000; //0.5 ETH
    mapping (address => uint) EthLedger;

    event AddressSet (address addrSetTo, address setter);
    event YugoTransfer (address recipient, uint256 amount);
    event Received(address, uint);

    function deposit(address _addrOrga, uint _eth) public payable {
        require(_eth > 0);
        address sender = _addrOrga;
        uint deposited =_eth;
        // receiver = owner;
        EthLedger[sender] = deposited;
        // receiver.transfer(deposited);
        emit Received(_addrOrga, _eth);
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

    function purchaseToken() external payable {
        require(yugoDao.organisationRegistrationStatus(msg.sender) == true, 'you need to be registered to purchase the token');
        require(yugo.balanceOf(msg.sender) == 0, "you already purchased a token");
        require(msg.value == yugoTokenCost, "you do not have enough ETH");
        // require(!EthLedger)
        deposit(msg.sender, msg.value);
        _transferYugo(msg.sender);
    }

    function _transferYugo(address _orga) internal {
        require(EthLedger[_orga] == yugoTokenCost, "no ETH was received");
        uint256 amount = 1*10**yugo.decimals();
        yugo.transfer(_orga, amount);
        emit YugoTransfer(_orga, amount);
    }

    // function transferWinninAction() {}

    // function verifyByOracle

}