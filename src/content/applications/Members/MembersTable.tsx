import React, { FC, ChangeEvent, useState } from 'react';
import { format } from 'date-fns';
import numeral from 'numeral';
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
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import BulkActions from './BulkActions';
import { IMemberStatus, IMember } from 'src/models';

interface MembersTableProps {
	className?: string;
	members: IMember[];
}

interface Filters {
	status?: IMemberStatus;
}

const getStatusLabel = (memberStatus: IMemberStatus): JSX.Element => {
	const map = {
		canceled: {
			text: 'Canceled',
			color: 'error',
		},
		registered: {
			text: 'Registered',
			color: 'success',
		},
		pending: {
			text: 'Pending',
			color: 'warning',
		},
	};

	const { text, color }: any = map[memberStatus];

	return <Label color={color}>{text}</Label>;
};

const applyFilters = (members: IMember[], filters: Filters): IMember[] => {
	return members.filter((member) => {
		let matches = true;

		if (filters.status && member.status !== filters.status) {
			matches = false;
		}

		return matches;
	});
};

const applyPagination = (members: IMember[], page: number, limit: number): IMember[] => {
	return members.slice(page * limit, page * limit + limit);
};

const MembersTable: FC<MembersTableProps> = ({ members }) => {
	const [selectedMembers, setSelectedCryptoOrders] = useState<string[]>([]);
	const selectedBulkActions = selectedMembers.length > 0;
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
			id: 'registered',
			name: 'Registered',
		},
		{
			id: 'pending',
			name: 'Pending',
		},
		{
			id: 'canceled',
			name: 'Canceled',
		},
	];

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

	const handleSelectAllMembers = (event: ChangeEvent<HTMLInputElement>): void => {
		// setSelectedCryptoOrders(event.target.checked ? members.map((member) => member.id) : []);
	};

	const handleSelectOneMember = (event: ChangeEvent<HTMLInputElement>, memberId: any): void => {
		if (!selectedMembers.includes(memberId)) {
			setSelectedCryptoOrders((prevSelected) => [...prevSelected, memberId]);
		} else {
			setSelectedCryptoOrders((prevSelected) => prevSelected.filter((id) => id !== memberId));
		}
	};

	const handlePageChange = (event: any, newPage: number): void => {
		setPage(newPage);
	};

	const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
		setLimit(parseInt(event.target.value));
	};

	const filteredMembers = applyFilters(members, filters);
	const paginatedMembers = applyPagination(filteredMembers, page, limit);
	const selectedSomeMembers = selectedMembers.length > 0 && selectedMembers.length < members.length;
	const selectedAllMembers = selectedMembers.length === members.length;
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
					title="All members"
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
									checked={selectedAllMembers}
									indeterminate={selectedSomeMembers}
									onChange={handleSelectAllMembers}
								/>
							</TableCell>
							<TableCell>First Name</TableCell>
							<TableCell>Last Name</TableCell>
							<TableCell>Email</TableCell>
							<TableCell align="right">ETH Address</TableCell>
							<TableCell align="right">Registration Date</TableCell>
							<TableCell align="right">Status</TableCell>
							<TableCell align="right">Action</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{paginatedMembers.length > 0 &&
							paginatedMembers?.map((member) => {
								const isMemberSelected = member?.id ? selectedMembers.includes(member?.id) : false;
								return (
									<TableRow hover key={member?.id} selected={isMemberSelected}>
										<TableCell padding="checkbox">
											<Checkbox
												color="primary"
												checked={isMemberSelected}
												onChange={(event: ChangeEvent<HTMLInputElement>) =>
													handleSelectOneMember(event, member?.id)
												}
												value={isMemberSelected}
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
												{member?.firstname}
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
												{member?.lastname}
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
												{member?.email}
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
												{member?.ethAddress}
											</Typography>
										</TableCell>
										<TableCell align="right">
											<Typography variant="body1" color="text.primary" gutterBottom noWrap>
												{member?.registrationDate &&
													format(member?.registrationDate, 'MMMM dd yyyy')}
											</Typography>
										</TableCell>
										<TableCell align="right">{getStatusLabel(member?.status)}</TableCell>
										<TableCell align="right">
											<Tooltip title="Delete member" arrow>
												<IconButton
													sx={{
														'&:hover': { background: theme.colors.error.lighter },
														color: theme.palette.error.main,
													}}
													color="inherit"
													size="small"
												>
													<DeleteTwoToneIcon fontSize="small" />
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
					count={filteredMembers.length}
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

export default MembersTable;
