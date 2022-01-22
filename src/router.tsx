import React, { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { RouteObject } from 'react-router';

import SidebarLayout from 'src/layouts/SidebarLayout';
import BaseLayout from 'src/layouts/BaseLayout';
import Overview from 'src/content/overview';
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

// import SuspenseLoader from './components/SuspenseLoader';

// const Loader = (Component) => (props) =>
//   (
//     <Suspense fallback={<SuspenseLoader />}>
//       <Component {...props} />
//     </Suspense>
//   );

// Pages

// const Overview = lazy(() => import('./content/overview'));

// Dashboards

// const Tasks = Loader(lazy(() => import('./content/dashboards/Tasks')));

// Applications

// const Transactions = Loader(lazy(() => import('./content/applications/Transactions')));
// const UserProfile = Loader(lazy(() => import('./content/applications/Users/profile')));
// const UserSettings = Loader(lazy(() => import('./content/applications/Users/settings')));

// Status

// const Status404 = Loader(lazy(() => import('./content/pages/Status/Status404')));
// const Status500 = Loader(lazy(() => import('./content/pages/Status/Status500')));
// const StatusComingSoon = Loader(lazy(() => import('./content/pages/Status/ComingSoon')));
// const StatusMaintenance = Loader(lazy(() => import('./content/pages/Status/Maintenance')));

const routes: RouteObject[] = [
	{
		path: '/',
		element: <LandingPage />,
	},
	{
		path: 'status',
		// element: <Navigate to="404" replace />,
		children: [
			// {
			//   path: '/',
			//   element: <Navigate to="404" replace />
			// },
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
		],
	},
	{
		path: 'dashboards',
		element: <SidebarLayout />,
		children: [
			// {
			//   path: '/',
			//   element: <Navigate to="/dashboards/tasks" replace />
			// },
			{
				path: 'tasks',
				element: <Tasks />,
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
					{
						path: 'settings',
						element: <UserSettings />,
					},
				],
			},
		],
	},
	{
		path: 'management',
		element: <SidebarLayout />,
		children: [
			// {
			//   path: '/',
			//   element: <Navigate to="/management/transactions" replace />
			// },
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
];

export default routes;
