// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

interface IYugoManager {
    
    function yugoBalanceOf(address account) external view returns (uint256);
}