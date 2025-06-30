import { Avatar, Button, Typography, useTheme } from '@mui/material';

import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';

/**
 * @param {{ open: boolean, handleCloseUnassignDialog: Function, handleUnassign: Function, entityType: string, body: string}} props
 * @returns {JSX.Element}
 */
function UnassignDialog({ open, handleCloseUnassignDialog, handleUnassign, entityType, body }) {
  const theme = useTheme();

  return (
    // eslint-disable-next-line react/jsx-no-undef

    <>
      {/* Dialog Title Component with custom styles */}
      <DialogTitle className="d-flex v-center">
        {/* Avatar Component with custom styles */}
        <Avatar className="mr-15 p-4 d-icon-avatar" sx={{ background: theme.palette.primary.light, color: theme.palette.primary.main }}>
          <div className="material-symbols-outlined">notifications_off</div>
        </Avatar>
        {/* Anyway this calls a h2 */}
        {/* <Typography variant="p">Are you sure you want to Unassign?</Typography> */}
        <Typography variant="h2">Are you sure you want to unassign?</Typography>
      </DialogTitle>

      {/* Dialog Content Component with custom styles */}
      <DialogContent>
        {/* Dialog Content Text Component with custom styles */}
        <DialogContentText>
          {body ?? 'Are you sure you want to unassign the selected vehicle from the associated organization?'}
        </DialogContentText>
      </DialogContent>

      {/* Dialog Actions Component with custom styles */}
      <DialogActions className="d-flex align-items-center h-end">
        {/* Cancel Button Component with custom styles */}
        <Button variant="outlined" color="primary" className="text-ellipsis position-end line-1 br-25" onClick={handleCloseUnassignDialog}>
          <div className="material-symbols-outlined mr-8">close</div>
          Cancel
        </Button>
        {/* Confirm Button Component with custom styles */}
        <Button onClick={handleUnassign} className="text-ellipsis position-end line-1 br-25" variant="contained" color="primary">
          <div className="material-symbols-outlined mr-8">check</div>
          Confirm
        </Button>
      </DialogActions>
    </>
  );
}

UnassignDialog.propTypes = {
  open: PropTypes.bool,
  handleCloseUnassignDialog: PropTypes.func,
  handleUnassign: PropTypes.func,
  entityType: PropTypes.string,
  body: PropTypes.string
};

export default UnassignDialog;
