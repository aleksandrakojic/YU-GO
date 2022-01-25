import React, { useContext, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import CommentTwoToneIcon from '@mui/icons-material/CommentTwoTone';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Typography from '@mui/material/Typography';
import ThumbUpAltTwoToneIcon from '@mui/icons-material/ThumbUpAltTwoTone';
import { IAction, ProfileType } from 'src/models';
import { Button, Chip } from '@mui/material';
import { useMoralis, useWeb3ExecuteFunction } from 'react-moralis';
import { AppContext } from 'src/contexts/AppContext';
import { LoadingButton } from '@mui/lab';
import { useSnackbar, VariantType } from 'notistack';

interface Props {
	action: any;
	index: number;
}

const CardActionsWrapper = styled(CardActions)(
	({ theme }) => `
     background: ${theme.colors.alpha.black[5]};
     padding: ${theme.spacing(3)};
`
);

export default function ActionCard({ action, index }: Props) {
	const { enqueueSnackbar } = useSnackbar();
	const { user, account, Moralis } = useMoralis();
	const { abi, contractAddress } = useContext(AppContext);
	const { data, isLoading, isFetching, fetch, error } = useWeb3ExecuteFunction();
	const isVoteDisabled = user?.attributes?.type === ProfileType.Organization;
	const hasVoted = action?.attributes?.voters?.includes(account?.toLowerCase());
	const [membersOrgaAddr, setMembersOrgaAddr] = useState();

	useEffect(() => {
		getMembersOrganisationAddr();
	}, []);

	useEffect(() => {
		if (data) {
			const event = (data as any)?.events?.HasVotedForAction?.event;
			if (event === 'HasVotedForAction') {
				const queryFunc = async () => {
					const query = new Moralis.Query('Actions');
					const votedAction = await query
						.equalTo('addrOrgaCreator', action?.attributes?.addrOrgaCreator?.toLowerCase())
						.first();
					if (votedAction) {
						votedAction?.addUnique('voters', account);
						const votes = votedAction?.attributes?.nbOfVotes + 1;
						votedAction?.set('nbOfVotes', votes);
						votedAction.save();
					}
				};
				queryFunc();
			}
		}
	}, [data]);

	useEffect(() => {
		if (error) {
			handleSnackMessage(error[0] || error['message'] || 'An error occured ...', 'error');
		}
	}, [error]);

	const getMembersOrganisationAddr = async () => {
		const query = new Moralis.Query('Participants');
		const member = await query.equalTo('ethAddress', account).first();

		const membersOrgaAddr = member?.attributes?.organisation;
		setMembersOrgaAddr(membersOrgaAddr);
	};

	const handleSnackMessage = (message: string, variant: VariantType) => {
		enqueueSnackbar(message, { variant });
	};

	const handleVote = () => {
		const votingData: any = {
			abi,
			contractAddress,
			functionName: 'voteForAction',
			msgSender: account,
			params: {
				_actionCreator: action?.attributes?.addrOrgaCreator,
				_creatorOfContest: action?.attributes?.addrGrantOrga,
				_participantOrga: membersOrgaAddr,
			},
		};
		fetch({ params: votingData });
	};

	// TODO: put images in db / IPFS
	const renderImg = () =>
		index % 3 === 0
			? 'https://www.unwomen.org/sites/default/files/Headquarters/Images/Sections/News/Stories/2020/2/small-actions-big-impact-march.gif'
			: index % 3 === 1
			? 'https://i.pinimg.com/originals/64/e7/f9/64e7f90ce2b5b5bb3b9a094e0be8a391.gif'
			: 'https://media.giphy.com/media/ijdXWu3oNxXQRPwjsh/giphy.gif';

	return (
		<Card
			sx={{
				margin: '10px',
				maxWidth: 350,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
			}}
		>
			<CardHeader
				sx={{ '.MuiCardHeader-title': { fontSize: '1.2rem' } }}
				avatar={
					<Avatar sx={{ bgcolor: 'lightcoral' }} aria-label="recipe">
						O
					</Avatar>
				}
				action={
					<IconButton aria-label="settings">
						<MoreVertIcon />
					</IconButton>
				}
				title={action?.attributes?.name}
				subheader={
					<p>
						<i>{action?.createdAt?.toUTCString()}</i>
					</p>
				}
			/>
			<CardMedia component="img" height="190" image={renderImg()} alt="action" />
			<CardContent>
				<Typography variant="h5" color="primary">
					<u>Requested funds</u> : {action?.attributes?.requiredFunds} ETH
				</Typography>
				<br />
				<Typography
					variant="body2"
					color="secondary"
					sx={{
						maxHeight: '130px',
						overflowY: 'auto',
						scrollbarGutter: 'stable',
						'::-webkit-scrollbar': {
							width: '2px',
							backgroundColor: '#404a76',
							margin: '2px',
						},
					}}
				>
					{action?.attributes?.description}
				</Typography>
			</CardContent>
			<CardActionsWrapper
				sx={{
					display: { xs: 'block', md: 'flex' },
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				{!isVoteDisabled && (
					<LoadingButton
						sx={{ mr: 2 }}
						startIcon={<ThumbUpAltTwoToneIcon />}
						variant="contained"
						disabled={isVoteDisabled || hasVoted}
						onClick={handleVote}
						loading={isLoading || isFetching}
					>
						{hasVoted ? 'Voted' : 'Vote'}
					</LoadingButton>
				)}
				<Button startIcon={<CommentTwoToneIcon />} variant="outlined">
					Comment
				</Button>
				<Chip label={`${action?.attributes?.nbOfVotes}`} color="info" sx={{ ml: 2 }} />
			</CardActionsWrapper>
		</Card>
	);
}
