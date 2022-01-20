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
	Chip,
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
		box-shadow: 0 0 0 0 rgba(0, 0, 0, 2);
		transform: scale(1);
		animation: pulse 2s infinite;
		background: linear-gradient(
			to right, 
			hsl(280 100% 65%), 
			hsl(200 100% 80%)
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
	const [hasYugo, setHasYugo] = useState(false);
	const { Moralis } = useMoralis();
	const { chain, account } = useChain();
	const { networks, abi } = contractManager;
	const contractAddress = networks[chain?.networkId ?? 5777].address;

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

	const {
		fetch: fetchLedgerState,
		data: ledgerData,
		isFetching: isFetchingLedger,
		isLoading: isLoadingLedger,
		error: errorLedger,
	} = useWeb3ExecuteFunction({
		abi,
		contractAddress,
		functionName: 'hasEthDeposit',
		params: {
			_account: account,
		},
	});

	const {
		fetch: transferYugo,
		data: transferYugoData,
		isFetching: isTransferingYugo,
		isLoading: isLoadingTransferYugo,
		error: errorTransferYugo,
	} = useWeb3ExecuteFunction({
		abi,
		contractAddress,
		functionName: 'transferYugo',
	});

	const { fetch, error, isFetching, data } = useWeb3Transfer({
		amount: Moralis.Units.ETH(0.1),
		type: 'native',
		receiver: contractAddress,
		contractAddress: contractAddress,
	});

	useEffect(() => {
		if (!(balanceData && isFetchingBalance && isLoadingBalance)) {
			fetchBalance();
		}
	}, []);

	useEffect(() => {
		if (data) {
			fetchBalance();
			fetchLedgerState();
		}
	}, [data]);

	useEffect(() => {
		if (balanceData === '0' && !isLoadingBalance && !ledgerData) {
			fetchLedgerState();
		}
	}, [balanceData, isLoadingBalance]);

	useEffect(() => {
		if ((transferYugoData as any)?.events?.YugoTransfer && !isLoadingTransferYugo && !hasYugo) {
			setHasYugo(true);
		}
	}, [transferYugoData, isLoadingTransferYugo]);

	const handleBuyToken = () => {
		fetch();
	};

	const handleRedeemToken = () => {
		transferYugo();
	};

	const errorMessage = () => {
		if (error) return JSON.stringify(error);
		if (errorBalance) return JSON.stringify(errorBalance);
		if (errorTransferYugo) return JSON.stringify(errorTransferYugo);
		if (errorLedger) return JSON.stringify(errorLedger);
		return null;
	};

	console.log('datas', balanceData, ledgerData, transferYugoData, data, hasYugo);

	const isLoading =
		isFetching ||
		isFetchingBalance ||
		isLoadingBalance ||
		isFetchingLedger ||
		isLoadingLedger ||
		isTransferingYugo ||
		isLoadingTransferYugo;

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
								secondary={
									balanceData !== '0' || hasYugo
										? 'You have full access on the platform'
										: 'Get Yugo token to be able to create your community, contests and actions'
								}
							/>
							{isLoading && <CircularProgress />}
							{!isLoading && balanceData === '0' && !ledgerData && (
								<Button color="info" size="large" variant="contained" onClick={handleBuyToken}>
									Buy
								</Button>
							)}
							{!isLoading && balanceData === '0' && ledgerData && !hasYugo && (
								<Button
									color="warning"
									size="large"
									variant="contained"
									onClick={handleRedeemToken}
								>
									Redeem
								</Button>
							)}
							{!isLoading && (balanceData !== '0' || hasYugo) && (
								<Chip
									label="1 YUGO"
									color="primary"
									sx={{ color: 'black', fontWeight: 'bold', borderRadius: '3px' }}
								/>
							)}
						</ListItem>
					</List>
				</Card>
				{errorMessage() && (
					<Card>
						<List>
							<ListItem sx={{ color: 'red' }}>{errorMessage()}</ListItem>
						</List>
					</Card>
				)}
			</Grid>
		</Grid>
	);
}

export default YugoTokenTab;
