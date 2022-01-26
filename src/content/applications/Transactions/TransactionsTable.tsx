import React, { FC, ChangeEvent, useState } from 'react';
import { format } from 'date-fns';
import {
	Tooltip,
	Divider,
	Box,
	FormControl,
	InputLabel,
	Card,
	Checkbox,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TablePagination,
	TableRow,
	TableContainer,
	Select,
	MenuItem,
	Typography,
	useTheme,
	CardHeader,
} from '@mui/material';

import Label from 'src/components/Label';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import BulkActions from './BulkActions';
import { ITransaction, ITransactionStatus } from 'src/models';

interface TransactionTableProps {
	className?: string;
	transactions: any[];
}

interface Filters {
	status?: ITransactionStatus;
}

const getStatusLabel = (transactionStatus: ITransactionStatus): JSX.Element => {
	const map = {
		signed: {
			text: 'Signed',
			color: 'info',
		},
		transfered: {
			text: 'Transfered',
			color: 'success',
		},
		pending: {
			text: 'Pending',
			color: 'warning',
		},
	};

	const { text, color }: any = map[transactionStatus];

	return <Label color={color}>{text}</Label>;
};

const applyFilters = (transactions: ITransaction[], filters: Filters): ITransaction[] => {
	return transactions?.filter((transaction) => {
		let matches = true;

		if (filters.status && transaction?.attributes?.status !== filters.status) {
			matches = false;
		}

		return matches;
	});
};

const applyPagination = (
	transactions: ITransaction[],
	page: number,
	limit: number
): ITransaction[] => {
	return transactions.slice(page * limit, page * limit + limit);
};

const TransactionsTable: FC<TransactionTableProps> = ({ transactions }) => {
	const [selectedTransactions, setSelectedTransaction] = useState<string[]>([]);
	const selectedBulkActions = selectedTransactions.length > 0;
	const [page, setPage] = useState<number>(0);
	const [limit, setLimit] = useState<number>(5);
	const [filters, setFilters] = useState<Filters>({
		status: undefined,
	});

	const statusOptions = [
		{
			id: 'all',
			name: 'All',
		},
		{
			id: 'transfered',
			name: 'Transfered',
		},
		{
			id: 'pending',
			name: 'Pending',
		},
		{
			id: 'signed',
			name: 'Signed',
		},
	];

	const handleEthAddress = (address) =>
		address
			? `${address?.substring(0, 6)} ... ${address.substring(address.length - 4, address.length)}`
			: '';

	const handleStatusChange = (e: any): void => {
		console.log('event', e);
		// let value = '';

		// if (e.target.value !== 'all') {
		//   value = e.target.value;
		// }

		// setFilters((prevFilters) => ({
		//   ...prevFilters,
		//   status: value
		// }));
	};

	const handleSelectAllTransactions = (event: ChangeEvent<HTMLInputElement>): void => {
		if (transactions?.length) {
			setSelectedTransaction(
				event.target.checked ? transactions?.map((transaction) => transaction.id) : []
			);
		}
	};

	const handleSelectOneTransaction = (
		event: ChangeEvent<HTMLInputElement>,
		cryptoOrderId: string
	): void => {
		if (!selectedTransactions.includes(cryptoOrderId)) {
			setSelectedTransaction((prevSelected) => [...prevSelected, cryptoOrderId]);
		} else {
			setSelectedTransaction((prevSelected) => prevSelected.filter((id) => id !== cryptoOrderId));
		}
	};

	const handlePageChange = (event: any, newPage: number): void => {
		setPage(newPage);
	};

	const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
		setLimit(parseInt(event.target.value));
	};

	const filteredTransactions = applyFilters(transactions, filters);
	const paginatedTransactions = applyPagination(filteredTransactions, page, limit);
	const selectedSomeCryptoOrders =
		selectedTransactions.length > 0 && selectedTransactions.length < transactions.length;
	const selectedAllCryptoOrders = selectedTransactions.length === transactions.length;
	const theme = useTheme();

	return (
		<Card>
			{selectedBulkActions && (
				<Box flex={1} p={2}>
					<BulkActions />
				</Box>
			)}
			{!selectedBulkActions && (
				<CardHeader
					action={
						<Box width={150}>
							<FormControl fullWidth variant="outlined">
								<InputLabel>Status</InputLabel>
								<Select
									value={filters.status || 'all'}
									onChange={handleStatusChange}
									label="Status"
									autoWidth
								>
									{statusOptions.map((statusOption) => (
										<MenuItem key={statusOption.id} value={statusOption.id}>
											{statusOption.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Box>
					}
					title="Recent Transactions"
				/>
			)}
			<Divider />
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell padding="checkbox">
								<Checkbox
									color="primary"
									checked={selectedAllCryptoOrders}
									indeterminate={selectedSomeCryptoOrders}
									onChange={handleSelectAllTransactions}
								/>
							</TableCell>
							<TableCell>Grant</TableCell>
							<TableCell>Winner</TableCell>
							<TableCell>Action</TableCell>
							<TableCell align="right">Amount</TableCell>
							<TableCell align="right">Created</TableCell>
							<TableCell align="right">Status</TableCell>
							<TableCell align="right">Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{paginatedTransactions.map((transaction) => {
							const isSelected = selectedTransactions.includes(transaction.objectId);
							return (
								<TableRow hover key={transaction.objectId} selected={isSelected}>
									<TableCell padding="checkbox">
										<Checkbox
											color="primary"
											checked={isSelected}
											onChange={(event: ChangeEvent<HTMLInputElement>) =>
												handleSelectOneTransaction(event, transaction.objectId)
											}
											value={isSelected}
										/>
									</TableCell>
									<TableCell>
										<Typography
											variant="body1"
											fontWeight="bold"
											color="text.primary"
											gutterBottom
											noWrap
										>
											{handleEthAddress(transaction?.attributes?.addrGrantOrga)}
										</Typography>
									</TableCell>
									<TableCell>
										<Typography
											variant="body1"
											fontWeight="bold"
											color="text.primary"
											gutterBottom
											noWrap
										>
											{handleEthAddress(transaction?.attributes?.addrWinner)}
										</Typography>
									</TableCell>
									<TableCell>
										<Typography
											variant="body1"
											fontWeight="bold"
											color="text.primary"
											gutterBottom
											noWrap
										>
											{transaction?.attributes?.actionName}
										</Typography>
									</TableCell>
									<TableCell align="right">
										<Typography
											variant="body1"
											fontWeight="bold"
											color="text.primary"
											gutterBottom
											noWrap
										>
											{transaction?.attributes?.requiredFunds} ETH
										</Typography>
									</TableCell>
									<TableCell align="right">
										<Typography
											variant="body1"
											fontWeight="bold"
											color="text.primary"
											gutterBottom
											noWrap
										>
											<Typography variant="body2" color="text.secondary" noWrap>
												{format(transaction?.attributes?.createdAt, 'MMMM dd yyyy')}
											</Typography>
										</Typography>
									</TableCell>
									<TableCell align="right">
										{getStatusLabel(transaction?.attributes?.status as ITransactionStatus)}
									</TableCell>
									<TableCell align="right">
										<Tooltip title="View Agreement" arrow>
											<IconButton
												sx={{
													'&:hover': {
														background: theme.colors.primary.lighter,
													},
													color: theme.palette.primary.main,
												}}
												color="inherit"
												size="small"
											>
												<AssignmentOutlinedIcon fontSize="small" />
											</IconButton>
										</Tooltip>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
			<Box p={2}>
				<TablePagination
					component="div"
					count={filteredTransactions.length}
					onPageChange={handlePageChange}
					onRowsPerPageChange={handleLimitChange}
					page={page}
					rowsPerPage={limit}
					rowsPerPageOptions={[5, 10, 25, 30]}
				/>
			</Box>
		</Card>
	);
};

export default TransactionsTable;
