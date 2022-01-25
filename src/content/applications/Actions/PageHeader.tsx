import { Typography, Button, Grid } from '@mui/material';
import React from 'react';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

interface Props {
	onAddNewAction: () => void;
	isActionDisabled: boolean;
}

function PageHeader({ onAddNewAction, isActionDisabled }: Props) {
	return (
		<Grid container justifyContent="space-between" alignItems="center">
			<Grid item>
				<Typography variant="h3" component="h3" gutterBottom>
					ACTIONS
				</Typography>
				<Typography variant="subtitle2">
					Use Tabs to filter between actions you created and actions you can vote on
				</Typography>
			</Grid>
			<Grid item>
				{!isActionDisabled && (
					<Button
						sx={{ mt: { xs: 2, md: 0 } }}
						variant="contained"
						startIcon={<AddTwoToneIcon fontSize="small" />}
						onClick={onAddNewAction}
						disabled={isActionDisabled}
					>
						Add new action
					</Button>
				)}
			</Grid>
		</Grid>
	);
}

export default PageHeader;
