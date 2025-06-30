// material-ui
import Image from 'next/image';
import logo from '/public/images/logo.png';

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  // return <img src={logo} alt="User Manager" width="161" height="42" />;
  return <Image src={logo} alt="User Manager" />;
};

export default Logo;
