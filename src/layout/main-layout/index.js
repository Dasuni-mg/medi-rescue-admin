// import { Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { AppBar, Box, CssBaseline, Toolbar, useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

// project imports
import { drawerWidth } from 'store/constant';
import Breadcrumbs from 'ui-component/extended/breadcrumbs';
import navigation from 'utils/menu-items';
import Header from './header';
import Sidebar from './sidebar';

// assets
import { IconChevronRight } from '@tabler/icons-react';

// styles
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  ...theme.typography.mainContent,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  transition: theme.transitions.create(
    'margin',
    open
      ? {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen
        }
      : {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen
        }
  ),
  [theme.breakpoints.up('md')]: {
    // marginLeft: open ? 0 : -(drawerWidth - 20),
    width: `calc(100% - ${drawerWidth}px)`
  },
  [theme.breakpoints.down('md')]: {
    width: `calc(100% - ${drawerWidth}px)`
  },
  [theme.breakpoints.down('sm')]: {
    width: `calc(100% - ${drawerWidth}px)`
  }
}));

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = ({ children }) => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  // Handle left drawer
  const [leftDrawerOpened, setLeftDrawerOpened] = useState(true);
  const handleLeftDrawerToggle = () => {
    setLeftDrawerOpened((opened) => !opened);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* header */}
      <Sidebar drawerOpen={!matchDownMd ? leftDrawerOpened : !leftDrawerOpened} drawerToggle={handleLeftDrawerToggle} />

      {/* drawer */}

      {/* main content */}
      <Main theme={theme} open={leftDrawerOpened}>
        <AppBar
          enableColorOnDark
          position="relative"
          color="inherit"
          elevation={0}
          sx={{
            transition: leftDrawerOpened ? theme.transitions.create('width') : 'none',

            height: '62px'
          }}
        >
          <Box
            sx={{
              position: 'fixed',
              zIndex: '99',
              bgcolor: theme.palette.background.default,
              width: '100%', // Default width
              '@media (-webkit-min-device-pixel-ratio:0)': {
                width: '-webkit-fill-available' // For WebKit browsers
              },
              '@-moz-document url-prefix()': {
                width: '-moz-available' // For Firefox
              },
              boxShadow: theme.shadows[1]
            }}
          >
            <Toolbar>
              <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
            </Toolbar>
          </Box>
        </AppBar>
        {/* breadcrumb */}
        <Breadcrumbs separator={IconChevronRight} navigation={navigation} icon title rightAlign />
        {children}
      </Main>
    </Box>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired
};

export default MainLayout;
