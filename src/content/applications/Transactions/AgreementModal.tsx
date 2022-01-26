import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Card, CardContent, Divider, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

enum SignatureStatus {
	None,
	Sign,
	Withdraw,
}

interface Props {
	isOpen: boolean;
	isLoading: boolean;
	onClose: () => void;
	onSubmit: () => void;
	agreement: string;
	status: SignatureStatus;
}

export default function AgreementModal({
	isOpen,
	isLoading,
	onClose,
	onSubmit,
	agreement,
	status,
}: Props) {
	return (
		<Dialog
			open={isOpen}
			onClose={onClose}
			sx={{ '& > div > div': { padding: 2, backgroundColor: '#393264' } }}
		>
			<DialogTitle>AGREEMENT DOCUMENT</DialogTitle>
			<Divider />
			<DialogContent>
				<DialogContentText>Preview of your agreement and transfer</DialogContentText>
				<Card sx={{ minWidth: 275, marginTop: '20px', backgroundColor: '#5b519b' }}>
					<CardContent>
						<Typography variant="body2">{agreement}</Typography>
					</CardContent>
				</Card>
			</DialogContent>
			<DialogActions sx={{ marginRight: '20px' }}>
				<Button variant="outlined" onClick={onClose} disabled={isLoading}>
					Close
				</Button>
				{status !== SignatureStatus.None && (
					<LoadingButton
						color="secondary"
						variant="outlined"
						onClick={onSubmit}
						loading={isLoading}
					>
						{status === SignatureStatus.Sign ? 'Sign' : 'Withdraw'}
					</LoadingButton>
				)}
			</DialogActions>
		</Dialog>
	);
}
