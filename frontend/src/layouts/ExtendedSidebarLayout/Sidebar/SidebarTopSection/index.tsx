import { useRef, useState } from 'react';
import useAuth from '../../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

import {
  Avatar,
  Box,
  Button,
  Divider,
  Popover,
  IconButton,
  Typography,
  styled,
  useTheme
} from '@mui/material';
import UnfoldMoreTwoToneIcon from '@mui/icons-material/UnfoldMoreTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';

const MenuUserBox = styled(Box)(
  ({ theme }) => `
    background: ${theme.palette.background.default};
    padding: ${theme.spacing(2)};
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
    text-align: left;
    padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
  () => `
    font-weight: 700;
    display: block;
`
);

function SidebarTopSection() {
  const theme = useTheme();

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleLogout = async (): Promise<void> => {
    try {
      handleClose();
      await logout();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        textAlign: 'center',
        mx: 2,
        pt: 1,
        position: 'relative'
      }}
    >
      <Avatar
        sx={{
          width: 68,
          height: 68,
          mb: 2,
          mx: 'auto',
          bgcolor: 'primary.main',
          fontSize: '1.6rem'
        }}
      >
        {user?.name?.charAt(0).toUpperCase()}
      </Avatar>

      <Typography variant="h4" color="text.primary">
        {user.name}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        {user.jobtitle}
      </Typography>
      <IconButton
        size="small"
        sx={{
          position: 'absolute',
          right: theme.spacing(0),
          top: theme.spacing(0),
          color: 'text.secondary',
          background: theme.palette.background.default,

          '&:hover': {
            color: 'primary.main',
            background: theme.palette.action.hover
          }
        }}
        ref={ref}
        onClick={handleOpen}
      >
        <UnfoldMoreTwoToneIcon fontSize="small" />
      </IconButton>
      <Popover
        disableScrollLock
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center'
        }}
      >
        <MenuUserBox sx={{ minWidth: 210 }} display="flex">
          <Avatar
            variant="rounded"
            sx={{ bgcolor: 'primary.main' }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <UserBoxText>
            <UserBoxLabel variant="body1">{user.name}</UserBoxLabel>
            <Typography variant="body2" color="text.secondary">
              {user.jobtitle}
            </Typography>
          </UserBoxText>
        </MenuUserBox>
        <Divider sx={{ mb: 0 }} />
        <Box m={1}>
          <Button color="primary" fullWidth onClick={handleLogout}>
            <LockOpenTwoToneIcon sx={{ mr: 1 }} />
            ออกจากระบบ
          </Button>
        </Box>
      </Popover>
    </Box>
  );
}

export default SidebarTopSection;
