import React, { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import routes from './router';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import ThemeProvider from './theme/ThemeProvider';
import { CircularProgress, Container, CssBaseline, Typography } from '@mui/material';
import { useMoralis } from 'react-moralis';

const App = () => {
  const content = useRoutes(routes);
  const {
    Moralis,
    isWeb3Enabled,
    enableWeb3,
    isInitializing,
    isAuthenticated,
    isWeb3EnableLoading,
    isInitialized,
    user,
    account,
    chainId
  } = useMoralis();
  console.log('useMoralis', Moralis, isInitialized, user, account, chainId);
  const organisations = Moralis.Object.extend('Organisations');
  const query = new Moralis.Query(organisations);
  console.log('organization', query);

  // useEffect(() => {
  //   (async () => {
  //     const organisations = Moralis.Object.extend('Organisations');
  //     const query = new Moralis.Query(organisations);
  //     const results = await query.find();
  //     console.log(results[0].attributes.name);
  //   })();
  // }, []);

  useEffect(() => {
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);

  if (isInitializing) {
    return (
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100vw',
          maxWidth: '100vw !important',
          padding: '0px !important',
          height: '100vh',
          backgroundColor: '#111633'
        }}
      >
        <CircularProgress color="primary" />
      </Container>
    );
  }

  if (!isInitialized) {
    return (
      <Container>
        <Typography variant="h3">Fail to initialize</Typography>
      </Container>
    );
  }

  return (
    <ThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        {content}
      </LocalizationProvider>
    </ThemeProvider>
  );
};
export default App;
