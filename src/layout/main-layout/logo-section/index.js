// import { Link } from 'react-router-dom';
import Link from 'next/link';

// material-ui
import { ButtonBase } from '@mui/material';

// project imports
import { Box } from '@mui/system';
import Logo from 'ui-component/logo';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => {
  return (
    <ButtonBase disableRipple component={Link} href="/home">
      <Box className="left-bar-logo-wrapper">
        <Logo />
      </Box>
    </ButtonBase>
  );
};

export default LogoSection;
