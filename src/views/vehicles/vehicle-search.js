import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, Grid, TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { hasPermission } from 'utils/permission';
import { organizationService } from '../../services/organization-service';
import { vehicleTypeService } from '../../services/vehicle-type-service';

/**
 * VehicleSearch component
 *
 * This component renders a dynamic MUI Autocomplete for Groups, Organizations, and a search bar for Vehicles.
 * It also handles debouncing the searchVehicles API call.
 * @param {Object} props - props object
 * @param {Array} props.tenants - list of tenants
 * @param {Array} props.organizations - list of organizations
 * @param {Function} props.handleSearchNumberChange - handle search number change function
 * @param {Function} props.setTextGroup - set text group function
 * @param {Function} props.setTextOrganization - set text organization function
 * @param {Function} props.debouncedSearchVehicles - debounced search vehicles function
 * @param {string} props.textGroup - current text group value
 * @param {string} props.textNumber - current text number value
 * @param {string} props.textOrganization - current text organization value
 * @param {Function} props.setVehicleTypeUpdate - set vehicle type update function
 * @param {Function} props.setOrganizationUpdate - set organization update function
 */
export const VehicleSearch = ({
  tenants,
  organizations,
  handleSearchNumberChange,
  setTextGroup,
  setTextOrganization,
  debouncedSearchVehicles,
  textGroup,
  textNumber,
  textOrganization,
  setVehicleTypeUpdate,
  setOrganizationUpdate,
  }) => {
  const { t } = useTranslation();
  const [organizationDefaultValue, setOrganizationDefaultValue] = useState({
    id: 'all',
    name: 'All',
    value: 'all'
  });

  useEffect(() => {
    const hasSearchPermission = hasPermission('smtadmin_vehicle.searchAny');
    // Ensure tenants array is not empty before calling getListVehicleTypes
    if (hasSearchPermission) {
      if (tenants && tenants.length > 0) {
        getListVehicleTypes(tenants[0].id); // Call with the first tenant's ID or any relevant value
        getOrganizations(tenants[0].id);
      }
    } else {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData?.tenantId) {
        getListVehicleTypes(userData.tenantId); // Call with the first tenant's ID or any relevant value
        getOrganizations(userData.tenantId);
      }
    }
  }, [tenants]); // Re-run this effect when tenants change

  /**
   * @function getListVehicleTypes
   * @description Fetches the list of vehicle types from the API and updates the state.
   * @param {string} tenantIds - tenant ID or IDs to filter by
   * @returns {Promise<void>} Resolves when the vehicle types are fetched and the state is updated.
   */
  const getListVehicleTypes = async (tenantIds) => {
    try {
      setVehicleTypeUpdate([]);
      const response = await vehicleTypeService.listVehicleTypes(tenantIds); // Wait for the API call to complete
      setVehicleTypeUpdate(response); // Update the state with the fetched data
    } catch (error) {
      console.error('Error fetching vehicle by id:', error); // Log the error if API call fails
    }
  };

  /**
   * @function getOrganizations
   * @description Fetches the list of organizations from the API and updates the state.
   * @param {string} textGroupCreate - current text group value
   * @returns {Promise<void>} Resolves when the organizations are fetched and the state is updated.
   */
  const getOrganizations = async (textGroupCreate) => {
    const sorting = [];

    // Push the object with 'createdAt' as id and 'desc' as true
    sorting.push({
      id: 'createdAt',
      desc: true
    });
    try {
      const response = await organizationService.searchOrganization('', 0, 100, [], textGroupCreate);
      setOrganizationUpdate(response.content); // Update the state with the fetched data
    } catch (error) {
      console.error('Error fetching vehicle by id:', error); // Log the error if API call fails
    }
  };

  return (
    <Grid container className="mb-30 lift-form-values" justifyContent="flex-start" spacing={5}>
      {hasPermission('smtadmin_vehicle.viewAny') && tenants.length > 0 && (
        <Grid item xs={12} sm={6} md={6} lg={4} xl={4} alignItems="center">
          <Autocomplete
            disablePortal
            id="groupSearch"
            options={tenants} // Use tenants array directly
            defaultValue={tenants[0]} // Set the default value to the first tenant
            getOptionLabel={(option) => option.name} // Display label in the dropdown
            disableClearable
            onChange={(e, value) => {
              const selectedValue = value ? value.id : tenants[0].id;
              setTextOrganization('all');
              setTextGroup(selectedValue); // Update the group state
              debouncedSearchVehicles(textOrganization, textNumber, selectedValue); // Search vehicles
              getListVehicleTypes(selectedValue); // Fetch vehicle types for the selected tenant
              getOrganizations(selectedValue); // Fetch organizations for the selected tenant
              setOrganizationDefaultValue({ id: 'all', name: 'All', value: 'all' }); // Reset organization default
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={t('vehicle.search.listGroup.placeholder')}
                label={t('vehicle.search.listGroup.label')}
                fullWidth
                size="small"
                color="secondary"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
              />
            )}
          />
        </Grid>
      )}

      <Grid item xs={12} sm={6} md={6} lg={4} xl={4} alignItems="center">
        <Autocomplete
          disablePortal
          id="organizationSearch"
          options={[
            { id: 'all', name: 'All', value: 'all' },
            { id: 'notAssigned', name: 'Not Assigned', value: 'notAssigned' },
            ...organizations
          ]}
          value={organizationDefaultValue} // Use organization default value
          getOptionLabel={(option) => option.name} // Display label in the dropdown
          disableClearable
          onChange={(e, value) => {
            const newValue = value || { id: 'all', name: 'All', value: 'all' };
            setOrganizationDefaultValue(newValue); // Update selected organization
            setTextOrganization(newValue.id);
            debouncedSearchVehicles(newValue.id, textNumber, textGroup);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={t('vehicle.search.listOrganization.placeholder')}
              label={t('vehicle.search.listOrganization.label')}
              fullWidth
              size="small"
              color="secondary"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={6} lg={4} xl={4} className="red" alignItems="center">
        <TextField
          placeholder={t('vehicle.search.searchNumber.placeholder')}
          label={t('vehicle.search.searchNumber.label')}
          fullWidth
          size="small"
          id="numberSearch"
          color="secondary"
          onChange={handleSearchNumberChange}
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

VehicleSearch.propTypes = {
  tenants: PropTypes.array.isRequired,
  organizations: PropTypes.array.isRequired,
  handleSearchNumberChange: PropTypes.func.isRequired,
  setTextGroup: PropTypes.func.isRequired,
  setTextOrganization: PropTypes.func.isRequired,
  debouncedSearchVehicles: PropTypes.func.isRequired,
  textGroup: PropTypes.string.isRequired,
  textNumber: PropTypes.string.isRequired,
  textOrganization: PropTypes.string.isRequired,
  setVehicleTypeUpdate: PropTypes.func.isRequired,
  setOrganizationUpdate: PropTypes.func.isRequired
};
