// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IVerifySignature{

    function getMessageHash(
            address _to,
            uint _amount,
            string memory agreement,
            uint _nonce
        ) external pure returns (bytes32);

    function canWithdraw(
        address _from, 
        address _to
        ) external view returns(bool);
}