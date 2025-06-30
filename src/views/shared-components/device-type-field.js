import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, TextField } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { deviceTypeService } from 'services/device-type-service';
import { hasPermission } from 'utils/permission';
import Toaster from 'utils/toaster';
import { deviceValidationSchema } from 'utils/form-schemas';

/**
 * DeviceTypeField
 *
 * This component renders an autocomplete field to select a device type
 * It fetches the list of countries from the server
 * When the user selects a device type, it sets the device type in the state
 *
 * @param {Object} props
 * @param {boolean} props.disabled Whether the field is disabled or not
 * @param {boolean} props.touched Whether the field is touched or not
 * @param {Object} props.errors Errors of the field
 * @param {Function} props.setFieldValue Function to set the value of the field in the state
 * @param {Object} props.entity Entity object
 * @param {boolean} props.isCreateEntity Whether the entity is being created or not
 */
export const DeviceTypeField = ({ disabled, touched, errors, setFieldValue, entity }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deviceTypeDefault, setDeviceTypeDefault] = useState({});
  const [deviceTypeName, setDeviceTypeName] = useState('');

  /**
   * If the user selects a device type, it sets the device type in the state
   */
  useEffect(() => {
    // Set the default device type when the entity changes
    fetch();
    setDeviceTypeName('');
  }, []);

  /**
   * Validates the device type name
   * @param {string} deviceTypeName - The device type name to validate
   * @returns {void}
   * */
  useEffect(() => {
    if (deviceTypeName === '') {
      return;
    }
    validateDeviceTypeName(deviceTypeName);
  }, [deviceTypeName]);

  const validateDeviceTypeName = useCallback((deviceTypeName) => {
    try {
      deviceValidationSchema.validateSync(entity);
    } catch (error) {
      return;
    }
  });

  /**
   * If the user selects a device type, it sets the device type in the state
   */
  useEffect(() => {
    // Set the default device type when the entity changes
    if (entity?.deviceTypeId) {
      options.find((deviceType) => {
        if (deviceType?.id === entity?.deviceTypeId) {
          setDeviceTypeDefault(deviceType);
        }
      });
    }
  }, [entity, deviceTypeDefault, options]);

  /**
   * Fetches the list of countries from the server
   */
  const fetch = useCallback(() => {
    deviceTypeService
      .getDeviceTypes()
      .then((data) => {
        // If the list of countries is complete, stop fetching
        if (options.length >= data.totalRowCount) {
          setLoading(false);
          return;
        }
        // Otherwise, add the new countries to the list
        const newOptions = [...data];
        setOptions(newOptions);
        setLoading(false);
      })
      .catch((error) => {
        // If there is an error, show an error message to the user
        Toaster.error(error?.reason ?? t('device.drawer.field.deviceType.fetchList.error.unknown'));
        setLoading(false);
      });
  }, []);

  /**
   * Handles the open event of the autocomplete field
   */
  const handleOpen = () => {
    // If the list of countries is empty, fetch the countries
    if (options.length === 0) {
      setOpen(true);
      setLoading(true);
      fetch();
    } else {
      // Otherwise, just open the autocomplete
      setOpen(true);
    }
  };

  /**
   * Handles the close event of the autocomplete field
   */
  const handleClose = () => {
    // Close the autocomplete and stop fetching countries
    setOpen(false);
    setLoading(false);
  };

  /**
   * Checks if the user has the permission to create or update the entity
   */
  const updateSavebuttonVisibility = () => {
    return hasPermission('smtadmin_deviceType.list') || hasPermission('smtadmin_deviceType.listAny');
  };

  return (
    <Autocomplete
      disablePortal
      disabled={disabled}
      key={isEmpty(deviceTypeDefault) ? undefined : deviceTypeDefault?.id}
      defaultValue={isEmpty(deviceTypeDefault) ? undefined : deviceTypeDefault}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      isOptionEqualToValue={(option, value) =>
        // If the option and value are not empty, compare their names
        !isEmpty(option) && !isEmpty(value) && option?.name && value?.name && option?.name === value?.name
      }
      getOptionKey={(option) => option?.id ?? undefined}
      getOptionLabel={(option) => option?.name ?? ''}
      options={options}
      loading={loading}
      disableClearable={true}
      onChange={(e, v, r) => {
        // Set the device type in the state when the user selects a device type
        setFieldValue('deviceType', v?.id ?? '');
        setDeviceTypeName(v);
      }}
      onInputChange={(event, newInputValue, reason) => {}}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            label={t('device.drawer.field.deviceType.label')}
            placeholder={t('device.drawer.field.deviceType.placeholder')}
            required
            fullWidth
            size="small"
            id="Device-Type-Entity-field"
            name="Device-Type-Entity-field"
            error={touched?.deviceType && Boolean(errors?.deviceType)}
            helperText={touched?.deviceType && t(errors?.deviceType)}
            color="secondary"
            InputLabelProps={{
              shrink: true
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <InputAdornment position="end">
                  {loading ? <CircularProgress color="inherit" size={20} /> : <></>}
                  {updateSavebuttonVisibility() && !loading && <SearchIcon />}
                </InputAdornment>
              )
            }}
          />
        );
      }}
    />
  );
};

DeviceTypeField.propTypes = {
  disabled: PropTypes.bool.isRequired,
  touched: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  entity: PropTypes.object.isRequired
};
