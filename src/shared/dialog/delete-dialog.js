import { Avatar, Button, Typography, useTheme } from '@mui/material';

import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';

/**
 * @param {{ open: boolean, handleCloseDeleteDialog: function, handleDelete: function, entityType: string, body: string }} props
 * @returns {ReactElement}
 */
function DeleteDialog({
  open,
  handleCloseDeleteDialog,
  handleDelete,
  entityType,
  body = 'Will be permanently deleted and cannot be undone. Would you like to continue?' // eslint-disable-line object-curly-newline
}) {
  const theme = useTheme();

  return (
    // eslint-disable-next-line react/jsx-no-undef
    <>
      <DialogTitle className="d-flex v-center">
        <Avatar className="mr-15 p-4 d-icon-avatar" sx={{ color: theme.palette.error.main }}>
          <div className="material-symbols-outlined">delete</div>
        </Avatar>
        <Typography variant="h2">Are you sure you want to Delete?</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{body}</DialogContentText>
      </DialogContent>
      <DialogActions className="d-flex align-items-center h-end">
        <Button onClick={handleCloseDeleteDialog} className="text-ellipsis position-end line-1 br-25" variant="outlined" color="error">
          <div className="material-symbols-outlined mr-8">close</div>
          Cancel
        </Button>
        <Button onClick={handleDelete} className="text-ellipsis position-end line-1 br-25" variant="contained" color="error" autoFocus>
          <div className="material-symbols-outlined mr-8">delete</div>
          Confirm
        </Button>
      </DialogActions>
    </>
  );
}

DeleteDialog.propTypes = {
  open: PropTypes.bool,
  handleCloseDeleteDialog: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  entityType: PropTypes.string,
  body: PropTypes.string
};

export default DeleteDialog;
