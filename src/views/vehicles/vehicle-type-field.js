import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, InputAdornment, TextField } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

/**
 * VehicleTypeFiled component
 *
 * This component renders a dynamic MUI Autocomplete for Vehicle Types based on the mode (create, edit, or view).
 * It uses the vehicleTypeUpdate list for edit and view modes, and the vehicleTypes list for create mode.
 * It also handles adding a new vehicle type if the searchText is not found in the options.
 * @param {boolean} props.disabled Whether the field is disabled or not
 * @param {Object} vehicleTypes - list of vehicle types
 * @param {Object} formik - formik object
 * @param {boolean} isEditMode - if true, render in edit mode
 * @param {string} searchText - search text
 * @param {function} setSearchText - set search text function
 * @param {function} handleAddVehicleType - handle add vehicle type function
 * @param {Object} vehicle - vehicle object
 * @param {Object} vehicleTypeUpdate - list of vehicle types for edit and view modes
 */
export const VehicleTypeFiled = ({
  disabled,
  vehicleTypes,
  formik,
  isEditMode,
  searchText,
  setSearchText,
  handleAddVehicleType,
  vehicle,
  vehicleTypeUpdate,
  vehicleTypeLoading
}) => {
  // Determine which option list to use based on the mode (create, edit, or view)
  const { t } = useTranslation();
  const options = isEditMode ? vehicleTypeUpdate : vehicleTypes;

  return (
    <Autocomplete
      disabled={disabled}
      disablePortal
      id="vehicleTypeId"
      options={options} // Use dynamic options based on mode
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
      value={options.find((option) => option.id === Number(formik.values.vehicleTypeId)) || null}
      onChange={(e, value) => formik.setFieldValue('vehicleTypeId', value ? value.id : '')}
      onInputChange={(e, value) => setSearchText(value)}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={t('vehicle.drawer.field.vehicleType.placeholder')}
          label={t('vehicle.drawer.field.vehicleType.label')}
          error={formik.touched.vehicleTypeId && Boolean(formik.errors.vehicleTypeId)}
          helperText={formik.touched.vehicleTypeId && t(formik.errors.vehicleTypeId)}
          required
          fullWidth
          size="small"
          id="vehicleTypeId"
          color="secondary"
          InputLabelProps={{
            shrink: true
          }}
          onKeyDown={(e) => {
            if (e.code === 'Enter') {
              handleAddVehicleType();
            }
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <InputAdornment position="end">
                {/* Show AddIcon if searchText is not found in options */}
                {vehicleTypeLoading ? <CircularProgress color="inherit" size={20} /> : <></>}
                {!vehicleTypeLoading && searchText && !options.some((option) => option.name.toLowerCase() === searchText.toLowerCase()) && (
                  <AddIcon
                    sx={{ cursor: 'pointer' }}
                    onClick={(event) => {
                      event.stopPropagation();
                      event.preventDefault();
                      handleAddVehicleType();
                    }}
                  />
                )}
                {!vehicleTypeLoading && <SearchIcon />}
              </InputAdornment>
            )
          }}
        />
      )}
    />
  );
};

VehicleTypeFiled.propTypes = {
  disabled: PropTypes.bool,
  vehicleTypes: PropTypes.array,
  formik: PropTypes.object,
  isEditMode: PropTypes.bool,
  searchText: PropTypes.string,
  setSearchText: PropTypes.func,
  handleAddVehicleType: PropTypes.func,
  vehicle: PropTypes.object,
  vehicleTypeUpdate: PropTypes.array,
  vehicleTypeLoading: PropTypes.bool
};
