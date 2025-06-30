import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, TextField } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { organizationTypeService } from 'services/organization-type-service';
import { organizationTypeNameSchema } from 'utils/form-schemas';
import { hasPermission } from 'utils/permission';
import Toaster from 'utils/toaster';

/**
 * useAutocompleteInputClear hook
 *
 * This hook is used to clear the autocomplete input when the watch value changes
 * It uses the ref to get the clear button element and click it when the watch value changes
 *
 * @param {Function} watch The watch function to get the value
 * @param {Function} checkClear The function to check if the input should be cleared
 * @returns {Object} The ref object
 */
function useAutocompleteInputClear(watch, checkClear) {
  const elmRef = useRef(null);

  useEffect(() => {
    if (!elmRef?.current) return;

    if (!checkClear || typeof checkClear !== 'function') return;

    const button = elmRef.current.querySelector('#organizationType-clear');
    if (checkClear(watch) && button) {
      // Click the clear button to clear the input
      button.click();
    }
  }, [watch]);

  return elmRef;
}

/**
 * OrganizationTypeField
 *
 * This component renders an autocomplete field to select an organization type
 * It fetches the list of organization types from the server
 * It also allows the user to create a new organization type
 * When the user selects an organization type, it sets the organization type in the state
 * When the user creates a new organization type, it creates a new organization type in the server and sets it in the state
 *
 * @param {Object} props
 * @param {boolean} props.disabled Whether the field is disabled or not
 * @param {boolean} props.touched Whether the field is touched or not
 * @param {Object} props.errors Errors of the field
 * @param {Function} props.setFieldValue Function to set the value of the field in the state
 * @param {Object} props.organization Organization object
 * @param {string} props.tenantId Tenant id
 */
export const OrganizationTypeFiled = ({ disabled, touched, errors, setFieldValue, organization, tenantId, isCreateOrg }) => {
  const { t } = useTranslation();
  const [openOrganizationTypes, setOpenOrganizationTypes] = useState(false);
  const [organizationTypesOptions, setOrganizationTypesOptions] = useState([]);
  const [organizationTypesLoading, setOrganizationTypesLoading] = useState(false);
  const [organizationTypeDefault, setOrganizationTypeDefault] = useState({});
  const [newOrganizationType, setNewOrganizationType] = useState('');
  const [organizationTypeNameError, setOrganizationTypeNameError] = useState(null);

  useEffect(() => {
    setOpenOrganizationTypes(false);
    setOrganizationTypesOptions([]);
    setOrganizationTypesLoading(false);
    setOrganizationTypeDefault({});
    setNewOrganizationType('');
    setOrganizationTypeNameError(null);
    setFieldValue('organizationType', '');
  }, [tenantId]);

  /**
   * Set the default organization type
   */
  useEffect(() => {
    setOrganizationTypeDefault(organization?.organizationType ?? {});
  }, [organization]);

  /**
   * Set the organization type in the state if the organization type is not empty
   */
  useEffect(() => {
    if (!isEmpty(organizationTypeDefault)) {
      setFieldValue('organizationType', organizationTypeDefault.id);
    }
  }, [organizationTypeDefault]);

  /**
   * Handle the open event of the autocomplete
   */
  const handleOrganizationTypesOpen = () => {
    setOpenOrganizationTypes(true);
    setOrganizationTypesLoading(true);

    /**
     * Fetch the list of organization types from the server
     * @param {string} tenantId Tenant id
     * @returns {Promise} The promise object
     */
    organizationTypeService
      .listOrganizationType(tenantId)
      .then((data) => {
        setOrganizationTypesLoading(false);
        setOrganizationTypesOptions(data);
      })
      .catch((error) => {
        Toaster.error(error?.reason ?? t('organization.drawer.field.organizationType.fetchList.error.unknown'));
        setOrganizationTypesLoading(false);
        setOrganizationTypesOptions([]);
      });
  };

  /**
   * Handle the close event of the autocomplete
   */
  const handleOrganizationTypesClose = () => {
    setOpenOrganizationTypes(false);
    setOrganizationTypesOptions([]);
  };

  const validateOrganizationTypeName = useCallback((newOrganizationType) => {
    try {
      // Validate the new organization type against the schema
      organizationTypeNameSchema.validateSync(newOrganizationType);
    } catch (error) {
      // If the validation fails, it shows an error message and doesn't create a new organization type
      setOpenOrganizationTypes(false);
      setOrganizationTypeNameError(error?.message ?? null);
      return;
    }
  });

  useEffect(() => {
    if (newOrganizationType === '') {
      return;
    }
    if (organizationTypesOptions.findIndex((orgType) => orgType.name === newOrganizationType) > -1) {
      return;
    }
    validateOrganizationTypeName(newOrganizationType);
  }, [newOrganizationType, organizationTypesOptions]);

  /**
   * Create a new organization type
   */
  const createNewOrganizationType = () => {
    if (newOrganizationType === '' || organizationTypeNameError !== null) {
      return;
    }
    validateOrganizationTypeName(newOrganizationType);

    /**
     * Create the new organization type
     *
     * It creates a new organization type with the given name and tenant id
     * and sends a request to the server to create the new organization type
     */
    const newOrgType = {
      name: newOrganizationType
    };
    organizationTypeService
      .createOrganizationType(newOrgType, tenantId)
      .then((data) => {
        // Clear the new organization type input and fetch the new list of organization types
        setNewOrganizationType('');
        handleOrganizationTypesOpen();
        Toaster.success(t('organization.drawer.field.organizationType.create.success.message'));
      })
      .catch((error) => {
        // If there is an error, it shows a toast error with the error message
        if (error?.code && error?.code === 1204) {
          Toaster.error(t('organization.drawer.field.organizationType.create.error.duplicate'));
        } else if (error?.code && error?.code === 1707) {
          Toaster.error(error?.reason ?? t('organization.drawer.field.organizationType.create.error.unknown'));
        } else {
          Toaster.error(t('organization.drawer.field.organizationType.create.error.unknown'));
        }
      });
  };

  /**
   * Checks if the user has the permission to create or update an organization
   *
   * @returns {boolean} True if the user has the permission, false otherwise
   */
  const updateSavebuttonVisibility = () => {
    if (isCreateOrg) {
      // If the user is creating an organization, check if they have the permission to create any organization
      return hasPermission('smtadmin_organization.createAny') || hasPermission('smtadmin_organization.create');
    } else {
      // If the user is updating an organization, check if they have the permission to update any organization
      return hasPermission('smtadmin_organization.updateAny') || hasPermission('smtadmin_organization.update');
    }
  };

  const elmRef = useAutocompleteInputClear(tenantId, (v) => true);

  return (
    <Autocomplete
      ref={elmRef}
      disabled={disabled}
      key={isEmpty(organizationTypeDefault) ? undefined : organizationTypeDefault?.id}
      defaultValue={isEmpty(organizationTypeDefault) ? undefined : organizationTypeDefault}
      open={openOrganizationTypes}
      onOpen={handleOrganizationTypesOpen}
      onClose={handleOrganizationTypesClose}
      isOptionEqualToValue={(option, value) => {
        return !isEmpty(option) && !isEmpty(value) && option?.name && value?.name && option.name === value.name;
      }}
      getOptionKey={(option) => option?.id ?? undefined}
      getOptionLabel={(option) => option?.name ?? ''}
      options={organizationTypesOptions}
      loading={organizationTypesLoading}
      disablePortal={true}
      disableClearable={false}
      onChange={(e, v, r) => {
        switch (r) {
          case 'selectOption':
            setFieldValue('organizationType', v?.id ?? '');
            setNewOrganizationType('');
            setOrganizationTypeNameError(null);
            break;
          case 'createOption':
            break;
          case 'removeOption':
            break;
          case 'clear':
            setFieldValue('organizationType', '');
            break;
          case 'blur':
            break;
          default:
            break;
        }
      }}
      onInputChange={(e, v, r) => {
        switch (r) {
          case 'input':
            if (v === '') {
              return;
            }
            break;
          case 'reset':
            break;
          case 'clear':
            break;
          default:
            break;
        }
        setOrganizationTypeNameError(null);
        if (isEmpty(organizationTypeDefault)) {
          setFieldValue('organizationType', '');
        }
        setNewOrganizationType(v);
      }}
      id="organizationType-auto"
      name="organizationType-auto"
      renderInput={(params) => {
        let children = [];
        children = params?.InputProps?.endAdornment?.props?.children ?? [];
        const child = children.find((c) => c && c.props['aria-label'] === 'Clear');
        return (
          <TextField
            {...params}
            placeholder={t('organization.drawer.field.organizationType.placeholder')}
            label={t('organization.drawer.field.organizationType.label')}
            required
            fullWidth
            size="small"
            id="organizationType"
            name="organizationType"
            error={(touched?.organizationType && Boolean(errors?.organizationType)) || organizationTypeNameError}
            helperText={(touched?.organizationType && t(errors?.organizationType)) || t(organizationTypeNameError)}
            onKeyDown={(e) => {
              if (e.code === 'Enter') {
                createNewOrganizationType();
              }
            }}
            color="secondary"
            InputLabelProps={{
              shrink: true
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <InputAdornment position="end">
                  {updateSavebuttonVisibility() &&
                    ((newOrganizationType !== '' && organizationTypeNameError === null && (
                      <AddIcon sx={{ cursor: 'pointer' }} onClick={createNewOrganizationType} />
                    )) || <></>)}
                  {organizationTypesLoading ? <CircularProgress color="inherit" size={20} /> : <></>}
                  {
                    <button
                      id={'organizationType-clear'}
                      style={{ visibility: 'hidden', display: 'none' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        const fn = child?.props?.onClick ?? null;
                        if (fn) {
                          fn();
                        }
                      }}
                    >
                      {''}
                    </button>
                  }
                  {updateSavebuttonVisibility() && !organizationTypesLoading && <SearchIcon />}
                </InputAdornment>
              )
            }}
          />
        );
      }}
    />
  );
};

OrganizationTypeFiled.propTypes = {
  disabled: PropTypes.bool,
  touched: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  organization: PropTypes.object.isRequired,
  tenantId: PropTypes.string.isRequired,
  isCreateOrg: PropTypes.bool.isRequired
};
