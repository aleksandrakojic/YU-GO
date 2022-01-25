import React, { useRef, useState } from 'react';

import { NavLink } from 'react-router-dom';

import {
	Avatar,
	Box,
	Button,
	Divider,
	Hidden,
	lighten,
	List,
	ListItem,
	ListItemText,
	Popover,
	Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';

const MetamaskButton = styled(Button)(
	({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
`
);

const MenuUserBox = styled(Box)(
	({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`
);

const MetamaskBoxText = styled(Box)(
	({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const MetamaskBoxLabel = styled(Typography)(
	({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

const MetamaskBoxDescription = styled(Typography)(
	({ theme }) => `
        color: ${lighten(theme.palette.secondary.main, 0.5)}
`
);

export const MetamaskLogoutButton = (name, address) => {
	const ethAddress = address
		? `${address?.substring(0, 6)}...${address.substring(address.length - 4, address.length)}`
		: '';

	return (
		<MetamaskButton color="secondary">
			<Avatar variant="rounded" alt={name} src="/static/images/avatars/MetaMask.png" />
			<MetamaskBoxText>
				<MetamaskBoxDescription variant="body1">Ethereum network</MetamaskBoxDescription>
				<MetamaskBoxDescription variant="h5">{ethAddress}</MetamaskBoxDescription>
			</MetamaskBoxText>
			<Box>
				<LockOpenTwoToneIcon sx={{ mr: 1 }} />
			</Box>
		</MetamaskButton>
	);
};

interface Props {
	currentUser?: any;
	logout: () => void;
}

function MetamaskBox({ currentUser, logout }: Props) {
	const addr = currentUser?.attributes?.ethAddress;
	const user = {
		name: 'Ethereum network',
		avatar: '/static/images/avatars/MetaMask.png',
		ethAddress: addr
			? `${addr?.substring(0, 6)}...${addr.substring(addr.length - 4, addr.length)}`
			: '',
	};

	const ref = useRef<any>(null);
	const [isOpen, setOpen] = useState<boolean>(false);

	const handleOpen = (): void => {
		setOpen(true);
	};

	const handleClose = (): void => {
		setOpen(false);
	};

	return (
		<>
			<MetamaskButton color="secondary" ref={ref} onClick={handleOpen}>
				<Avatar variant="rounded" alt={user.name} src={user.avatar} />
				<Hidden mdDown>
					<MetamaskBoxText>
						<MetamaskBoxLabel variant="body1">{user.name}</MetamaskBoxLabel>
						<MetamaskBoxDescription variant="h4">{user.ethAddress}</MetamaskBoxDescription>
					</MetamaskBoxText>
				</Hidden>
				<Hidden smDown>
					<ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
				</Hidden>
			</MetamaskButton>
			<Popover
				anchorEl={ref.current}
				onClose={handleClose}
				open={isOpen}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
			>
				<MenuUserBox sx={{ minWidth: 210 }} display="flex">
					<Avatar variant="rounded" alt={user.name} src={user.avatar} />
					<MetamaskBoxText>
						<MetamaskBoxLabel variant="body1">{user.name}</MetamaskBoxLabel>
						<MetamaskBoxDescription variant="body2">{user.ethAddress}</MetamaskBoxDescription>
					</MetamaskBoxText>
				</MenuUserBox>
				<Divider sx={{ mb: 0 }} />
				<List sx={{ p: 1 }} component="nav">
					<ListItem button to="/organization/details" component={NavLink}>
						<AccountBoxTwoToneIcon fontSize="small" />
						<ListItemText primary="My organization" />
					</ListItem>
					<ListItem button to="/organization/settings" component={NavLink}>
						<AccountTreeTwoToneIcon fontSize="small" />
						<ListItemText primary="Account Settings" />
					</ListItem>
				</List>
				<Divider />
				<Box sx={{ m: 1 }}>
					<Button color="primary" fullWidth onClick={logout}>
						<LockOpenTwoToneIcon sx={{ mr: 1 }} />
						Sign out
					</Button>
				</Box>
			</Popover>
		</>
	);
}

export default MetamaskBox;
