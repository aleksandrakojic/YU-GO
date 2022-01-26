import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';
import React from 'react';

import Transactions from './Transactions';

function ApplicationsTransactions() {
	return (
		<>
			<PageTitleWrapper>
				<PageHeader />
			</PageTitleWrapper>
			<Container maxWidth="lg">
				<Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
					<Grid item xs={12}>
						<Transactions />
					</Grid>
				</Grid>
			</Container>
			<Footer />
		</>
	);
}

export default ApplicationsTransactions;
