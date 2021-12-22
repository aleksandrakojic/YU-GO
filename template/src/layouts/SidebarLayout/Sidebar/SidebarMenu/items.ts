import React, { ReactNode } from 'react';

import DesignServicesTwoToneIcon from '@mui/icons-material/DesignServicesTwoTone';
import BrightnessLowTwoToneIcon from '@mui/icons-material/BrightnessLowTwoTone';
import MmsTwoToneIcon from '@mui/icons-material/MmsTwoTone';
import TableChartTwoToneIcon from '@mui/icons-material/TableChartTwoTone';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import VerifiedUserTwoToneIcon from '@mui/icons-material/VerifiedUserTwoTone';

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
    heading: '',
    items: [
      {
        name: 'Overview',
        link: '/overview',
        icon: DesignServicesTwoToneIcon
      }
    ]
  },
  {
    heading: 'Dashboards',
    items: [
      {
        name: 'Crypto',
        link: '/dashboards/crypto',
        icon: BrightnessLowTwoToneIcon
      }
    ]
  },
  {
    heading: 'Management',
    items: [
      {
        name: 'Transactions',
        icon: TableChartTwoToneIcon,
        link: '/management/transactions'
      },
      {
        name: 'User Profile',
        icon: AccountCircleTwoToneIcon,
        link: '/management/profile',
        items: [
          {
            name: 'Profile Details',
            link: '/management/profile/details'
          },
          {
            name: 'User Settings',
            link: '/management/profile/settings'
          }
        ]
      }
    ]
  },
  {
    heading: 'Extra Pages',
    items: [
      {
        name: 'Status',
        icon: VerifiedUserTwoToneIcon,
        link: '/status',
        items: [
          {
            name: 'Error 404',
            link: '/status/404'
          },
          {
            name: 'Error 500',
            link: '/status/500'
          },
          {
            name: 'Maintenance',
            link: '/status/maintenance'
          },
          {
            name: 'Coming Soon',
            link: '/status/coming-soon'
          }
        ]
      }
    ]
  }
];

export default menuItems;
