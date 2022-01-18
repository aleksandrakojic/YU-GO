import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Divider } from '@mui/material';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (addr: string) => void;
}

export default function AddMemberModal({ isOpen, onClose, onSubmit }: Props) {
	const [addr, setAddr] = React.useState('');

	const handleSubmit = () => {
		if (addr) {
			onSubmit(addr);
			setAddr('');
		}
	};
	const handleChange = ({ target: { value } }) => setAddr(value);
	const handleClose = () => {
		setAddr('');
		onClose();
	};

	return (
		<Dialog
			open={isOpen}
			onClose={handleClose}
			sx={{ '& > div > div': { padding: 2, backgroundColor: '#393264' } }}
		>
			<DialogTitle>WHITELIST MEMBER OF YOUR ORGANIZATION</DialogTitle>
			<Divider />
			<DialogContent>
				<DialogContentText>
					Adding ETH address of your member, you are allowing her to access the platform.
				</DialogContentText>
				<TextField
					autoFocus
					margin="dense"
					id="name"
					label="ETH Address"
					type="text"
					fullWidth
					variant="filled"
					onChange={handleChange}
					value={addr}
				/>
			</DialogContent>
			<DialogActions sx={{ marginRight: '20px' }}>
				<Button variant="outlined" color="secondary" onClick={handleClose}>
					Cancel
				</Button>
				<Button variant="outlined" onClick={handleSubmit}>
					Submit
				</Button>
			</DialogActions>
		</Dialog>
	);
}
