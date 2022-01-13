import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';
import React, { useContext, useEffect, useState } from 'react';

import Contests from './Contests';
import AddContestModal from './AddContestModal';
import { AppContext } from 'src/contexts/AppContext';
import { useWeb3ExecuteFunction, useMoralis } from 'react-moralis';

function ContestsContainer() {
	const { Moralis, isAuthenticated, authenticate } = useMoralis();
	const { abi, contractAddress, currentUser, thematics, countries } = useContext(AppContext);
	const { data, isLoading, isFetching, fetch, error } = useWeb3ExecuteFunction();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const toggleModalState = () => setIsModalOpen(!isModalOpen);
	const [newContest, setNewContest] = useState<any>(null);
	const [contests, setContests] = useState([]);

	useEffect(() => {
		const subscribeFunc = async () => {
			const query = new Moralis.Query('Contests');
			const subscription = await query.subscribe();
			subscription?.on('create', (object) => {
				console.log('CONTEST', object);
			});
			return subscription;
		};
		const subscription = subscribeFunc();

		return () => {
			subscription.then((r) => r?.unsubscribe());
		};
	}, []);

	useEffect(() => {
		const addrOrga = (data as any)?.events?.ContestCreated?.returnValues?.addressOrga;
		if (!(isLoading && isFetching && error) && newContest?.name && addrOrga) {
			const queryFunc = async () => {
				if (addrOrga) {
					const Contests = Moralis.Object.extend('Contests');
					const contestInstance = new Contests();
					contestInstance?.save({
						...newContest,
						availableFunds: Number(newContest.availableFunds),
						addrGrantOrga: currentUser?.attributes?.ethAddress?.toLowerCase(),
					});
				}
			};
			queryFunc();
			setNewContest(null);
		}
	}, [data, newContest]);

	const handleSubmit = (contest: any) => {
		const contractData: any = {
			abi,
			contractAddress,
			functionName: 'addContest',
			params: {
				_name: contest.name,
				_themeIds: contest.thematics,
				_eligibleCountryIds: contest.countries,
				_applicationEndDate: new Date(contest.applicationEndDate).getTime(),
				_votingEndDate: new Date(contest.votingEndDate).getTime(),
				_funds: contest.availableFunds,
			},
		};
		fetch({ params: contractData });
		setNewContest(contest);
	};

	console.log('create contest', data, isLoading, isFetching, error);

	return (
		<>
			<PageTitleWrapper>
				<PageHeader onAddNewMember={toggleModalState} />
			</PageTitleWrapper>
			<Container maxWidth="lg">
				<Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
					<Grid item xs={12}>
						<Contests currentUser={currentUser} />
					</Grid>
				</Grid>
			</Container>
			<Footer />
			<AddContestModal
				isOpen={isModalOpen}
				onClose={toggleModalState}
				onSubmit={handleSubmit}
				thematics={thematics}
				countries={countries}
			/>
		</>
	);
}

export default ContestsContainer;
