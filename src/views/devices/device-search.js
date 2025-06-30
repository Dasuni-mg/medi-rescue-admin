import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, CircularProgress, Grid, InputAdornment, TextField } from '@mui/material';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { tenantService } from 'services/tenant-service';
import Toaster from 'utils/toaster';
import { vehicleService } from '../../services/vehicle-service';
import { isEmpty } from 'lodash';

/**
 * SearchFilter
 *
 * This component renders search filters for devices, allowing users to search by tenant, vehicle, or serial number.
 * It includes an autocomplete dropdown for tenants and vehicles, fetching options from the respective services.
 * The component manages the loading state for tenant and vehicle data, and handles input changes with debounce.
 *
 * @param {Object} props
 * @param {Function} props.setSearch - Function to set the search criteria in the state.
 * @param {Function} props.setTenant - Function to set the selected tenant in the state.
 * @param {boolean} props.isSuperAdmin - Indicates if the user has super admin privileges.
 * @param {Object} props.tenant - The current tenant object.
 */
const SearchFilter = ({ setSearch, setTenant, isSuperAdmin, tenant, selectedAction, setSelectedAction }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);
  const [defaultValue, setDefaultValue] = useState();
  const [optionsVehicle, setOptionsVehicle] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [vehicleDefault, setVehicleDefault] = useState({});
  const [inputVehicleValue, setInputVehicleValue] = useState('');
  const [inputSerialValue, setInputSerialValue] = useState('');
  const [inputUnAssign1Value, setInputUnAssignValue] = useState(false);

  /**
   * If the user selects a tenant, it sets the tenant in the state
   */
  useEffect(() => {
    if (defaultValue) {
      setTenant(defaultValue);
    }
  }, [defaultValue]);

  /**
   * If the user selects a vehicle, it sets the vehicle in the state
   */
  useEffect(() => {
    if (tenant) {
      setSelectedAction({ type: 'tenantSelected' });
    }
  }, [tenant]);

  /**
   * Fetches the list of tenants and sets the options state
   * If the list of tenants is empty, it sets the isLoading state to false
   *
   */
  useEffect(() => {
    fetch();
  }, []);

  /**
   *
   * Fetches the list of tenants and sets the options state
   * */
  const fetch = useCallback(() => {
    setLoading(true);
    tenantService
      .searchTenant(offset, limit, '', '-createdAt')
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

        if (newOptions.length === data.totalRowCount) {
          setDefaultValue(newOptions[0]);
          setTenant(newOptions[0]);
        }

        if (newOptions.length > data.totalRowCount) {
          setOptions([]);
          setOffset(0);
        }

        if (offset > Math.floor(data.totalRowCount / limit)) {
          setOptions([]);
          setOffset(0);
        }

        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        Toaster.error(error?.reason ?? t('organization.search.listGroup.fetchGroup.error.unknown'));
      });
  }, [offset, limit]);

  /**
   * Fetches the list of vehicles and sets the optionsVehicle state
   * If the list of vehicles is empty, it sets the isLoading state to false
   * */
  useEffect(() => {
    if (tenant?.id) {
      fetchVehicles();
    }
  }, [defaultValue, inputValue, tenant?.id]);

  /**
   * Fetches the list of vehicles and sets the optionsVehicle state
   * If the list of vehicles is empty, it sets the isLoading state to false
   * */
  useEffect(() => {
    if (selectedAction.type === 'tenantSelected') {
    }
  }, [selectedAction.type]);

  /**
   * If the list of vehicles is empty, it sets the isLoading state to false
   */
  useEffect(() => {
    if (optionsVehicle.length > 0) {
      setVehicleDefault({ id: 'all', number: 'All' });
    }
  }, [optionsVehicle]);

  /**
   * Fetches the list of vehicles from the API and sets the optionsVehicle state
   * If the list of vehicles is empty, it sets the isLoadingVehicles state to false
   * @param {string} tenantId - The tenant ID to filter the vehicles by
   * @returns {Promise<void>}
   */
  const fetchVehicles = async () => {
    setLoadingVehicles(true);

    try {
      const vehicles = await vehicleService.searchVehicles('all', '', tenant?.id);

      // Format the vehicle details as 'Vehicle number - Vehicle type'
      const formattedVehicles = vehicles.data.map((vehicle) => {
        return {
          id: vehicle.id,
          number: `${vehicle.number} - ${vehicle.vehicleTypeName}` // Fallback if vehicle type is not found
        };
      });

      setOptionsVehicle(formattedVehicles);
      setLoadingVehicles(false);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoadingVehicles(false);
    }
  };

  /**
   * Opens the autocomplete dropdown
   * @function
   */
  const handleOpen = () => {
    setOpen(true);
  };

  /**
   * Closes the autocomplete dropdown and sets its open state to false.
   * @function
   */
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Grid container className="mb-30 lift-form-values" justifyContent="flex-start" spacing={5}>
      {/* Search Filter */}
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
            loading={loading}
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
                        {loading ? <CircularProgress color="inherit" size={20} /> : <></>}
                        {!loading ? <SearchIcon /> : <></>}
                      </InputAdornment>
                    )
                  }}
                />
              );
            }}
          />
        </Grid>
      )}
      {/* Vehicle Autocomplete */}
      <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
        <Autocomplete
          disablePortal
          id="vehicleSearch"
          options={[
            { id: 'all', number: 'All', value: 'all' },
            { id: 'notAssigned', number: 'Not Assigned', value: 'notAssigned' }
          ].concat(optionsVehicle)}
          key={isEmpty(vehicleDefault) ? undefined : vehicleDefault?.id}
          defaultValue={isEmpty(vehicleDefault) ? undefined : vehicleDefault}
          getOptionLabel={(option) => option.number} // Display 'name' in dropdown
          onChange={(e, value) => {
            const selectedValue = value ? value.number : '';
            if (selectedValue === 'All') {
              setSearch({
                serialNumber: inputSerialValue
              });
              setInputVehicleValue('');
            } else if (selectedValue === 'Not Assigned') {
              setInputUnAssignValue(true);
              setInputVehicleValue(selectedValue);
              setSearch({
                serialNumber: inputSerialValue,
                notAssigned: true
              });
            } else {
              let text = selectedValue;
              let numericPart = text.split('-')[0].trim();
              setSearch({
                serialNumber: inputSerialValue,
                vehicleNumber: numericPart
              });
              setInputVehicleValue(numericPart);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t('device.search.listVehicle.label')}
              placeholder={t('device.search.listVehicle.placeholder')}
              fullWidth
              size="small"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <InputAdornment position="end">
                    {loadingVehicles ? <CircularProgress color="inherit" size={20} /> : <SearchIcon />}
                  </InputAdornment>
                )
              }}
            />
          )}
        />
      </Grid>
      {/* Serial Number */}
      <Grid item xs={12} sm={6} md={6} lg={4} xl={4} className="" alignItems="center">
        <TextField
          fullWidth
          label={t('device.search.searchSerialNumber.label')}
          placeholder={t('device.search.searchSerialNumber.placeholder')}
          size="small"
          color="secondary"
          onChange={debounce((e) => {
            setInputSerialValue(e.target.value);
            if (inputVehicleValue === 'Not Assigned') {
              setSearch({ notAssigned: true, serialNumber: e.target.value });
            } else if (inputVehicleValue) {
              setSearch({ vehicleNumber: inputVehicleValue, serialNumber: e.target.value });
            } else {
              setSearch({ serialNumber: e.target.value });
            }
          }, 500)}
          InputProps={{
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

SearchFilter.propTypes = {
  setSearch: PropTypes.func.isRequired,
  setSearchVehiclesIds: PropTypes.func.isRequired,
  setTenant: PropTypes.func.isRequired,
  isSuperAdmin: PropTypes.bool.isRequired,
  tenant: PropTypes.object.isRequired
};

export default SearchFilter;
