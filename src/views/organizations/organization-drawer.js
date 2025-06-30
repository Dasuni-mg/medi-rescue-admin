import { Box, Button, Divider, Grid, IconButton, TextField, Typography } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { organizationService } from 'services/organization-service';
import InnerPageLoader from 'shared/loaders/inner-page-loader';
import { ProgressSpinner } from 'ui-component/extended/progress-bars';
import { organizationCreateViewUpdateSchema } from 'utils/form-schemas';
import { hasPermission } from 'utils/permission';
import Toaster from 'utils/toaster';
import { CountryField } from '../shared-components/country-field';
import { TenantField } from '../shared-components/tenant-field';
import { OrganizationTypeFiled } from './organization-type-field';

/**
 * OrganizationDrawer component
 * This component is used to create and view organizations
 * It is opened when the user clicks on the 'Create' or 'View' button in the organization table
 * @param {Object} props - The props object
 * @param {boolean} props.navOpen - Whether the drawer is open or not
 * @param {function} props.toggleDrawer - The function to toggle the drawer
 * @param {Object} props.selectedAction - The selected action object
 * @param {string} props.selectedAction.type - The type of action, either 'create' or 'view'
 * @param {Object} props.selectedAction.row - The row object from the organization table
 * @param {boolean} props.isSuperAdmin - Whether the user is a super admin or not
 * @param {Object} props.tenant - The tenant object
 * @returns {ReactElement} The OrganizationDrawer component
 */
export const OrganizationDrawer = ({ navOpen, toggleDrawer, selectedAction, isSuperAdmin, tenant }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [organization, setOrganization] = useState({});
  const [isCreateOrg, setIsCreateOrg] = useState(false);
  const [disableFormField, setDisableFormField] = useState(false);

  useEffect(() => {
    switch (selectedAction?.type ?? '') {
      case 'create':
        if (isSuperAdmin) {
          setDisableFormField(true);
        }
        setIsCreateOrg(true);
        break;
      case 'view':
        if (isSuperAdmin) {
          setDisableFormField(false);
        }
        setIsCreateOrg(false);
        break;
      default:
        break;
    }
  }, [selectedAction]);

  /**
   * The mutation function for creating an organization
   * @param {Object} data - The organization data
   * @returns {Promise} The promise object
   */
  const { mutate: createOrganizationMutate } = useMutation({
    mutationFn: (data) => organizationService.createOrganization(data),
    mutationKey: 'create-organization'
  });

  /**
   * The mutation function for updating an organization
   * @param {Object} data - The organization data
   * @returns {Promise} The promise object
   */
  const { mutate: updateOrganizationMutate } = useMutation({
    mutationFn: (data) => organizationService.updateOrganization(data),
    mutationKey: 'update-organization'
  });

  /**
   * The function to handle the form submission
   * @param {Object} values - The form values object
   * @returns {void}
   */
  const handleOnSubmit = async (values) => {
    let newOrg = {
      name: values.name,
      organizationType: {
        id: values.organizationType
      },
      email: values.emailAddress,
      country: {
        id: values.country
      },
      address: values.address === '' ? null : values.address,
      contactNumber: values.contactNumber === '' ? null : values.contactNumber
    };

    if (isSuperAdmin && !!values.group) {
      newOrg = {
        ...newOrg,
        tenant: {
          id: values.group
        }
      };
    }

    if (selectedAction.type === 'create') {
      setIsLoading(true);
      createOrganizationMutate(newOrg, {
        /**
         * Called when the mutation is successful.
         * @param {Object} data - The response data from the API.
         */
        onSuccess: (data) => {
          setIsLoading(false);
          Toaster.success(t('organization.drawer.create.success.message'));
          toggleDrawer(false, {
            row: {},
            type: 'created'
          });
        },
        onError: (error) => {
          setIsLoading(false);

          // If the error code is 1204, it means the organization with the same name or email address already exists.
          // Show an error message with the field name and the error message.
          if (error?.code && error?.code === 1204) {
            Toaster.error(t('organization.drawer.create.error.duplicate'));
          } else if (error?.code && error?.code === 1707) {
            // If the error code is 1707, it means the API returned an unknown error.
            // Show an error message with the error message returned by the API.
            Toaster.error(error?.reason ?? t('organization.drawer.create.error.unknown'));
          } else {
            // If the error code is not 1204 or 1707, show a generic error message.
            Toaster.error(t('organization.drawer.create.error.unknown'));
          }
        }
      });
    }

    if (selectedAction.type === 'view') {
      setIsLoading(true);
      updateOrganizationMutate(
        { id: organization?.id, data: newOrg },
        {
          /**
           * Called when the mutation is successful.
           * @param {Object} data - The response data from the API.
           */
          onSuccess: (data) => {
            setIsLoading(false);
            Toaster.success(t('organization.drawer.update.success.message'));
            toggleDrawer(false, {
              row: {},
              type: 'updated'
            });
          },
          /**
           * Called when the mutation encounters an error.
           * @param {Object} error - The error returned by the API.
           */
          onError: (error) => {
            setIsLoading(false);

            // If the error code is 1204, it means the organization with the same name or email address already exists.
            // Show an error message with the field name and the error message.
            if (error?.code && error?.code === 1204) {
              Toaster.error(t('organization.drawer.update.error.duplicate'));
            } else if (error?.code && error?.code === 1707) {
              // If the error code is 1707, it means the API returned an unknown error.
              // Show an error message with the error message returned by the API.
              Toaster.error(error?.reason ?? t('organization.drawer.update.error.unknown'));
            } else {
              // If the error code is not 1204 or 1707, show a generic error message.
              Toaster.error(t('organization.drawer.update.error.unknown'));
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
        name: organization?.name ?? '',
        organizationType: organization?.organizationType?.name ?? '',
        emailAddress: organization?.email ?? '',
        country: organization?.country ?? '',
        address: organization?.address ?? '',
        contactNumber: organization?.contactNumber ?? ''
      };
      if (isSuperAdmin) {
        return {
          ...initVal,
          group: organization?.group ?? ''
        };
      } else {
        return initVal;
      }
    })(),
    validationSchema: organizationCreateViewUpdateSchema.omit(isSuperAdmin ? [] : ['group']),
    onSubmit: handleOnSubmit
  });

  useEffect(() => {
    resetForm();
    setOrganization({});
    if (navOpen && selectedAction.type === 'view') {
      setIsLoading(true);
      organizationService
        .viewOrganization(
          selectedAction?.row?.row?.original?.id ?? '',
          isSuperAdmin ? selectedAction?.row?.row?.original?.tenant?.id ?? null : tenant?.id ?? null
        )
        .then((response) => {
          setOrganization(response);
          if (isSuperAdmin) {
            setFieldValue('group', response?.tenant?.id ?? '');
          }
          setFieldValue('name', response?.name ?? '');
          setFieldValue('organizationType', response?.organizationType?.id ?? '');
          setFieldValue('emailAddress', response?.email ?? '');
          setFieldValue('country', response?.country?.id ?? '');
          setFieldValue('address', response?.address ?? '');
          setFieldValue('contactNumber', response?.contactNumber ?? '');
          setIsLoading(false);
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
  }, [navOpen, selectedAction, tenant, isCreateOrg]);

  /**
   * Checks if the user has the permission to create or update an organization
   *
   * @returns {boolean} True if the user has the permission, false otherwise
   */
  const updateSavebuttonVisibility = () => {
    if (isCreateOrg) {
      return (
        // If the user is creating an organization, check if they have the permission to create any organization
        hasPermission('smtadmin_organization.createAny') ||
        // or the permission to create the specific organization
        hasPermission('smtadmin_organization.create')
      );
    } else {
      return (
        // If the user is updating an organization, check if they have the permission to update any organization
        hasPermission('smtadmin_organization.updateAny') ||
        // or the permission to update the specific organization
        hasPermission('smtadmin_organization.update')
      );
    }
  };

  return (
    <Drawer className="about-drawer" open={navOpen} onClose={() => toggleDrawer(false)} anchor="right">
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
                      return t('organization.drawer.title.action.create');
                    case 'view':
                      return t('organization.drawer.title.action.view');
                    default:
                      return '';
                  }
                })()}{' '}
                {t('organization.drawer.title.suffix')}
              </Typography>
              <IconButton aria-label="delete" className="position-end" onClick={() => toggleDrawer(false)}>
                <div className="material-symbols-outlined">close</div>
              </IconButton>
            </Box>
            <Divider />
          </Grid>
          {/* Title */}

          {/* Form wrapper */}
          <Grid container className="d-title-space" sx={{ pointerEvents: updateSavebuttonVisibility() ? '' : 'none' }}>
            {/* Each Row  */}
            {isSuperAdmin && (
              <Grid item xs={12} className="mb-28">
                <TenantField
                  setFieldValue={setFieldValue}
                  errors={errors}
                  touched={touched}
                  isCreateOrg={isCreateOrg}
                  tenant={tenant}
                  setDisableFormField={setDisableFormField}
                />
              </Grid>
            )}
            {/* Each Row  */}

            {/* Each Row  */}
            <Grid item xs={12} className="mb-28">
              <TextField
                disabled={disableFormField}
                fullWidth
                label={t('organization.drawer.field.name.label')}
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
                placeholder={t('organization.drawer.field.name.placeholder')}
              />
            </Grid>
            {/* Each Row  */}

            {/* Each Row  */}
            <Grid item xs={12} className="mb-28">
              <OrganizationTypeFiled
                disabled={disableFormField}
                errors={errors}
                touched={touched}
                setFieldValue={setFieldValue}
                organization={organization ?? {}}
                tenantId={isCreateOrg ? values?.group ?? null : tenant?.id ?? null}
                isCreateOrg={isCreateOrg}
              ></OrganizationTypeFiled>
            </Grid>
            {/* Each Row  */}

            {/* Each Row  */}
            <Grid item xs={12} className="mb-28">
              <TextField
                disabled={disableFormField}
                fullWidth
                label={t('organization.drawer.field.emailAddress.label')}
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
                placeholder={t('organization.drawer.field.emailAddress.placeholder')}
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
                entity={organization}
                entityType={'organization'}
                setDisableFormField={setDisableFormField}
                isCreateEntity={isCreateOrg}
              />
            </Grid>
            {/* Each Row  */}

            {/* Each Row  */}
            <Grid item xs={12} className="mb-28">
              <TextField
                disabled={disableFormField}
                fullWidth
                label={t('organization.drawer.field.address.label')}
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
                placeholder={t('organization.drawer.field.address.placeholder')}
              />
            </Grid>
            {/* Each Row  */}

            {/* Each Row  */}
            <Grid item xs={12} className="mb-28">
              <TextField
                disabled={disableFormField}
                fullWidth
                label={t('organization.drawer.field.contactNumber.label')}
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
                placeholder={t('organization.drawer.field.contactNumber.placeholder')}
              />
            </Grid>
            {/* Each Row  */}

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
                          return t('organization.drawer.submit.create');
                        case 'view':
                          return t('organization.drawer.submit.update');
                        default:
                          return t('organization.drawer.submit.create');
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

OrganizationDrawer.propTypes = {
  navOpen: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  selectedAction: PropTypes.object.isRequired,
  isSuperAdmin: PropTypes.bool.isRequired,
  tenant: PropTypes.object.isRequired
};
