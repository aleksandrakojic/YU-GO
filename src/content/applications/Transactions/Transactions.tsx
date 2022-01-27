import React, { useEffect, useState } from 'react';
import { Card, LinearProgress } from '@mui/material';
import TransactionsTable from './TransactionsTable';
import { subDays } from 'date-fns';
import { useChain, useMoralis, useMoralisQuery, useWeb3ExecuteFunction } from 'react-moralis';
import contractSignature from 'src/contracts/VerifySignature.json';
import contractEscrow from 'src/contracts/GrantEscrow.json';
import { useSnackbar } from 'notistack';
import { ITransaction, ITransactionStatus } from 'src/models';
import AgreementModal from './AgreementModal';

enum SignatureStatus {
	None,
	Sign,
	Withdraw,
}

function Transactions() {
	const { enqueueSnackbar } = useSnackbar();
	const { chain } = useChain();
	const { networks, abi } = contractSignature;
	const contractAddress = networks[chain?.networkId ?? 5777].address;
	const { abi: abiEscrow, networks: networksEscrow } = contractEscrow;
	const contractEscrowAddress = networksEscrow[chain?.networkId ?? 5777].address;
	const { Moralis, account, web3 } = useMoralis();
	const { data, isLoading, isFetching, fetch, error } = useWeb3ExecuteFunction();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [transactions, setTransactions] = useState<any[]>([]);
	const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
	const [status, setStatus] = useState(SignatureStatus.None);

	useEffect(() => {
		if (selectedTransaction) {
			const t = selectedTransaction?.attributes;

			switch (t.status) {
				case ITransactionStatus.Pending: {
					if (t?.addrGrantOrga.toLowerCase() === account?.toLowerCase()) {
						setStatus(SignatureStatus.Sign);
					}
					if (t?.addrGrantOrga.toLowerCase() !== account?.toLowerCase()) {
						setStatus(SignatureStatus.None);
					}
					break;
				}
				case ITransactionStatus.Signed: {
					if (t?.addrGrantOrga.toLowerCase() === account?.toLowerCase()) {
						setStatus(SignatureStatus.None);
					}
					if (t?.addrGrantOrga.toLowerCase() !== account?.toLowerCase()) {
						setStatus(SignatureStatus.Withdraw);
					}
					break;
				}
				case ITransactionStatus.Transfered: {
					setStatus(SignatureStatus.None);
					break;
				}
				default:
					break;
			}
		} else {
			setStatus(SignatureStatus.None);
		}
	}, [selectedTransaction]);

	const {
		data: transactionsData,
		error: transactionsError,
		isLoading: isLoadingTransactions,
	} = useMoralisQuery('Transactions', (query) => query.includeAll(), [], {
		live: true,
	});

	useEffect(() => {
		if (transactionsData && !isLoadingTransactions) {
			const grantOrgaQuery = new Moralis.Query('Transactions');
			grantOrgaQuery.equalTo('addrGrantOrga', account);
			const winnerOrgaQuery = new Moralis.Query('Transactions');
			winnerOrgaQuery.equalTo('addrWinner', account);
			const mainQuery = Moralis.Query.or(grantOrgaQuery, winnerOrgaQuery);
			mainQuery
				.find()
				.then((res) => {
					setTransactions(res);
				})
				.catch((err) => {
					enqueueSnackbar('Error occured while fetching transactions', { variant: 'error' });
				});
		}
	}, [transactionsData, isLoadingTransactions]);

	const handleViewAgreement = (t: ITransaction) => {
		setSelectedTransaction(t);
		setIsModalOpen(true);
	};

	const signTransaction = () => {
		console.log('sign transaction');
		const nonce = Math.floor(Math.random() * 10000).toString();
		if (web3 && selectedTransaction) {
			let _hash = web3?.utils.soliditySha3(
				selectedTransaction?.attributes?.addrWinner,
				selectedTransaction?.attributes?.requiredFunds,
				contractAddress,
				selectedTransaction?.attributes?.agreement,
				nonce
			);
			console.log('HASH', _hash);
			if (_hash && account && nonce) {
				web3.eth.personal.sign(_hash, account, nonce).then((res) => {
					console.log('signatrue response', res);
					verifySignatureAndAuthFunds(res, nonce);
				});
			}
		}
	};

	const verifySignatureAndAuthFunds = (hash, nonce) => {
		console.log('withdrawFunds');
		const verifySignatureData: any = {
			abi,
			contractAddress,
			functionName: 'verify',
			params: {
				_to: selectedTransaction?.attributes?.addrWinner,
				_amount: selectedTransaction?.attributes?.requiredFunds,
				_contractAddress: contractAddress,
				_agreement: selectedTransaction?.attributes?.agreement,
				_nonce: nonce,
				signature: hash,
			},
		};
		fetch({
			params: verifySignatureData,
			onError: (error) => console.log('error: ', error),
			onSuccess: (result) => {
				console.log('RES Verify', result);
				if ((result as any)?.events?.SignerVerified?.returnValues[2]) {
					const grantOrgaAddr = (result as any)?.events?.SignerVerified?.returnValues[0];
					const saveInDatabase = async () => {
						const transQuery = new Moralis.Query('Transactions');
						const query = await transQuery.equalTo('objectId', selectedTransaction?.id);
						const queryResult = await query.first();
						console.log('queryresult', queryResult);
						if (queryResult) {
							queryResult?.set('addrGrantOrga', grantOrgaAddr);
							queryResult?.set('signature', hash);
							queryResult?.set('nonce', Number(nonce));
							queryResult?.set('status', 'signed');
							queryResult.save();
						}
					};
					saveInDatabase();
				}
				setIsModalOpen(false);
				setSelectedTransaction(null);
			},
		});
	};

	const withdrawFunds = () => {
		// const escrowData = {
		// 	abi: abiEscrow,
		// 	contractAddress: contractEscrowAddress,
		// 	functionName: 'canWithdraw',
		// 	params: {
		// 		_from: selectedTransaction?.attributes?.addrGrantOrga,
		// 		_to: selectedTransaction?.attributes?.addrWinner,
		// 	},
		// };
		// fetch({
		// 	params: escrowData,
		// 	onSuccess: (res) => console.log('res', res),
		// 	onError: (err) => console.log('can not withdraw', err),
		// });
		const escrowData = {
			abi: abiEscrow,
			contractAddress: contractEscrowAddress,
			functionName: 'withdrawGrant',
			params: {
				_contestCreator: selectedTransaction?.attributes?.addrGrantOrga,
			},
		};
		fetch({
			params: escrowData,
			onError: (e) => console.log('err', e),
			onSuccess: (res) => {
				console.log('SUCCESS WITHDRAW', res);
				const saveInDatabase = async () => {
					const transQuery = new Moralis.Query('Transactions');
					const query = await transQuery.equalTo('objectId', selectedTransaction?.id);
					const queryResult = await query.first();
					console.log('withdrawFunds', queryResult);
					if (queryResult) {
						queryResult?.set('status', 'transfered');
						queryResult.save();
					}
				};
				saveInDatabase();
				setIsModalOpen(false);
				setSelectedTransaction(null);
			},
		});
	};

	const handleAgreementSubmit = () => {
		if (selectedTransaction) {
			if (status === SignatureStatus.Sign) {
				signTransaction();
			}
			if (status === SignatureStatus.Withdraw) {
				withdrawFunds();
			}
		}
	};
	const toggleModalState = () => setIsModalOpen(!isModalOpen);

	console.log('trans', transactionsData, transactions, transactionsError, data, contractAddress);

	return (
		<Card>
			{(isLoadingTransactions || isFetching) && <LinearProgress color="primary" />}
			<TransactionsTable transactions={transactions} onViewAgreement={handleViewAgreement} />
			<AgreementModal
				isOpen={isModalOpen}
				onClose={toggleModalState}
				onSubmit={handleAgreementSubmit}
				agreement={selectedTransaction?.attributes?.agreement}
				isLoading={isLoading || isFetching}
				status={status}
			/>
		</Card>
	);
}

export default Transactions;
