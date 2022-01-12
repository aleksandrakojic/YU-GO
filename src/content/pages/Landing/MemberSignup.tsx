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
import { useMoralisQuery } from "react-moralis";
import { Moralis } from "moralis";

const PaperContent = styled(Paper)({
  padding: "16px",
});

export const MemberSignup = ({ organisations }: Record<string, unknown>) => {
  const onSubmit = async (values) => {
    console.log("on Submit");
    // const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    // await sleep(300);

    const User = Moralis.Object.extend({
      className: "User",
    });

    const user = new User();
    user.set("type", 1);

    user.save().then((data) => {
      console.log("saved", data);
    });
    window.alert(JSON.stringify(values));
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
  const [member, setMember] = useState({
    name: "",
    email: "",
    organisationId: "",
  });

  const handleInputChange = (name, value) => {
    console.log("value", value);
    member[name] = value;
    setMember(member);
    //setMember({ ...member, [name]: value });
    console.log("01", member);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("member", member);
    const User = Moralis.Object.extend({
      className: "User",
    });

    const user = new User();
    user.set("type", 1);

    user.save().then((data) => {
      console.log(data);
    });
  };

  useEffect(() => {
    // const { data, error, isLoading } = useMoralisQuery("Organisation");
    console.log("data", data);
  });

  return (
    <div style={{ padding: 16, margin: "auto", maxWidth: 600 }}>
      <Form
        onSubmit={onSubmit}
        validate={validate}
        render={({ handleSubmit, form, submitting, pristine, values }) => (
          <form onSubmit={handleSubmit}>
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
                    value={member.name}
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
                    value={member.email}
                    onChange={({ target: { value } }) =>
                      handleInputChange("email", value)
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="organization-label">
                      Organization
                    </InputLabel>
                    <Select
                      name="organization"
                      labelId="organization-label"
                      label="Organization"
                      value={member.organisationId}
                      onChange={({ target: { value } }) =>
                        handleInputChange("organization", value)
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
                    disabled={submitting}
                    onClick={handleSubmit}
                  >
                    {/* > */}
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </PaperContent>
          </form>
        )}
      />
    </div>
  );
};

export default MemberSignup;
