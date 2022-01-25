import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container, LinearProgress } from '@mui/material';
import Footer from 'src/components/Footer';
import React, { useContext, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';

import Contests from './Contests';
import AddContestModal from './AddContestModal';
import { AppContext } from 'src/contexts/AppContext';
import { useWeb3ExecuteFunction, useMoralis, useMoralisQuery } from 'react-moralis';
import { getEligibleFormattedContests } from 'src/helpers/utils';

function ContestsOrgaContainer() {
	const { enqueueSnackbar } = useSnackbar();
	const { Moralis, account } = useMoralis();
	const { abi, contractAddress, thematics, countries } = useContext(AppContext);
	const { data, isLoading, isFetching, fetch, error } = useWeb3ExecuteFunction();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [newContest, setNewContest] = useState<any>(null);
	const [contests, setContests] = useState<any[]>([]);
	const [balance, setBalance] = useState<any>(null);
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
		getBalance();
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
						addrGrantOrga: account?.toLowerCase(),
					});
				}
			};
			queryFunc();
			setNewContest(null);
		}
	}, [data, newContest]);

	const getOrganization = async () => {
		const query = new Moralis.Query('Organisations');
		const orga = await query.equalTo('ethAddress', account).first();
		setOrganization(orga);
	};

	const handleSubmit = (contest: any) => {
		const contractData: any = {
			abi,
			contractAddress,
			functionName: 'addContest',
			msgValue: Moralis.Units.ETH(contest.availableFunds),
			params: {
				_name: contest.name,
				_themeIds: contest.thematics,
				_eligibleCountryIds: contest.countries,
				_applicationEndDate: new Date(contest.applicationEndDate).getTime() / 1000,
				_votingEndDate: new Date(contest.votingEndDate).getTime() / 1000,
				_funds: Moralis.Units.ETH(contest.availableFunds),
			},
		};
		fetch({ params: contractData });
		setNewContest(contest);
	};

	const fetchContests = async () => {
		if (organization) {
			const query = new Moralis.Query('Contests');
			const allContests = await query.find();

			const formattedContest = getEligibleFormattedContests(allContests, organization, account);

			setContests(formattedContest);
		}
	};

	const getBalance = async () => {
		const query = new Moralis.Query('EthBalance');
		const userEthBalanceData = await query.equalTo('address', account).first();
		const ethBalance = Number(userEthBalanceData?.attributes?.balance) / 10 ** 18;
		setBalance(ethBalance);
	};

	return (
		<>
			<PageTitleWrapper>
				<PageHeader onAddNewMember={toggleModalState} isOrganisation={true} />
			</PageTitleWrapper>
			<Container maxWidth="lg">
				<Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
					<Grid item xs={12}>
						{(isLoading || isFetching || isLoadingContest) && <LinearProgress color="primary" />}
						<Contests account={account} contests={contests} />
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
				balance={balance}
			/>
		</>
	);
}

export default ContestsOrgaContainer;
