import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, Container, Button, Stack, LinearProgress } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

import { OrganizationSignup } from './OrganizationSignup';
import MemberSignup from './MemberSignup';
import EnableWeb3 from 'src/components/EnableWeb3';
import { MainContent, PaperItem, Wrapper, AppBar } from './styles';
import { AppContext } from 'src/contexts/AppContext';
import { useWeb3ExecuteFunction, useMoralis } from 'react-moralis';
import { useNavigate } from 'react-router-dom';
import Logo from 'src/components/Logo';
import { ProfileType } from 'src/models';
import { useSnackbar, VariantType } from 'notistack';
import { LoadingButton } from '@mui/lab';
import { MetamaskLogoutButton } from 'src/layouts/SidebarLayout/Header/MetamaskBox';

enum SignupType {
	None,
	Organization,
	Member,
}
function LandingPage() {
	const navigate = useNavigate();
	const { Moralis, account, authenticate, isAuthenticated, isAuthenticating, user, logout } =
		useMoralis();
	const { enqueueSnackbar } = useSnackbar();
	const [signup, setSignup] = useState(SignupType.None);
	const { thematics, countries, abi, contractAddress, setType, type } = useContext(AppContext);
	const [newOrganistation, setNewOrganisation] = useState<any>(null);
	const [newParticipant, setNewParticipant] = useState<any>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { data, isFetching, fetch, error } = useWeb3ExecuteFunction();

	useEffect(() => {
		if (data && newOrganistation) {
			const d: any = data;
			if (d?.events?.OrganizationRegistered) {
				const Organisation = Moralis.Object.extend('Organisations');
				const orga = new Organisation();

				orga.save({ ...newOrganistation, ethAddress: d?.from }).then(
					async (res) => {
						await authenticate();
						setIsLoading(false);
						setType(ProfileType.Organization);
						
					},
					(error) => {
						console.error('error saving orga', error);
					}
				);
			}
			setNewOrganisation(null);
		}
	}, [data, newOrganistation]);

	useEffect(() => {
		if (data && newParticipant) {
			const Participant = Moralis.Object.extend('Participants');
			const participant = new Participant();
			participant.save({ ...newParticipant, ethAddress: account }).then(
				async (res) => {
					await authenticate();
					setIsLoading(false);
					setType(ProfileType.Member);
					
				},
				(error) => {
					console.error('error saving member', error);
				}
			);
			setNewParticipant(null);
		}
	}, [data, newParticipant]);

	useEffect(() => {
		if (isAuthenticated && !user?.attributes?.type && type === ProfileType.None) {
			handleSnackMessage('You need to be registered !', 'warning');
		}
		if (error) {
			handleSnackMessage(error[0] || error['message'] || 'An error occured ...', 'error');
		}
	}, [type, isAuthenticated, error]);

	const handleSnackMessage = (message: string, variant: VariantType) => {
		enqueueSnackbar(message, { variant });
	};

	const handleSubmitMember = (member) => {
		const contractData: any = {
			abi,
			contractAddress,
			functionName: 'participantIsWhiteListed',
			params: {
				_addrOrganisation: member.organisation,
				_addrParticipant: account,
			},
		};
		fetch({ params: contractData });
		setNewParticipant(member);
		setIsLoading(true);
	};

	const handleSubmitOrganization = (organization) => {
		const contractData: any = {
			abi,
			contractAddress,
			functionName: 'registerOrganisation',
			params: {
				thematicIds: organization?.thematics,
				countryId: organization?.country,
			},
		};

		fetch({ params: contractData });
		setNewOrganisation(organization);
		setIsLoading(true);
	};

	const renderForm = () => {
		
		if (signup === SignupType.Organization && !isLoading) {
			return (
				<OrganizationSignup
					thematics={thematics}
					countries={countries}
					onSubmitOrganization={handleSubmitOrganization}
				/>
			);
		}
		if (signup === SignupType.Member && !isLoading) {
			return <MemberSignup onSubmitMember={handleSubmitMember} />;
		}
		if (signup === SignupType.None && !isLoading) {
			return (
				<Stack
					sx={{
						p: 2,
						display: 'flex',
						flexDirection: 'row',
						flexWrap: 'wrap',
						gap: 2,
					}}
				>
					<PaperItem elevation={16} onClick={() => setSignup(SignupType.Organization)}>
						<Typography variant="h3">I am Organization</Typography>
					</PaperItem>
					<PaperItem elevation={16} onClick={() => setSignup(SignupType.Member)}>
						<Typography variant="h3">I am Member</Typography>
					</PaperItem>
				</Stack>
			);
		}
	};

	const userConnect = async () => {
		if (!isAuthenticated && !user) {
			authenticate();
		}
	};

	const handleLogout = () => {
		logout();
		navigate('/');
		setType(ProfileType.None);
	};

	const renderAppBar = () => (
		<AppBar>
			<Box sx={{ display: 'flex', alignItems: 'center' }}>
				<Logo />
			</Box>
			{isAuthenticated && user ? (
				<Box sx={{ textAlign: 'right' }} onClick={handleLogout}>
					{MetamaskLogoutButton(user.get('name'), user.get('ethAddress'))}
				</Box>
			) : (
				<LoadingButton onClick={userConnect} variant="contained" loading={isAuthenticating}>
					Connect Wallet
				</LoadingButton>
			)}
		</AppBar>
	);

	return (
		<Wrapper>
			{renderAppBar()}
			<MainContent>
				<Container maxWidth="sm">
					<Box
						sx={{
							textAlign: 'center',
							height: '400px',
							display: 'flex',
							justifyContent: 'space-between',
							flexDirection: 'column',
						}}
					>
						<img alt="Business woman" height={400} src="/static/images/logo/woman.svg" />
					</Box>
				</Container>

				<Container maxWidth="sm">
					<EnableWeb3>
						{signup === SignupType.None && (
							<Box>
								<Typography variant="h1" sx={{ fontSize: '3rem' }}>
									Unlock the next step in community cooperation
								</Typography>
								<Typography sx={{ fontSize: '1.3rem', padding: '20px 0px' }}>
									YU-GO DAO gives direct power to the women of ex-Yugoslavia. Join us in pioneering
									a future where magic internet communities unlock the power of women-centric
									coordination.
								</Typography>
							</Box>
						)}
						<Box sx={{ textAlign: 'center' }}>
							{signup !== SignupType.None && (
								<Button onClick={() => setSignup(SignupType.None)}>
									<KeyboardBackspaceIcon /> <div>Back</div>
								</Button>
							)}
							{(isLoading || isFetching) && signup !== SignupType.None && (
								<LinearProgress color="primary" sx={{ maxWidth: '90%', margin: '0px auto' }} />
							)}
							{renderForm()}
						</Box>
					</EnableWeb3>
				</Container>
			</MainContent>
		</Wrapper>
	);
}

export default LandingPage;
