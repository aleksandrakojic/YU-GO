# Avoiding Common Attacks

The steps and mesures we took to avoid common attacks and potential hacks of our smart contracts.

[Reference](https://solidity-by-example.org)

## Re-Entrancy

We use modifiers to prevent re-entrancy calls of payable functions in our contracts using the `nonReentrant` modifier from OpenZeppelin's `ReentrancyGuard` contract.

[Reference](https://docs.openzeppelin.com/contracts/4.x/api/security#ReentrancyGuard)
[Reference](https://solidity-by-example.org/hacks/re-entrancy/)
## Pausable

A common emergency response mechanism that can pause functionality while a remediation is pending..

[Reference](https://docs.openzeppelin.com/contracts/4.x/api/security#Pausable)

## Arithmetic Overflow and Underflow

We don't use `SaFeMath` from *@openzeppelin*  as we use upgraded solidity version [Solidity to 0.8.11](https://docs.soliditylang.org/en/v0.8.11/080-breaking-changes.html#) which has default behaviour to revert and throw and error on overflow and underflow.

[Reference](https://solidity-by-example.org/hacks/overflow/)

## Selfdestruct

An arbitrary contract could call `selfdestruct` to send all its remaining Ether stored in this contract to the  address of one of our contracts. This attack could impact the code using `address(this).balance`. 

[Reference](https://solidity-by-example.org/hacks/self-destruct/)


## Accessing Private Data

We do not store any sensitive and private data of our smart-contract and be able to get a hold on key information.

[Reference](https://solidity-by-example.org/hacks/accessing-private-data/)


## Delegatecall

We dot use directly `delegatecall`.

[Reference](https://solidity-by-example.org/hacks/delegatecall/)


## Source of Randomness

We do not use `block.timestamp` to compute a random number.

[Reference](https://solidity-by-example.org/hacks/randomness/)

## Denial of Service

We use **pull over push** that is the contract does not distribute/send the rewards to the winnners. They claim their prize themselves.

[Reference](https://solidity-by-example.org/hacks/denial-of-service/)

## Phishing with tx.origin

We do not use directly `tx.origin` in our contracts.

## Block Timestamp Manipulation

We dot use `block.timestamp` as a source of entropy or random number. Sometimes we do use it to check that a passed in date is one week from now, which is way greater than the ~13-15 seconds interval in between 2 Ethereum blocks.

[Reference](https://solidity-by-example.org/hacks/block-timestamp-manipulation/)