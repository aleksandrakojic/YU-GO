import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';
import React, { useContext, useEffect, useState } from 'react';

import Members from './Members';
import AddMemberModal from './AddMemberModal';
import { AppContext } from 'src/contexts/AppContext';
import { useWeb3ExecuteFunction, useMoralis } from 'react-moralis';
import { IMemberStatus } from 'src/models';

function OrganizationMembers() {
	const { Moralis, account } = useMoralis();
	const { abi, contractAddress, currentUser } = useContext(AppContext);
	const { data, isLoading, isFetching, fetch, error } = useWeb3ExecuteFunction();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [newAddr, setNewAddr] = useState<any>(null);
	const [allMembers, setAllMembers] = useState([]);
	const [orgaParticipant, setOrgaParticipant] = useState<any[]>([]);

	const toggleModalState = () => setIsModalOpen(!isModalOpen);

	useEffect( () => {
		getAllParticipants();
		getWhitelistedAddresses();
		const subscribeFunc = async () => {
			const query = new Moralis.Query('Organisations');
			const subscription = await query.subscribe();
			subscription?.on('update', (object) => {
				setWhitelistedAddresses(object?.attributes?.whitelisted);
			});
			return subscription;
		};
		const subscription = subscribeFunc();

		return () => {
			subscription.then((r) => r?.unsubscribe());
		};
	}, []);


	useEffect(() => {
		if (!(isLoading && isFetching && error) && newAddr) {
			const queryFunc = async () => {
				const addresses = (data as any)?.events?.ParticipantWhitelisted?.returnValues;
				if (addresses) {
					const memberAddr = addresses['addressParticipant'];
					const orgAddr = addresses['addressOrganization'];

					const Organisations = Moralis.Object.extend('Organisations');
					const query = new Moralis.Query(Organisations);
					query.equalTo('ethAddress', orgAddr.toLowerCase());
					const res = await query.first();
					console.log(memberAddr, orgAddr, res);
					res?.addUnique('whitelisted', newAddr.toLowerCase());
					res?.save();
					setNewAddr(null);
				}
			};
			queryFunc();
		}
	}, [data, isFetching, newAddr]);

	const getWhitelistedAddresses = async () => {
		const query = new Moralis.Query('Organisations');
		const organization = await query.equalTo('ethAddress', account).first();
		setWhitelistedAddresses(organization?.attributes?.whitelisted);
	};

	const setWhitelistedAddresses = (whitelisted) => {
		const whitelistedAddrs = whitelisted?.map((memberAddr) => {
			const participant = orgaParticipant.find(e=>{
				return e.ethAddress == memberAddr;
			})
			console.log(orgaParticipant, participant)
			return {
				id: Math.random().toString(36).substring(2, 7),
				firstname: participant?.firstname,
				lastname: participant?.lastname,
				status: IMemberStatus.Pending,
				email: participant?.email,
				ethAddress: memberAddr,
				orgEthAddress: currentUser?.attributes?.ethAddress,
				registrationDate: new Date(currentUser?.attributes?.updatedAt).getTime(),
			}
		});
		if (whitelistedAddrs) {
			setAllMembers(whitelistedAddrs);
		}
	};

	const getAllParticipants = async () => {
		const query = new Moralis.Query('Participants');
		const participants = await query
			.equalTo('organisation', currentUser?.attributes?.ethAddress)
			.find();
		console.log("getAllParticipants", participants);
		setOrgaParticipant(participants);
	};

	const handleSubmit = (addr: string) => {
		setIsModalOpen(false);
		setNewAddr(addr);
		const contractData: any = {
			abi,
			contractAddress,
			functionName: 'addParticipant',
			params: {
				_addrOrga: account,
				_addrParticipant: addr,
			},
		};
		fetch({ params: contractData });
	};

	console.log('add participant', data, isLoading, isFetching, error, newAddr, currentUser, account);

	return (
		<>
			<PageTitleWrapper>
				<PageHeader onAddNewMember={toggleModalState} />
			</PageTitleWrapper>
			<Container maxWidth="lg">
				<Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
					<Grid item xs={12}>
						<Members members={allMembers} />
					</Grid>
				</Grid>
			</Container>
			<Footer />
			<AddMemberModal isOpen={isModalOpen} onClose={toggleModalState} onSubmit={handleSubmit} />
		</>
	);
}

export default OrganizationMembers;
