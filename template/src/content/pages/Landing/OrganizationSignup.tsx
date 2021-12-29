import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Autocomplete } from '@mui/material';
import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import { useNavigate } from 'react-router-dom';
import { IData } from 'src/models';
import { PaperContent } from './styles';

interface Props {
  thematics: IData[];
  countries: IData[];
  onSubmitOrganization: (org) => void;
}
export const OrganizationSignup = ({ thematics, countries, onSubmitOrganization }: Props) => {
  const navigate = useNavigate();
  const [organizationData, setOrganizationData] = useState({
    name: '',
    email: '',
    description: '',
    address: '',
    country: 0,
    thematics: []
  });

  const handleSubmit = () => {
    onSubmitOrganization(organizationData);
  };

  const handleSubmitForm = () => {
    navigate('/dashboards');
  };

  const handleThemeSelection = (e, newvalue) => {
    const themeIds = newvalue.map((t) => t.id);
    setOrganizationData({ ...organizationData, thematics: themeIds });
  };

  const handleInputChange = (name, value) => {
    setOrganizationData({ ...organizationData, [name]: value });
  };

  return (
    <div style={{ padding: 10, margin: 'auto', maxWidth: 600 }}>
      <Form
        onSubmit={handleSubmit}
        render={({ submitting, pristine }) => (
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
                  onChange={({ target: { value } }) => handleInputChange('name', value)}
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
                  onChange={({ target: { value } }) => handleInputChange('email', value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  name="address"
                  fullWidth
                  required
                  type="address"
                  label="Address"
                  value={organizationData.address}
                  component={TextField}
                  onChange={({ target: { value } }) => handleInputChange('address', value)}
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
                  onChange={({ target: { value } }) => handleInputChange('description', value)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="country-label">Countries</InputLabel>
                  <Select
                    name="country"
                    labelId="country-label"
                    label="Country"
                    onChange={({ target: { name, value } }) => handleInputChange(name, value)}
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
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  maxWidth: '100%'
                }}
              >
                <Autocomplete
                  fullWidth
                  multiple
                  id="tags-outlined"
                  options={thematics}
                  getOptionLabel={(option) => option.name}
                  onChange={handleThemeSelection}
                  filterSelectedOptions
                  renderInput={(params) => <TextField {...params} label="Thematics" />}
                />
              </Grid>
              <Grid item style={{ marginTop: 16 }}>
                <Button
                  type="button"
                  variant="contained"
                  onClick={() => console.log('reset')}
                  disabled={submitting || pristine}
                >
                  Reset
                </Button>
              </Grid>
              <Grid item style={{ marginTop: 16 }}>
                <Button variant="contained" color="primary" type="submit" disabled={submitting} onClick={handleSubmit}>
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
