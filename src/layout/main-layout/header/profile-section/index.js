import { useEffect, useRef, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
import { useRouter } from 'next/navigation';
// Material-ui
import { Avatar, Box, ClickAwayListener, List, ListItemButton, ListItemIcon, ListItemText, Paper, Popper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import MainCard from 'ui-component/cards/main-card';
import Transitions from 'ui-component/extended/transitions';
import InitialExtractor from 'utils/initialExtractor';
import { storageService } from '../../../../services/storage-service';
import { ChangePasswordDrawer } from './change-password-drawer';

// Assets
import { IconLogout, IconSettings } from '@tabler/icons-react';
// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
  // Retrieve firstName and lastName from local storage
  const userData = JSON.parse(localStorage.getItem('userData')) || {};
  const firstName = userData.firstName || 'FirstName';
  const lastName = userData.lastName || 'LastName';
  const displayName = firstName + ' ' + lastName;

  const theme = useTheme();
  // const customization = useSelector((state) => state.customization);
  // const auth = useSelector((state) => state.auth);
  // const navigate = useNavigate();
  const router = useRouter();

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef(null);
  const handleLogout = async () => {
    // navigate('auth/logout');
    router.push('/auth/logout');
    storageService.removeData();
  };

  const toggleDrawer = () => () => {
    setNavOpen((open) => !open);
  };

  const handleClose = (event) => {
    if (anchorRef.current?.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListItemClick = (event, index, route = '') => {
    setSelectedIndex(index);
    handleClose(event);

    if (route && route !== '') {
      router.push(route);
    }
  };
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Avatar
        id="profile_btn"
        sx={{
          ...theme.typography.mediumAvatar,
          marginRight: theme.spacing(5),
          cursor: 'pointer',
          width: 42,
          height: 42
        }}
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        color="inherit"
        onClick={handleToggle}
        className="border-3 "
      >
        {InitialExtractor(displayName)}
      </Avatar>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 14]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[1]}>
                  {/* <Box sx={{ p: 2 }}>
                    <Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography component="div" variant="h3" sx={{ fontWeight: 400, pt: 2, pl: 3 }}>
                          {auth.user.display_name}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box> */}
                  <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>
                    <Box>
                      <List
                        component="nav"
                        sx={{
                          width: '100%',
                          maxWidth: 350,
                          minWidth: 300,
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: '10px',
                          [theme.breakpoints.down('md')]: {
                            minWidth: '100%'
                          },
                          '& .MuiListItemButton-root': {
                            mt: 0.5
                          }
                        }}
                      >
                        <ListItemButton
                          sx={{ borderRadius: `5px` }}
                          selected={selectedIndex === 0}
                          onClick={(event) => handleListItemClick(event, 0, '#')}
                        >
                          <ListItemIcon>
                            <IconSettings onClick={toggleDrawer()} stroke={1.5} size="1.3rem" />
                          </ListItemIcon>
                          <ListItemText onClick={toggleDrawer()} primary={<Typography variant="body2">Change Password</Typography>} />
                        </ListItemButton>

                        <ListItemButton sx={{ borderRadius: `5px` }} selected={selectedIndex === 4} onClick={handleLogout}>
                          <ListItemIcon>
                            <IconLogout stroke={1.5} size="1.3rem" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
                        </ListItemButton>
                      </List>
                    </Box>
                  </PerfectScrollbar>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
      {/* Drawer */}
      <ChangePasswordDrawer navOpen={navOpen} toggleDrawer={toggleDrawer} />
      {/* Drawer */}
    </>
  );
};

export default ProfileSection;
