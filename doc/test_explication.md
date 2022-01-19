# Tests

> This document explains for each test why we wrote it and  what it is aimed at.

## Test Environment

We are using:
- [OpenZeppelin test-helpers](https://docs.openzeppelin.com/test-helpers)
- truffle test as a test runner engine
- [chai](https://www.npmjs.com/package/chai) for our TDD assertions

We use the **`expect`** variant in our tests.

## Test Struture

We chose to use exclusively **javascript tests** instead of Solidity unit tests.  
They are **located** beneath the **`test`** folder.  
Each one tests a smart-contract with unit tests and integration tests when interacting with others.  
Inside the test, functions are grouped (using `describe`) by feature, or state or whatever is meaningfull for the reader of the test output depending on the contract.

We check the following for each key function of a smart-contract:
- **pre-requisites** (ie. `require`)
- **successful cases**
- **failure cases**

## Test YugoDao
Tests include:
- check all the steps of a voting session
- registration of a Organisation
- registration of a Particapant
- creation of a contest
- creation of actions for a contest
- check the step for voting
- various events emittion
- check the vote tally

## Test YugoManager
Tests include:
- setting up of Yugo and YuGoDao addresses in YugoManager
- checking that Yugo was pre-minted to YugoManager right at deployment
- the purchase of the Yugo token by the organisation
- the deposit of ETH in YugoManager before Yugo token can be claimed
- various events emittion

## Test GrantEscrow
Tests include:
- the deposit of grants in ETH
- The withdrawal of funds by winning organisation
