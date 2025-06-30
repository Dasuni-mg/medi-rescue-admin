import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
  useTheme
} from '@mui/material';
import { useConfirmation } from '../../hooks/useConfirmation';

const CommonConfirmBox = () => {
  const { isOpen, title, message, confirm, cancel, confirmBtn } = useConfirmation();
  const theme = useTheme();
  return (
    <Dialog
      open={isOpen}
      onClose={cancel}
      PaperProps={{
        style: {
          width: '600px',
          padding: theme.spacing(7)
        }
      }}
    >
      <DialogTitle variant="h3">{title}</DialogTitle>
      <IconButton
        aria-label="close"
        sx={{
          position: 'absolute',
          right: 16,
          top: 20,
          color: (theme) => theme.palette.grey[500]
        }}
      >
        <CloseIcon />
      </IconButton>
      <Divider sx={{ mt: theme.spacing(7), mb: theme.spacing(7) }} />
      <DialogContent>
        <DialogContentText component="div">
          <Typography dangerouslySetInnerHTML={{ __html: message }}></Typography>
        </DialogContentText>
      </DialogContent>
      <Divider sx={{ mt: theme.spacing(7), mb: theme.spacing(7) }} />
      <DialogActions>
        <Button size="large" variant="outlined" onClick={cancel} color="error">
          Reset
        </Button>
        <Button size="large" variant="contained" onClick={confirm} color={confirmBtn.btnColor}>
          {confirmBtn.btnText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommonConfirmBox;
