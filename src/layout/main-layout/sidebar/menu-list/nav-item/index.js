import PropTypes from 'prop-types';
import { forwardRef } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link, useLocation } from 'react-router-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// material-ui
import { Avatar, Chip, Divider, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// assets
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
// import { menuOpen, setMenu } from 'store/customization-slice';

// ==============================|| SIDEBAR MENU LIST ITEMS ||============================== //

const NavItem = ({ item, level }) => {
  const theme = useTheme();
  const pathname = usePathname();
  // const dispatch = useDispatch();
  // const { pathname } = useLocation();
  // const customization = useSelector((state) => state.customization);
  // const matchesSM = useMediaQuery(theme.breakpoints.down('lg'));

  const Icon = item.icon;
  const itemIcon = item?.icon ? (
    <Icon stroke={1.5} size="1.3rem" />
  ) : (
    <FiberManualRecordIcon
      sx={{
        width: -1 > -1 ? 8 : 6,
        height: -1 > -1 ? 8 : 6
      }}
      fontSize={level > 0 ? 'inherit' : 'medium'}
    />
  );

  let itemTarget = '_self';
  if (item.target) {
    itemTarget = '_blank';
  }

  const ListItemComponent = forwardRef((props, ref) => <Link ref={ref} {...props} href={item.url} />);

  let listItemProps = {
    component: ListItemComponent
  };

  if (item?.external) {
    listItemProps = { component: 'a', href: item.url, target: itemTarget };
  }

  const itemHandler = (id) => {
    // dispatch(menuOpen({ id }));
    // if (matchesSM) dispatch(setMenu({ opened: false }));
  };

  // active menu item on page load
  // useEffect(() => {
  //   const currentIndex = document.location.pathname
  //     .toString()
  //     .split('/')
  //     .findIndex((id) => id === item.id);
  //   if (currentIndex > -1) {
  //     // dispatch(menuOpen({ id: item.id }));
  //   }
  //   // eslint-disable-next-line
  // }, [pathname]);

  return (
    <ListItemButton
      {...listItemProps}
      disabled={item.disabled}
      sx={{
        alignItems: 'flex-start',
        backgroundColor: theme.palette.primary.light,
        height: theme.spacing(13),
        pl: `${level * 24}px`,
        pt: '14px',
        borderTop: `1px solid ${theme.palette.dark.light200}`
      }}
      selected={pathname === item.url}
      onClick={() => itemHandler(item.id)}
    >
      <ListItemIcon sx={{ my: 'auto', minWidth: !item?.icon ? 18 : 36 }}>{itemIcon}</ListItemIcon>
      <Divider orientation="vertical" sx={{ borderRightWidth: 1, mr: 3, borderColor: '#D7D9E3' }} />
      <ListItemText
        primary={
          <Typography variant={-1 > -1 ? 'p' : 'body1'} color="inherit">
            {item.title}
          </Typography>
        }
        secondary={
          item.caption && (
            <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
              {item.caption}
            </Typography>
          )
        }
      />
      {item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </ListItemButton>
  );
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number
};

export default NavItem;
