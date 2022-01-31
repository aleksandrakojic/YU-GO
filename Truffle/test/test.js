const { web3 } = require("@openzeppelin/test-helpers/src/setup");

contract("test", async function (accounts) {

it('print balance', async function () {
    let actionCreator = accounts[1]
    const balance = await web3.eth.getBalance(actionCreator);
    console.log('balance :', balance)
})


})
