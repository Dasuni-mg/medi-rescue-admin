import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, Box, Button, Divider, Drawer, Grid, IconButton, TextField, Typography, useTheme } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import { useMutation } from '@tanstack/react-query';
import { saveAs } from 'file-saver';
import { useFormik } from 'formik';
import html2canvas from 'html2canvas';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import QRCodeGenerator from 'qrcode';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'react-qr-code';
import deviceService from 'services/device-service';
import { tenantService } from 'services/tenant-service';
import InnerPageLoader from 'shared/loaders/inner-page-loader';
import { ProgressBar, ProgressSpinner } from 'ui-component/extended/progress-bars';
import { deviceValidationSchema } from 'utils/form-schemas';
import { hasPermission } from 'utils/permission';
import Toaster from 'utils/toaster';
import { vehicleService } from '../../services/vehicle-service';
import { DeviceTypeField } from '../shared-components/device-type-field';
import { TenantField } from '../shared-components/tenant-field';

/**
 * DeviceDrawer component is a sidebar drawer used to create or view device details.
 * It handles form validation, submission, and manages the display of device-related
 * information such as serial number, device name, type, associated vehicles, and QR code.
 *
 * @param {boolean} navOpen - Indicates if the drawer is open.
 * @param {function} toggleDrawer - Function to open/close the drawer.
 * @param {object} selectedAction - The action object containing information about the current action (create/view).
 * @param {boolean} isSuperAdmin - Indicates if the user has super admin privileges.
 * @param {object} tenant - The tenant object containing tenant information.
 * @param {function} setTenant - Function to set the current tenant.
 */
export const DeviceDrawer = ({ navOpen, toggleDrawer, selectedAction, isSuperAdmin, tenant, setTenant }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [device, setDevice] = useState({});
  const [isCreateDevice, setIsCreateDevice] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const { t } = useTranslation();
  const [qrCodeData, setQrCodeData] = useState('');
  const qrCodeRef = useRef();
  const [vehicleList, setVehicleList] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [disableFormField, setDisableFormField] = useState(false);
  const [isCreateVehicle, setIsCreateVehicle] = useState(false);
  const [groupId, setGroupId] = useState('');
  const theme = useTheme();

  // form handling
  const formik = useFormik({
    initialValues: {
      serialNumber: '',
      deviceType: '',
      deviceName: '',
      qrCode: '',
      group: '',
      vehicle: ''
    },
    validationSchema: deviceValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      handleOnSubmit(values);
    }
  });

  useEffect(() => {
    switch (selectedAction?.type ?? '') {
      case 'create':
        if (isSuperAdmin) {
          setDisableFormField(true);
        }
        setIsCreateVehicle(true);
        break;
      case 'view':
        if (isSuperAdmin) {
          setDisableFormField(false);
        }
        setIsCreateVehicle(false);
        break;
      default:
        break;
    }
  }, [selectedAction]);

  useEffect(() => {
    // Watch for changes in the tenant field value
    if (formik?.values?.group) {
      setGroupId(formik?.values?.group);
      fetchVehicles();
    }
    // setTenant(formik?.values?.group);
  }, [formik?.values?.group, groupId]);

  /** Formik form initialization */
  useEffect(() => {
    if (selectedAction?.type == 'create') {
      formik.setValues({
        serialNumber: '',
        deviceType: '',
        deviceName: '',
        qrCode: '',
        group: '',
        vehicle: ''
      });
    }
  }, [toggleDrawer]);

  /**
   * The mutation function for creating an device
   * @param {Object} data - The device data
   * @returns {Promise} The promise object
   */
  const { mutate: createDeviceMutate } = useMutation({
    mutationFn: (data) => deviceService.createDevice(data),
    mutationKey: 'create-device'
  });

  /**
   * The mutation function for updating an device
   * @param {Object} data - The device data
   * @returns {Promise} The promise object
   */
  const { mutate: updateDeviceMutate } = useMutation({
    mutationFn: ({ id, data }) => deviceService.updateDevice(id, data),
    mutationKey: 'update-device'
  });

  /**
   * useEffect to fetch device types
   */
  useEffect(() => {
    getTenants();
  }, [navOpen, formik?.values?.group]);

  /**
   * useEffect to fetch vehicles
   */
  useEffect(() => {
    if (groupId) {
      fetchVehicles();
    }
  }, [groupId]);

  /**
   * Fetches all vehicles from the API and updates the vehicle list state.
   */
  const fetchVehicles = async () => {
    try {
      const vehiclesResponse = await vehicleService.searchVehicles('all', '', groupId);
      setVehicleList(vehiclesResponse.data);
    } catch (error) {
      Toaster.error(t('device.drawer.create.error.unknown'));
    }
  };

  /**
   * useEffect to fetch device
   */
  useEffect(() => {
    if (selectedAction?.type === 'view' && selectedAction?.row?.id) {
      setIsLoading(true);
      deviceService
        .getDeviceById(selectedAction.row.id)
        .then((response) => {
          setDevice(response);
          setIsLoading(false);
        })
        .catch((error) => {
          Toaster.error('Failed to load device');
          setIsLoading(false);
        });
    }
  }, [selectedAction]);

  /**
   * Checks if the user has the permission to create or update an device
   *
   * @returns {boolean} True if the user has the permission, false otherwise
   */
  const updateSavebuttonVisibility = () => {
    if (isCreateDevice) {
      return (
        // If the user is creating an device, check if they have the permission to create any device
        hasPermission('smtadmin_device.createAny') ||
        // or the permission to create the specific device
        hasPermission('smtadmin_device.create')
      );
    } else {
      return (
        // If the user is updating an device, check if they have the permission to update any device
        hasPermission('smtadmin_device.updateAny') ||
        // or the permission to update the specific device
        hasPermission('smtadmin_device.update')
      );
    }
  };

  /**
   * The function to handle the form submission
   * @param {Object} values - The form values object
   * @returns {void}
   */
  const handleOnSubmit = async (values) => {
    if (selectedAction.type === 'create') {
      setIsLoading(true);
      createDeviceMutate(
        {
          serialNumber: values.serialNumber || '',
          deviceTypeId: values.deviceType || '',
          name: values.deviceName || '',
          qrCode: values.qrCode || '',
          tenantId: groupId || '',
          vehicleIds: values.vehicle || []
        },
        {
          /**
           * Called when the device creation mutation is successful.
           * Displays a success message, closes the drawer, and updates the state.
           * @param {Object} data - The response data from the API.
           */
          onSuccess: (data) => {
            setIsLoading(false);
            Toaster.success(t('device.drawer.create.success.message'));
            toggleDrawer(false, {
              row: {},
              type: 'created'
            });
          },
          /**
           * Handles errors during the device creation process.
           * Displays specific error messages based on error codes.
           *
           * @param {Object} error - The error object containing error details.
           */
          onError: (error) => {
            setIsLoading(false);
            // If the error code is 1204, it means the device with the same name or email address already exists.
            if (error?.code && error?.code === 1204) {
              Toaster.error(t('device.drawer.create.error.duplicate'));
            } else if (error?.code && error?.code === 1707) {
              // If the error code is 1707, it means the API returned an unknown error.
              Toaster.error(error?.reason ?? t('device.drawer.create.error.unknown'));
            } else {
              // If the error code is not 1204 or 1707, show a generic error message.
              Toaster.error(t('device.drawer.create.error.unknown'));
            }
          }
        }
      );
    }

    if (selectedAction.type === 'view') {
      setIsLoading(true);
      updateDeviceMutate(
        {
          id: device?.id || '',
          data: {
            serialNumber: values.serialNumber || '',
            deviceTypeId: values.deviceType || '',
            name: values.deviceName || '',
            qrCode: values.qrCode || '',
            tenantId: values.group || '',
            vehicleIds: values.vehicle || []
          }
        },
        {
          /**
           * Called when the device update mutation is successful.
           * Displays a success message, closes the drawer, and resets the form.
           * @param {Object} data - The response data from the API.
           */
          onSuccess: (data) => {
            setIsLoading(false);
            Toaster.success(t('device.drawer.update.success.message'));
            toggleDrawer(false, {
              row: {},
              type: 'updated'
            });
          },
          /**
           * Handles errors during the device update process.
           * Displays specific error messages based on error codes.
           *
           * @param {Object} error - The error object containing error details.
           * @param {number} error.code - The error code returned by the API.
           * @param {string} [error.reason] - The error message returned by the API.
           *
           * @returns {void}
           */
          onError: (error) => {
            setIsLoading(false);
            // If the error code is 1204, it means the device with the same name or email address already exists.
            if (error?.code && error?.code === 1204) {
              Toaster.error(t('device.drawer.update.error.duplicate'));
            } else if (error?.code && error?.code === 1707) {
              // If the error code is 1707, it means the API returned an unknown error.
              Toaster.error(error?.reason ?? t('device.drawer.update.error.unknown'));
            } else {
              // If the error code is not 1204 or 1707, show a generic error message.
              Toaster.error(t('device.drawer.update.error.unknown'));
            }
          }
        }
      );
    }
  };

  /**
   * Generates a random 5-digit code
   * @returns {string} The generated 5-digit code
   */
  const generateRandomCode = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
  };

  /**
   * Generates a random 5-digit code and creates a QR code using the QRCodeGenerator package.
   * The QR code is then set as the value of the qrCode form field, and a success message is displayed.
   * If an error occurs, an error message is displayed.
   * @returns {void}
   */
  const handleGenerateQRCode = async () => {
    try {
      // Check if a QR code already exists
      const isRegenerate = !!formik.values.qrCode;

      // Generate a random 5-digit code
      const data = generateRandomCode();

      // Use QRCodeGenerator to generate the QR code in data URL format
      const qrCode = await QRCodeGenerator.toDataURL(data);

      // Update the formik value with the new QR code
      formik.setFieldValue('qrCode', data);

      // Show a success message based on the action
      if (isRegenerate) {
        Toaster.success(t('device.drawer.field.qrCode.regenerate.success')); // Message for regeneration
      } else {
        Toaster.success(t('device.drawer.field.qrCode.genarate.success'));
      }
    } catch (error) {
      Toaster.error(t('device.drawer.field.qrCode.genarate.error'));
    }
  };

  /**
   * Fetches all tenants from the API and updates the tenants state.
   * @returns {Promise<void>} Resolves when the tenants are fetched and the state is updated.
   */
  const getTenants = async () => {
    try {
      // Call the API to fetch the tenants
      const response = await tenantService.searchTenant(0, -1, '', '');
      // Update the state with the fetched data
      setTenants(response.data);
    } catch (error) {
      // Log the error if the API call fails
      Toaster.error(t('device.drawer.field.group.fetchGroup.error.unknown'));
    }
  };

  /**
   * Reset the form and set the device to view.
   */
  useEffect(() => {
    formik.resetForm();
    setDevice({});
    if (navOpen && selectedAction.type === 'view') {
      setIsLoading(true);
      getTenants();
      deviceService
        .getDeviceById(selectedAction?.row?.row.original?.id ?? '')
        .then((response) => {
          setDevice(response);
          if (isSuperAdmin) {
            formik.setFieldValue('group', response?.tenantId);
          }

          // Map the fields from the response to the form fields
          formik.setFieldValue('serialNumber', response?.serialNumber ?? '');
          formik.setFieldValue('deviceName', response?.name ?? '');
          formik.setFieldValue('deviceType', response?.deviceTypeId ?? '');
          formik.setFieldValue('vehicle', response?.vehicleIds ?? []);
          formik.setFieldValue('qrCode', response?.qrCode ?? '');

          setIsLoading(false);
        })
        .catch((error) => {
          Toaster.error(error);
          // toggleDrawer(false);
          setIsLoading(false);
        });
    }
    if (navOpen && (selectedAction?.type ?? '') === 'create') {
      formik.resetForm();
    }
  }, [navOpen, selectedAction, tenant, isCreateDevice]);

  /**
   * Function to download the generated QR code as a PNG file.
   * @description
   *   This function captures the QR code as an image using html2canvas with higher
   *   resolution, and then uses the saveAs library to download it as a PNG file.
   */
  const handleDownloadQRCode = () => {
    const qrCodeElement = qrCodeRef.current;
    const timestamp = new Date().getTime();

    // Create a temporary container for full-page centering
    const fullPageContainer = document.createElement('div');
    fullPageContainer.style.width = '400px'; // Page width
    fullPageContainer.style.height = '300px'; // Page height
    fullPageContainer.style.display = 'flex';
    fullPageContainer.style.alignItems = 'center';
    fullPageContainer.style.justifyContent = 'center';
    fullPageContainer.style.backgroundColor = '#ffffff';

    // Clone the QR code and append it to the container
    const qrCodeClone = qrCodeElement.cloneNode(true);
    fullPageContainer.appendChild(qrCodeClone);

    // Append the container to the body temporarily
    document.body.appendChild(fullPageContainer);

    // Capture the full page as an image
    html2canvas(fullPageContainer, {
      scale: 4
    }).then((canvas) => {
      canvas.toBlob(function (blob) {
        saveAs(blob, `qr_code_${timestamp}.png`); // Download with timestamped filename
        document.body.removeChild(fullPageContainer); // Clean up the temporary container
      });
    });
  };

  /**
   * Copies the QR code data to the clipboard.
   */
  const handleCopyToClipboard = () => {
    navigator.clipboard
      .writeText(qrCodeData)
      .then(() => Toaster.success(t('device.drawer.field.qrCode.copy.success')))
      .catch(() => Toaster.error(t('device.drawer.field.qrCode.copy.error')));
  };

  return (
    <Drawer className="about-drawer" open={navOpen} onClose={() => toggleDrawer(false)} anchor="right">
      <Box className="sidebar-p">
        {/*Pre loader component*/}
        {/* <InnerPageLoader /> */}
        {/*Pre loader component*/}

        {/* Progress Bar */}
        <ProgressBar active={isLoading} />
        {isLoading && <InnerPageLoader />}
        {/* End of Progress Bar */}

        {/* Device Drawer Header */}
        <Grid container>
          <Grid item xs={12}>
            <Box className="d-title-space d-flex v-center">
              <Typography variant="h3">
                {(() => {
                  switch (selectedAction?.type ?? '') {
                    case 'create':
                      return t('device.drawer.title.action.create');
                    case 'view':
                      return t('device.drawer.title.action.view');
                    default:
                      return '';
                  }
                })()}{' '}
                {t('device.drawer.title.suffix')}
              </Typography>
              <IconButton aria-label="delete" className="position-end" onClick={() => toggleDrawer(false)}>
                <span className="material-symbols-outlined">close</span>
              </IconButton>
            </Box>
          </Grid>
          <Divider />
          {/* End of Device Drawer Header */}

          {/* Form */}

          <Grid container className="d-title-space" sx={{ pointerEvents: updateSavebuttonVisibility() ? '' : 'none' }}>
            {/* Tenant Autocomplete */}
            {/* Each Row  */}
            {isSuperAdmin && (
              <Grid item xs={12} className="mb-28">
                <TenantField
                  isCreateOrg={isCreateVehicle}
                  setFieldValue={formik.setFieldValue}
                  errors={formik.errors}
                  touched={formik.touched}
                  tenant={tenant}
                  setDisableFormField={setDisableFormField}
                />
              </Grid>
            )}
            {/* End of Each Row */}

            {/* Serial Number */}
            <Grid item xs={12} className="mb-28">
              <TextField
                disabled={disableFormField}
                fullWidth
                placeholder={t('device.drawer.field.serialNumber.placeholder')}
                id="serialNumber"
                name="serialNumber"
                label={t('device.drawer.field.serialNumber.label')}
                InputLabelProps={{ shrink: true }}
                size="small"
                value={formik.values.serialNumber}
                required
                onChange={formik.handleChange}
                error={formik.touched.serialNumber && Boolean(formik.errors.serialNumber)}
                helperText={formik.touched.serialNumber && t(formik.errors.serialNumber)}
              />
            </Grid>

            {/* Device Name */}
            <Grid item xs={12} className="mb-28">
              <TextField
                disabled={disableFormField}
                label={t('device.drawer.field.deviceName.label')}
                placeholder={t('device.drawer.field.deviceName.placeholder')}
                size="small"
                fullWidth
                id="deviceName"
                name="deviceName"
                required
                InputLabelProps={{ shrink: true }}
                value={formik.values.deviceName}
                onChange={formik.handleChange}
                error={formik.touched.deviceName && Boolean(formik.errors.deviceName)}
                helperText={formik.touched.deviceName && t(formik.errors.deviceName)}
              />
            </Grid>

            {/* Device Type Autocomplete */}
            <Grid item xs={12} className="mb-28">
              <DeviceTypeField
                disabled={disableFormField}
                setFieldValue={formik.setFieldValue}
                errors={formik.errors}
                touched={formik.touched}
                entity={device}
                setDisableFormField={setDisableFormField}
              />
            </Grid>

            {/* Vehicle Autocomplete */}
            <Grid item xs={12} className="mb-28">
              <Autocomplete
                disabled={disableFormField}
                disablePortal
                id="vehicle"
                name="vehicle"
                options={vehicleList}
                key={vehicleList.find((option) => option.id === Number(formik.values.vehicle[0]))?.id || undefined}
                defaultValue={vehicleList.find((option) => option.id === Number(formik.values.vehicle[0])) || undefined}
                isOptionEqualToValue={(option, value) => {
                  return !isEmpty(option) && !isEmpty(value) && option?.id && value?.id && option?.id === value?.id;
                }}
                getOptionKey={(option) => option?.id ?? undefined}
                getOptionLabel={(option) => option?.number ?? ''}
                // value={vehicleList.find((option) => option.id === Number(formik.values.vehicle[0])) || null}
                onChange={(e, value, reason) => {
                  formik.setFieldValue('vehicle', [value.id]);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('device.drawer.field.vehicle.label')}
                    placeholder={t('device.drawer.field.vehicle.placeholder')}
                    fullWidth
                    id="vehicle"
                    name="vehicle"
                    value={formik.values.vehicle}
                    onChange={formik.handleChange}
                    margin="normal"
                    size="small"
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

            {/* QR Code Generation and Display */}
            <Grid container spacing={3}>
              <Grid item xs={12} className="mb-28">
                <Button
                  disabled={disableFormField}
                  variant="contained"
                  color="secondary"
                  className="text-ellipsis position-start line-1"
                  onClick={handleGenerateQRCode}
                >
                  <div className="material-symbols-outlined mr-8">qr_code</div>
                  <div className="button">
                    {
                      formik.values.qrCode
                        ? t('device.drawer.field.qrCode.regenerate.action') // Text when QR code exists
                        : t('device.drawer.field.qrCode.genarate.action') // Text when QR code does not exist
                    }
                  </div>
                </Button>
              </Grid>

              {/* QR Code Generation and Display */}
              {/* {isGenerated && ( */}
              {formik.values.qrCode && (
                <Grid item xs={12} className="mb-28 d-flex justify-between">
                  {/* QR Code Ref applied here */}
                  <div ref={qrCodeRef}>
                    <QRCode
                      size={312}
                      style={{ height: 'auto', maxWidth: '80%', width: '80%' }}
                      value={formik.values.qrCode || ''} // Default value or QR code value
                      viewBox={`0 0 256 256`}
                    />
                  </div>
                  <Button
                    disabled={disableFormField}
                    className="ml-20 p-4 d-icon-avatar pointer download"
                    sx={{ background: theme.palette.primary.light, color: theme.palette.primary.main }}
                    onClick={handleDownloadQRCode}
                  >
                    <div className="material-symbols-outlined">download</div>
                  </Button>
                </Grid>
              )}
              {/* )} */}

              <Grid container spacing={2} className="mb-28 pl-13">
                {/* Typography for instructions */}
                {formik.values.qrCode && (
                  <Grid item xs={12}>
                    <Typography variant="body1" className="pb-15 dark-color">
                      {t('device.drawer.field.qrCode.helperText')}
                    </Typography>
                  </Grid>
                )}

                {/* TextField and Button */}
                <Grid item xs={12} className="d-flex v-center">
                  <TextField
                    disabled={disableFormField}
                    fullWidth
                    id="qrCode"
                    name="qrCode"
                    label={t('device.drawer.field.qrCode.label')}
                    placeholder={t('device.drawer.field.qrCode.placeholder')}
                    size="small"
                    value={formik.values.qrCode}
                    InputLabelProps={{ shrink: true }}
                  />
                  <Button
                    disabled={disableFormField}
                    className="ml-20 p-4 d-icon-avatar pointer copy"
                    sx={{ background: theme.palette.primary.light, color: theme.palette.primary.main }}
                    onClick={handleCopyToClipboard}
                  >
                    <div className="material-symbols-outlined">content_copy</div>
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12} className="mb-15">
              <Button
                onClick={formik.handleSubmit}
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
                {(() => {
                  switch (selectedAction?.type ?? '') {
                    case 'create':
                      return t('device.drawer.submit.create');
                    case 'view':
                      return t('device.drawer.submit.update');
                    default:
                      return t('device.drawer.submit.create');
                  }
                })()}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Drawer>
  );
};

DeviceDrawer.propTypes = {
  navOpen: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  selectedAction: PropTypes.object,
  isSuperAdmin: PropTypes.bool,
  tenant: PropTypes.object.isRequired
};

export default DeviceDrawer;
