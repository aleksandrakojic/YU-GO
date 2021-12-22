import { Button, Input, Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import React, { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
// import { loadContract } from "./LoadContract";
import contract from "@truffle/contract";
import contractInfo from "contracts/Main.json";

const styles = {
  card: {
    alignItems: "center",
    width: "50%",
  },
  select: {
    marginTop: "20px",
    display: "flex",
    alignItems: "center",
  },
  textWrapper: { maxWidth: "80px", width: "100%" },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexDirection: "row",
  },
  dropdown: {
    width: "50%",
    marginTop: "20px",
    display: "flex",
    alignItems: "center",
  },
};

export default function CreateProfile() {
  // useEffect(() => {
  //     const fetchData = async() => {
  //         try {
  //             const organisations = Moralis.Object.extend("Organisations");
  //             const query = new Moralis.Query(organisations);
  //             orgList= await query.find();
  //         } catch (error) {
  //             console.log("error", error);
  //             }
  //     }
  //     fetchData();
  // },[]);
  // let orgList = {};

  const [accounts, setAccounts] = useState([]);

  const { contractName, networks, abi } = contractInfo;
  const contractAddress = networks[1337].address; //1337
  console.log(contractAddress);

  const loadContract = async (name) => {
    const web3 = await Moralis.enableWeb3();
    const contract = new web3.eth.Contract(abi, contractAddress);
    console.log("contract", contract);
    const accounts = await web3.eth.getAccounts();
    setAccounts(accounts);
    console.log("account", accounts[0]);

    return contract;
  };

  const [contract, setContract] = useState(null);

  useEffect(() => {
    console.log("in useEffect");
    const LoadContract = async () => {
      const _contract = await loadContract("Main");
      console.log("in effect", _contract);
      setContract(_contract);
    };
    LoadContract();
  }, []);

  const { Moralis } = useMoralis();
  console.log("contract", contract);

  const [values, setValues] = useState("");

  const onChange = (e) => {
    setValues(e.target.value);
  };

  const Submit = () => {
    addParticipant();
  };

  const addParticipant = async () => {
    //get instance of Participants object, if Participants table does not exist it creates it
    console.log(values);
    const add = await contract.methods
      .addParticipant(accounts[0], values)
      .send({ from: accounts[0] });
    //cgeck address in User DB
    //if no, check if address is in whitelist

    console.log("return", add);
  };

  return (
    <div style={styles.card}>
      <div style={styles.select}>
        <div style={styles.textWrapper}>
          <Text strong>Address:</Text>
        </div>
        <Input
          size="medium"
          name="address" //IMPORTANT
          onChange={onChange}
        />
      </div>

      <Button
        type="primary"
        size="large"
        style={{ width: "100%", marginTop: "25px" }}
        onClick={() => Submit()}
      >
        Submit
      </Button>
    </div>
  );
}
