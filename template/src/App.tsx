import React, { useEffect, useState } from 'react';
import { useRoutes } from 'react-router-dom';
import routes from './router';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import ThemeProvider from './theme/ThemeProvider';
import { CircularProgress, Container, CssBaseline, Typography } from '@mui/material';
import { useMoralis, useWeb3ExecuteFunction } from 'react-moralis';
import contractInfo from 'src/contracts/Main.json';
import { AppContext } from './contexts/AppContext';
import { IContractData } from './models';

enum DataTypes {
  Thematics = 'thematics',
  Countries = 'countries'
}

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
    authenticate,
    user,
    account,
    chainId
  } = useMoralis();
  console.log('useMoralis', isAuthenticated, isWeb3Enabled, isInitialized, user, account, chainId);
  const { contractName, networks, abi } = contractInfo;
  const contractAddress = networks[1337].address; //1337
  const [contractData, setContractData] = useState<IContractData>({
    thematics: [],
    countries: []
  });

  const {
    fetch: fetchThemes,
    data: themeData,
    isFetching: isFetchingThemes,
    isLoading: isLoadingThemes,
    error: errorThemes
  } = useWeb3ExecuteFunction({
    abi,
    contractAddress,
    functionName: 'getThematics'
  });

  const {
    fetch: fetchCountries,
    data: countryData,
    isFetching: isFetchingCountries,
    isLoading: isLoadingCountries,
    error: errorCountries
  } = useWeb3ExecuteFunction({
    abi,
    contractAddress,
    functionName: 'getCountries'
  });

  useEffect(() => {
    enableWeb3({
      onSuccess: (s) => console.info('enableweb success', s),
      onError: (e) => console.info('enableweb3 error', e),
      onComplete: () => console.info('copmlete web3')
    });
  }, []);

  useEffect(() => {
    if (themeData && !contractData.thematics.length && !isFetchingThemes && !isLoadingThemes) {
      const themes = (themeData as Array<any>)?.map((t, i) => ({ id: i, name: t }));
      setContractData({ ...contractData, [DataTypes.Thematics]: themes });
    }
    if (countryData && !contractData.countries.length && !isFetchingCountries && !isLoadingCountries) {
      const countries = (countryData as Array<any>)?.map((c, i) => ({ id: i, name: c }));
      setContractData({ ...contractData, [DataTypes.Countries]: countries });
    }
  }, [themeData, countryData]);

  useEffect(() => {
    console.log('REINIT WEB3');
    if (!isWeb3Enabled && !isWeb3EnableLoading) {
      enableWeb3();
    } else {
      if (!themeData && !contractData.thematics.length) {
        fetchThemes();
      }
      if (!countryData && !contractData.countries.length) {
        fetchCountries();
      }
    }
  }, [isWeb3Enabled, isWeb3EnableLoading]);

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

  const currentUser = Moralis.User.current();

  return (
    <ThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AppContext.Provider value={{ ...contractData, abi, contractAddress, currentUser }}>
          <CssBaseline />
          {content}
        </AppContext.Provider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};
export default App;
