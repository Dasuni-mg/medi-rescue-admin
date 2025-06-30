import { Typography } from '@mui/material';

// Project imports
import menuItem from 'utils/menu-items';
import NavGroup from './nav-group';

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
  const navItems = menuItem.items.map((item) => {
    if (item.type == 'group') {
      return <NavGroup key={item.id} item={item} />;
    } else {
      return (
        <Typography key={item.id} variant="h6" color="error" align="center">
          Menu Items Error
        </Typography>
      );
    }
  });

  return <>{navItems}</>;
};

export default MenuList;
