import { Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, styled, TextField, Chip } from '@mui/material';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import React from 'react';
import { Form, Field } from 'react-final-form';
import { useNavigate } from 'react-router-dom';

interface ChipData {
  key: number;
  label: string;
}

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
  listStyle: 'none'
}));

const PaperContent = styled(Paper)({
  padding: '16px'
});

export const OrganizationSignup = () => {
  const navigate = useNavigate();
  const [chipData, setChipData] = React.useState<readonly ChipData[]>([
    { key: 0, label: 'Violence' },
    { key: 1, label: 'Trafic' },
    { key: 2, label: 'Support' },
    { key: 3, label: 'Education' },
    { key: 4, label: 'Activism' }
  ]);

  const handleDelete = (chipToDelete: ChipData) => () => {
    setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
  };

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

  const handleSubmitForm = () => {
    navigate('/dashboards');
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
                  <Field fullWidth required name="name" type="text" label="Organization name" component={TextField} />
                </Grid>
                <Grid item xs={12}>
                  <Field name="email" fullWidth required type="email" label="Email" component={TextField} />
                </Grid>
                <Grid item xs={12}>
                  <Field name="address" fullWidth required type="address" label="Address" component={TextField} />
                </Grid>
                <Grid item xs={12}>
                  <Field fullWidth name="description" multiline label="Description" component={TextField} />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="country-label">Countries</InputLabel>
                    <Select name="country" labelId="country-label" label="Country">
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={1}>Serbia</MenuItem>
                      <MenuItem value={2}>Montenegro</MenuItem>
                      <MenuItem value={3}>Bosnia and Herzegovina</MenuItem>
                      <MenuItem value={4}>Croatia</MenuItem>
                      <MenuItem value={5}>Slovenia</MenuItem>
                      <MenuItem value={6}>Macedonia</MenuItem>
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
                  {chipData.map((data) => (
                    <ListItem key={data.key}>
                      <Chip label={data.label} onDelete={handleDelete(data)} />
                    </ListItem>
                  ))}
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
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={submitting}
                    onClick={handleSubmitForm}
                  >
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

export default OrganizationSignup;
