# Design Pattern Decisions

This section explains why we chose the design patterns we are using in the code. 


- Behavioral Patterns
    - [ ] **Inheritance**: We do not use inheritance as it creates unnecessary complications.
    - [x] **Guard Check**: Ensure that the behavior of a smart contract and its input parameters are as expected.
    - [ ] **Oracle**: Gain access to data stored outside of the blockchain.
    - [x] **State Machine**: Enable a contract to go through different stages with different corresponding functionality exposed.
    - [ ] Randomness: Generate a random number of a predefined interval in the deterministic environment of a blockchain.
- Security Patterns
    - [x] **Access Restriction**: Restrict the access to contract functionality according to suitable criteria.
    - [x] Checks Effects Interactions: Reduce the attack surface for malicious contracts trying to hijack control flow after an external call.
    - [x] Secure Ether Transfer: Secure transfer of ether from a contract to another address.
    - [x] **Pull over Push**: Shift the risk associated with transferring ether to the user.
    - [x] Emergency Stop: Add an option to disable critical contract functionality in case of an emergency.
- Upgradeability Patterns
    - [ ] Proxy Delegate: Introduce the possibility to upgrade smart contracts without breaking any dependencies.
    - [ ] Eternal Storage: Keep contract storage after a smart contract upgrade.
- Economic Patterns
    - [ ] String Equality Comparison: Check for the equality of two provided strings in a way that minimizes average gas consumption for a large number of different inputs.
    - [x] Tight Variable Packing: Optimize gas consumption when storing or loading statically-sized variables.
    - [ ] Memory Array Building: Aggregate and retrieve data from contract storage in a gas efficient way.

[Reference](https://fravoll.github.io/solidity-patterns/)

## Bahavioral Patterns

### Inheritance

Inheritance requires people to jump between multiple files to understand what a program is doing, and requires people to understand the rules of precedence in case of conflicts (which class’ function X is the one that’s actually used?). Hence, it makes the code too complicated to understand. We call functions of trusted contracts and those functions have different names to avoid conflicts.

[reference](https://consensys.net/diligence/blog/2019/06/a-case-against-inheritance-in-smart-contracts/)

### Guard Check (Checks-Effects-Interactions)

We make extensive use of "modifier" and "require" to check that all conditions are met to safely execute a function. In our functions, checks are performed first. In a second step, if all the checks have succeeded, the effects on the state variables of the current contract are carried out. The interaction with other contracts is the very last stage of our functions.

### Oracle

Oracle functions:
- verification / proof of existance of a organization before entering the DAO.

### State Machine
mapping are extensively used as our states keepers, in conjounctions with our guard checks.

## Crypto-Currency

We use **ETH** as a crypto-currency.

## Security Patterns

### Access Restriction

- We restrict access to key functions of our smart-contracts where only the registered paticipant ie. the verified registerd organization of Yu-Go DAO, can access them.  
- Only the individual deploying the contracts the contracts can call the setAddress functions to set the address of the other contracts.
- Some functions can only be called by a contract from Yugo.

We also use Ownable d'Open Zeppelin [Openzeppelin's `Ownable` contract](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.0.0/contracts/access/Ownable.sol) and its onlyOwner modifier.

[Reference](https://fravoll.github.io/solidity-patterns/access_restriction.html)

## Pull over Push

The Yugo Governance Token is not sent after purchase but the buyer has been marked as eligible to claim it. During the claiming process, the eligibility requirement is updated before the transfer, so the token cannot be claimed a second time. Application example: the transferYugo function in the YugoManager contract.

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

