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

## `test/main.test.js`
