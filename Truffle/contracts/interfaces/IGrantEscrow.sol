// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IGrantEscrow {

    event GrantDeposited(uint grant, address depositor);
    event GrantWithdrawn(uint grant, address recipient);

    function depositGrant(address _depositor, uint _amount) external payable;
    function withdrawGrant(address _contestCreator) external;
    function fundsInEscrow(address _contestCreator) view external returns(uint);
    function setWithdrawStatus(address _from, address _to, bool _state) external returns(bool);
    function canWithdraw(address _from, address _to) external view returns(bool);
}