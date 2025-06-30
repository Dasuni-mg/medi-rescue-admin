import PropTypes from 'prop-types';

// material-ui
import { Box, Icon } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import LogoSection from '../LogoSection';
import ProfileSection from './profile-section';
// assets

import logo from '';
import Image from 'next/image';
import SearchSection from './search-section';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
  const theme = useTheme();

  return (
    <>
      {/* logo & toggler button */}
      <Box
        sx={{
          width: 290,
          display: 'flex',
          [theme.breakpoints.down('md')]: {
            width: 'auto'
          }
        }}
      >
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1, ml: 3, mt: 1 }}>
          <LogoSection />
        </Box>
        <Icon sx={{ width: 42, height: 42, cursor: 'pointer' }} onClick={handleLeftDrawerToggle}>
          <Image src={logo} alt="Logo" />
        </Icon>
      </Box>

      {/* header search */}
      <SearchSection />
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />
      {/* notification & profile */}
      {/* <NotificationSection /> */}

      <Box id="lng_btn" sx={{ margin: '0 20px 0 0' }}>
        <Language />
      </Box>

      <ProfileSection />
      <Avatar
        id="logout_btn"
        sx={{
          color: theme.palette.dark.light100,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.dark.light50}`,
          margin: '0 8px 0 0',
          cursor: 'pointer'
        }}
      >
        <LogoutIcon />
      </Avatar>
    </>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func
};

export default Header;
