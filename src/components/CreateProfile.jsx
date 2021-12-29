import { Button, Input, Dropdown, Menu } from "antd";
import { DownOutlined } from '@ant-design/icons';
import Text from "antd/lib/typography/Text";
import React, { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
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
  }
};

export default function CreateProfile() {
    const { Moralis } = useMoralis();
    const { networks, abi } = contractInfo;
    const contractAddress = networks[1337].address; //1337
    const [isWhitelisted, setIsWhitelisted] = useState(null)
    const [contract, setContract] = useState(null)
    const [account, setAccount] = useState(null)
    const [userRegistered, setUserRegistered] = useState(false)
    const initialValues = {
        lastname: "",                                    
        firstname: "", 
        email: "",
        tel:"",
        orga: "",
        };
    const [inputValues, setInputValues] = useState(initialValues);
    const [emailIsValid, setEmailIsValid] = useState(true);

    const orgList = {
        0: {className: "Organisations",id: "ZDOcTqfhWadYVU7vhn68qPsl",_objCount: 2, attributes: {name: 'orgaOne', ethAddress: "0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0"}, updatedAt: ''}, 
        1: {className: "Organisations",id: "ZDOcTqfhWadYVU7vhn68qPsl",_objCount: 2, attributes: {name: 'orgaTwo', ethAddress: "0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b"}, updatedAt: ''}, 
        2: {className: "Organisations",id: "ZDOcTqfhWadYVU7vhn68qPsl",_objCount: 2, attributes: {name: 'orgaThree', ethAddress: "0xE11BA2b4D45Eaed5996Cd0823791E0C93114882d"}, updatedAt: ''}, 
    }

    const loadContract = async () => {
        const web3 = await Moralis.enableWeb3();
        const contract = new web3.eth.Contract(abi, contractAddress); 
        console.log('contract', contract);   
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        return contract
    }

    useEffect(() => {
        const LoadContract = async () => {
            const _contract= await loadContract()
            setContract(_contract)
        }
        LoadContract()
    }, [])

    const onChange = (e) => {
        const { name, value } = e.target;
        setInputValues({
          ...inputValues,
          [name]: value,
        });
      };
    
    //|::::: handling the Dropdown with Antd :::::
    const menus = Object.entries(orgList).map((item, i) => {
        // console.log('item[1]', item[1])
        return (
            <Menu.Item key={i}>
            {item[1].attributes.name}
            {/* {key[1].country} */}
            </Menu.Item>
        )
    });
    const menu = () => {
            return (
            <Menu onClick={handleMenuClick} mode="vertical">
                {menus}
            </Menu>
            )
    }

    const handleMenuClick = (e) => {
        console.log('in handleMenuClick', orgList[e.key].attributes.ethAddress)
        setInputValues({
            ...inputValues,
            orga: orgList[e.key].attributes.ethAddress,
          });
        };
    //|::::::::::::::::::::::::::::::::::::::::::::

    const Submit = () => {
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!pattern.test(inputValues.email)) {
            setEmailIsValid(false);
        } else {
            registerParticipant();
        }
    }

    const registerParticipant = async () => {
        // const currentUser = Moralis.User.current();
        // if (!currentUser) {
        //     // authenticate({ signingMessage: "new user!" })
        //     Moralis.authenticate().then(function (user) {
        //         console.log(user.get('ethAddress'))
        //     })
        // } else {
        //     console.log('currentUser', currentUser)
        // }
        
        //check if currentUser already in DB
        const Users = Moralis.Object.extend("Participants");
        const query = new Moralis.Query(Users);
        const results = await query.find();
        console.log('results', results)
        // const results = await query.find();
        // console.log(results[0].attributes.name);
        // const _isWhitelisted = await contract.methods.participantIsWhiteListed(
        //     inputValues.orga )
        //     // .send({from: account})
        //     .send({from: account})
        // console.log('whitelisted', _isWhitelisted)

       
        

        // if address in whitelist save data Moralis DB
        // const Participants = await Moralis.Object.extend("Participants");
        // const participant = await new Participants();
        // await Moralis.authenticate().then(function (user) {
        //     console.log(user.get('ethAddress'))
        //     participant.set("ethAddress", user.get('ethAddress'))
        //     participant.save();
        // })
        
        // console.log('results',results)
        // Object.entries(results).map((item, i) => {
        //     console.log('item',item)
        // })
        console.log('in registerParticipant',inputValues)
    }
       

    return (
        <div style={styles.card}>
         
            <div style={styles.select}>
                <div style={styles.textWrapper}>
                        <Text strong>Nom:</Text>
                </div>
                <Input
                    size="medium"
                    name = "lastname" //IMPORTANT
                    onChange={onChange}
                />
            </div>

            <div style={styles.select}>
                <div style={styles.textWrapper}>
                        <Text strong>Prénom:</Text>
                </div>
                <Input
                    size="medium"
                    name = "firstname"
                    onChange={onChange}
                />
            </div>

            <div style={styles.select}>
                <div style={styles.textWrapper}>
                        <Text strong>E-mail:</Text>
                </div>
                <Input
                    size="medium"
                    name = "email"
                    onChange={onChange}
                />
            </div>
            { !emailIsValid ?
                    <Text type="danger">adresse email invalide</Text> :
                    <></>
                }

            <div style={styles.select}>
                <div style={styles.textWrapper}>
                        <Text strong>Tel. (Optional):</Text>
                </div>
                <Input
                    size="medium"
                    name = "tel"
                    onChange={onChange}
                />
            </div>

            <Dropdown overlay={menu} >
                {/* <Button>
                    Select your organisation <DownOutlined />
                </Button> */}
                <a className="ant-dropdown-link" style={styles.dropdown} name="orga" onClick={handleMenuClick}>
                Select your organisation <DownOutlined />
                </a>
            </Dropdown>
     
                <div className='userRegistered'>
                    { !userRegistered ?
                        <></> : 
                        <Text type="danger">You are already registered</Text>
                    }
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


