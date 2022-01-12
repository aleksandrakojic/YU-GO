import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Autocomplete,
} from "@mui/material";
import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { IData } from "src/models";
import { PaperContent } from "./styles";

interface Props {
  thematics: IData[];
  countries: IData[];
  onSubmitOrganization: (org) => void;
}

const initOrganization = {
  name: "",
  email: "",
  description: "",
  address: "",
  country: 0,
  thematics: [],
};

export const OrganizationSignup = ({
  thematics,
  countries,
  onSubmitOrganization,
}: Props) => {
  const [organizationData, setOrganizationData] = useState(initOrganization);

  const handleSubmit = () => {
    console.log("submit");
    onSubmitOrganization(organizationData);
  };

  const handleThemeSelection = (e, newvalue) => {
    const themeIds = newvalue.map((t) => t.id);
    setOrganizationData({ ...organizationData, thematics: themeIds });
  };

  const handleInputChange = (name, value) => {
    setOrganizationData({ ...organizationData, [name]: value });
  };

  const handleResetForm = () => {
    console.log("reset form", initOrganization, organizationData);
    setOrganizationData(initOrganization);
  };
  const isSubmitDisabled = () =>
    !(
      organizationData?.address &&
      organizationData?.email &&
      organizationData?.name &&
      organizationData?.thematics.length
    );

  return (
    <div style={{ padding: 10, margin: "auto", maxWidth: 600 }}>
      <Form
        onSubmit={handleSubmit}
        subscription={{ submitting: true, pristine: true }}
        initialValues={initOrganization}
        render={({ submitting, values, form }) => (
          <PaperContent>
            <Grid container alignItems="flex-start" spacing={2}>
              <Grid item xs={12}>
                <Field
                  fullWidth
                  required
                  name="name"
                  type="text"
                  label="Organization name"
                  value={organizationData.name}
                  component={TextField}
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
                  value={organizationData.email}
                  component={TextField}
                  onChange={({ target: { value } }) =>
                    handleInputChange("email", value)
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  name="address"
                  fullWidth
                  type="address"
                  label="Address"
                  value={organizationData.address}
                  component={TextField}
                  onChange={({ target: { value } }) =>
                    handleInputChange("address", value)
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  fullWidth
                  name="description"
                  multiline
                  label="Description"
                  value={organizationData.description}
                  component={TextField}
                  onChange={({ target: { value } }) =>
                    handleInputChange("description", value)
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="country-label">Countries</InputLabel>
                  <Select
                    name="country"
                    labelId="country-label"
                    label="Country"
                    required
                    onChange={({ target: { name, value } }) =>
                      handleInputChange(name, value)
                    }
                    value={organizationData.country}
                  >
                    {countries.map((c) => (
                      <MenuItem value={c.id} key={c.id}>
                        {c.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  maxWidth: "100%",
                }}
              >
                <Autocomplete
                  fullWidth
                  multiple
                  aria-required
                  id="tags-outlined"
                  options={thematics}
                  getOptionLabel={(option) => option.name}
                  onChange={handleThemeSelection}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField {...params} label="Thematics" />
                  )}
                />
              </Grid>
              <Grid item style={{ marginTop: 16 }}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={form.reset}
                  disabled={submitting}
                >
                  Reset
                </Button>
              </Grid>
              <Grid item style={{ marginTop: 16 }}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isSubmitDisabled()}
                  onClick={handleSubmit}
                >
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

export default OrganizationSignup;
