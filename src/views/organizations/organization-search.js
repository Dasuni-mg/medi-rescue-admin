import SearchIcon from '@mui/icons-material/Search';
import { Grid, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { tenantService } from 'services/tenant-service';
import { hasPermission } from 'utils/permission';
import Toaster from 'utils/toaster';

/**
 * OrganizationSearch
 *
 * This component renders a search bar and a dropdown
 * It fetches the list of tenants and renders it in the dropdown
 * When the user selects a tenant, it sets the tenant in the state
 * It also has a search bar that allows the user to search for organizations
 * When the user enters a search term, it sets the search term in the state
 *
 * @param {Object} props
 * @param {boolean} props.isSuperAdmin Whether the user is a super admin or not
 * @param {Function} props.setSearch Function to set the search term in the state
 * @param {Function} props.setTenant Function to set the tenant in the state
 */
export const OrganizationSearch = ({ setSearch, setTenant, isSuperAdmin }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);
  const [defaultValue, setDefaultValue] = useState(undefined);

  /**
   * Fetches the list of tenants and sets the options state
   * If the list of tenants is empty, it sets the isLoading state to false
   * If there is an error, it shows an error message to the user
   */
  useEffect(() => {
    setOffset(0);
    setOptions([]);
    fetch();
  }, []);

  /**
   * If the user selects a tenant, it sets the tenant in the state
   */
  useEffect(() => {
    if (defaultValue) {
      setTenant(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    if (offset === 0) {
      return;
    }
    fetch();
  }, [offset]);

  const fetch = useCallback(() => {
    // Check if the user has the permission to list tenants
    if (hasPermission('smtadmin_tenant.list')) {
      tenantService
        .searchTenant(offset, limit, '', '-createdAt')
        .then((data) => {
          if (options.length >= data.totalRowCount) {
            setIsLoading(false);
            return;
          }
          const newOptions = [...options, ...data.data];
          setOptions(newOptions);
          if (newOptions.length < data.totalRowCount) {
            setOffset((o) => o + 1);
          }
          if (newOptions.length === data.totalRowCount) {
            setDefaultValue(newOptions[0]);
          }
          if (newOptions.length > data.totalRowCount) {
            setOptions([]);
            setOffset(0);
          }
          if (offset > Math.floor(data.totalRowCount / limit)) {
            setOptions([]);
            setOffset(0);
          }
        })
        .catch((error) => {
          Toaster.error(error?.reason ?? t('organization.search.listGroup.fetchGroup.error.unknown'));
        })
        .finally(() => {
          setIsLoading(false); // End loading once data is fetched
        });
    }
  }, [offset, limit]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Grid container className="mb-30 lift-form-values" justifyContent="flex-start" spacing={5}>
      {isSuperAdmin && (
        <Grid item xs={12} sm={6} md={6} lg={4} xl={4} className="" alignItems="center">
          <Autocomplete
            key={defaultValue?.id ?? undefined}
            defaultValue={defaultValue}
            disablePortal
            open={open}
            onOpen={handleOpen}
            onClose={handleClose}
            isOptionEqualToValue={(option, value) => option?.name === value?.name}
            getOptionLabel={(option) => option?.name ?? ''}
            options={options}
            loading={isLoading}
            disableClearable={true}
            onChange={(event, newValue, reason) => {
              switch (reason) {
                case 'selectOption':
                  setTenant(newValue);
                  break;
                case 'createOption':
                case 'removeOption':
                case 'clear':
                case 'blur':
                default:
                  break;
              }
            }}
            onInputChange={(event, newInputValue, reason) => {
              setInputValue(newInputValue);
            }}
            renderInput={(params) => {
              return (
                <TextField
                  {...params}
                  placeholder={t('organization.search.listGroup.placeholder')}
                  label={t('organization.search.listGroup.label')}
                  fullWidth
                  size="small"
                  id="Group-Organization"
                  name="Group-Organization"
                  // error={inputValue === ''}
                  // helperText={inputValue === '' ? t('organization.search.listGroup.helperText') : ''}
                  color="secondary"
                  InputLabelProps={{
                    shrink: true
                  }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <InputAdornment position="end">
                        {isLoading ? <CircularProgress color="inherit" size={20} /> : <></>}
                        {!isLoading ? <SearchIcon /> : <></>}
                      </InputAdornment>
                    )
                  }}
                />
              );
            }}
          />
        </Grid>
      )}
      <Grid item xs={12} sm={6} md={6} lg={4} xl={4} className="" alignItems="center">
        <TextField
          fullWidth
          label={t('organization.search.searchOrganization.label')}
          placeholder={t('organization.search.searchOrganization.placeholder')}
          size="small"
          id="Search-Organization"
          onChange={debounce((e) => setSearch(e.target.value), 500)}
          color="secondary"
          InputProps={{
            maxLength: 51,
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
      </Grid>
    </Grid>
  );
};

OrganizationSearch.propTypes = {
  setSearch: PropTypes.func.isRequired,
  setTenant: PropTypes.func.isRequired,
  isSuperAdmin: PropTypes.bool.isRequired
};
