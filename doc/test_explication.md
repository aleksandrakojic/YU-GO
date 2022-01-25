# Tests

> This document explains for each test why we wrote it and  what it is aimed at.

## Test Environment

We are using:
- [OpenZeppelin test-helpers](https://docs.openzeppelin.com/test-helpers)
- truffle test as a test runner engine
- [chai](https://www.npmjs.com/package/chai) for our TDD assertions

To lunch the test, in a terminal execute `nom run devchain` which will launch Ganache in determisitic mode to always get the same public and private keys.
In a second terminal, execute `truffle test --network develop`.

## Test Struture

We chose to use exclusively **javascript tests** instead of Solidity unit tests.  
They are **located** beneath the **`test`** folder.  
Each one tests a smart-contract with unit tests and integration tests when interacting with others.  
Inside the test, functions are grouped (using `describe`) by feature, or state or whatever is meaningfull for the reader of the test output depending on the contract.

We check the following for each key function of a smart-contract:
- **pre-requisites** (ie. `require`)
- **successful cases**
- **failure cases**

## Test BDD FULL
Tests the application's behavior from the end user's standpoint, such as:
- registration of a Organisation
- registration of a Particapant
- creation of a contest
- depositing funds in escrow
- creation of actions for a contest
- voting
- Tallying
_ Signature
- withdrawing funds from escrow
- all deadlines
- events 

## Test YugoManager functions
Tests include:
- setting up of Yugo and YuGoDao addresses in YugoManager
- checking that Yugo was pre-minted to YugoManager right at deployment
- the purchase of the Yugo token by the organisation
- the deposit of ETH in YugoManager before Yugo token can be claimed
- events

## Test GrantEscrow functions
Single check to test the modifier of the function depositGrant.

## Test deleteActions function of YugoDao
Tests include:
- funcitonning of the require
- event is emitted
