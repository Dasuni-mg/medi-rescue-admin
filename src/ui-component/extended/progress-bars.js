import { Box, CircularProgress, LinearProgress } from '@mui/material';
import PropTypes from 'prop-types';

const ProgressBar = ({ active }) => {
  return <Box sx={{ width: '100%', height: '1px' }}>{active && <LinearProgress />}</Box>;
};

const ProgressSpinner = ({ active, standalone = false, spinnerSize = 15, varient = 'indeterminate', color = 'inherit' }) => {
  if (standalone) {
    return active && <CircularProgress size={spinnerSize} color={color} />;
  } else {
    return <Box sx={{ width: '100%', height: '1px' }}>{active && <CircularProgress size={spinnerSize} variant={varient} />}</Box>;
  }
};

export { ProgressBar, ProgressSpinner };

ProgressBar.propTypes = {
  active: PropTypes.bool
};

ProgressSpinner.propTypes = {
  active: PropTypes.bool,
  standalone: PropTypes.bool,
  spinnerSize: PropTypes.number,
  varient: PropTypes.string,
  color: PropTypes.string
};
