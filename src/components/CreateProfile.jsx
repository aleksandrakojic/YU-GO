import { Button, Input } from "antd";
import Text from "antd/lib/typography/Text";
import React, { useState } from "react";
import { useMoralis } from "react-moralis";

const styles = {
  card: {
    alignItems: "center",
    width: "50%",
  },
//   header: {
//     textAlign: "center",
//   },
//   input: {
//     width: "100%",
//     outline: "none",
//     fontSize: "16px",
//     whiteSpace: "nowrap",
//     overflow: "hidden",
//     textverflow: "ellipsis",
//     appearance: "textfield",
//     color: "#041836",
//     fontWeight: "700",
//     border: "none",
//     backgroundColor: "transparent",
//   },
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
};

function CreateProfile() {
    const { Moralis } = useMoralis();
    const initialValues = {
        lastname: "",                                    
        firstname: "", 
        email: "",
        tel:"",
        };

    const [values, setValues] = useState(initialValues);
    const [emailIsValid, setEmailIsValid] = useState(true);

    const onChange = (e) => {
        const { name, value } = e.target;
        setValues({
          ...values,
          [name]: value,
        });
      };

    const Submit = () => {
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!pattern.test(values.email)) {
            setEmailIsValid(false);
        }
        console.log('values:',values)
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

export default CreateProfile;
