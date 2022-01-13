import { ConstructionOutlined } from "@mui/icons-material";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  styled,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Form, Field } from "react-final-form";
import { useMoralisQuery, useMoralis } from "react-moralis";
import { Moralis } from "moralis";
import { useNavigate } from 'react-router-dom';


const PaperContent = styled(Paper)({
  padding: "16px",
});

interface Props {
  onSubmitMember: (member) => void;
}

const initMember = {
  name: "",
  email: "",
  organisation : "",
};




export const MemberSignup = ({onSubmitMember}: Props) => {

  const navigate = useNavigate();
  const { authenticate, isAuthenticated,isAuthenticating, user, logout } = useMoralis();
  const [memberData, setMemberData] = useState(initMember);

  const handleSubmit = (e) => {
    onSubmitMember(memberData);
  };

  const handleInputChange = (name, value) => {
    setMemberData({ ...memberData, [name]: value });
  };

  const validate = (values) => {
    const errors: any = {};
    if (!values.name) {
      errors.name = "Required";
    }
    if (!values.country) {
      errors.country = "Required";
    }
    if (!values.email) {
      errors.email = "Required";
    }
    console.log({ errors });
    return errors;
  };

  const { data, error, isLoading } = useMoralisQuery("Organisations");
 


  return (
    <div style={{ padding: 16, margin: "auto", maxWidth: 600 }}>
      <Form
        onSubmit={handleSubmit}
        subscription={{ submitting: true, pristine: true }}
        initialValues={initMember}
        //validate={validate}
        render={({ submitting, values, form, pristine }) => (
          
            <PaperContent>
              <Grid container alignItems="flex-start" spacing={2}>
                <Grid item xs={12}>
                  <Field
                    fullWidth
                    required
                    name="name"
                    type="text"
                    label="Member name"
                    component={TextField}
                    value={memberData.name}
                    onChange={({ target: { value } }) =>
                      handleInputChange("name", value)
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    name="email"
                    fullWidth
                    required
                    type="email"
                    label="Email"
                    component={TextField}
                    value={memberData.email}
                    onChange={({ target: { value } }) =>
                      handleInputChange("email", value)
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="organization-label">
                      Organisation
                    </InputLabel>
                    <Select
                      name="organisation"
                      labelId="organization-label"
                      label="Organization"
                      value={memberData.organisation}
                      onChange={({ target: { value } }) =>
                        handleInputChange("organisation", value)
                      }
                    >
                      <MenuItem value=""></MenuItem>
                      {data.map((c) => (
                        <MenuItem value={c.id} key={c.id}>
                          {c.attributes.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item style={{ marginTop: 16 }}>
                  <Button
                    type="button"
                    variant="contained"
                    onClick={form.reset}
                    disabled={submitting || pristine}
                  >
                    Reset
                  </Button>
                </Grid>
                <Grid item style={{ marginTop: 16 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    {/* > */}
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </PaperContent>
          
        )}
      />
    </div>
  );
};

export default MemberSignup;
