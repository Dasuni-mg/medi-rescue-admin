import { Box, Button, Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { hasPermission } from 'utils/permission';

/**
 * VehicleHeader component
 *
 * This component renders a heading for the Vehicles page with a button to create a new vehicle.
 * It also handles setting the mode to create and toggling the drawer.
 * @param {Object} props - props object
 * @param {Function} props.toggleDrawer - function to toggle the drawer
 * @param {Function} props.setMode - function to set the mode
 * @returns {JSX.Element} The VehicleHeader component
 */
export const VehicleHeader = ({ toggleDrawer, setMode }) => {
  const { t } = useTranslation();
  /**
   * Handle toggle drawer and set mode to create when the create button is clicked
   */
  const handleClick = () => {
    setMode('create');
    toggleDrawer(true)();
  };

  return (
    <Grid container className="title vehicle-heading lift-header-title">
      <Grid item xs={12} sm={8} md={8} className="red pb-15 mb-15-mobile">
        <Box className="d-flex h-start v-center">
          <Box className="mr-15 material-symbols-outlined">arrow_forward</Box>
          <Typography variant="h1" className="text-ellipsis line-2 h1_color fw-400">
            {t('vehicle.header.title')}{' '}
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12} sm={4} md={4} className="red pb-15">
        {/* Check if the user has permission to create an vehicle. If the user has permission, render the button */}
        {(hasPermission('smtadmin_vehicle.create') || hasPermission('smtadmin_vehicle.createAny')) && (
          <Button
            id="blinking"
            variant="contained"
            color="secondary"
            className="text-ellipsis position-end position-btn-mobile line-1"
            onClick={handleClick}
          >
            <div className="material-symbols-outlined mr-8">add_circle</div>
            {t('vehicle.header.create')}
          </Button>
        )}
      </Grid>
    </Grid>
  );
};
