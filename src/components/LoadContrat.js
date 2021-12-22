import contract from "@truffle/contract"

export const loadContract = async (name, Moralis) => {
    const res = await fetch(`/contracts/${name}.json`)
    const Artifact = await res.json()

    const _contractTruffle = contract(Artifact)
//   _contractTruffle.setProvider(provider)

    const deployedContract = await _contractTruffle.deployed()
    const web3 = await Moralis.enableWeb3();
    const contractAbi = Artifact.abi;
    const contractAddress = deployedContract.address;
    const contract = new web3.eth.Contract(contractAbi, contractAddress);       

  // return deployedContract
  return contract
}