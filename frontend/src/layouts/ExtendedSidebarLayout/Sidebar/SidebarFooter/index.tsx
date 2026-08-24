import { Box, Button, alpha, useTheme } from '@mui/material';
import PowerSettingsNewTwoToneIcon from '@mui/icons-material/PowerSettingsNewTwoTone';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../../hooks/useAuth';

function SidebarFooter() {
  const theme = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ px: 2, py: 2 }}>
      <Button
        fullWidth
        onClick={handleLogout}
        startIcon={<PowerSettingsNewTwoToneIcon />}
        sx={{
          justifyContent: 'flex-start',
          color: theme.palette.primary.dark,
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
          transition: `${theme.transitions.create(['all'])}`,

          '&:hover': {
            backgroundColor: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText
          }
        }}
      >
        ออกจากระบบ
      </Button>
    </Box>
  );
}

export default SidebarFooter;
