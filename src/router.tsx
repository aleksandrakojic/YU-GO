import React from 'react';
import { Navigate } from 'react-router-dom';
import { RouteObject } from 'react-router';

import SidebarLayout from 'src/layouts/SidebarLayout';
import Status404 from 'src/content/pages/Status/Status404';
import Status500 from 'src/content/pages/Status/Status500';
import StatusMaintenance from 'src/content/pages/Status/Maintenance';
import StatusComingSoon from 'src/content/pages/Status/ComingSoon';
import Tasks from 'src/content/dashboards/Tasks';
import Transactions from 'src/content/applications/Transactions';
import UserProfile from 'src/content/applications/Users/profile';
import UserSettings from 'src/content/applications/Users/settings';
import LandingPage from './content/pages/Landing';
import OrganizationMembers from './content/applications/Members';
import ContestsContainer from './content/applications/Contests';
import ActionsContainer from './content/applications/Actions';

const routes: RouteObject[] = [
	{
		path: '/',
		element: <LandingPage />,
	},
	{
		path: 'status',
		children: [
			{
				path: '',
				element: <Navigate to="404" replace />,
			},
			{
				path: '404',
				element: <Status404 />,
			},
			{
				path: '500',
				element: <Status500 />,
			},
			{
				path: 'maintenance',
				element: <StatusMaintenance />,
			},
			{
				path: 'coming-soon',
				element: <StatusComingSoon />,
			},
			{
				path: 'tasks',
				element: <Tasks />,
			},
		],
	},
	{
		path: 'dashboards',
		element: <SidebarLayout />,
		children: [
			{
				path: '',
				element: <Navigate to="/" replace />,
			},
			{
				path: 'organization',
				children: [
					{
						path: '',
						element: <Navigate to="details" replace />,
					},
					{
						path: 'details',
						element: <UserProfile />,
					},
					{
						path: 'settings',
						element: <UserSettings />,
					},
				],
			},
			{
				path: 'profile',
				children: [
					{
						path: '',
						element: <Navigate to="details" replace />,
					},
					{
						path: 'details',
						element: <UserProfile />,
					},
				],
			},
		],
	},
	{
		path: 'management',
		element: <SidebarLayout />,
		children: [
			{
				path: '',
				element: <Navigate to="/management/members" replace />,
			},
			{
				path: 'members',
				element: <OrganizationMembers />,
			},
			{
				path: 'contests',
				element: <ContestsContainer />,
			},
			{
				path: 'actions',
				element: <ActionsContainer />,
			},
			{
				path: 'transactions',
				element: <Transactions />,
			},
		],
	},
	{
		path: 'happenings',
		element: <SidebarLayout />,
		children: [
			{
				path: '',
				element: <Navigate to="/happenings/contests" replace />,
			},
			{
				path: 'contests',
				element: <ContestsContainer />,
			},
			{
				path: 'actions',
				element: <ActionsContainer />,
			},
		],
	},
];

export default routes;
