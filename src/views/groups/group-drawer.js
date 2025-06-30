import { Dropzone, FileMosaic } from '@files-ui/react';
import { Alert, Avatar, Box, Button, Divider, Grid, IconButton, TextField, Typography } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import { useTheme } from '@mui/material/styles';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fileUploadService } from 'services/file-upload-service';
import { tenantService } from 'services/tenant-service';
import { ProgressSpinner } from 'ui-component/extended/progress-bars';
import { tenantCreateSchema } from 'utils/form-schemas';
import { hasPermission } from 'utils/permission';
import Toaster from 'utils/toaster';
import InnerPageLoader from '../../shared/loaders/inner-page-loader'; // Ensure this is the correct path
import { CountryField } from '../shared-components/country-field';

/**
 * GroupDrawer component
 * This component is used to create and view groups
 * It is opened when the user clicks on the 'Create' or 'View' button in the group table
 * @param {Object} props - The props object
 * @param {boolean} props.navOpen - Whether the drawer is open or not
 * @param {function} props.toggleDrawer - The function to toggle the drawer
 * @param {Object} props.selectedAction - The selected action object
 * @param {string} props.selectedAction.type - The type of action, either 'create' or 'view'
 * @param {Object} props.selectedAction.row - The row object from the group table
 * @param {Object} props.tenant - The tenant object
 * @returns {ReactElement} The GroupDrawer component
 */
export const GroupDrawer = ({ navOpen, toggleDrawer, selectedAction, tenant }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [group, setGroup] = useState({});
  const [isCreateTenant, setIsCreateTenant] = useState(false);
  const [disableFormField, setDisableFormField] = useState(false);
  const [files, setFiles] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');
  const [error, setError] = useState(null);
  const s3BucketUrl = 'https://s3.us-east-1.amazonaws.com/gp-dev-public/';

  useEffect(() => {
    switch (selectedAction?.type ?? '') {
      case 'create':
        setIsCreateTenant(true);
        break;
      case 'view':
        setIsCreateTenant(false);
        break;
      default:
        break;
    }
  }, [selectedAction]);

  useEffect(() => {
    if (toggleDrawer) {
      setFiles([]); // Call to remove the image
      setError(null);
    }
    // toggleDrawer(false);
    // imageremove();
  }, [toggleDrawer]);

  /**
   * The mutation function for creating an group
   * @param {Object} data - The group data
   * @returns {Promise} The promise object
   */
  const { mutate: createGroupMutate } = useMutation({
    mutationFn: (data) => tenantService.createTenant(data),
    mutationKey: 'create-group'
  });

  /**
   * The mutation function for updating an group
   * @param {Object} data - The group data
   * @returns {Promise} The promise object
   */
  const { mutate: updateGroupMutate } = useMutation({
    mutationFn: (data) => tenantService.updateTenant(data),
    mutationKey: 'update-group'
  });

  /**
   * The function to handle the form submission
   * @param {Object} values - The form values object
   * @returns {void}
   */
  const handleOnSubmit = async (values) => {
    /**
     * Create a new tenant object from the form values.
     * The logoName is set to the value of the file that was uploaded.
     */
    let newTenant = {
      name: values.name,
      email: values.emailAddress,
      country: {
        id: values.country
      },
      address: values.address,
      contactNumber: values.contactNumber,
      logoName: uploadFileName
    };

    /**
     * If the user is creating a new tenant, call the createGroupMutate function
     * and pass the new tenant object as the argument.
     * If the mutation is successful, show a success message and close the drawer.
     * If the mutation fails, show an error message with the error code and message.
     */
    if (selectedAction.type === 'create') {
      setIsLoading(true);
      createGroupMutate(newTenant, {
        onSuccess: (data) => {
          setIsLoading(false);
          Toaster.success(t('group.drawer.create.success.message'));
          imageremove();
          setFiles([]);
          toggleDrawer(false);
        },
        /**
         * Error handler for the create group mutation.
         * @param {Object} error - The error object returned by the API.
         * @returns {void}
         */
        onError: (error) => {
          setIsLoading(false);
          if (error?.code && error?.code === 1204) {
            /**
             * If the error code is 1204, the group with the same name or email address already exists.
             * Show an error message with the field name and the error message.
             */
            if (error?.attribute === 'Name') {
              Toaster.error(`${t('group.drawer.field.name.label')} ${t('group.drawer.create.error.duplicate')}`);
            } else if (error?.attribute === 'Email') {
              Toaster.error(`${t('group.drawer.field.emailAddress.label')} ${t('group.drawer.create.error.duplicate')}`);
            } else {
              /**
               * If the error attribute is not Name or Email, show a generic error message.
               */
              Toaster.error(t('group.drawer.create.error.duplicate'));
            }
          } else if (error?.code && error?.code === 1707) {
            /**
             * If the error code is 1707, the API returned an unknown error.
             * Show an error message with the error message returned by the API.
             */
            Toaster.error(error?.reason ?? t('group.drawer.create.error.unknown'));
          } else {
            /**
             * If the error code is not 1204 or 1707, show a generic error message.
             */
            Toaster.error(t('group.drawer.create.error.unknown'));
          }
        }
      });
    }

    /**
     * If the user is updating an existing tenant, call the updateGroupMutate function
     * and pass the new tenant object as the argument.
     * If the mutation is successful, show a success message and close the drawer.
     * If the mutation fails, show an error message with the error code and message.
     */
    if (selectedAction.type === 'view') {
      setIsLoading(true);
      updateGroupMutate(
        { id: group?.id, data: newTenant },
        {
          /**
           * If the mutation is successful, show a success message, close the drawer,
           * and clear the selected files.
           */
          onSuccess: (data) => {
            setIsLoading(false);
            Toaster.success(t('group.drawer.update.success.message'));
            toggleDrawer(false, {
              row: {},
              type: 'updated'
            });
            setFiles([]);
          },
          /**
           * Error handler for the update group mutation.
           * @param {Object} error - The error object returned by the API.
           * @returns {void}
           */
          onError: (error) => {
            setIsLoading(false);

            if (error?.code && error?.code === 1204) {
              /**
               * If the error code is 1204, the group with the same name or email address already exists.
               * Show an error message with the field name and the error message.
               */
              if (error?.attribute === 'Name') {
                Toaster.error(`${t('group.drawer.field.name.label')} ${t('group.drawer.update.error.duplicate')}`);
              } else if (error?.attribute === 'Email') {
                Toaster.error(`${t('group.drawer.field.emailAddress.label')} ${t('group.drawer.update.error.duplicate')}`);
              } else {
                /**
                 * If the error attribute is not Name or Email, show a generic error message.
                 */
                Toaster.error(t('group.drawer.update.error.duplicate'));
              }
            } else if (error?.code && error?.code === 1707) {
              /**
               * If the error code is 1707, the API returned an unknown error.
               * Show an error message with the error message returned by the API.
               */
              Toaster.error(error?.reason ?? t('group.drawer.update.error.unknown'));
            } else {
              /**
               * If the error code is not 1204 or 1707, show a generic error message.
               */
              Toaster.error(t('group.drawer.update.error.unknown'));
            }
          }
        }
      );
    }
  };

  const { values, handleChange, handleBlur, handleSubmit, touched, errors, setFieldValue, resetForm } = useFormik({
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues: (() => {
      let initVal = {
        name: group?.name ?? '',
        emailAddress: group?.email ?? '',
        country: group?.country ?? '',
        address: group?.address ?? '',
        contactNumber: group?.contactNumber ?? '',
        logoName: group?.logoName ?? ''
      };

      return initVal;
    })(),
    validationSchema: tenantCreateSchema.omit(['group']),
    onSubmit: handleOnSubmit
  });

  useEffect(() => {
    resetForm();
    setGroup({});
    setError(null);
    if (navOpen && selectedAction.type === 'view') {
      setIsLoading(true);
      tenantService
        .viewTenant(selectedAction?.row?.row?.original?.id ?? '')
        .then((response) => {
          setIsLoading(false);
          setGroup(response);
          const dynamicImageUrl = response.logoName ? `${s3BucketUrl}${response.logoName}` : '';
          setImageUrl(dynamicImageUrl);
          setFieldValue('name', response?.name ?? '');
          setFieldValue('emailAddress', response?.email ?? '');
          setFieldValue('country', response?.country?.id ?? '');
          setFieldValue('address', response?.address ?? '');
          setFieldValue('contactNumber', response?.contactNumber ?? '');
          setFieldValue('logoName', response.logoName ?? '');
        })
        .catch((error) => {
          Toaster.error(error?.reason ?? 'An unexpected error occurred');
          toggleDrawer(false);
          setIsLoading(false);
        });
    }
    if (navOpen && (selectedAction?.type ?? '') === 'create') {
      resetForm();
    }
  }, [navOpen, selectedAction, tenant, isCreateTenant]);

  /**
   * Checks if the user has the permission to create or update the entity
   * @return {boolean} True if the user has the permission, false otherwise
   */
  const updateSavebuttonVisibility = () => {
    /**
     * If the user is creating the entity, we need to check if the user has the permission to create
     * any entity or the specific entity
     */
    if (isCreateTenant) {
      return hasPermission('smtadmin_tenant.createAny') || hasPermission('smtadmin_tenant.create');
    } else {
      /**
       * If the user is updating the entity, we need to check if the user has the permission to update
       * any entity or the specific entity
       */
      return hasPermission('smtadmin_tenant.updateAny') || hasPermission('smtadmin_tenant.update');
    }
  };
  /**
   * Resets the image upload component by removing the uploaded file and resetting
   * the error message.
   */
  const imageremove = () => {
    // Reset the image URL
    setImageUrl('');
    // Reset the upload file name
    setUploadFileName('');
    // Reset the error message
    setError(null);
  };
  const onDrop = useCallback(async (acceptedFiles) => {
    setIsLoading(true);
    imageUrl ? imageremove() : imageUrl;
    // Remove the 0th file from the array
    if (acceptedFiles.length > 1) {
      acceptedFiles = acceptedFiles.slice(acceptedFiles.length - 1);
    }

    if (acceptedFiles.length == 0) {
      setFiles([]);
      setImageUrl('');
      setIsLoading(false);
      return;
    }
    const filteredFiles = acceptedFiles.filter((file) => {
      const isValidType = file.type === 'image/png' || file.type === 'image/jpeg';
      const isValidSize = file.size <= 5 * 1024 * 1024;
      if (!isValidType) {
        setError(t('group.drawer.fileUpload.invalidType'));
        return false;
      } else if (!isValidSize) {
        setError(t('group.drawer.fileUpload.sizeExceeded'));
        return false;
      }
      setError(null);
      return true;
    });
    setFiles(filteredFiles);
    if (filteredFiles.length > 0) {
      try {
        const response = await fileUploadService.fileUpload(acceptedFiles); // Await the promise
        // Set the file name from the response
        setUploadFileName(response.filename); // Adjust based on the response structure

        Toaster.success(t('group.drawer.fileUpload.success'));
      } catch (error) {
        // Handle error case
        Toaster.error(t('group.drawer.fileUpload.error'));
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <Drawer
      className="about-drawer"
      open={navOpen}
      onClose={() => {
        toggleDrawer(false);
        setFiles([]);
      }}
      anchor="right"
    >
      <Box className="sidebar-p">
        {/* Progress Bar */}
        {isLoading && <InnerPageLoader />}
        {/* End of Progress Bar */}

        <Grid container>
          {/* Title */}
          <Grid item xs={12}>
            <Box className="d-title-space d-flex v-center">
              <Typography variant="h3">
                {(() => {
                  switch (selectedAction?.type ?? '') {
                    case 'create':
                      return t('group.drawer.title.action.create');
                    case 'view':
                      return t('group.drawer.title.action.view');
                    default:
                      return '';
                  }
                })()}{' '}
                {t('group.drawer.title.suffix')}
              </Typography>
              <IconButton
                aria-label="delete"
                className="position-end"
                onClick={() => {
                  toggleDrawer(false);
                  setFiles([]);
                }}
              >
                <div className="material-symbols-outlined">close</div>
              </IconButton>
            </Box>
            <Divider />
          </Grid>
          {/* Title */}
          {/* Form wrapper */}
          <Grid container className="d-title-space" sx={{ pointerEvents: updateSavebuttonVisibility() ? '' : 'none' }}>
            {/* Each Row  */}
            <Grid item xs={12} className="mb-28">
              <TextField
                disabled={disableFormField}
                fullWidth
                label={t('group.drawer.field.name.label')}
                required
                size="small"
                id="name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && t(errors.name)}
                color="secondary"
                inputProps={{
                  maxLength: 51
                }}
                InputLabelProps={{
                  shrink: true
                }}
                placeholder={t('group.drawer.field.name.placeholder')}
              />
            </Grid>
            {/* Each Row  */}
            {/* Each Row  */}
            <Grid item xs={12} className="mb-28">
              <TextField
                disabled={disableFormField}
                fullWidth
                label={t('group.drawer.field.emailAddress.label')}
                required
                size="small"
                id="emailAddress"
                name="emailAddress"
                value={values.emailAddress}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.emailAddress && Boolean(errors.emailAddress)}
                helperText={touched.emailAddress && t(errors.emailAddress)}
                color="secondary"
                inputProps={{
                  maxLength: 51
                }}
                InputLabelProps={{
                  shrink: true
                }}
                placeholder={t('group.drawer.field.emailAddress.placeholder')}
              />
            </Grid>
            {/* Each Row  */}
            {/* Each Row  */}
            <Grid item xs={12} className="mb-28">
              <CountryField
                disabled={disableFormField}
                setFieldValue={setFieldValue}
                errors={errors}
                touched={touched}
                entity={group}
                entityType={'group'}
                setDisableFormField={setDisableFormField}
                isCreateEntity={isCreateTenant}
              />
            </Grid>
            {/* Each Row  */}
            {/* Each Row  */}
            <Grid item xs={12} className="mb-28">
              <TextField
                disabled={disableFormField}
                fullWidth
                label={t('group.drawer.field.address.label')}
                size="small"
                id="address"
                name="address"
                value={values.address}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.address && Boolean(errors.address)}
                helperText={touched.address && t(errors.address)}
                color="secondary"
                inputProps={{
                  maxLength: 101
                }}
                InputLabelProps={{
                  shrink: true
                }}
                placeholder={t('group.drawer.field.address.placeholder')}
              />
            </Grid>
            {/* Each Row  */}
            {/* Each Row  */}
            <Grid item xs={12} className="mb-28">
              <TextField
                disabled={disableFormField}
                fullWidth
                label={t('group.drawer.field.contactNumber.label')}
                size="small"
                id="contactNumber"
                name="contactNumber"
                value={values.contactNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.contactNumber && Boolean(errors.contactNumber)}
                helperText={touched.contactNumber && t(errors.contactNumber)}
                color="secondary"
                inputProps={{
                  maxLength: 16
                }}
                InputLabelProps={{
                  shrink: true
                }}
                placeholder={t('group.drawer.field.contactNumber.placeholder')}
              />
            </Grid>
            {/* Each Row  */}
            {/* File uploader  */} {/* Each Row  */}{' '}
            <Grid item xs={12} className=" file-uploader mb-30">
              <Grid container spacing={5}>
                <Grid item md={8} xs={12} sm={12}>
                  <Box className="outer-glow-shadow ">
                    {/* component */}
                    <Dropzone onChange={onDrop} value={files} multiple={false}>
                      {files.map((file, index) => (
                        <FileMosaic key={index} {...file} preview />
                      ))}
                    </Dropzone>
                    {/* component */}
                  </Box>
                  {error && (
                    <Typography variant="body2" color="error" className="mt-8">
                      {error}
                    </Typography>
                  )}
                </Grid>
                {!isCreateTenant && imageUrl && (
                  <Grid item md={4} xs={4} sm={4} className="d-flex">
                    <Box className="me-auto d-flex align-items-center">
                      {/* uploaaded pic */}{' '}
                      <div className="view-create-group-actual-img-wrapper">
                        <div className="view-create-group-actual-img ">
                          <img src={imageUrl} alt="Uploaded pic" className="img-resize-group-view" />
                        </div>
                      </div>
                      <Avatar
                        className="-ml-22 p-4 d-icon-avatar pointer"
                        sx={{ background: theme.palette.error.light, color: theme.palette.error.main }}
                      >
                        <div onClick={imageremove} className="material-symbols-outlined">
                          delete
                        </div>
                      </Avatar>
                      {/* uploaaded pic */}{' '}
                    </Box>{' '}
                  </Grid>
                )}{' '}
              </Grid>{' '}
            </Grid>{' '}
            <Grid item xs={12} className="mb-28">
              {' '}
              <Alert severity="info">{t('group.drawer.fileUpload.info')} </Alert>
            </Grid>{' '}
            {/* Each Row  */}
            {/* File uploader  */}
            {/* Each Row  */}
            {updateSavebuttonVisibility() && (
              <Grid item xs={12} className="mb-15">
                <Button
                  onClick={handleSubmit}
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
                  <div className="button">
                    {(() => {
                      switch (selectedAction?.type ?? '') {
                        case 'create':
                          return t('group.drawer.submit.create');
                        case 'view':
                          return t('group.drawer.submit.update');
                        default:
                          return t('group.drawer.submit.create');
                      }
                    })()}
                  </div>
                </Button>
              </Grid>
            )}
            {/* Each Row  */}
          </Grid>
          {/* Form wrapper */}
        </Grid>
      </Box>
    </Drawer>
  );
};

GroupDrawer.propTypes = {
  navOpen: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  selectedAction: PropTypes.object.isRequired,
  tenant: PropTypes.object.isRequired
};
