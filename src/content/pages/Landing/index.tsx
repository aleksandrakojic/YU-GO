import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, Container, Button, Stack } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

import { OrganizationSignup } from './OrganizationSignup';
import MemberSignup from './MemberSignup';
import EnableWeb3 from 'src/components/EnableWeb3';
import { MainContent, PaperItem } from './styles';
import { AppContext } from 'src/contexts/AppContext';
import { useWeb3ExecuteFunction, useMoralis } from 'react-moralis';
import { useNavigate } from 'react-router-dom';

enum SignupType {
  None,
  Organization,
  Member
}

function LandingPage() {
  const navigate = useNavigate();
  const { enableWeb3, Moralis, authenticate } = useMoralis();
  const [signup, setSignup] = useState(SignupType.None);
  const { thematics, countries, abi, contractAddress } = useContext(AppContext);
  const { data, isLoading, isFetching, fetch, error } = useWeb3ExecuteFunction();
  const [newOrganistation, setNewOrganisation] = useState<any>(null);

  useEffect(() => {
    if (data && newOrganistation?.name && newOrganistation?.email && newOrganistation?.thematics && newOrganistation) {
      const d: any = data;
      if (d?.events?.OrganizationRegistered) {
        console.log('inside create orga db', data);
        const Organisations = Moralis.Object.extend('Organisations');
        const orga = new Organisations();

        orga.save({ ...newOrganistation, ethAddress: d?.from }).then(
          (res) => {
            authenticate().then((user) => {
              navigate('/dashboards/organization/settings');
            });
          },
          (error) => {
            console.warn('error saving orga', error);
          }
        );
      }
      setNewOrganisation(null);
    }
  }, [data]);

  const handleSubmitOrganization = (organization) => {
    const contractData: any = {
      abi,
      contractAddress,
      functionName: 'registerOrganisation',
      params: {
        name: organization?.name,
        thematicIds: organization?.thematics,
        countryId: organization?.country
      }
    };
    fetch({ params: contractData });
    setNewOrganisation(organization);
  };

  const renderForm = () => {
    if (signup === SignupType.Organization) {
      return (
        <OrganizationSignup
          thematics={thematics}
          countries={countries}
          onSubmitOrganization={handleSubmitOrganization}
        />
      );
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
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <PaperItem elevation={16} onClick={() => setSignup(SignupType.Organization)}>
            <Typography variant="h3">I am Organization</Typography>
          </PaperItem>
          <PaperItem elevation={16} onClick={() => setSignup(SignupType.Member)}>
            <Typography variant="h3">I am Member</Typography>
          </PaperItem>
        </Stack>
      );
    }
  };

  return (
    <MainContent sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Container maxWidth="sm">
        <Box
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
        <EnableWeb3>
          <Box sx={{ textAlign: 'center' }}>
            {signup !== SignupType.None && (
              <Button onClick={() => setSignup(SignupType.None)}>
                <KeyboardBackspaceIcon /> <div>Back</div>
              </Button>
            )}
            {renderForm()}
          </Box>
        </EnableWeb3>
      </Container>
    </MainContent>
  );
}

export default LandingPage;
