import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container, LinearProgress } from '@mui/material';
import Footer from 'src/components/Footer';
import React, { useEffect, useState } from 'react';

import Actions from './Actions';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import { getEligibleFormattedContests } from 'src/helpers/utils';
import { useSnackbar } from 'notistack';

function ActionsContainerMemberView() {
	const { enqueueSnackbar } = useSnackbar();
	const { Moralis, account, user } = useMoralis();
	const [eligibleContests, setEligibleContests] = useState<any[]>([]);
	const [organization, setOrganization] = useState<any>(null);
	const [actions, setActions] = useState<Array<any>>([]);

	const {
		data: contestData,
		error: contestError,
		isLoading: isLoadingContest,
	} = useMoralisQuery('Contests', (query) => query.includeAll(), [], {
		live: true,
	});

	const {
		data: actionsData,
		error: actionError,
		isLoading: isLoadingAction,
	} = useMoralisQuery('Actions', (query) => query.includeAll(), [], {
		live: true,
	});

	useEffect(() => {
		getOrganization();
		queryActions();
	}, []);

	useEffect(() => {
		if (contestData && organization && eligibleContests?.length === 0) {
			const eligibleContest = getEligibleFormattedContests(
				contestData,
				organization,
				organization?.attributes?.ethAddress
			);
			setEligibleContests(eligibleContest);
		}
	}, [contestData, organization]);

	useEffect(() => {
		queryActions();
	}, [actionsData, contestData, eligibleContests]);

	useEffect(() => {
		if (!isLoadingAction && !isLoadingContest) {
			const err = actionError || contestError;
			if (err) {
				enqueueSnackbar(err[0] ?? JSON.stringify(err), { variant: 'error' });
			}
		}
	}, [actionError, contestError, isLoadingContest, isLoadingAction]);

	const queryActions = async () => {
		if (actionsData && eligibleContests?.length > 0) {
			const actionCreatorAddrs = eligibleContests?.map((c) => c?.addrActionCreators)?.flat();
			const setAddr = new Set(actionCreatorAddrs);
			const arrayAddr = Array.from(setAddr);
			const queryActions = new Moralis.Query('Actions');
			const query = await queryActions.containedIn('addrOrgaCreator', arrayAddr);
			const filteredActions = await query.find();
			setActions(filteredActions);
		}
	};

	const getOrganization = async () => {
		if (account) {
			const query = new Moralis.Query('Organisations');
			const orga = await query.contains('whitelisted', account).first();
			setOrganization(orga);
		}
	};

	console.log('action data', actionsData, actions, contestData, eligibleContests, organization);

	return (
		<>
			<PageTitleWrapper>
				<PageHeader
					onAddNewAction={() => console.log('you can not add action')}
					isActionDisabled={true}
				/>
			</PageTitleWrapper>
			<Container maxWidth="lg">
				<Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
					<Grid item xs={12}>
						{(isLoadingContest || isLoadingAction) && <LinearProgress color="primary" />}
						<Actions currentUser={user} actions={actions} />
					</Grid>
				</Grid>
			</Container>
			<Footer />
		</>
	);
}

export default ActionsContainerMemberView;
