import { Chip } from '@mui/material';

const ChipSet = ({ labelText, chipType }) => {
  ChipSet.propTypes = {
    labelText: PropTypes.string.isRequired,
    chipType: PropTypes.string.isRequired
  };

  const chipSX = {
    height: 26,
    padding: '6px',
    borderRadius: '6px'
  };

  return <Chip label={labelText} className={chipType} sx={chipSX} />;
};

export default ChipSet;
