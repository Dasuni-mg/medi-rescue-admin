import PropTypes from 'prop-types';

// material-ui
import { Box, Icon } from '@mui/material';
import { useTheme } from '@mui/material/styles';
// project imports
import ProfileSection from './profile-section';
// assets
import Image from 'next/image';
import logo from '/public/images/icons/hamburger.svg';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
  const theme = useTheme();

  return (
    <>
      {/* logo & toggler button */}
      <Box
        sx={{
          display: 'flex',
          [theme.breakpoints.down('md')]: {
            width: 'auto'
          }
        }}
      >
        <Icon sx={{ width: 42, height: 42, cursor: 'pointer' }} onClick={handleLeftDrawerToggle}>
          <Image src={logo} alt="Logo" />
        </Icon>
      </Box>

      {/* header search */}
      {/* <SearchSection /> */}
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />

      <Box id="lng_btn" sx={{ margin: '0 20px 0 0' }}>
        {/* <Language /> */}
      </Box>

      <ProfileSection />
    </>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func
};

export default Header;
