import React, { useEffect, useState } from 'react';
import { Card, LinearProgress } from '@mui/material';
import TransactionsTable from './TransactionsTable';
import { subDays } from 'date-fns';
import { useMoralis, useMoralisQuery, useWeb3ExecuteFunction } from 'react-moralis';
import { useSnackbar } from 'notistack';

function Transactions() {
	const { enqueueSnackbar } = useSnackbar();
	const { Moralis, account } = useMoralis();
	const { data, isLoading, isFetching, fetch, error } = useWeb3ExecuteFunction();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [transactions, setTransactions] = useState<any[]>([]);

	const {
		data: transactionsData,
		error: transactionsError,
		isLoading: isLoadingTransactions,
	} = useMoralisQuery('Transactions', (query) => query.includeAll(), [], {
		live: true,
	});

	useEffect(() => {
		if (transactionsData) {
			const grantOrgaQuery = new Moralis.Query('Transactions');
			grantOrgaQuery.equalTo('addrGrantOrga', account);
			const winnerOrgaQuery = new Moralis.Query('Transactions');
			winnerOrgaQuery.equalTo('addrWinner', account);
			const mainQuery = Moralis.Query.or(grantOrgaQuery, winnerOrgaQuery);
			mainQuery
				.find()
				.then((res) => {
					console.log('response', res);
					setTransactions(res);
				})
				.catch((err) => {
					enqueueSnackbar('Error occured while fetching transactions', { variant: 'error' });
				});
		}
	}, [transactionsData]);

	console.log('trans', transactionsData, transactions, transactionsError, account);

	return (
		<Card>
			{(isLoadingTransactions || isFetching) && <LinearProgress color="primary" />}
			<TransactionsTable transactions={transactions} />
		</Card>
	);
}

export default Transactions;
