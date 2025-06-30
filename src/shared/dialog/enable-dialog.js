import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Enable Dialog component
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.open - Dialog open state
 * @param {Function} props.handleCloseEnableDialog - Function to close the dialog
 * @param {Function} props.vehiclEnableAndDisableById - Function to enable or disable the vehicle
 * @param {string} props.vehicleId - Vehicle id
 * @param {boolean} props.newStatus - New status of the vehicle
 * @param {Object} props.theme - Theme object
 * @param {string} props.text - Text to use in the dialog title and message
 */
const EnableDialog = ({ open, handleCloseEnableDialog, vehiclEnableAndDisableById, vehicleId, newStatus, theme, title, body }) => {
  /**
   * Function to close the dialog
   */
  const handleClose = () => {
    handleCloseEnableDialog();
  };

  /**
   * Function to confirm the action
   */
  const handleConfirm = () => {
    vehiclEnableAndDisableById(vehicleId, newStatus);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} className="pop">
      <DialogTitle className="d-flex v-center">
        <Avatar className="mr-15 p-4 d-icon-avatar" sx={{ background: theme.palette.primary.light, color: theme.palette.primary.main }}>
          <div className="material-symbols-outlined">warning_off</div>
        </Avatar>
        <Typography variant="h2">{`Are you sure you want to ${title}?`}</Typography>
      </DialogTitle>

      <DialogContent>
        <DialogContentText>{`${body}`}</DialogContentText>
      </DialogContent>

      <DialogActions className="d-flex align-items-center h-end">
        {/* Cancel Button */}
        <Button
          variant="outlined"
          color="primary"
          className="text-ellipsis position-end line-1 br-25"
          onClick={handleClose} // Call the close function
        >
          <div className="material-symbols-outlined mr-8">close</div>
          Cancel
        </Button>

        {/* Confirm Button */}
        <Button
          onClick={handleConfirm} // Call the confirm function
          className="text-ellipsis position-end line-1 br-25"
          variant="contained"
          color="primary"
          autoFocus
        >
          <div className="material-symbols-outlined mr-8">check</div>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

EnableDialog.propTypes = {
  open: PropTypes.bool,
  handleCloseEnableDialog: PropTypes.func,
  vehiclEnableAndDisableById: PropTypes.func,
  vehicleId: PropTypes.string,
  newStatus: PropTypes.bool,
  theme: PropTypes.object,
  title: PropTypes.string,
  body: PropTypes.string
};

export default EnableDialog;
