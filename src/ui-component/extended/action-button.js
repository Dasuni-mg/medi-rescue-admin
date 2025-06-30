import { IconButton } from '@mui/material';
import PropTypes from 'prop-types';

const ActionButton = (props) => {
  const { onClick, ariaLabel, color } = props;

  ActionButton.propTypes = {
    onClick: PropTypes.string.isRequired,
    ariaLabel: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired
  };

  return (
    <IconButton aria-label={ariaLabel} color={color} onClick={onClick}>
      {props.children}
    </IconButton>
  );
};

export default ActionButton;
