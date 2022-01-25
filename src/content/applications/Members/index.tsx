import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container, LinearProgress } from '@mui/material';
import Footer from 'src/components/Footer';
import React, { useContext, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';

import Members from './Members';
import AddMemberModal from './AddMemberModal';
import { AppContext } from 'src/contexts/AppContext';
import { useWeb3ExecuteFunction, useMoralis, useMoralisQuery } from 'react-moralis';
import { IMemberStatus } from 'src/models';

function OrganizationMembers() {
	const { enqueueSnackbar } = useSnackbar();
	const { Moralis, account } = useMoralis();
	const { abi, contractAddress, currentUser } = useContext(AppContext);
	const { data, isLoading, isFetching, fetch, error } = useWeb3ExecuteFunction();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [newAddr, setNewAddr] = useState<any>(null);
	const [allMembers, setAllMembers] = useState([]);

	const {
		data: participantsData,
		error: participantsError,
		isLoading: isLoadingParticipants,
	} = useMoralisQuery('Participants', (query) => query.includeAll(), [], {
		live: true,
	});

	const {
		data: whitelistData,
		error: whitelistError,
		isLoading: isLoadingWhitelist,
	} = useMoralisQuery('Organisations', (query) => query.includeAll(), [], {
		live: true,
	});

	const toggleModalState = () => setIsModalOpen(!isModalOpen);

	useEffect(() => {
		getWhitelistedAddresses();
	}, [whitelistData, participantsData]);

	useEffect(() => {
		if (!isLoadingParticipants && !isLoadingWhitelist) {
			const err = participantsError || whitelistError;
			if (err) {
				enqueueSnackbar(err[0] ?? JSON.stringify(err), { variant: 'error' });
			}
		}
	}, [participantsError, whitelistError]);

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
					res?.addUnique('whitelisted', newAddr.toLowerCase());
					res?.save();
					setNewAddr(null);
				}
			};
			queryFunc();
		}
	}, [data, isFetching, isLoading, newAddr]);

	const getWhitelistedAddresses = async () => {
		const organization = whitelistData.find((w) => {
			return w.attributes.ethAddress === account;
		});

		setWhitelistedAddresses(organization?.attributes?.whitelisted);
	};

	const setWhitelistedAddresses = (whitelisted) => {
		const whitelistedAddrs = whitelisted?.map((memberAddr) => {
			const participant = participantsData.find((e) => {
				return e.attributes.ethAddress === memberAddr;
			});
			return {
				id: Math.random().toString(36).substring(2, 7),
				firstname: participant?.attributes?.firstname,
				lastname: participant?.attributes?.lastname,
				status: participant ? IMemberStatus.Registered : IMemberStatus.Pending,
				email: participant?.attributes?.email,
				ethAddress: memberAddr,
				orgEthAddress: currentUser?.attributes?.ethAddress,
				registrationDate: new Date(currentUser?.attributes?.updatedAt).getTime(),
			};
		});
		if (whitelistedAddrs) {
			setAllMembers(whitelistedAddrs);
		}
	};

	const handleSubmit = (addr: string) => {
		const contractData: any = {
			abi,
			contractAddress,
			functionName: 'addParticipant',
			params: {
				_addrOrga: account,
				_addrParticipant: addr,
			},
		};
		fetch({
			params: contractData,
			onComplete: () => {
				setIsModalOpen(false);
			},
		});
		setNewAddr(addr);
	};

	return (
		<>
			<PageTitleWrapper>
				<PageHeader onAddNewMember={toggleModalState} />
			</PageTitleWrapper>
			<Container maxWidth="lg">
				<Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
					<Grid item xs={12}>
						{(isLoading || isFetching || isLoadingWhitelist) && <LinearProgress color="primary" />}
						<Members members={allMembers} />
					</Grid>
				</Grid>
			</Container>
			<Footer />
			<AddMemberModal
				isOpen={isModalOpen}
				onClose={toggleModalState}
				onSubmit={handleSubmit}
				isLoading={isLoading || isFetching}
			/>
		</>
	);
}

export default OrganizationMembers;
