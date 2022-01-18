import * as React from 'react';
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
import { IAction } from 'src/models';
import { Box, Button } from '@mui/material';

interface Props {
	action: IAction;
	index: number;
}

const CardActionsWrapper = styled(CardActions)(
	({ theme }) => `
     background: ${theme.colors.alpha.black[5]};
     padding: ${theme.spacing(3)};
`
);

export default function ContestCard({ action, index }: Props) {
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
				sx={{ '.MuiCardHeader-title': { fontSize: '1.5rem' } }}
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
				title={action.name}
				subheader={
					<p>
						<i>{action?.createdAt?.toUTCString()}</i>
					</p>
				}
			/>
			<CardMedia component="img" height="190" image={renderImg()} alt="action" />
			<CardContent>
				<Typography variant="h5" color="primary">
					<u>Requested funds</u> : {action?.requiredFunds} ETH
				</Typography>
				<br />
				<Typography variant="body2" color="secondary">
					{action.description}
				</Typography>
			</CardContent>
			<CardActionsWrapper
				sx={{
					display: { xs: 'block', md: 'flex' },
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<Box>
					<Button startIcon={<ThumbUpAltTwoToneIcon />} variant="contained">
						Vote
					</Button>
					<Button startIcon={<CommentTwoToneIcon />} variant="outlined" sx={{ mx: 2 }}>
						Comment
					</Button>
				</Box>
			</CardActionsWrapper>
		</Card>
	);
}
