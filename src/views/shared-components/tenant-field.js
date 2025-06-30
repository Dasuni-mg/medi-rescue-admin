import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, TextField } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { tenantService } from 'services/tenant-service';
import { hasPermission } from 'utils/permission';
import Toaster from 'utils/toaster';

/**
 * TenantField
 *
 * This component renders a search bar and a dropdown
 * It fetches the list of tenants and renders it in the dropdown
 * When the user selects a tenant, it sets the tenant in the state
 * It also has a search bar that allows the user to search for tenants
 * When the user enters a search term, it sets the search term in the state
 *
 * @param {Object} props
 * @param {boolean} props.isCreateOrg Whether the user is creating an organization or not
 * @param {string} props.tenant The current tenant
 * @param {Function} props.setFieldValue Function to set the tenant in the state
 * @param {Function} props.setDisableFormField Function to disable the form field
 */
export const TenantField = ({ touched, errors, setFieldValue, isCreateOrg, tenant, setDisableFormField }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    // stop fetching unlimited
    if (!open) {
      return;
    }
    fetch();
  }, [offset]);

  /**
   * Fetches the list of tenants from the server
   * If the list of tenants is empty, it sets the loading state to false
   * If there is an error, it shows an error message to the user
   */
  const fetch = useCallback(() => {
    tenantService
      .searchTenant(offset, limit, inputValue, '-createdAt')
      .then((data) => {
        if (options.length >= data.totalRowCount) {
          setLoading(false);
          return;
        }
        const newOptions = [...options, ...data.data];
        setOptions(newOptions);
        if (newOptions.length < data.totalRowCount) {
          setOffset((o) => o + 1);
        }
        setLoading(false);
      })
      .catch((error) => {
        Toaster.error(error?.reason ?? t('organization.drawer.field.group.fetchGroup.error.unknown'));
        setLoading(false);
      });
  }, [offset, limit, inputValue]);

  /**
   * Handles the open event of the autocomplete field
   * Sets the loading state to true and fetches the list of tenants
   */
  const handleOpen = () => {
    setOpen(true);
    setLoading(true);
    fetch();
  };

  /**
   * Handles the close event of the autocomplete field
   * Sets the loading state to false and resets the offset
   */
  const handleClose = () => {
    setOpen(false);
    setLoading(false);
    setOptions([]);
    setOffset(0);
  };

  /**
   * Checks if the user has the permission to create an organization
   * If the user has the permission, it shows the search icon
   */
  const updateSavebuttonVisibility = () => {
    if (isCreateOrg) {
      return hasPermission('smtadmin_organization.createAny') || hasPermission('smtadmin_organization.create');
    } else {
      return hasPermission('smtadmin_organization.updateAny') || hasPermission('smtadmin_organization.update');
    }
  };

  return (
    <Autocomplete
      disablePortal
      disabled={!isCreateOrg}
      key={(!isCreateOrg && tenant?.id) || undefined}
      defaultValue={(!isCreateOrg && tenant) || undefined}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      isOptionEqualToValue={(option, value) =>
        !isEmpty(option) && !isEmpty(value) && option?.name && value?.name && option?.name === value?.name
      }
      getOptionKey={(option) => option?.id ?? undefined}
      getOptionLabel={(option) => option?.name ?? ''}
      options={options}
      loading={loading}
      disableClearable={true}
      onChange={(e, v, r) => {
        setFieldValue('group', v?.id ?? '');
        setDisableFormField(false);
      }}
      onInputChange={(event, newInputValue, reason) => {}}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            placeholder={t('organization.drawer.field.group.placeholder')}
            label={t('organization.drawer.field.group.label')}
            required
            fullWidth
            size="small"
            id="Group-Organization-field"
            name="Group-Organization-field"
            error={touched?.group && Boolean(errors?.group)}
            helperText={touched?.group && t(errors?.group)}
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

TenantField.propTypes = {
  touched: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  isCreateOrg: PropTypes.bool.isRequired,
  tenant: PropTypes.object.isRequired,
  setDisableFormField: PropTypes.func.isRequired
};
