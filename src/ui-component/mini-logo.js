// material-ui
import Image from 'next/image';

// ==============================|| LOGO ||============================== //
const MiniLogo = () => {
  return (
    <Image
      src="/images/auth/mediportal-mini-logo.png"
      alt="Medirescue mini logo"
      fill={true}
      style={{
        objectFit: 'cover'
      }}
    />
  );
};

export default MiniLogo;
