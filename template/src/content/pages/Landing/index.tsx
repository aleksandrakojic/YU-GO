import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Button, Paper, Stack } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

import { styled } from '@mui/material/styles';
import { OrganizationSignup } from './OrganizationSignup';
import MemberSignup from './MemberSignup';

enum SignupType {
  None,
  Organization,
  Member
}

const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    overflow: auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
);

const PaperItem = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  border: '1px solid darkslateblue',
  height: 100,
  width: 350,
  lineHeight: '60px',
  cursor: 'pointer',
  boxShadow: '0px 2px 1px -1px #1b245a, 0px 1px 1px 0px #1b245a, 0px 1px 3px 0px #1b245a',
  '&:hover': {
    boxShadow: '0px 7px 8px -4px #1b245a, 0px 6px 20px 2px #1b245a, 0px 2px 20px 6px #1b245a'
  }
}));

function LandingPage() {
  const [signup, setSignup] = useState(SignupType.None);

  const renderForm = () => {
    if (signup === SignupType.Organization) {
      return <OrganizationSignup />;
    }
    if (signup === SignupType.Member) {
      return <MemberSignup />;
    }
    if (signup === SignupType.None) {
      return (
        <Stack
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 4
          }}
        >
          <PaperItem elevation={16} onClick={() => setSignup(SignupType.Organization)}>
            <Typography variant="h2">Jump in as Organization</Typography>
          </PaperItem>
          <PaperItem elevation={16} onClick={() => setSignup(SignupType.Member)}>
            <Typography variant="h2">Jump in as Member</Typography>
          </PaperItem>
        </Stack>
      );
    }
  };

  return (
    <MainContent sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Container maxWidth="sm">
        <Box
          textAlign="center"
          sx={{
            textAlign: 'center',
            height: '400px',
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column'
          }}
        >
          <Typography variant="h1" sx={{ fontSize: '5rem' }}>
            YU-GO DAO
          </Typography>
          <img alt="Coming Soon" height={200} src="/static/images/logo/woman.svg" />
        </Box>
      </Container>

      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center' }}>
          {signup !== SignupType.None && (
            <Button onClick={() => setSignup(SignupType.None)}>
              <KeyboardBackspaceIcon /> <div>Back</div>
            </Button>
          )}
          {renderForm()}
        </Box>
      </Container>
    </MainContent>
  );
}

export default LandingPage;
