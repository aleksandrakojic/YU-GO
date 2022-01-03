// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {


    constructor () ERC20("Yugo", "YG") {
        // TODO: Meilleur distribution des tokens, envoyer au manager ? 
        _mint(msg.sender, 300); 
    
    }

    function burn(address _account, uint256 _amount) public onlyOwner {
        _burn(_account, _amount);
    }
}