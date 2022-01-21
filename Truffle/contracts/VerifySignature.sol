// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import {utils} from "./libraries/utils.sol";
import "./interfaces/IYugoDao.sol";

/**
* @notice This smart contract handles the signature of an agreement, confirming that the winner can claim the price.
*/
contract VerifySignature is Ownable {
    
    struct Confidential {
            string agreement;
            uint nonce;
            bytes32 msgHash;
            bytes32 signature;
        }

    IYugoDao private yugodao;

    bool private yugoAddrSet;

    event YugoDaoAddrSet(address yugodao);

    mapping(address => mapping (address => Confidential)) private confidentials;
    mapping( address => mapping (address => bool)) private unlockFunds;
    
    /**
    * @notice Set the address of teh YugoDao contract <br />
    * @dev Only the account deploying can call this function <br />
    * @dev require boolean yugoAddrSet to be false <br />
    * @dev yugoAddrSet is updated to true to avoid any further attempt to change the address
    * @param _dao YugoDao contract address
    */
    function setYugoDaoAddress(address _dao) external onlyOwner {
        require(!yugoAddrSet, "yugo address has already been set");
        yugoAddrSet = true;
        yugodao = IYugoDao(_dao);
        emit YugoDaoAddrSet(_dao);
    }

    /**
    * @notice Set the address of teh YugoDao contract <br />
    * @dev Only the account deploying can call this function <br />
    * @dev require boolean yugoAddrSet to be false <br />
    * @dev yugoAddrSet is updated to true to avoid any further attempt to change the address <br />
    * @param _to Address of the recipient 
    * @param _amount Funds required by the action 
    * @param _agreement Agreement unsigned 
    * @param _nonce The secret number used for the hash 
    * @return Hash as a Bytes32
    */
    function getMessageHash(
        address _to,
        uint _amount,
        string memory _agreement,
        uint _nonce
    ) public returns (bytes32) {
        confidentials[msg.sender][_to].agreement = _agreement;
        confidentials[msg.sender][_to].nonce = _nonce;
        bytes32 _msgHash = keccak256(abi.encodePacked(_to, _amount, _agreement, _nonce));
        confidentials[msg.sender][_to].msgHash = _msgHash;
        return _msgHash;
    }

    /**
    * @notice Adds "Ethereum Signed Message" to the hash
    * @param _messageHash The hash from getMEssageHash 
    * @return Hash as a Bytes32
    */
    function getEthSignedMessageHash(bytes32 _messageHash)
        public
        pure
        returns (bytes32)
    {
 
        return
            keccak256(
                abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash)
            );
    }

    /**
    * @notice Allows the Grant Orga to claim the funds in escrow
    * @param _to Address of the recipient 
    * @param _amount Funds required by the action 
    * @param _agreement Agreement unsigned 
    * @param _nonce The secret number used for the hash 
    * @param signature The hash signed fy teh Grant Orga 
    * @return True if msg.sender is the signer
    */
    function verify(
        address _to,
        uint _amount,
        string memory _agreement,
        uint _nonce,
        bytes memory signature
    ) public returns (bool) {
        bytes32 messageHash = getMessageHash(_to, _amount, _agreement, _nonce);
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);

        if (recoverSigner(ethSignedMessageHash, signature) == msg.sender) {
            unlockFunds[msg.sender][_to] = true;
            return true;
        } else {
            return false;
        }
    }


    /**
    * @notice Recover the signer of a hash
    * @param _ethSignedMessageHash The first part of the signature
    * @param _signature The hash signed by the Grant Orga 
    * @return the signer
    */
    function recoverSigner(bytes32 _ethSignedMessageHash, bytes memory _signature)
        public
        pure
        returns (address)
    {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);

        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    /**
    * @notice Function to split the signature
    * @param sig The hash signed by the Grant Orga 
    */
    function splitSignature(bytes memory sig)
        public
        pure
        returns (
            bytes32 r,
            bytes32 s,
            uint8 v
        )
    {
        require(sig.length == 65, "invalid signature length");

        assembly {
            /*
            First 32 bytes stores the length of the signature

            add(sig, 32) = pointer of sig + 32
            effectively, skips first 32 bytes of signature

            mload(p) loads next 32 bytes starting at the memory address p into memory
            */

            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }

        // implicitly return (r, s, v)
    }

    /**
    * @notice Checks the boolean of mapping unlockFunds 
    * @dev called from GrantEscrow when claiming funds in escrow
    * @param _from The address of the Grant Orga 
    * @param _to The address of the recipient
    */
    function canWithdraw(address _from, address _to) external view returns(bool) {
        return unlockFunds[_from][_to];
    }
}
