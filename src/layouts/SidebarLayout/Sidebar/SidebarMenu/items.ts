import React, { ReactNode } from 'react';

import DesignServicesTwoToneIcon from '@mui/icons-material/DesignServicesTwoTone';
import BrightnessLowTwoToneIcon from '@mui/icons-material/BrightnessLowTwoTone';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TableChartTwoToneIcon from '@mui/icons-material/TableChartTwoTone';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import FemaleIcon from '@mui/icons-material/Female';
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

export const organizationMenuItems: MenuItems[] = [
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
		heading: 'Yugo DAO',
		items: [
			{
				name: 'DAO',
				icon: VerifiedUserTwoToneIcon,
				link: '/dao',
				items: [
					{
						name: 'Proposals',
						link: '/status/coming-soon',
					},
					// {
					//   name: 'Error 500',
					//   link: '/status/500'
					// },
					{
						name: 'Maintenance',
						link: '/status/maintenance',
					},
					{
						name: 'Tasks',
						link: '/status/tasks',
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

export const memberMenuItems: MenuItems[] = [
	{
		heading: 'Dashboards',
		items: [
			{
				name: 'Member',
				link: '/dashboards/profile',
				icon: FemaleIcon,
				items: [
					{
						name: 'Details',
						link: '/dashboards/profile/details',
					},
				],
			},
		],
	},
	{
		heading: 'Happenings',
		items: [
			{
				name: 'Contests',
				icon: CampaignIcon,
				link: '/happenings/contests',
			},
			{
				name: 'Actions',
				icon: PendingActionsOutlinedIcon,
				link: '/happenings/actions',
			},
		],
	},
	{
		heading: 'Yugo DAO',
		items: [
			{
				name: 'DAO',
				icon: VerifiedUserTwoToneIcon,
				link: '/dao',
				items: [
					{
						name: 'Proposals',
						link: '/status/coming-soon',
					},
					// {
					//   name: 'Error 500',
					//   link: '/status/500'
					// },
					{
						name: 'Maintenance',
						link: '/status/maintenance',
					},
					{
						name: 'Tasks',
						link: '/status/tasks',
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
