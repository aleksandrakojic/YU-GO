import { Card, Typography, Input, Button} from "antd";
import React, { useState } from 'react';
import { useMoralis } from "react-moralis";

export default function CreateProfile() {
    const { Moralis } = useMoralis();
    const { Text } = Typography;
    const { TextArea } = Input;
    const [state, setState] = useState({
                                        firstname: '', 
                                        lastname: '',
                                        email: '',
                                        tel:'',
                                    });
    
    const onChange = (e) => {
        const value = e.target.value;
        setState({
                ...state,
                [e.target.personalInfo]: value
            });
        console.log(value)
    }
    
    const emailHasCorrectFormat = () => {
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!pattern.test(state.email)) {
            alert('email has wrong format')
        }
    }

    const styles = {
        title: {
            fontSize: "20px",
            fontWeight: "700",
        },
        text: {
            fontSize: "16px",
        },
        card: {
            boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
            border: "1px solid #e7eaf3",
            borderRadius: "0.5rem",
        },
    };

    return (
            <div style={{ display: "flex", gap: "10px" }}>
                <Card
                    style={styles.card}
                    title={
                    <>
                        <Text strong>Créez votre profile Membre</Text>
                    </>
                    }
                >
                    <Input
                        value={state.firstname}
                        placeholder="Enter you firstname"
                        personalInfo = "firstname"
                        onChange={onChange}
                        autoSize={{ minRows: 1, maxRows: 2 }}
                        />
                    <TextArea
                        value={state.lastname}
                        placeholder="Enter you lastname"
                        personalInfo = "lastname"
                        onChange={onChange}
                        autoSize={{ minRows: 1, maxRows: 2 }}
                        />
                    <TextArea
                        value={state.email}
                        placeholder="Enter you e-mail"
                        personalInfo = "email"
                        onChange={onChange}
                        autoSize={{ minRows: 1, maxRows: 2 }}
                        />
                    <TextArea
                        value={state.tel}
                        placeholder="Enter your phone number (optional)"
                        personalInfo = "tel"
                        onChange={onChange}
                        autoSize={{ minRows: 1, maxRows: 2 }}
                        />
                    {/* <Button type="primary" onClick={onSubmit}>Submit</Button> */}
                </Card>
            </div>
    )

}