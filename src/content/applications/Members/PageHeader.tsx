import { Typography, Button, Grid } from '@mui/material';
import React from 'react';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

interface Props {
  onAddNewMember: () => void;
}

function PageHeader({ onAddNewMember }: Props) {
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          YOUR MEMBERS
        </Typography>
        <Typography variant="subtitle2"> Use status filter to display whitelisted and registered members</Typography>
      </Grid>
      <Grid item>
        <Button
          sx={{ mt: { xs: 2, md: 0 } }}
          variant="contained"
          startIcon={<AddTwoToneIcon fontSize="small" />}
          onClick={onAddNewMember}
        >
          Add new member
        </Button>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
