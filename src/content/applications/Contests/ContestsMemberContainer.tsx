import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container, LinearProgress } from '@mui/material';
import Footer from 'src/components/Footer';
import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';

import Contests from './Contests';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import { getEligibleFormattedContests } from 'src/helpers/utils';

function ContestsMemberContainer() {
	const { enqueueSnackbar } = useSnackbar();
	const { Moralis, account } = useMoralis();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [contests, setContests] = useState<any[]>([]);
	const [organization, setOrganization] = useState<any>(null);

	const {
		data: contestData,
		error: contestError,
		isLoading: isLoadingContest,
	} = useMoralisQuery('Contests', (query) => query.includeAll(), [], {
		live: true,
	});

	const toggleModalState = () => setIsModalOpen(!isModalOpen);

	useEffect(() => {
		getOrganization();
		fetchContests();
	}, []);

	useEffect(() => {
		if (contestData && organization) {
			const eligibleContest = getEligibleFormattedContests(contestData, organization, account);
			setContests(eligibleContest);
		}
	}, [contestData, organization]);

	useEffect(() => {
		if (!isLoadingContest && contestError) {
			enqueueSnackbar(contestError[0] ?? JSON.stringify(contestError), { variant: 'error' });
		}
	}, [contestError, isLoadingContest]);

	const getOrganization = async () => {
		const query = new Moralis.Query('Organisations');
		const orga = await query.containedIn('whitelisted', [account]).first();

		setOrganization(orga);
	};

	const fetchContests = async () => {
		if (organization) {
			const query = new Moralis.Query('Contests');
			const allContests = await query.find();

			const formattedContest = getEligibleFormattedContests(allContests, organization, account);

			setContests(formattedContest);
		}
	};

	return (
		<>
			<PageTitleWrapper>
				<PageHeader onAddNewMember={toggleModalState} isOrganisation={false} />
			</PageTitleWrapper>
			<Container maxWidth="lg">
				<Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
					<Grid item xs={12}>
						{isLoadingContest && <LinearProgress color="primary" />}
						<Contests account={account} contests={contests} />
					</Grid>
				</Grid>
			</Container>
			<Footer />
		</>
	);
}

export default ContestsMemberContainer;
