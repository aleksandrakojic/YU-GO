import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, Container, Button, Stack, Paper } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

import { OrganizationSignup } from './OrganizationSignup';
import MemberSignup from './MemberSignup';
import EnableWeb3 from 'src/components/EnableWeb3';
import { MainContent, PaperItem, Wrapper, AppBar } from './styles';
import { AppContext } from 'src/contexts/AppContext';
import { useWeb3ExecuteFunction, useMoralis } from 'react-moralis';
import { useNavigate } from 'react-router-dom';
import Logo from 'src/components/Logo';

enum SignupType {
	None,
	Organization,
	Member,
}

function LandingPage() {
	const navigate = useNavigate();
	const { enableWeb3, Moralis, authenticate, isAuthenticated,isAuthenticating, user, logout, refetchUserData, isUserUpdating, setUserData } = useMoralis();
	const [signup, setSignup] = useState(SignupType.None);
	const { thematics, countries, abi, contractAddress, currentUser } = useContext(AppContext);
	const { data, isLoading, isFetching, fetch, error } = useWeb3ExecuteFunction();
	const [newOrganistation, setNewOrganisation] = useState<any>(null);

	
	useEffect(() => {
		console.log("contextCurrentUser", currentUser, user);
		if(isAuthenticated && user?.get('type')== 2){
			navigate('/dashboards/organization/settings');
		}
		if(isAuthenticated && user?.get('type')== 1){
			navigate('/dashboards/profile/settings');
		}
	}, [isAuthenticated])

	useEffect(() => {
		if (
			data &&
			newOrganistation?.name &&
			newOrganistation?.email &&
			newOrganistation?.thematics &&
			newOrganistation
		) {
			
			const d: any = data;
			if (d?.events?.OrganizationRegistered) {
				console.log('inside create orga db', data);
				const Organisation = Moralis.Object.extend('Organisations');
				const orga = new Organisation();

				orga.save({ ...newOrganistation, ethAddress: d?.from }).then(
					(res) => {

						user?.set("type", 2);
						user?.save().then(res=>{
							navigate('/dashboards/organization/settings');
							console.log(res);
						}, err=>{
							console.warn('error saving user', err);
						})
					},
					(error) => {
						console.warn('error saving orga', error);
					}
				);

				
			}
			setNewOrganisation(null);
		}
	}, [data]);

	const handleSubmitMember =  async (member) => {
		console.log('handleSubmitMember', member, isAuthenticated);
		if(isAuthenticated){
			if(user?.get("type") == 2){
				navigate('/dashboards/organization/settings');
			}else if(user?.get("type") == 1){
				navigate('/dashboards/profile/settings');
			}else{
				setUserData({
					username: member.name,
					email: member.email,
					type: 1,
				}).then(res=>{
					navigate('/dashboards/profile/settings');
					console.log(res);
				}, err=>{
					console.warn('error saving user', err);
				})	
			}
		}else{

			

			authenticate().then(async (res)=>{
				//await refetchUserData();
				setUserData({
						username: member.name,
						email: member.email,
						type: 1,
				}).then(res=>{
					console.log(res);
					navigate('/dashboards/profile/settings');
				}, err=>{
					console.warn('error saving user', err);
				})

			});/**/

			


			/*authenticate({ onComplete: async () => {
				console.log("onComplete authenticate", user, currentUser, Moralis.User.current())
				await refetchUserData();
				setUserData({
						username: member.name,
						email: member.email,
						type: 1,
				}).then(res=>{
					console.log(res);
					navigate('/dashboards/profile/settings');
				}, err=>{
					console.warn('error saving user', err);
				})
				
				}, onError : () =>{
					console.warn("authenticate error");
				}, onSuccess : () =>{
					console.log("onSuccess");
				} 
			})*/
		}
	}

	const handleSubmitOrganization = (organization) => {
		console.log('handleSubmitOrganization', organization);
		if(isAuthenticated){
			if(user?.get("type") == 2){
				navigate('/dashboards/organization/settings');
			}
			else if(user?.get("type") == 1){
				navigate('/dashboards/profile/settings');
			}else{
				const contractData: any = {
					abi,
					contractAddress,
					functionName: 'registerOrganisation',
					params: {
						name: organization?.name,
						thematicIds: organization?.thematics,
						countryId: organization?.country,
					},
				};
				fetch({ params: contractData });
				setNewOrganisation(organization);
			}
		}else{
			authenticate().then(res=>{
				const contractData: any = {
					abi,
					contractAddress,
					functionName: 'registerOrganisation',
					params: {
						name: organization?.name,
						thematicIds: organization?.thematics,
						countryId: organization?.country,
					},
				};
				fetch({ params: contractData });
				setNewOrganisation(organization);
			})
		}
	};

	const renderForm = () => {
		
		if (signup === SignupType.Organization) {
			return (
				<OrganizationSignup
					thematics={thematics}
					countries={countries}
					onSubmitOrganization={handleSubmitOrganization}
				/>
			);
		}
		if (signup === SignupType.Member) {
			return <MemberSignup onSubmitMember={handleSubmitMember}/>;
		}
		if (signup === SignupType.None) {
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

	const userConnect =  () =>{
		
		console.log("userConnect")
		authenticate();
		// authenticate({ onComplete: async () => {
		// 	console.log("onComplete", isUserUpdating, user)
		// 	if(isAuthenticated){
		// 		if(user?.get("type") == 2){
		// 			navigate('/dashboards/organization/settings');
		// 		}else if(user?.get("type") == 1){
		// 			navigate('/dashboards/profile/settings');
		// 		}
		// 	}
		// }, onError : () =>{
		// 	console.warn("authenticate error");
		// }, onSuccess : () =>{
		// 	console.log("onSuccess");
		// } })

	
	}

	const renderAppBar = () => {
		
		if(isAuthenticated && user){
			return (
			<AppBar>
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<Logo /> <h1>Yu-go DAO</h1>
				</Box>
				<h4>{user.get('ethAddress')}</h4>
				<Button onClick={() => logout()} variant="contained" disabled={isAuthenticating}>Logout</Button>
			</AppBar>
		);
		}
		return (
			<AppBar>
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<Logo /> <h1>Yu-go DAO</h1>
				</Box>
				<Button onClick={() => {userConnect()}} variant="contained">Connect Wallet</Button>
			</AppBar>
		);
	}



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
						<img alt="Coming Soon" height={400} src="/static/images/logo/woman.svg" />
					</Box>
				</Container>

				<Container maxWidth="sm">
					<EnableWeb3>
						{signup === SignupType.None && (
							<Box>
								<Typography variant="h1" sx={{ fontSize: '3rem' }}>
									Unlock the next step in community cooperation
								</Typography>
								<Typography sx={{ fontSize: '1.5rem', padding: '20px 0px' }}>
									YU-GO DAO gives direct power to the women of ex-Yugoslavie. Join us in pioneering
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
							{renderForm()}
						</Box>
					</EnableWeb3>
				</Container>
			</MainContent>
		</Wrapper>
	);
}

export default LandingPage;
