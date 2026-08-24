import { Helmet } from 'react-helmet-async';
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Container,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import useAuth from '../../../../hooks/useAuth';
import Footer from '../../../../components/Footer';
import { bookingNav } from '../../../../config/bookingNav';

function ManagementUsersView() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (): Promise<void> => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <Helmet>
        <title>โปรไฟล์ - ระบบจองสนามกีฬา KMUTNB</title>
      </Helmet>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ p: { xs: 3, sm: 4 } }}>
              <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
                <Avatar
                  sx={{
                    width: 72,
                    height: 72,
                    fontSize: '1.8rem',
                    bgcolor: 'primary.main'
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 200 }}>
                  <Typography variant="h3">{user?.name}</Typography>
                  <Chip
                    label={user?.jobtitle}
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<LockOpenTwoToneIcon />}
                  onClick={handleLogout}
                >
                  ออกจากระบบ
                </Button>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <Box sx={{ p: 3, pb: 1 }}>
                <Typography variant="h4">เมนูลัด</Typography>
              </Box>
              <Divider />
              <List sx={{ py: 1 }}>
                {bookingNav.map((item) => (
                  <ListItemButton
                    key={item.name}
                    component={RouterLink}
                    to={item.link}
                  >
                    <ListItemIcon sx={{ color: 'primary.main' }}>
                      <item.icon />
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                ))}
              </List>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default ManagementUsersView;
