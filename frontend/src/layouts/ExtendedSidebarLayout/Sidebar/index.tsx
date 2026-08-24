import { useContext } from 'react';
import Scrollbar from '../../../components/Scrollbar';
import { SidebarContext } from '../../../contexts/SidebarContext';

import { Box, Drawer, styled, Divider, useTheme } from '@mui/material';

import SidebarTopSection from './SidebarTopSection';
import SidebarMenu from './SidebarMenu';
import SidebarFooter from './SidebarFooter';

const SidebarWrapper = styled(Box)(
  ({ theme }) => `
        width: ${theme.sidebar.width};
        min-width: ${theme.sidebar.width};
        color: ${theme.palette.text.secondary};
        background: ${theme.palette.background.paper};
        border-right: 1px solid ${theme.palette.divider};
        position: relative;
        z-index: 7;
        height: 100%;
        padding-bottom: 61px;
`
);

// The KMUTNB brand mark — same gradient icon-tile used on every other page,
// standing in for the template's generic "Tokyo" diamond logo.
function BrandMark() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: 2,
        display: 'grid',
        placeItems: 'center',
        fontSize: '1.2rem',
        mx: 'auto',
        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`
      }}
    >
      🏟
    </Box>
  );
}

function Sidebar() {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);
  const closeSidebar = () => toggleSidebar();
  const theme = useTheme();

  return (
    <>
      <SidebarWrapper
        sx={{
          display: {
            xs: 'none',
            lg: 'inline-block'
          },
          position: 'fixed',
          left: 0,
          top: 0
        }}
      >
        <Scrollbar>
          <Box mt={3}>
            <BrandMark />
          </Box>
          <Divider sx={{ my: theme.spacing(3), mx: theme.spacing(2) }} />
          <SidebarTopSection />
          <Divider sx={{ my: theme.spacing(3), mx: theme.spacing(2) }} />
          <SidebarMenu />
        </Scrollbar>
        <Divider />
        <SidebarFooter />
      </SidebarWrapper>
      <Drawer
        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
        open={sidebarToggle}
        onClose={closeSidebar}
        variant="temporary"
        elevation={9}
      >
        <SidebarWrapper>
          <Scrollbar>
            <Box mt={3}>
              <BrandMark />
            </Box>
            <Divider sx={{ my: theme.spacing(3), mx: theme.spacing(2) }} />
            <SidebarTopSection />
            <Divider sx={{ my: theme.spacing(3), mx: theme.spacing(2) }} />
            <SidebarMenu />
          </Scrollbar>
          <SidebarFooter />
        </SidebarWrapper>
      </Drawer>
    </>
  );
}

export default Sidebar;
