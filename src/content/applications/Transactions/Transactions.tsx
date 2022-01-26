import React, { useEffect, useState } from 'react';
import { Card, LinearProgress } from '@mui/material';
import TransactionsTable from './TransactionsTable';
import { subDays } from 'date-fns';
import { useChain, useMoralis, useMoralisQuery, useWeb3ExecuteFunction } from 'react-moralis';
import contractSignature from 'src/contracts/VerifySignature.json';
import { useSnackbar } from 'notistack';
import { ITransaction, ITransactionStatus } from 'src/models';
import AgreementModal from './AgreementModal';

enum SignatureStatus {
	None,
	Sign,
	Withdraw,
}

function Transactions() {
	const { chain } = useChain();
	const { networks, abi } = contractSignature;
	const contractAddress = networks[chain?.networkId ?? 5777].address;
	const { enqueueSnackbar } = useSnackbar();
	const { Moralis, account } = useMoralis();
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
		const nonce = Math.floor(Math.random() * 10000);

		const signatureData: any = {
			abi,
			contractAddress,
			functionName: 'getMessageHash',
			params: {
				_to: selectedTransaction?.attributes?.addrWinner,
				_amount: selectedTransaction?.attributes?.requiredFunds,
				_contractAddress: contractAddress,
				_agreement: selectedTransaction?.attributes?.agreement,
				_nonce: nonce,
			},
		};
		fetch({
			params: signatureData,
			onSuccess: (result) => {
				console.log('RESULT', result);
				const saveInDatabase = async () => {
					const transQuery = new Moralis.Query('Transactions');
					const query = await transQuery.equalTo('objectId', selectedTransaction?.id);
					const queryResult = await query.first();
					console.log('queryresult', queryResult);
					if (queryResult) {
						queryResult?.set('signature', result);
						queryResult?.set('nonce', nonce);
						queryResult?.set('status', 'signed');
						queryResult.save();
					}
				};
				saveInDatabase();
				setIsModalOpen(false);
				setSelectedTransaction(null);
			},
		});
	};

	const withdrawFunds = () => {
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
				_nonce: selectedTransaction?.attributes?.nonce,
				signature: selectedTransaction?.attributes?.signature,
			},
		};
		fetch({
			params: verifySignatureData,
			onSuccess: (result) => {
				console.log('RESULT Verify', result);
				const saveInDatabase = async () => {
					const transQuery = new Moralis.Query('Transactions');
					const query = await transQuery.equalTo('objectId', selectedTransaction?.id);
					const queryResult = await query.first();
					console.log('queryresult', queryResult);
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
		console.log('signed');
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
