import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, Box, Button, Divider, Grid, IconButton, TextField, Typography } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import InputAdornment from '@mui/material/InputAdornment';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InnerPageLoader from 'shared/loaders/inner-page-loader';
import { ProgressSpinner } from 'ui-component/extended/progress-bars';
import { hasPermission } from 'utils/permission';
import Toaster from 'utils/toaster';
import { organizationService } from '../../services/organization-service';
import { vehicleService } from '../../services/vehicle-service';
import { vehicleTypeService } from '../../services/vehicle-type-service';
import { vehicleCreateSchema } from '../../utils/form-schemas';
import { VehicleTypeFiled } from './vehicle-type-field';

/**
 * A Drawer component for Vehicle form in SMT Admin.
 * Can be used in Create, Update, or View mode.
 * @param {Object} props The props object.
 * @param {string} props.mode The mode of the drawer (create, update, view).
 * @param {boolean} props.navopen Flag to indicate if the drawer should be open or not.
 * @param {Function} props.toggleDrawer Function to toggle the drawer open or close.
 * @param {Object} props.vehicle The vehicle object to be edited or viewed.
 * @param {Array} props.emergencyTypes Array of emergency types.
 * @param {Array} props.fuelTypes Array of fuel types.
 * @param {Array} props.unitTypes Array of unit types.
 * @param {Array} props.tenants Array of tenants.
 * @param {Function} props.setMode Function to set the mode of the drawer.
 * @param {string} props.vehicleID The ID of the vehicle to be edited or viewed.
 * @param {string} props.textGroup The group name to be searched.
 * @param {string} props.textNumber The vehicle number to be searched.
 * @param {string} props.textOrganization The organization name to be searched.
 * @param {Array} props.organizations Array of organizations.
 * @param {Function} props.setVehicles Function to set the list of vehicles after a search.
 * @param {Function} props.vehicleTypeUpdate Function to update the vehicle type.
 * @param {Function} props.organizationUpdate Function to update the organization.
 */
export const VehicleDrawer = ({
  mode,
  navopen,
  toggleDrawer,
  vehicle,
  emergencyTypes,
  fuelTypes,
  unitTypes,
  tenants,
  setMode,
  vehicleID,
  textGroup,
  textNumber,
  textOrganization,
  organizations,
  setVehicles,
  vehicleTypeUpdate,
  organizationUpdate,
  setVehicleTypeUpdate,
  pageIndex,
  pageSize,
  setPagination,
  setSorting,
  pagination,
  sorting,
  orderBy,
  setOrderBy,
  setTotalRowCount
}) => {
  // const [organizations, setOrganizations] = useState([]);
  const { t } = useTranslation();
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [tenantId, setTenantId] = useState('');
  const [organizationsCreate, setOrganizationsCreate] = useState([]);
  const isEditMode = mode === 'update';
  const isCreateMode = mode === 'create';
  const [searchText, setSearchText] = useState('');
  const options = isEditMode ? organizationUpdate : organizationsCreate;
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTenantValue, setSelectedTenantValue] = useState();
  const [disableFormField, setDisableFormField] = useState(true);
  const [vehicleTypeLoading, setVehicleTypeLoading] = useState(false);

  const { mutate: vehicleUpdateMutate } = useMutation({
    /**
     * @function mutationFn
     * @description This function is used to update a vehicle in the API.
     * @param {Object} data - The vehicle data to be updated.
     * @returns {Promise<void>} Resolves when the vehicle is updated.
     */
    mutationFn: (data) => vehicleService.updateVehicle(data),
    mutationKey: 'vehicle-form'
  });

  useEffect(() => {
    if (mode == 'create' && selectedTenantValue == null) {
      setDisableFormField(true);
      formik.setValues({
        vehiclenumber: '',
        emergencytype: '',
        fueltype: '',
        primary_number: '',
        secondary_number: '',
        chassis_number: '',
        engine_number: '',
        ordometer_reading: '',
        unit: '',
        organization2: '',
        vehicleTypeId: ''
      });
    } else if (mode == 'update' && !Array.isArray(vehicle)) {
      setSelectedTenantValue(vehicle.tenantId);
      setDisableFormField(false);
      getOrganizations(vehicle.tenantId);
    }
    setIsLoading(false);
  }, [toggleDrawer]);

  useEffect(() => {
    if (mode == 'create' && selectedTenantValue != null) {
      setDisableFormField(false);
      formik.setFieldValue('tenant', selectedTenantValue);
      getListVehicleTypes(selectedTenantValue);
      getOrganizations(selectedTenantValue);
    }
  }, [selectedTenantValue]);

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
   * Fetches the list of organizations from the API and updates the state.
   * @param {string} textGroupCreate - The text to filter the search results by group
   * @returns {Promise<void>} - Resolves when the organizations are fetched and the state is updated
   */
  const getOrganizations = async (textGroupCreate) => {
    const sorting = [];

    // Push the object with 'createdAt' as id and 'desc' as true
    sorting.push({
      id: 'createdAt',
      desc: true
    });

    try {
      // Make the API call to search for organizations
      const response = await organizationService.searchOrganization('', 0, 100, [], textGroupCreate);
      // Update the state with the fetched organizations
      setOrganizationsCreate(response.content);
    } catch (error) {
      // Log the error if the API call fails
      console.error('Error fetching vehicle by id:', error);
    }
  };

  /**
   * Handles the submission of the vehicle update form.
   * @param {Object} values - The values from the formik form
   */
  const handleUpdateOnSubmit = async (values) => {
    setIsLoading(true);
    // Set the form loading state to true
    //setIsFormLoading(true);
    try {
      // Call the vehicle update mutation and pass the form values
      vehicleUpdateMutate(
        {
          // Map the form values to the API request
          number: values.vehiclenumber,
          emergencyTypeId: parseInt(values.emergencytype, 10),
          fuelTypeId: parseInt(values.fueltype, 10),
          primaryMobileNumber: values.primary_number,
          secondaryMobileNumber: values.secondary_number,
          chassisNumber: values.chassis_number,
          engineNumber: values.engine_number,
          odometer: values.ordometer_reading,
          unitTypeId: parseInt(values.unit, 10),
          organizations: values.organization2 !== '' ? [values.organization2] : null,
          vehicleTypeId: parseInt(values.vehicleTypeId, 10),
          id: vehicleID
        },
        {
          // On success, toggle the drawer off and reset the form
          onSuccess: (data) => {
            toggleDrawer(false)();
            formik.resetForm({
              values: {
                vehiclenumber: '',
                emergencytype: '',
                fueltype: '',
                primary_number: '',
                secondary_number: '',
                chassis_number: '',
                engine_number: '',
                ordometer_reading: '',
                unit: '',
                organization2: '',
                vehicleTypeId: ''
              }
            }); // Explicitly reset all fields to empty values
            setIsLoading(false);
            Toaster.success(t('vehicle.drawer.update.success.message'));
            debouncedSearchVehicles(textOrganization, textNumber, textGroup);
          },
          /**
           * @function onError
           * @description Handles the errors from the API call
           * @param {Object} error - The error object from the API call
           */
          onError: (error) => {
            setIsLoading(false);
            const errorCode = error?.code;
            const errorAttribute = error?.attribute;

            // Switch statement to handle different error codes
            switch (errorCode) {
              // 1714: Vehicle number already exists
              case 1714:
                Toaster.error(t('vehicle.drawer.update.error.vehicleNumberDuplicate'));
                break;
              // 1715: Engine number already exists
              case 1715:
                Toaster.error(t('vehicle.drawer.update.error.engineNumberDuplicate'));
                break;
              // 1716: Chassis number already exists
              case 1716:
                Toaster.error(t('vehicle.drawer.update.error.chassisNumberDuplicate'));
                break;
              // 1713: Tenant is not active or vehicle is assigned to an active incident
              case 1713:
                if (errorAttribute === 'Tenant') {
                  // Tenant is not active
                  Toaster.error(t('vehicle.drawer.update.error.tenant'));
                } else {
                  // Vehicle is assigned to an active incident
                  Toaster.error(t('vehicle.drawer.update.error.incident'));
                }
                break;
              default:
                // Unknown error
                Toaster.error(t('vehicle.drawer.update.error.unknown'));
            }
          }
        }
      );
    } catch (error) {
      setIsLoading(false);
      Toaster.error(t('vehicle.drawer.update.error.unknown'));
    }
  };

  useEffect(() => {
    if (mode == 'create') {
      setSelectedTenantValue(null);
    }
    if (!navopen) {
      formik.resetForm();
    }
  }, [navopen]);

  /**
   * Fetches the list of vehicle types from the API and updates the state.
   * @param {string} tenantIds - tenant ID or IDs to filter by
   * @returns {Promise<void>} Resolves when the vehicle types are fetched and the state is updated.
   */
  const getListVehicleTypes = async (tenantIds) => {
    try {
      // Reset the vehicle types state to an empty array
      setVehicleTypes([]);
      // Call the API to fetch the vehicle types
      const response = await vehicleTypeService.listVehicleTypes(tenantIds); // Wait for the API call to complete
      // Log the response if the API call was successful
      // Update the state with the fetched data
      setVehicleTypes(response); // Update the state with the fetched data
    } catch (error) {
      // Log the error if the API call fails
      console.error('Error fetching vehicle by id:', error);
    }
  };

  const { mutate: vehicleMutate } = useMutation({
    mutationFn: (data) => vehicleService.createVehicle(data),
    mutationKey: 'vehicle-form'
  });

  /**
   * Handles the form submission by calling the API to create a new vehicle.
   * @param {Object} values - The form values object
   * @returns {void}
   */
  const handleOnSubmit = async (values) => {
    setIsLoading(true);
    /**
     * The mutation function to create a new vehicle
     * @param {Object} data - The request object that is sent to the API
     * @returns {Promise<Object>} - The response from the API
     * @throws {Error} - If the API throws an error
     */
    vehicleMutate(
      {
        number: values.vehiclenumber,
        emergencyTypeId: parseInt(values.emergencytype, 10),
        fuelTypeId: parseInt(values.fueltype, 10),
        primaryMobileNumber: values.primary_number,
        secondaryMobileNumber: values.secondary_number || null,
        chassisNumber: values.chassis_number || null,
        engineNumber: values.engine_number || null,
        odometer: values.ordometer_reading || null,
        unitTypeId: parseInt(values.unit, 10) || null,
        tenantId: values.tenant || tenants[0].id,
        organizations: values.organization2 !== '' ? [values.organization2] : [],
        vehicleTypeId: parseInt(values.vehicleTypeId, 10)
      },
      {
        /**
         * Called when the mutation is successful.
         * Displays success message, resets the form, and refetches the list of vehicles.
         */
        onSuccess: (data) => {
          Toaster.success(t('vehicle.drawer.create.success.message'));
          toggleDrawer(false)();
          formik.resetForm(); // Reset the form to initial values after success
          debouncedSearchVehicles(textOrganization, textNumber, textGroup);
        },
        /**
         * Handles errors that occur during the update vehicle process.
         * Displays toast error messages based on different error codes and attributes.
         * @param {Error} error - The error that occurred during the update process.
         */
        onError: (error) => {
          setIsLoading(false);
          const errorCode = error?.code;
          const errorAttribute = error?.attribute;

          // Switch statement to handle different error codes
          switch (errorCode) {
            // 1714: Vehicle number already exists
            case 1714:
              Toaster.error(t('vehicle.drawer.create.error.vehicleNumberDuplicate'));
              break;
            // 1715: Engine number already exists
            case 1715:
              Toaster.error(t('vehicle.drawer.create.error.engineNumberDuplicate'));
              break;
            // 1716: Chassis number already exists
            case 1716:
              Toaster.error(t('vehicle.drawer.create.error.chassisNumberDuplicate'));
              break;
            // 1713: Tenant is not active or vehicle is assigned to an active incident
            case 1713:
              if (errorAttribute === 'Tenant') {
                // Tenant is not active
                Toaster.error(t('vehicle.drawer.create.error.tenant'));
              } else {
                // Vehicle is assigned to an active incident
                Toaster.error(t('vehicle.drawer.create.error.incident'));
              }
              break;
            default:
              // Unknown error
              Toaster.error(t('vehicle.drawer.create.error.unknown'));
          }
        }
      }
    );
  };

  /**
   * Handles the addition of a new vehicle type by calling the API to create a new vehicle type.
   * @returns {void}
   */
  const handleAddVehicleType = async () => {
    try {
      setVehicleTypeLoading(true);
      let response = '';
      // Check if the searchText is already in the vehicleTypes array
      if (!vehicleTypes.some((option) => option.name.toLowerCase() === searchText.toLowerCase())) {
        // Check the super admin permission
        if (hasPermission('smtadmin_vehicle.viewAny')) {
          // Call the API to create a new vehicle type
          response = await vehicleTypeService.createVehicleTypes(searchText, selectedTenantValue);
        } else {
          const userData = JSON.parse(localStorage.getItem('userData')); // Parse userData as it's stored in JSON format
          if (userData?.tenantId) {
            await vehicleTypeService.createVehicleTypes(searchText, userData.tenantId);
          }
        }
        setVehicleTypeLoading(false);
        Toaster.success(t('vehicle.drawer.field.vehicleType.create.success.message'));

        // Add the new vehicle type to the list
        const newVehicleType = { name: searchText, id: response.id, tenantId: response.tenantId };

        setVehicleTypes((previous) => [...previous, newVehicleType]);
        setVehicleTypeUpdate((previous) => [...previous, newVehicleType]);
      }
    } catch (error) {
      setVehicleTypeLoading(false);
      // Handle different types of errors
      if (error.name === 'Name should not exceed 30 characters') {
        Toaster.error(t('vehicle.drawer.field.vehicleType.validation.maxLength'));
      } else if (error.name === 'Vehicle Type is invalid') {
        Toaster.error(t('vehicle.drawer.field.vehicleType.validation.invalid'));
        Toaster.error('Invalid character type.');
      } else if (error.code === 1204) {
        Toaster.error(t('vehicle.drawer.field.vehicleType.create.error.duplicate'));
      } else {
        Toaster.error(t('vehicle.drawer.field.vehicleType.create.error.unknown'));
      }
    }
  };

  useEffect(() => {
    formik.resetForm();
    // Retrieve the user permissions and check for both 'createAny' and 'updateAny'
    const hasCreatePermission = hasPermission('smtadmin_vehicle.createAny');
    const hasUpdatePermission = hasPermission('smtadmin_vehicle.updateAny');
    if (hasCreatePermission || hasUpdatePermission) {
      // If no permission is available, fallback to the first tenant's ID
      if (tenants.length > 0) {
        const firstTenantId = tenants[0].id; // Fallback to first tenant's ID
        setTenantId(firstTenantId);

        if (firstTenantId) {
          // getListVehicleTypes(firstTenantId); // Retrieve vehicle types using first tenant's ID
          // getOrganizations(firstTenantId); // Retrieve organizations using first tenant's ID
        }
      }
    } else {
      // If permission is granted, retrieve tenantId from localStorage
      const userData = JSON.parse(localStorage.getItem('userData')); // Parse userData as it's stored in JSON format
      if (userData?.tenantId) {
        getListVehicleTypes(userData.tenantId); // Retrieve vehicle types using tenantId from userData
        getOrganizations(userData.tenantId); // Retrieve organizations using tenantId from userData
      }
    }
  }, [tenants]); // Adding 'tenants' as a dependency ensures it runs when tenants data is available

  const formik = useFormik({
    initialValues: {
      vehiclenumber: '',
      emergencytype: '',
      fueltype: '',
      primary_number: '',
      secondary_number: '',
      chassis_number: '',
      engine_number: '',
      ordometer_reading: '',
      unit: '',
      organization2: '',
      vehicleTypeId: '',
      tenant: ''
    },
    validationSchema: vehicleCreateSchema,
    validateOnChange: true, // Enable validation on change
    validateOnBlur: true, // Enable validation on blur (default behavior)
    onSubmit: (values) => {
      if (mode === 'create') {
        handleOnSubmit(values);
      } else if (mode === 'update') {
        handleUpdateOnSubmit(values);
      }
    }
  });

  useEffect(() => {
    if (isEditMode && vehicle) {
      formik.resetForm({
        // Populate form with vehicle details for viewing or editing
        values: {
          vehiclenumber: vehicle.number,
          emergencytype: vehicle.emergencyTypeId,
          fueltype: vehicle.fuelTypeId,
          primary_number: vehicle.primaryMobileNumber,
          secondary_number: vehicle.secondaryMobileNumber || null,
          chassis_number: vehicle.chassisNumber || null,
          engine_number: vehicle.engineNumber || null,
          ordometer_reading: vehicle.odometer || null,
          unit: vehicle.unitTypeId || null,
          organization2: vehicle.organizations ? vehicle.organizations[0] : null,
          vehicleTypeId: vehicle.vehicleTypeId
        }
      });
    }
  }, [isEditMode, vehicle.organizations ? vehicle.organizations[0] : null]);

  /**
   * Checks if the user has the permission to create or update an vehicle
   *
   * @returns {boolean} True if the user has the permission, false otherwise
   */
  const updateSavebuttonVisibility = () => {
    if (isCreateMode) {
      return (
        // If the user is creating an vehicle, check if they have the permission to create any vehicle
        hasPermission('smtadmin_vehicle.createAny') ||
        // or the permission to create the specific vehicle
        hasPermission('smtadmin_vehicle.create')
      );
    } else {
      return (
        // If the user is updating an vehicle, check if they have the permission to update any vehicle
        hasPermission('smtadmin_vehicle.update') ||
        // or the permission to update the specific vehicle
        hasPermission('smtadmin_vehicle.updateAny')
      );
    }
  };

  return (
    <Drawer className="about-drawer" open={navopen} onClose={toggleDrawer(false)} anchor="right">
      <Box className="sidebar-p">
        {/* Progress Bar */}
        {isLoading && <InnerPageLoader />}
        {/* End of Progress Bar */}

        <Grid container>
          {/* Title */}
          <Grid item xs={12}>
            <Box className="d-title-space d-flex v-center">
              <Typography variant="h3">
                {isCreateMode && `${t('vehicle.drawer.title.action.create')} ${t('vehicle.drawer.title.suffix')}`}
                {isEditMode && `${t('vehicle.drawer.title.action.update')} ${t('vehicle.drawer.title.suffix')}`}
              </Typography>
              <IconButton aria-label="close" className="position-end" onClick={toggleDrawer(false)}>
                <div className="material-symbols-outlined">close</div>
              </IconButton>
            </Box>
            <Divider />
          </Grid>
          {/* Title */}

          <Grid container className="d-title-space" sx={{ pointerEvents: updateSavebuttonVisibility() ? '' : 'none' }}>
            {/* Each Row  */}

            {hasPermission('smtadmin_vehicle.createAny') && ( // Check permission before rendering the field
              <Grid item xs={12} className="mb-28">
                <Autocomplete
                  disablePortal
                  id="tenant"
                  options={tenants}
                  disabled={!isCreateMode}
                  getOptionLabel={(option) => option.name}
                  onChange={(e, value) => {
                    setSelectedTenantValue(value && value.id ? value.id : null);
                  }}
                  value={
                    isEditMode
                      ? tenants.find((option) => option.id === vehicle.tenantId) || tenants[0]
                      : tenants.find((option) => option.id === formik.values.tenant)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={t('vehicle.drawer.field.group.placeholder')}
                      label={t('vehicle.drawer.field.group.label')}
                      required
                      fullWidth
                      disabled={isEditMode}
                      size="small"
                      id="tenant"
                      color="secondary"
                      InputLabelProps={{
                        shrink: true
                      }}
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

            <Grid item xs={12} className="mb-28">
              <TextField
                disabled={disableFormField}
                placeholder={t('vehicle.drawer.field.vehicleNumber.placeholder')}
                fullWidth
                label={t('vehicle.drawer.field.vehicleNumber.label')}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.vehiclenumber}
                error={formik.touched.vehiclenumber && Boolean(formik.errors.vehiclenumber)}
                helperText={formik.touched.vehiclenumber && t(formik.errors.vehiclenumber)}
                required
                size="small"
                id="vehiclenumber"
                color="secondary"
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
            {/* Each Row  */}

            {/* Each Row  */}
            <Grid item xs={12} className="mb-28">
              <Autocomplete
                disabled={disableFormField}
                disablePortal
                id="emergencytype"
                options={emergencyTypes}
                getOptionLabel={(option) => option.name}
                value={emergencyTypes.find((option) => option.id === Number(formik.values.emergencytype)) || null}
                onChange={(e, value) => formik.setFieldValue('emergencytype', value ? value.id : '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={t('vehicle.drawer.field.emergencyType.placeholder')}
                    label={t('vehicle.drawer.field.emergencyType.label')}
                    error={formik.touched.emergencytype && Boolean(formik.errors.emergencytype)}
                    helperText={formik.touched.emergencytype && t(formik.errors.emergencytype)}
                    required
                    fullWidth
                    size="small"
                    id="emergencytype"
                    color="secondary"
                    InputLabelProps={{
                      shrink: true
                    }}
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
            {/* Each Row  */}

            {/* Each Row  */}
            <Grid item xs={12} className="mb-28">
              <VehicleTypeFiled
                disabled={disableFormField}
                vehicleTypes={vehicleTypes}
                vehicleTypeUpdate={vehicleTypeUpdate}
                formik={formik}
                isEditMode={isEditMode}
                searchText={searchText}
                setSearchText={setSearchText}
                handleAddVehicleType={handleAddVehicleType}
                vehicle={vehicle}
                vehicleTypeLoading={vehicleTypeLoading}
              />
            </Grid>

            {/* Each Row  */}

            {/* Each Row  */}
            <Grid item xs={12} className="mb-28">
              <Autocomplete
                disabled={disableFormField}
                disablePortal
                id="fueltype"
                options={fuelTypes}
                getOptionLabel={(option) => option.name} // Display label in the dropdown
                value={fuelTypes.find((option) => option.id === Number(formik.values.fueltype)) || null}
                onChange={(e, value) => formik.setFieldValue('fueltype', value ? value.id : '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={t('vehicle.drawer.field.fuelType.placeholder')}
                    label={t('vehicle.drawer.field.fuelType.label')}
                    onBlur={formik.handleBlur}
                    error={formik.touched.fueltype && Boolean(formik.errors.fueltype)}
                    helperText={formik.touched.fueltype && t(formik.errors.fueltype)}
                    required
                    fullWidth
                    size="small"
                    id="fueltype"
                    color="secondary"
                    InputLabelProps={{
                      shrink: true
                    }}
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

            {/* Each Row  */}
            <Grid item xs={12} className="mb-28">
              <TextField
                disabled={disableFormField}
                fullWidth
                label={t('vehicle.drawer.field.primaryPhoneNumber.label')}
                onChange={formik.handleChange}
                value={formik.values.primary_number}
                onBlur={formik.handleBlur}
                error={formik.touched.primary_number && Boolean(formik.errors.primary_number)}
                helperText={formik.touched.primary_number && t(formik.errors.primary_number)}
                required
                size="small"
                id="primary_number"
                color="secondary"
                InputLabelProps={{
                  shrink: true
                }}
                placeholder={t('vehicle.drawer.field.primaryPhoneNumber.placeholder')}
              />
            </Grid>
            {/* Each Row  */}

            {/* Each Row  */}
            <Grid item xs={12} className="mb-28">
              <TextField
                disabled={disableFormField}
                fullWidth
                label={t('vehicle.drawer.field.secondaryPhoneNumber.label')}
                onChange={formik.handleChange}
                value={formik.values.secondary_number}
                onBlur={formik.handleBlur}
                error={formik.touched.secondary_number && Boolean(formik.errors.secondary_number)}
                helperText={formik.touched.secondary_number && t(formik.errors.secondary_number)}
                size="small"
                id="secondary_number"
                color="secondary"
                InputLabelProps={{
                  shrink: true
                }}
                placeholder={t('vehicle.drawer.field.secondaryPhoneNumber.placeholder')}
              />
            </Grid>
            {/* Each Row  */}

            {/* Each Row  */}
            <Grid item xs={12} className="mb-28">
              <TextField
                disabled={disableFormField}
                fullWidth
                label={t('vehicle.drawer.field.chassisNumber.label')}
                onChange={formik.handleChange}
                error={formik.touched.chassis_number && Boolean(formik.errors.chassis_number)}
                helperText={formik.touched.chassis_number && t(formik.errors.chassis_number)}
                value={formik.values.chassis_number}
                onBlur={formik.handleBlur}
                size="small"
                id="chassis_number"
                color="secondary"
                InputLabelProps={{
                  shrink: true
                }}
                placeholder={t('vehicle.drawer.field.chassisNumber.placeholder')}
              />
            </Grid>
            {/* Each Row  */}

            {/* Each Row  */}
            <Grid item xs={12} className="mb-28">
              <TextField
                disabled={disableFormField}
                fullWidth
                label={t('vehicle.drawer.field.engineNumber.label')}
                onChange={formik.handleChange}
                value={formik.values.engine_number}
                error={formik.touched.engine_number && Boolean(formik.errors.engine_number)}
                helperText={formik.touched.engine_number && t(formik.errors.engine_number)}
                onBlur={formik.handleBlur}
                size="small"
                id="engine_number"
                color="secondary"
                InputLabelProps={{
                  shrink: true
                }}
                placeholder={t('vehicle.drawer.field.engineNumber.placeholder')}
              />
            </Grid>
            {/* Each Row  */}

            {/* If break to two columns - each row */}
            <Grid container className="mb-28" spacing={5}>
              <Grid item xs={8}>
                <TextField
                  disabled={disableFormField}
                  fullWidth
                  label={t('vehicle.drawer.field.ordometerReading.label')}
                  onChange={formik.handleChange}
                  value={formik.values.ordometer_reading}
                  onBlur={formik.handleBlur}
                  error={formik.touched.ordometer_reading && Boolean(formik.errors.ordometer_reading)}
                  helperText={formik.touched.ordometer_reading && t(formik.errors.ordometer_reading)}
                  size="small"
                  id="ordometer_reading"
                  color="secondary"
                  InputLabelProps={{
                    shrink: true
                  }}
                  placeholder={t('vehicle.drawer.field.ordometerReading.placeholder')}
                />
              </Grid>
              <Grid item xs={4}>
                <Autocomplete
                  disabled={disableFormField}
                  disablePortal
                  id="combo-box-demo"
                  options={unitTypes}
                  getOptionLabel={(option) => option.name} // Display label in the dropdown
                  value={unitTypes.find((option) => option.id === Number(formik.values.unit)) || null}
                  onChange={(e, value) => formik.setFieldValue('unit', value ? value.id : '')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={t('vehicle.drawer.field.unit.placeholder')}
                      label={t('vehicle.drawer.field.unit.label')}
                      onChange={formik.handleChange}
                      value={isEditMode ? vehicle.unitTypeId : formik.values.unit}
                      onBlur={formik.handleBlur}
                      fullWidth
                      size="small"
                      id="unit"
                      color="secondary"
                      InputLabelProps={{
                        shrink: true
                      }}
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
            </Grid>
            {/* If break to two columns - each row */}

            <Grid item xs={12} className="mb-28">
              <Autocomplete
                disabled={disableFormField}
                disablePortal
                id="organization2"
                // Dynamically set options based on the mode
                options={options}
                getOptionLabel={(option) => option.name} // Display label in the dropdown
                value={options.find((option) => option.id === formik.values.organization2?.id) || null}
                onChange={(e, value) => formik.setFieldValue('organization2', value ? value : '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={t('vehicle.drawer.field.organization.placeholder')}
                    label={t('vehicle.drawer.field.organization.label')}
                    error={formik.touched.organization2 && Boolean(formik.errors.organization2)}
                    helperText={formik.touched.organization2 && t(formik.errors.organization2)}
                    fullWidth
                    size="small"
                    id="organization2"
                    color="secondary"
                    InputLabelProps={{
                      shrink: true
                    }}
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

            {/* Save / Update / View Button */}
            {updateSavebuttonVisibility() && (
              <Grid item xs={12} className="mb-15">
                {
                  <Button
                    onClick={() => {
                      formik.handleSubmit();
                    }}
                    variant="contained"
                    color="secondary"
                    className="text-ellipsis position-end line-1"
                    disabled={isLoading || disableFormField}
                  >
                    {isLoading && (
                      <div className="mr-10">
                        <ProgressSpinner standalone={true} active={isLoading} />
                      </div>
                    )}
                    {!isLoading && <div className="material-symbols-outlined mr-8">save</div>}
                    <div className="button">{isCreateMode ? 'Create' : 'Update'}</div>
                  </Button>
                }
              </Grid>
            )}
          </Grid>
        </Grid>
      </Box>
    </Drawer>
  );
};

VehicleDrawer.propTypes = {
  mode: PropTypes.string,
  navopen: PropTypes.bool,
  toggleDrawer: PropTypes.func,
  vehicle: PropTypes.object,
  emergencyTypes: PropTypes.array,
  fuelTypes: PropTypes.array,
  unitTypes: PropTypes.array,
  tenants: PropTypes.array,
  setMode: PropTypes.func,
  vehicleID: PropTypes.string,
  textGroup: PropTypes.string,
  textNumber: PropTypes.string,
  textOrganization: PropTypes.string,
  organizations: PropTypes.array,
  setVehicles: PropTypes.func,
  vehicleTypeUpdate: PropTypes.func,
  organizationUpdate: PropTypes.func
};
