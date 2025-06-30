import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, TextField } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { countryService } from 'services/country-service';
import { hasPermission } from 'utils/permission';
import Toaster from 'utils/toaster';

/**
 * CountryField
 *
 * This component renders an autocomplete field to select a country
 * It fetches the list of countries from the server
 * When the user selects a country, it sets the country in the state
 *
 * @param {Object} props
 * @param {boolean} props.disabled Whether the field is disabled or not
 * @param {boolean} props.touched Whether the field is touched or not
 * @param {Object} props.errors Errors of the field
 * @param {Function} props.setFieldValue Function to set the value of the field in the state
 * @param {Object} props.entity Entity object
 * @param {string} props.entityType The type of entity (e.g. 'organization', 'group')
 * @param {boolean} props.isCreateEntity Whether the entity is being created or not
 */
export const CountryField = ({ disabled, touched, errors, setFieldValue, entity, entityType, isCreateEntity }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [countryDefault, setCountryDefault] = useState({});

  useEffect(() => {
    // Set the default country when the entity changes
    setCountryDefault(entity?.country ?? {});
  }, [entity]);

  /**
   * Fetches the list of countries from the server
   */
  const fetch = useCallback(() => {
    countryService
      .getCountry()
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
        Toaster.error(error?.reason ?? t(entityType + '.drawer.field.country.fetchList.error.unknown'));
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
    if (isCreateEntity) {
      return hasPermission('smtadmin_' + entityType + '.create') || hasPermission('smtadmin_' + entityType + '.createAny');
    } else {
      return hasPermission('smtadmin_' + entityType + '.update') || hasPermission('smtadmin_' + entityType + '.updateAny');
    }
  };

  return (
    <Autocomplete
      disablePortal
      disabled={disabled}
      key={isEmpty(countryDefault) ? undefined : countryDefault?.id}
      defaultValue={isEmpty(countryDefault) ? undefined : countryDefault}
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
        // Set the country in the state when the user selects a country
        setFieldValue('country', v?.id ?? '');
      }}
      onInputChange={(event, newInputValue, reason) => {}}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            placeholder={t('organization.drawer.field.country.placeholder')}
            label={t('organization.drawer.field.country.label')}
            required
            fullWidth
            size="small"
            id="Country-Entity-field"
            name="Country-Entity-field"
            error={touched?.country && Boolean(errors?.country)}
            helperText={touched?.country && t(errors?.country)}
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

CountryField.propTypes = {
  disabled: PropTypes.bool.isRequired,
  touched: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  entity: PropTypes.object.isRequired,
  entityType: PropTypes.string.isRequired,
  isCreateEntity: PropTypes.bool.isRequired
};
