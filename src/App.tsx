import React, { useEffect, useState } from "react";
import { useRoutes } from "react-router-dom";
import routes from "./router";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

import ThemeProvider from "./theme/ThemeProvider";
import {
  CircularProgress,
  Container,
  CssBaseline,
  Typography,
} from "@mui/material";
import { useMoralis, useWeb3ExecuteFunction, useChain } from "react-moralis";
import contractInfo from "src/contracts/YugoDao.json";
import { AppContext } from "./contexts/AppContext";

import { useNavigate } from 'react-router-dom';
import { IContractData, ICountryCode } from './models';
import { usePrevious } from './helpers/utils';

enum DataTypes {
  Thematics = "thematics",
  Countries = "countries",
}

const App = () => {
	const content = useRoutes(routes);
	const navigate = useNavigate();
	const {
		isWeb3Enabled,
		enableWeb3,
		isInitializing,
		isWeb3EnableLoading,
		isInitialized,
		user,
		logout,
		isAuthenticating,
		isLoggingOut,
	} = useMoralis();
	const { chainId, chain, account } = useChain();
	const { networks, abi } = contractInfo;
	// const contractAddress = networks[3].address; //1337
	const [contractAddress, setContractAddress] = useState(networks[5777].address);
	const [contractData, setContractData] = useState<IContractData>({
		thematics: [],
		countries: [],
	});
	const prevAccount = usePrevious(account);

	const {
		fetch: fetchThemes,
		data: themeData,
		isFetching: isFetchingThemes,
		isLoading: isLoadingThemes,
		error: errorThemes,
	} = useWeb3ExecuteFunction({
		abi,
		contractAddress,
		functionName: 'getThematics',
	});

	const {
		fetch: fetchCountries,
		data: countryData,
		isFetching: isFetchingCountries,
		isLoading: isLoadingCountries,
		error: errorCountries,
	} = useWeb3ExecuteFunction({
		abi,
		contractAddress,
		functionName: 'getCountries',
	});

	useEffect(() => {
		enableWeb3({
			onSuccess: (s) => console.info('enableweb success', s),
			onError: (e) => console.info('enableweb3 error', e),
			onComplete: () => console.info('complete web3'),
		});
		if (chain && chainId) {
			setContractAddress(networks[chain?.networkId]?.address);
		}
	}, []);

	useEffect(() => {
		if (prevAccount && account && prevAccount !== account) {
			logout();
			navigate('/');
		}
	}, [account]);

	useEffect(() => {
		if (chain && chainId) {
			setContractAddress(networks[chain?.networkId]?.address);
		} else {
			setContractAddress(networks[5777]?.address);
		}
	}, [chain, chainId]);

	useEffect(() => {
		if (themeData && !contractData.thematics.length && !isFetchingThemes && !isLoadingThemes) {
			const themes = (themeData as Array<any>)?.map((t, i) => ({ id: i, name: t }));
			setContractData({ ...contractData, [DataTypes.Thematics]: themes });
		}
		if (
			countryData &&
			!contractData.countries.length &&
			!isFetchingCountries &&
			!isLoadingCountries
		) {
			const countries = (countryData as Array<any>)?.map((c, i) => ({
				id: i,
				name: c,
				code: ICountryCode[i],
			}));
			setContractData({ ...contractData, [DataTypes.Countries]: countries });
		}
	}, [themeData, countryData, isLoadingThemes, isLoadingCountries]);

	useEffect(() => {
		console.log('isWebenabled');
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

	if (isInitializing || isLoggingOut || isAuthenticating) {
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
					backgroundColor: '#111633',
				}}
			>
				<CircularProgress color="primary" />
			</Container>
		);
	}

	if (!isInitialized) {
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
					backgroundColor: '#111633',
				}}
			>
				<Typography variant="h3">Fail to initialize</Typography>
			</Container>
		);
	}

	return (
		<ThemeProvider>
			<LocalizationProvider dateAdapter={AdapterDateFns}>
				<AppContext.Provider value={{ ...contractData, abi, contractAddress, currentUser: user }}>
					<CssBaseline />
					{content}
				</AppContext.Provider>
			</LocalizationProvider>
		</ThemeProvider>
	);
};
export default App;
