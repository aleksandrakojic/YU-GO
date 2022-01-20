import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Divider, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { Box } from '@mui/system';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (action: any) => void;
	eligibleContests: any[];
}

const initAction = {
	name: '',
	description: '',
	contestId: '',
	addrGrantOrga: '',
	requiredFunds: 0,
};

export default function AddActionModal({ isOpen, onClose, onSubmit, eligibleContests }: Props) {
	const [action, setAction] = React.useState(initAction);

	const handleSubmit = () => {
		onSubmit({ ...action, requiredFunds: Number(action.requiredFunds) });
		handleClose();
	};
	const handleChange = ({ target: { value, name } }) => setAction({ ...action, [name]: value });
	const handleClose = () => {
		setAction(initAction);
		onClose();
	};

	return (
		<Grid container sx={{ padding: 2 }}>
			<Dialog
				open={isOpen}
				onClose={handleClose}
				sx={{ '& > div > div': { padding: 2, backgroundColor: '#393264' } }}
			>
				<DialogTitle sx={{ fontSize: '1rem', fontWeight: 'bold' }}>ADD NEW ACTION</DialogTitle>
				<Divider />
				<DialogContent
					sx={{
						display: 'flex',
						flexDirection: 'column',
						minHeight: '450px',
						justifyContent: 'space-between',
					}}
				>
					<DialogContentText>
						Create new action and add thematics and countries for which action will be visible
					</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						name="name"
						label="Title"
						type="text"
						fullWidth
						onChange={handleChange}
						value={action.name}
					/>
					<TextField
						autoFocus
						margin="dense"
						name="description"
						label="Description"
						type="text"
						fullWidth
						multiline
						minRows={5}
						onChange={handleChange}
						value={action.description}
					/>
					<TextField
						autoFocus
						margin="dense"
						name="requiredFunds"
						label="Required Funds in ETH"
						type="number"
						fullWidth
						multiline
						onChange={handleChange}
						value={action.requiredFunds}
					/>
					<Box sx={{ width: '100%' }}>
						<InputLabel id="contest-label">Contests</InputLabel>
						<Select
							fullWidth
							name="addrGrantOrga"
							labelId="contest-label"
							label="Contests"
							required
							onChange={handleChange}
							value={action.addrGrantOrga}
						>
							{eligibleContests?.map((c) => (
								<MenuItem value={c?.addrGrantOrga} key={c?.id}>
									{c?.name}
								</MenuItem>
							))}
						</Select>
					</Box>
				</DialogContent>
				<DialogActions sx={{ marginRight: '20px' }}>
					<Button variant="contained" color="secondary" onClick={handleClose}>
						Cancel
					</Button>
					<Button variant="contained" color="primary" onClick={handleSubmit}>
						Submit
					</Button>
				</DialogActions>
			</Dialog>
		</Grid>
	);
}
