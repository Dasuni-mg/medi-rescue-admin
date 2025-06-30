import { Box, Button, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

/**
 * DeviceHeader component
 * This component renders the title and button to create a new device.
 * If the user has permission to create a device, renders the button.
 * Otherwise, renders nothing.
 * @param {Object} props - The props object
 * @param {function} props.toggleDrawer - The function to toggle the drawer
 * @returns {ReactElement} The title and button to create a new device.
 */
export const DeviceHeader = ({ toggleDrawer }) => {
  const { t } = useTranslation();

  /**
   * Renders the title and button to create a new device.
   * If the user has permission to create a device, renders the button.
   * Otherwise, renders nothing.
   * @returns {ReactElement} The title and button to create a new device.
   */
  const renderTitleAndButton = () => {
    return (
      <Grid container className="title vehicle-heading lift-header-title">
        <Grid item xs={12} sm={8} md={8} className="red pb-15 mb-15-mobile">
          <Box className="d-flex h-start v-center">
            <Box className="mr-15 material-symbols-outlined">arrow_forward</Box>
            <Typography variant="h1" className="text-ellipsis line-2 h1_color fw-400">
              {t('device.header.title')}{' '}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={4} md={4} className="red pb-15">
          {/* Check if the user has permission to create an organization
        If the user has permission, render the button */}
          <Button
            id="blinking"
            variant="contained"
            color="secondary"
            className="text-ellipsis position-end position-btn-mobile line-1"
            onClick={() =>
              toggleDrawer(true, {
                row: {},
                type: 'create'
              })
            }
          >
            <div className="material-symbols-outlined mr-8">add_circle</div>
            {t('device.header.create')}
          </Button>
        </Grid>
      </Grid>
    );
  };
  return renderTitleAndButton();
};

DeviceHeader.propTypes = {
  toggleDrawer: PropTypes.func.isRequired
};

export default DeviceHeader;
