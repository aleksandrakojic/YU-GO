import { Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, styled, TextField } from '@mui/material';
import React from 'react';
import { Form, Field } from 'react-final-form';

const PaperContent = styled(Paper)({
  padding: '16px'
});

export const MemberSignup = () => {
  const onSubmit = async (values) => {
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(300);
    window.alert(JSON.stringify(values));
  };
  const validate = (values) => {
    const errors: any = {};
    if (!values.name) {
      errors.name = 'Required';
    }
    if (!values.country) {
      errors.country = 'Required';
    }
    if (!values.email) {
      errors.email = 'Required';
    }
    return errors;
  };

  return (
    <div style={{ padding: 16, margin: 'auto', maxWidth: 600 }}>
      <Form
        onSubmit={onSubmit}
        validate={validate}
        render={({ handleSubmit, submitting, pristine, values }) => (
          <form onSubmit={handleSubmit} noValidate>
            <PaperContent>
              <Grid container alignItems="flex-start" spacing={2}>
                <Grid item xs={12}>
                  <Field fullWidth required name="name" type="text" label="Member name" component={TextField} />
                </Grid>
                <Grid item xs={12}>
                  <Field name="email" fullWidth required type="email" label="Email" component={TextField} />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="organization-label">Organization</InputLabel>
                    <Select name="organization" labelId="organization-label" label="Organization">
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={1}>Safe house</MenuItem>
                      <MenuItem value={2}>Center for education of women</MenuItem>
                      <MenuItem value={3}>BeFem</MenuItem>
                      <MenuItem value={4}>Astra</MenuItem>
                      <MenuItem value={5}>Alternative center for girls</MenuItem>
                    </Select>
                  </FormControl>
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
                  <Button variant="contained" color="primary" type="submit" disabled={submitting}>
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
