import { Box, Grid, useTheme } from '@mui/material';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import InnerPageLoader from 'shared/loaders/inner-page-loader';
import { hasPermission } from 'utils/permission';
import Toaster from 'utils/toaster';
import { emergencyTypeService } from '../../services/emergency-type-service';
import { fuelTypeService } from '../../services/fuel-type-service';
import { organizationService } from '../../services/organization-service';
import { tenantService } from '../../services/tenant-service';
import { unitTypeService } from '../../services/unit-type-service';
import { vehicleService } from '../../services/vehicle-service';
import { VehicleBanner } from './vehicle-banner';
import { VehicleDrawer } from './vehicle-drawer';
import { VehicleHeader } from './vehicle-header';
import { VehicleSearch } from './vehicle-search';
import { VehicleTable } from './vehicle-table';

/**
 * @function Vehicles
 * @description This function renders the Vehicles component with the various elements of the UI.
 * @returns {ReactElement} The rendered component.
 */
function Vehicles() {
  const [navopen, setNavOpen] = React.useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [vehicle, setVehicle] = useState([]);
  const [emergencyTypes, setEmergencyTypes] = useState([]);
  const [fuelTypes, setFuelTypes] = useState([]);
  const [unitTypes, setUnitTypes] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [mode, setMode] = useState();
  const [vehicleID, setVehicleID] = useState('');
  const [textOrganization, setTextOrganization] = useState('all');
  const [textGroup, setTextGroup] = useState('');
  const [textNumber, SetTextNumber] = useState('');
  const [vehicleTypeUpdate, setVehicleTypeUpdate] = useState([]);
  const [organizationUpdate, setOrganizationUpdate] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0); // Tracks the current page
  const [pageSize, setPageSize] = useState(20); // Tracks the size of the page (rows per page)
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20
  });
  const [sorting, setSorting] = useState([
    {
      id: 'createdAt',
      desc: true
    }
  ]);
  const [orderBy, setOrderBy] = useState('');

  /**
   * @function viewVehicle
   * @description This function fetches a vehicle by ID from the API and updates the state.
   * @param {string} id - The ID of the vehicle to be fetched.
   * @returns {Promise<void>} Resolves when the vehicle is fetched and the state is updated.
   */
  const viewVehicle = async (id) => {
    setIsLoading(true);
    try {
      // Clear the previous vehicle data before fetching the new one
      setVehicle([]);
      // Call the API to fetch the vehicle by ID
      const response = await vehicleService.getVehicleById(id);
      // Update the state with the fetched data
      setVehicle(response);
    } catch (error) {
      // Log the error if the API call fails
      Toaster.error('An error occurred while viewing the vehicle. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * @function getListEmergencyTypes
   * @description This function fetches the list of emergency types from the API and updates the state.
   * @returns {Promise<void>} Resolves when the emergency types are fetched and the state is updated.
   */
  const getListEmergencyTypes = async () => {
    try {
      // Call the API to fetch the emergency types
      const response = await emergencyTypeService.listEmergencyType();
      // Update the state with the fetched data
      setEmergencyTypes(response);
    } catch (error) {
      // Log the error if the API call fails
      Toaster.error(`Error fetching emergency type data`);
    }
  };

  /**
   * @function getListFuelTypes
   * @description This function fetches the list of fuel types from the API and updates the state.
   * @returns {Promise<void>} Resolves when the fuel types are fetched and the state is updated.
   */
  const getListFuelTypes = async () => {
    try {
      // Call the API to fetch the fuel types
      const response = await fuelTypeService.listFuelType();
      // Update the state with the fetched data
      setFuelTypes(response);
    } catch (error) {
      // Log the error if the API call fails
      Toaster.error(`Error fetching fuel type data`);
    }
  };

  /**
   * @function getListUnitTypes
   * @description This function fetches the list of unit types from the API and updates the state.
   * @returns {Promise<void>} Resolves when the unit types are fetched and the state is updated.
   */
  const getListUnitTypes = async () => {
    try {
      // Call the API to fetch the unit types
      const response = await unitTypeService.listUnitType();
      // Update the state with the fetched data
      setUnitTypes(response);
    } catch (error) {
      // Log the error if the API call fails
      console.error('Error fetching unit type data:', error);
    }
  };

  /**
   * @function getOrganizations
   * @description Fetches the list of organizations from the API and updates the state.
   * @returns {Promise<void>} Resolves when the organizations are fetched and the state is updated.
   */
  const getOrganizations = async () => {
    const sorting = [];

    // Push the object with 'createdAt' as id and 'desc' as true
    sorting.push({
      id: 'createdAt',
      desc: false
    });

    try {
      // Call the API to fetch the organizations
      const response = await organizationService.searchOrganization('', 0, 100, [], textGroup);
      // Update the state with the fetched data
      setOrganizations(response.content);
    } catch (error) {
      console.error('Error fetching vehicle by id:', error); // Log the error if API call fails
    }
  };

  /**
   * @function getTenants
   * @description Fetches the list of tenants from the API and updates the state.
   * @returns {Promise<void>} Resolves when the tenants are fetched and the state is updated.
   */
  const getTenants = async () => {
    try {
      if (hasPermission('smtadmin_tenant.list')) {
        // Call the API to fetch the tenants
        const response = await tenantService.searchTenant(0, 10, '', '');
        // Update the state with the fetched data
        setTenants(response.data);
        // If there are tenants, set the first tenant's ID as the textGroup
        if (response.data.length > 0) {
          setTextGroup(response.data[0].id);
        }
      } else {
        const userData = JSON.parse(localStorage.getItem('userData')); // Parse userData as it's stored in JSON format
        if (userData?.tenantId) {
          setTextGroup(userData.tenantId);
        }
      }
    } catch (error) {
      // Log the error if the API call fails
      console.error('Error fetching vehicle by id:', error);
    }
  };

  useEffect(() => {
    getListEmergencyTypes();
    getListFuelTypes();
    getListUnitTypes();
    getTenants();
  }, []); // Only run once when the component mounts

  // Another useEffect that triggers debouncedSearchVehicles after textGroup is updated
  useEffect(() => {
    if (textGroup) {
      debouncedSearchVehicles(textOrganization, textNumber, textGroup, pageIndex, pageSize); // Call search function after textGroup is set
      getOrganizations();
    }
  }, [textGroup, textOrganization, textNumber]);

  const theme = useTheme();

  /**
   * @function toggleDrawer
   * @description Toggles the drawer open or closed.
   * @param {boolean} newOpen Whether the drawer should be open or closed.
   * @returns {function} A function that can be used as an event handler to toggle the drawer.
   */
  const toggleDrawer = (newOpen) => () => {
    setNavOpen(newOpen);
  };

  /**
   * @function debouncedSearchVehicles
   * @description Return vehicles fpr relevant searching criterias
   * @returns {function} A function that can be used as an event search vehicles.
   */
  const debouncedSearchVehicles = useCallback(
    debounce(async (textOrganization, textNumber, textGroup) => {
      try {
        let setOrderByName = 'desc';
        if (sorting.length === 0) {
          sorting.push({
            id: 'createdAt',
            desc: true
          });
        }

        const sort = sorting.map((s) => {
          let id = '';
          setOrderByName = s.desc ? 'desc' : 'asc';
          setOrderBy(setOrderByName);
          switch (s.id) {
            case 'number':
              id = 'number';
              break;
            case 'emergencyTypeName':
              id = 'emergencyTypeName';
              break;
            case 'vehicleTypeName':
              id = 'vehicleTypeName';
              break;
            case 'organizationName':
              id = 'organizationName';
              break;
            case 'createdAt':
              id = 'createdAt';
              break;
            default:
              id = 'createdAt';
              break;
          }
          return id;
        });

        setIsLoading(true);
        const response = await vehicleService.searchVehicles(
          textOrganization,
          textNumber,
          textGroup,
          pagination.pageIndex,
          pagination.pageSize,
          sort,
          orderBy
        );
        setVehicles(response.data); // Set the state with the fetched data
        setTotalRowCount(response.total);
      } catch (error) {
        setVehicles([]);
        setTotalRowCount(0);
        console.error('Error fetching vehicle data:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300), // 300 ms delay before calling backend
    [pagination, sorting]
  );

  /**
   * @function handleSearchNumberChange
   * @description Handles the change event for the search number input and calls the debounced search function.
   * @param {React.ChangeEvent<HTMLInputElement>} event The change event object.
   */
  const handleSearchNumberChange = (event) => {
    const query = event.target.value;
    // Set the current search number in the state
    SetTextNumber(query);
    // Call the debounced search function
    debouncedSearchVehicles(textOrganization, query, textGroup, pageIndex, pageSize);
  };

  return (
    <Box sx={{ flexGrow: 1 }} className="bg-load">
      {/* Progress Bar */}
      {isLoading && <InnerPageLoader />}
      {/* End of Progress Bar */}

      <Grid container sx={{ padding: { xs: theme.spacing(7), md: theme.spacing(8) } }}>
        {/* Heading  */}
        <VehicleHeader toggleDrawer={toggleDrawer} setMode={setMode} />
        {/* Heading  */}

        {/* Banner */}
        <VehicleBanner />
        {/* Banner */}

        {/* Search */}
        <VehicleSearch
          tenants={tenants}
          organizations={organizations}
          handleSearchNumberChange={handleSearchNumberChange}
          setTextGroup={setTextGroup}
          setTextOrganization={setTextOrganization}
          SetTextNumber={SetTextNumber}
          debouncedSearchVehicles={debouncedSearchVehicles}
          textOrganization={textOrganization}
          textNumber={textNumber}
          textGroup={textGroup}
          setVehicleTypeUpdate={setVehicleTypeUpdate}
          setOrganizationUpdate={setOrganizationUpdate}
          pagination={pagination}
          sorting={sorting}
          setPagination={setPagination}
          setSorting={setSorting}
        />
        {/* Search */}

        {/* Table  */}
        <VehicleTable
          toggleDrawer={toggleDrawer}
          vehicles={vehicles}
          mode={mode}
          totalRowCount={totalRowCount}
          setTotalRowCount={setTotalRowCount}
          setVehicles={setVehicles}
          setMode={setMode}
          viewVehicle={viewVehicle}
          vehicleID={vehicleID}
          setVehicleID={setVehicleID}
          setVehicleTypeUpdate={setVehicleTypeUpdate}
          debouncedSearchVehicles={debouncedSearchVehicles}
          textOrganization={textOrganization}
          textNumber={textNumber}
          textGroup={textGroup}
          pagination={pagination}
          sorting={sorting}
          setPagination={setPagination}
          setSorting={setSorting}
          orderBy={orderBy}
          setOrderBy={setOrderBy}
        />
        {/* Table  */}
      </Grid>

      <VehicleDrawer
        pageIndex={pageIndex}
        pageSize={pageSize}
        mode={mode}
        navopen={navopen}
        toggleDrawer={toggleDrawer}
        emergencyTypes={emergencyTypes}
        fuelTypes={fuelTypes}
        unitTypes={unitTypes}
        tenants={tenants}
        vehicle={vehicle}
        setMode={setMode}
        vehicleID={vehicleID}
        textGroup={textGroup}
        textNumber={textNumber}
        textOrganization={textOrganization}
        vehicleTypeUpdate={vehicleTypeUpdate}
        organizationUpdate={organizationUpdate}
        vehicles={vehicles}
        organizations={organizations}
        setVehicleTypeUpdate={setVehicleTypeUpdate}
        setVehicles={setVehicles}
        values={VehicleDrawer.values}
        handleBlur={VehicleDrawer.handleBlur}
        handleChange={VehicleDrawer.handleChange}
        setFieldValue={VehicleDrawer.setFieldValue}
        touched={VehicleDrawer.touched}
        errors={VehicleDrawer.errors}
        setTotalRowCount={setTotalRowCount}
      />
    </Box>
  );
}

export default Vehicles;
