import React, { ReactNode } from 'react';

import DesignServicesTwoToneIcon from '@mui/icons-material/DesignServicesTwoTone';
import BrightnessLowTwoToneIcon from '@mui/icons-material/BrightnessLowTwoTone';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TableChartTwoToneIcon from '@mui/icons-material/TableChartTwoTone';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import VerifiedUserTwoToneIcon from '@mui/icons-material/VerifiedUserTwoTone';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import CampaignIcon from '@mui/icons-material/Campaign';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';

export interface MenuItem {
	link?: string;
	icon?: ReactNode;
	badge?: string;
	items?: MenuItem[];
	name: string;
}

export interface MenuItems {
	items: MenuItem[];
	heading: string;
}

const menuItems: MenuItems[] = [
	{
		heading: 'Dashboards',
		items: [
			{
				name: 'Organization',
				link: '/dashboards/organization',
				icon: BrightnessLowTwoToneIcon,
				items: [
					{
						name: 'Details',
						link: '/dashboards/organization/details',
					},
					{
						name: 'Settings',
						link: '/dashboards/organization/settings',
					},
				],
			},
		],
	},
	{
		heading: 'Management',
		items: [
			{
				name: 'Members',
				icon: GroupAddIcon,
				link: '/management/members',
			},
			{
				name: 'Contests',
				icon: CampaignIcon,
				link: '/management/contests',
			},
			{
				name: 'Actions',
				icon: PendingActionsOutlinedIcon,
				link: '/management/actions',
			},
			{
				name: 'Transactions',
				icon: MonetizationOnIcon,
				link: '/management/transactions',
			},
		],
	},
	{
		heading: 'Yu-GO DAO',
		items: [
			{
				name: 'DAO',
				icon: VerifiedUserTwoToneIcon,
				link: '/dao',
				items: [
					{
						name: 'Proposals',
						link: '/dao/proposals',
					},
					// {
					//   name: 'Error 500',
					//   link: '/status/500'
					// },
					{
						name: 'Maintenance',
						link: '/status/maintenance',
					},
					// {
					//   name: 'Coming Soon',
					//   link: '/status/coming-soon'
					// }
				],
			},
		],
	},
];

export default menuItems;
