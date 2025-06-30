import PropTypes from 'prop-types';

// Material-ui
import { Avatar, Box, Drawer, Paper, Popper, Stack, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Third-party
import { BrowserView, MobileView } from 'react-device-detect';
import PerfectScrollbar from 'react-perfect-scrollbar';

// Project imports
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { drawerWidth } from 'store/constant';
import MainCard from 'ui-component/cards/main-card';
import Transitions from 'ui-component/extended/transitions';
import InitialExtractor from 'utils/initialExtractor';
import LogoSection from '../logo-section';
import MenuList from './menu-list';

// ==============================|| SIDEBAR DRAWER ||============================== //

const Sidebar = ({ drawerOpen, drawerToggle, window }) => {
  const theme = useTheme();

  // Retrieve firstName and lastName from local storage
  const userData = JSON.parse(localStorage.getItem('userData')) || {};
  const firstName = userData.firstName || 'FirstName';
  const lastName = userData.lastName || 'LastName';
  const displayName = firstName + ' ' + lastName;

  // Get the current date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }); // Format: 18 Dec 2023

  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));
  const container = window !== undefined ? () => window.document.body : undefined;

  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

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
  const drawer = (
    <>
      <Box sx={{ display: { xs: 'block' } }} className="left_bar_logo">
        <Box sx={{ display: 'flex', mx: 'auto', justifyContent: 'center' }}>
          <LogoSection className="left-bar-logo-wrapper" />
        </Box>
      </Box>

      <Box className="h-center mobile-stay-on-top-sidebar">
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '23px' }}>
          <Avatar
            sx={{ width: 90, height: 90, boxShadow: '0px 14px 18px 1px #BFD5EB', border: `6px solid ${theme.palette.background.paper}` }}
          >
            {InitialExtractor(displayName)}
          </Avatar>
        </Box>

        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', marginTop: theme.spacing(5) }}
          ref={anchorRef}
          onClick={handleToggle}
        >
          <Typography fontWeight={300} variant="para" align="center" color={theme.palette.primary.main} sx={{}}>
            Hi, {`${firstName} ${lastName}`}{' '}
          </Typography>
          {/* <KeyboardArrowDownIcon sx={{ ml: 1 }} /> */}
        </Box>

        <Typography variant="smalltext" align="center" color={theme.palette.primary.main} sx={{ marginBottom: '15px', display: 'block' }}>
          {formattedDate}
        </Typography>
      </Box>

      <BrowserView className="mobile-stay-on-top-sidebar">
        <PerfectScrollbar
          component="div"
          style={{
            zIndex: 999,
            padding: 0,
            background: theme.palette.primary.light,
            // height: !matchUpMd ? 'calc(100vh - 56px)' : 'calc(100vh - 88px)',
            boxShadow: '#BFD5EB'
          }}
        >
          <MenuList />
        </PerfectScrollbar>
      </BrowserView>

      <MobileView>
        <Box sx={{ px: 2 }}>
          <MenuList />
        </Box>
      </MobileView>

      <Popper
        sx={{ zIndex: 9999 }}
        placement="bottom"
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
              <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[1]}>
                <Box sx={{ p: 2 }}>
                  <Stack>
                    <Typography>Hello I am {`${firstName} ${lastName}`}</Typography>
                  </Stack>
                </Box>
              </MainCard>
            </Paper>
          </Transitions>
        )}
      </Popper>

      {/* <Box
        className="banner-snippet"
        sx={{
          backgroundImage: 'url(/images/home/sidebar-snnipet.png)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          padding: '20px'
        }}
      >
        <Box display={'flex'} alignItems={'center'}>
          <Avatar
            sx={{
              width: 72,
              height: 72,
              background: theme.palette.background.paper,
              border: `1px solid #EBEBEB`,
              mr: theme.spacing(3.752)
            }}
          >
            <Avatar sx={{ width: 48, height: 48, boxShadow: theme.shadows[5], background: theme.palette.background.paper }}>
              <LogoutIcon />
            </Avatar>
          </Avatar>

          <Box display={'flex'} flexDirection={'column'}>
            <Box display={'flex'} alignItems={'center'}>
              <CircleIcon color="success" fontSize="small" sx={{ stroke: '#ffffff', strokeWidth: 3 }} />
              <Typography color={theme.palette.background.paper} ml={2} sx={{ fontSize: '1rem' }}>
                Logout
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box> */}
      <Box className="sidebar-bg-img">
        <Image
          priority={true}
          fill={true}
          style={{
            objectFit: 'cover'
          }}
          src="/images/home/sidebar.png"
          alt="sidebar-img"
        />
      </Box>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ flexShrink: { md: 0 }, width: matchUpMd ? (drawerOpen ? drawerWidth : 0) : 'auto' }}
      aria-label="mailbox folders"
    >
      <Drawer
        container={container}
        variant={matchUpMd ? 'persistent' : 'temporary'}
        anchor="left"
        open={drawerOpen}
        onClose={drawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerOpen ? drawerWidth : 0, // Adjust width based on drawerOpen state
            background: '#F1F5FF',
            color: theme.palette.text.primary,
            boxShadow: theme.shadows[2],
            borderRight: 'none',
            [theme.breakpoints.up('md')]: {
              top: '0px',
              zIndex: '1098'
            }
          }
        }}
        ModalProps={{ keepMounted: true }}
        color="inherit"
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

Sidebar.propTypes = {
  drawerOpen: PropTypes.bool,
  drawerToggle: PropTypes.func,
  window: PropTypes.object
};

export default Sidebar;
