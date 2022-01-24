const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
// const { web3 } = require('@openzeppelin/test-helpers/src/setup');
// or:
var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider)
const { expect, assert } = require('chai');

contract('test', async function (accounts, provider) {
    // const _accounts = await web3.eth.accounts;
    // console.log(_accounts)
    const sign = await web3.eth.sign('test', accounts[0])
    console.log(sign)
    // console.log(web3)
//    console.log(await web3.eth.getBalance(accounts[0], 'latest', ));
//    console.log(web3.eth)
// var ethAccounts = ['0xabc', '0xdef', '0x123'];
//    function testCallback( value1, value2 ) {
//     console.log(value1 + ", " + value2 );
// }
// web3.eth.getBalance(accounts[0], undefined, testCallback );
// const privateKey = '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d';
// // const privateKey = '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318';
// const _signature = await web3.eth.accounts.sign('0x4a5c5d454721bbbb25540c3317521e71c373ae36458f960d2ad46ef088110e95', privateKey);
// console.log(_signature)
    // console.log(web3.getAccounts)
    // await accounts.forEach(function(a){ console.log(web3.fromWei(web3.eth.getBalance(a), 'ether')) })
    // console.log(web3.eth.accounts.wallet);
    // let expectedBalance = web3.utils.toBN(web3.toWei(3, 'ether'));
    // let actualBalance = await web3.eth.getBalance(accounts[1]);

    // assert.deepEqual(actualBalance, expectedBalance, "Balance incorrect!");
    // console.log(this.web3.getBalance.call(accounts[0]))
    // let bal = await web3.eth.getBalance(accounts[0])
    // console.log(bal)
    // let a = new BN(web3.utils.fromWei(web3.eth.getBalance('0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'),'ether')).toNumber();   
    // console.log(a)
    // console.log(web3.eth)
    // await web3.eth.getBalance(accounts[0],function(error,result){

    //     if(error){
    //        console.log(error)
    //     }
    //     else{
    //        console.log(Number(result))
    //     }
    //  });
    // console.log(bal)
    // let expectedBalance = web3.toBigNumber(web3.toWei(100, 'ether'));
    // let actualBalance = await web3.eth.getBalance(accounts[1]);
    // assert.deepEqual(actualBalance, expectedBalance, "Balance incorrect!");

    // console.log('a')
    // const rawBal0 = web3.eth.getBalance
    // (accounts[0])
    // console.log('b')
    // const bnBal0 = new BN(rawBal0)
    // console.log('c')
    // const bal0 = web3.utils.fromWei(bnBal0, "ether");
    // console.log('d')
    // console.log(bal0)
    // console.log('e')
})