import { Button, Input, Dropdown, Menu } from "antd";
import { DownOutlined } from '@ant-design/icons';
import Text from "antd/lib/typography/Text";
import React, { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";

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

    const { Moralis } = useMoralis();

    const initialValues = {
        lastname: "",                                    
        firstname: "", 
        email: "",
        tel:"",
        orga: "",
        };

    const orgList = {
        0: {className: "Organisations",id: "ZDOcTqfhWadYVU7vhn68qPsl",_objCount: 2, attributes: {name: 'orgaOne', ethAddress: "0x61962Ca1467A0e7ba06787784336DaBE792Be29b"}, updatedAt: ''}, 
        1: {className: "Organisations",id: "ZDOcTqfhWadYVU7vhn68qPsl",_objCount: 2, attributes: {name: 'orgaTwo', ethAddress: "0x51dE42454f3A50848e65bEDE6141Db788a9bCc5D"}, updatedAt: ''}, 
        2: {className: "Organisations",id: "ZDOcTqfhWadYVU7vhn68qPsl",_objCount: 2, attributes: {name: 'orgaThree'}, updatedAt: ''}, 
    }

    const [values, setValues] = useState(initialValues);
    const [emailIsValid, setEmailIsValid] = useState(true);

    const onChange = (e) => {
        const { name, value } = e.target;
        setValues({
          ...values,
          [name]: value,
        });
        console.log(values)
      };
    
    //|::::: handling the Dropdown with Antd :::::
    const menus = Object.entries(orgList).map((item, i) => {
        console.log('item[1]', item[1])
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
        console.log(orgList[e.key].attributes.ethAddress)
        setValues({
            ...values,
            orga: orgList[e.key].attributes.ethAddress,
          });
        };

    //|::::::::::::::::::::::::::::::::::::::::::::

    const Submit = () => {
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!pattern.test(values.email)) {
            setEmailIsValid(false);
        } else {
            registerParticipant();
        }
    }

    const registerParticipant = async () => {
        //get instance of Participants object, if Participants table does not exist it creates it
        const Participants = await Moralis.Object.extend("Participants");
        const participant = await new Participants();
        //check address is in whitelist
        // if address in whitelist save data in SC and Moralis DB
        // await Moralis.authenticate().then(function (user) {
        //     console.log(user.get('ethAddress'))
        //     participant.set("ethAddress", user.get('ethAddress'))
        //     participant.save();
        // })
        const organisations = Moralis.Object.extend("Organisations");
        const query = new Moralis.Query(organisations);
        const results = await query.find();
        console.log(results[0].attributes.name);
        console.log('results',results)
        Object.entries(results).map((item, i) => {
            console.log('item',item)
            // console.log('item[i]',item[i])
        })
        console.log('in registerParticipant',values)
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


