import { Avatar, Menu, MenuItem, Typography, useTheme } from '@mui/material';
import React from 'react';

const Language = () => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Avatar
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{
          color: theme.palette.dark.light100,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.dark.light50}`,
          cursor: 'pointer'
        }}
      >
        <Typography color={theme.palette.primary.dark}>EN</Typography>
      </Avatar>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
      >
        <MenuItem onClick={handleClose}>English</MenuItem>
        <MenuItem onClick={handleClose}>Dutch</MenuItem>
        <MenuItem onClick={handleClose}>Spanish</MenuItem>
        <MenuItem onClick={handleClose}>French</MenuItem>
      </Menu>
    </>
  );
};

export default Language;
