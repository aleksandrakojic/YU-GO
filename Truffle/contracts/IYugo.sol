// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

interface IYugo {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function decimals() external view returns (uint8);
}