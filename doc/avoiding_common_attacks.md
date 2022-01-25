# Avoiding Common Attacks

The steps and mesures we took to avoid common attacks and potential hacks of our smart contracts.

# Tools
We used our knowledge combined with tools sush as Slither and Mythril to find vulnerabilites in our contracts.

[Reference](https://solidity-by-example.org)

## Re-Entrancy

We extensively use checks ('require') and modifiers to prevent re-entrancy calls of payable functions and some non-payable functions in our contracts. Our modifiers are similar to the `nonReentrant` modifier from OpenZeppelin's `ReentrancyGuard` contract.

[Reference](https://docs.openzeppelin.com/contracts/4.x/api/security#ReentrancyGuard)
[Reference](https://solidity-by-example.org/hacks/re-entrancy/)

## Signature Replay
A replay attack is when a signed message is reused to claim authorization for a second action. In Yugo, before the final transfer, a document must be signed “off-chain”. Hence, the problem is that the same signature might be used multiple times to execute that function. Obviously, This can be harmful if the signer's intention was to approve a transaction once. Yugo solves this problem by having the document signed with a nonce; as well as the contract address to prevent "cross-contract replay" attacks.

[reference](https://docs.soliditylang.org/en/v0.8.11/solidity-by-example.html#creating-the-signature)

## Pausable

A common emergency response mechanism that can pause functionality while a remediation is pending. We use this pattern to pause the minting of Yugo Token.

[Reference](https://docs.openzeppelin.com/contracts/4.x/api/security#Pausable)

## Arithmetic Overflow and Underflow

We don't use `SaFeMath` from *@openzeppelin*  as we use upgraded solidity version [Solidity to 0.8.11](https://docs.soliditylang.org/en/v0.8.11/080-breaking-changes.html#) which has default behaviour to revert and throw and error on overflow and underflow.

[Reference](https://solidity-by-example.org/hacks/overflow/)

## Selfdestruct

An arbitrary contract could call `selfdestruct` to send all its remaining Ether stored in this contract to the  address of one of our contracts. This attack could impact the code using `address(this).balance`. Therefore, in YUGO, we do not rely on that but rather we store values in mappings (address => uint) with the address of the caller as key.

[Reference](https://solidity-by-example.org/hacks/self-destruct/)


## Accessing Private Data

YUGO does not store any sensitive and private data. Only essential data to contracts are stored, such as Public Keys of Users.

[Reference](https://solidity-by-example.org/hacks/accessing-private-data/)


## Delegatecall

We dot use `delegatecall`.

[Reference](https://solidity-by-example.org/hacks/delegatecall/)


## Source of Randomness

We do not use `block.timestamp` to compute a random number.

[Reference](https://solidity-by-example.org/hacks/randomness/)

## Denial of Service

We use **pull over push** that is the contract does not distribute/send the rewards to the winnners. They claim their prize themselves. Examples in YugoManager.sol or GrantEscrow.sol.

[Reference](https://solidity-by-example.org/hacks/denial-of-service/)

## Phishing with tx.origin

We do not use directly `tx.origin` in our contracts.

## Block Timestamp Manipulation

We dot use `block.timestamp` as a source of entropy or random number. We use it to check that a deadline has passed, which is way greater than the ~13-15 seconds interval in between 2 Ethereum blocks.

[Reference](https://solidity-by-example.org/hacks/block-timestamp-manipulation/)