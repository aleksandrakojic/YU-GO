# Design Pattern Decisions

This section explains why we chose the design patterns we are using in the code. 


- Behavioral Patterns
    - [x] **Guard Check**: Ensure that the behavior of a smart contract and its input parameters are as expected.
    - [ ] State Machine: Enable a contract to go through different stages with different corresponding functionality exposed.
    - [ ] **Oracle**: Gain access to data stored outside of the blockchain.
    - [x] **State Machine**: Enable a contract to go through different stages with different corresponding functionality exposed.
    - [ ] Randomness: Generate a random number of a predefined interval in the deterministic environment of a blockchain.
- Security Patterns
    - [x] **Access Restriction**: Restrict the access to contract functionality according to suitable criteria.
    - [ ] Checks Effects Interactions: Reduce the attack surface for malicious contracts trying to hijack control flow after an external call.
    - [ ] Secure Ether Transfer: Secure transfer of ether from a contract to another address.
    - [x] **Pull over Push**: Shift the risk associated with transferring ether to the user.
    - [ ] Emergency Stop: Add an option to disable critical contract functionality in case of an emergency.
- Upgradeability Patterns
    - [ ] Proxy Delegate: Introduce the possibility to upgrade smart contracts without breaking any dependencies.
    - [ ] Eternal Storage: Keep contract storage after a smart contract upgrade.
- Economic Patterns
    - [ ] String Equality Comparison: Check for the equality of two provided strings in a way that minimizes average gas consumption for a large number of different inputs.
    - [ ] Tight Variable Packing: Optimize gas consumption when storing or loading statically-sized variables.
    - [ ] Memory Array Building: Aggregate and retrieve data from contract storage in a gas efficient way.

[Reference](https://fravoll.github.io/solidity-patterns/)

## Bahavioral Patterns

### Guard Check

See Access Restriction

### Oracle

Oracle functions:
- verification / proof of existance of a organization before entering the DAO
## Crypto-Currency

We use **ETH** as a crypto-currency.

## Security Patterns

### Access Restriction

We restrict access to key functions of our smart-contracts where only the registered paticipant ie. the verified registerd organization of Yu-Go DAO, can access them.  
Only the owner of the `YuGo` contract can call the functions to set the address of the third party contracts :
- `NewContract`: `setOracleAddress` 
Only the owner of the `YuGo` contract can call ... :
- (...)
- (...)

We use a *Guard Check Pattern** via `onlyOwner` of [Openzeppelin's `Ownable` contract](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.0.0/contracts/access/Ownable.sol) for this purpose.

[Reference](https://fravoll.github.io/solidity-patterns/access_restriction.html)

## Pull over Push

We use *Pull over Push* so that players handle withdrawal (stake, gains) on their own.

[Reference](https://fravoll.github.io/solidity-patterns/pull_over_push.html)

## Tech

### Solidity version 0.8

We have decided to switch to the latest Solidity version (0.8.11) since OpenZeppelin supports it.  
This version brings in native handling of arithmetic overflow and underflow and reverts the transaction in this case. 
We don't use risky `SafeMath` library.

### Repository and Source Code

We have a **mono-repo, that** is a single repository.
It has **the frontend** source code which communicates with **the backend** code hosted on [Moralis sever](https://moralis.io/)

### Deployment

The ReactJS **front-end** (DApp) is automatically **[deployed on Moralis](../README.md#deploy-front-end)** each time the ~~`master`~~ `front-test` branch is pushed.
