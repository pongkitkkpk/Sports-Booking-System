import { FC, ReactNode, useMemo } from 'react';
import { Box, ThemeProvider, alpha, lighten, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { createKmutnbTheme } from '../../theme/kmutnbTheme';

import Sidebar from './Sidebar';
import Header from './Header';

interface ExtendedSidebarLayoutProps {
  children?: ReactNode;
}

// This is the one layout the real app uses (the other four — boxed-sidebar,
// collapsed-sidebar, top-navigation, accent-header — are unused template
// leftovers), so the KMUTNB brand theme is applied here at the root: header,
// sidebar and every routed page all share it, rather than each page opting
// in separately.
const ExtendedSidebarLayout: FC<ExtendedSidebarLayoutProps> = () => {
  const baseTheme = useTheme();
  const theme = useMemo(() => createKmutnbTheme(baseTheme), [baseTheme]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          flex: 1,
          height: '100%',
          color: 'text.primary',

          '.MuiPageTitle-wrapper': {
            background:
              theme.palette.mode === 'dark'
                ? theme.colors.alpha.trueWhite[5]
                : theme.colors.alpha.white[50],
            marginBottom: `${theme.spacing(4)}`,
            boxShadow:
              theme.palette.mode === 'dark'
                ? `0 1px 0 ${alpha(
                    lighten(theme.colors.primary.main, 0.7),
                    0.15
                  )}, 0px 2px 4px -3px rgba(0, 0, 0, 0.2), 0px 5px 12px -4px rgba(0, 0, 0, .1)`
                : `0px 2px 4px -3px ${alpha(
                    theme.colors.alpha.black[100],
                    0.1
                  )}, 0px 5px 12px -4px ${alpha(
                    theme.colors.alpha.black[100],
                    0.05
                  )}`
          }
        }}
      >
        <Header />
        <Sidebar />
        <Box
          sx={{
            position: 'relative',
            zIndex: 5,
            display: 'block',
            flex: 1,
            pt: `${theme.header.height}`,
            [theme.breakpoints.up('lg')]: {
              ml: `${theme.sidebar.width}`
            }
          }}
        >
          <Box display="block">
            <Outlet />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ExtendedSidebarLayout;
