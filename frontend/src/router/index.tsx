import { RouteObject } from 'react-router';

import Authenticated from '../components/Authenticated';

import BaseLayout from '../layouts/BaseLayout';
import ExtendedSidebarLayout from '../layouts/ExtendedSidebarLayout';

import dashboardsRoutes from './dashboards';
import accountRoutes from './account';
import baseRoutes from './base';

const router: RouteObject[] = [
  {
    path: 'account',
    children: accountRoutes
  },
  {
    path: '',
    element: <BaseLayout />,
    children: baseRoutes
  },

  // Extended Sidebar Layout — the one layout the booking product uses

  {
    path: 'extended-sidebar',
    element: (
      <Authenticated>
        <ExtendedSidebarLayout />
      </Authenticated>
    ),
    children: [
      {
        path: 'dashboards',
        children: dashboardsRoutes
      }
    ]
  }
];

export default router;
