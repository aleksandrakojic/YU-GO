import { Typography } from '@mui/material';
import React from 'react';

function PageHeader() {
	const user = {
		name: 'Jane Doe',
	};

	return (
		<>
			<Typography variant="h3" component="h3" gutterBottom>
				Profile Settings
			</Typography>
			<Typography variant="subtitle2">{user.name}, settings panel.</Typography>
		</>
	);
}

export default PageHeader;
