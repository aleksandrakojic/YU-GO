import React, { useEffect, useState } from 'react';
import {
	Box,
	Typography,
	Card,
	Grid,
	ListItem,
	List,
	ListItemText,
	Button,
	ListItemAvatar,
	CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import contractManager from 'src/contracts/YugoManager.json';
import { useChain, useMoralis, useWeb3ExecuteFunction, useWeb3Transfer } from 'react-moralis';

const YugoToken = styled(Box)(
	({ theme }) => `
    width: ${theme.spacing(10)};
    height: ${theme.spacing(10)};
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		border-radius: 50%;
		border: 7px solid ${theme.colors.primary.dark};
		background-color: ${theme.colors.primary.main};
		color: ${theme.colors.secondary.dark};
		box-shadow: 0 0 0 0 rgba(0, 0, 0, 2);
		transform: scale(1);
		animation: pulse 2s infinite;
		background: linear-gradient(
			to right, 
			hsl(90 100% 63%), 
			hsl(205 100% 59%)
  	);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		text-align: center;

		@keyframes pulse {
			0% {
				transform: scale(0.90);
				box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.8);
			}

			70% {
				transform: scale(1);
				box-shadow: 0 0 0 15px rgba(0, 0, 0, 0);
			}

			100% {
				transform: scale(0.90);
				box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
			}
		}
`
);

function YugoTokenTab() {
	const { Moralis } = useMoralis();
	const { chain, account } = useChain();
	const { networks, abi } = contractManager;
	const [contractAddress, setContractAddress] = useState(
		networks[chain?.networkId ?? 5777].address
	);

	const {
		fetch: fetchBalance,
		data: balanceData,
		isFetching: isFetchingBalance,
		isLoading: isLoadingBalance,
		error: errorBalance,
	} = useWeb3ExecuteFunction({
		abi,
		contractAddress,
		functionName: 'yugoBalanceOf',
		params: {
			account,
		},
	});

	useEffect(() => {
		if (!(balanceData && isFetchingBalance && isLoadingBalance)) {
			fetchBalance();
		}
	}, []);

	const { fetch, error, isFetching } = useWeb3Transfer({
		amount: Moralis.Units.ETH(0.1),
		type: 'native',
		receiver: contractAddress,
		contractAddress: contractAddress,
	});

	const handleBuyToken = () => {
		fetch();
	};

	console.log('error', error, balanceData, isFetchingBalance, isLoadingBalance, errorBalance);

	return (
		<Grid container spacing={3}>
			<Grid item xs={12}>
				<Box pb={2}>
					<Typography variant="h3">Yugo Token Balance</Typography>
					<Typography variant="subtitle2">
						Manage your access on platform with Yugo token
					</Typography>
				</Box>
				<Card>
					<List>
						<ListItem sx={{ p: 3 }}>
							<ListItemAvatar sx={{ pr: 2 }}>
								<YugoToken>YUGO</YugoToken>
							</ListItemAvatar>
							<ListItemText
								primaryTypographyProps={{ variant: 'h5', gutterBottom: true }}
								secondaryTypographyProps={{
									variant: 'subtitle2',
									lineHeight: 1,
								}}
								primary="Yugo Token"
								secondary="Get Yugo token to be able to create your community, contests and actions"
							/>
							{isFetching || isLoadingBalance ? (
								<CircularProgress />
							) : (
								<Button color="info" size="large" variant="contained" onClick={handleBuyToken}>
									Buy
								</Button>
							)}
						</ListItem>
					</List>
				</Card>
			</Grid>
		</Grid>
	);
}

export default YugoTokenTab;
