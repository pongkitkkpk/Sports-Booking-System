import { RouteObject } from 'react-router';

import Authenticated from '../components/Authenticated';
import { Navigate } from 'react-router-dom';

import BoxedSidebarLayout from '../layouts/BoxedSidebarLayout';
import DocsLayout from '../layouts/DocsLayout';
import BaseLayout from '../layouts/BaseLayout';
import AccentHeaderLayout from '../layouts/AccentHeaderLayout';

import ExtendedSidebarLayout from '../layouts/ExtendedSidebarLayout';
import CollapsedSidebarLayout from '../layouts/CollapsedSidebarLayout';

import TopNavigationLayout from '../layouts/TopNavigationLayout';

import dashboardsRoutes from './dashboards';
import blocksRoutes from './blocks';
import applicationsRoutes from './applications';
import managementRoutes from './management';
import documentationRoutes from './documentation';
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

  // Documentation

  {
    path: 'docs',
    element: <DocsLayout />,
    children: documentationRoutes
  },

  // Boxed Sidebar Layout

  {
    path: 'boxed-sidebar',
    element: (
      <Authenticated>
        <BoxedSidebarLayout />
      </Authenticated>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="dashboards" replace />
      },
      {
        path: 'dashboards',
        children: dashboardsRoutes
      },
      {
        path: 'blocks',
        children: blocksRoutes
      },
      {
        path: 'applications',
        children: applicationsRoutes
      },
      {
        path: 'management',
        children: managementRoutes
      }
    ]
  },


  // Collapsed Sidebar Layout

  {
    path: 'collapsed-sidebar',
    element: (
      <Authenticated>
        <CollapsedSidebarLayout />
      </Authenticated>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="dashboards" replace />
      },
      {
        path: 'dashboards',
        children: dashboardsRoutes
      },
      {
        path: 'blocks',
        children: blocksRoutes
      },
      {
        path: 'applications',
        children: applicationsRoutes
      },
      {
        path: 'management',
        children: managementRoutes
      },
      {
        path: 'management',
        children: managementRoutes
      }
    ]
  },


  // Top Navigation Layout

  {
    path: 'top-navigation',
    element: (
      <Authenticated>
        <TopNavigationLayout />
      </Authenticated>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="dashboards" replace />
      },
      {
        path: 'dashboards',
        children: dashboardsRoutes
      },
      {
        path: 'blocks',
        children: blocksRoutes
      },
      {
        path: 'applications',
        children: applicationsRoutes
      },
      {
        path: 'management',
        children: managementRoutes
      }
    ]
  },

  // Accent Header Layout

  {
    path: 'accent-header',
    element: (
      <Authenticated>
        <AccentHeaderLayout />
      </Authenticated>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="dashboards" replace />
      },
      {
        path: 'dashboards',
        children: dashboardsRoutes
      },
      {
        path: 'blocks',
        children: blocksRoutes
      },
      {
        path: 'applications',
        children: applicationsRoutes
      },
      {
        path: 'management',
        children: managementRoutes
      }
    ]
  },

  // Extended Sidebar Layout

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
      },
      {
        path: 'blocks',
        children: blocksRoutes
      },
      {
        path: 'applications',
        children: applicationsRoutes
      },
      {
        path: 'management',
        children: managementRoutes
      }

    ]
  }
];

export default router;
