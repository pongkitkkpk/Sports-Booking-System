import { useRef, useState } from 'react';
import {
  Box,
  Button,
  Popover,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import KeyboardArrowDownTwoToneIcon from '@mui/icons-material/KeyboardArrowDownTwoTone';
import { useVisibleBookingNav } from '../../../../config/bookingNav';

function HeaderMenu() {
  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);
  const bookingNav = useVisibleBookingNav();

  return (
    <>
      <Box sx={{ display: { xs: 'none', md: 'inline-flex' } }}>
        <Button
          ref={ref}
          onClick={() => setOpen(true)}
          endIcon={<KeyboardArrowDownTwoToneIcon />}
          color="primary"
          variant="outlined"
          size="small"
        >
          เมนูด่วน
        </Button>
      </Box>
      <Popover
        disableScrollLock
        anchorEl={ref.current}
        onClose={() => setOpen(false)}
        open={isOpen}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography variant="h5">ระบบจองสนามกีฬา KMUTNB</Typography>
        </Box>
        <Divider />
        <List sx={{ minWidth: 260, py: 1 }}>
          {bookingNav.map((item) => (
            <ListItemButton
              key={item.name}
              component={RouterLink}
              to={item.link}
              onClick={() => setOpen(false)}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
                <item.icon />
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          ))}
        </List>
      </Popover>
    </>
  );
}

export default HeaderMenu;
