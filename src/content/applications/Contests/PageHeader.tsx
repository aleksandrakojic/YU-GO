import { Typography, Button, Grid } from '@mui/material';
import React from 'react';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

interface Props {
	onAddNewMember: () => void;
	isOrganisation: boolean;
}

function PageHeader({ onAddNewMember, isOrganisation }: Props) {
	return (
		<Grid container justifyContent="space-between" alignItems="center">
			<Grid item>
				<Typography variant="h3" component="h3" gutterBottom>
					CONTESTS
				</Typography>
				<Typography variant="subtitle2">
					Use Tabs to filter between contest you created and contest you can apply on
				</Typography>
			</Grid>
			<Grid item>
				{isOrganisation && (
					<Button
						sx={{ mt: { xs: 2, md: 0 } }}
						variant="contained"
						startIcon={<AddTwoToneIcon fontSize="small" />}
						onClick={onAddNewMember}
					>
						Add new contest
					</Button>
				)}
			</Grid>
		</Grid>
	);
}

export default PageHeader;
