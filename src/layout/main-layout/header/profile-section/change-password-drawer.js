import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { Alert, Box, Button, Divider, Grid, IconButton, TextField, Typography } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import InputAdornment from '@mui/material/InputAdornment';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { authService } from 'services/auth-service';
import { ProgressSpinner } from 'ui-component/extended/progress-bars';
import { changePasswordSchema } from 'utils/form-schemas';
import Toaster from 'utils/toaster';
import InnerPageLoader from '../../../../shared/loaders/inner-page-loader';

export const ChangePasswordDrawer = ({ navOpen, toggleDrawer }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [changePassword, setChangePassword] = useState({});
  const [error, setError] = useState(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  /**
   * Handles the click event on the show/hide current password button.
   * It toggles the state of the showCurrentPassword variable.
   */
  const handleClickShowCurrentPassword = () => {
    setShowCurrentPassword((prev) => !prev);
  };

  /**
   * Handles the click event on the show/hide new password button.
   * It toggles the state of the showNewPassword variable.
   */
  const handleClickShowNewPassword = () => {
    setShowNewPassword((prev) => !prev);
  };

  /**
   * Handles the click event on the show/hide confirm new password button.
   * It toggles the state of the showConfirmNewPassword variable.
   */
  const handleClickShowConfirmNewPassword = () => {
    setShowConfirmNewPassword((prev) => !prev);
  };

  useEffect(() => {
    if (toggleDrawer) {
      setError(null);
    }
  }, [toggleDrawer]);

  const { mutate: changePasswordMutate } = useMutation({
    mutationFn: (data) => authService.changePassword(data),
    mutationKey: 'change-password'
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
    let changePasswordObj = {
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      confirmNewPassword: values.confirmNewPassword
    };

    setIsLoading(true);
    changePasswordMutate(changePasswordObj, {
      /**
       * Called when the password change mutation is successful.
       * Displays a success message, resets loading state, removes the image,
       * clears the files, and closes the drawer.
       * @param {Object} data - The response data from the API.
       */
      onSuccess: (data) => {
        toggleDrawer(false);
        setIsLoading(false);
        Toaster.success(t('changePassword.drawer.create.success.message'));
      },

      /**
       * Called when the password change mutation fails.
       * Displays an error message and resets the loading state.
       * @param {Error} error - The error that occurred during the mutation.
       */
      onError: (error) => {
        setIsLoading(false);
        switch (error?.code) {
          case 1702:
            Toaster.error(t('changePassword.drawer.create.error.oldPassword'));
            break;
          case 1703:
            Toaster.error(t('changePassword.drawer.create.error.recentPassword'));
            break;
          default:
            Toaster.error(t('changePassword.drawer.create.error.unknown'));
        }
      }
    });
  };

  const { values, handleChange, handleBlur, handleSubmit, touched, errors, resetForm } = useFormik({
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues: (() => {
      let initVal = {
        currentPassword: changePassword.currentPassword,
        newPassword: changePassword.newPassword,
        confirmNewPassword: changePassword.confirmNewPassword
      };

      return initVal;
    })(),
    validationSchema: changePasswordSchema.omit(['changePassword']),
    onSubmit: handleOnSubmit
  });

  useEffect(() => {
    resetForm();
    setChangePassword({});
    setError(null);
  }, [navOpen]);

  return (
    <Drawer className="about-drawer" open={navOpen} onClose={toggleDrawer(false)} anchor="right">
      <Box className="sidebar-p">
        {/* Progress Bar */}
        {isLoading && <InnerPageLoader />}
        {/* End of Progress Bar */}

        <Grid container>
          {/* Title */}
          <Grid item xs={12}>
            <Box className="d-title-space d-flex v-center">
              <Typography variant="h3">{t('changePassword.drawer.title.main')}</Typography>
              <IconButton aria-label="delete" className="position-end" onClick={toggleDrawer(false)}>
                <div className="material-symbols-outlined">close</div>
              </IconButton>
            </Box>
            <Divider />
          </Grid>
          {/* Title */}
          {/* Form wrapper */}
          <Grid container className="d-title-space">
            {/* Each Row  */}
            <Grid item xs={12} className="mb-28">
              <TextField
                fullWidth
                label={t('changePassword.drawer.field.currentPassword.label')}
                required
                size="small"
                id="currentPassword"
                name="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                value={values.currentPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.currentPassword && Boolean(errors.currentPassword)}
                helperText={touched.currentPassword && t(errors.currentPassword)}
                color="secondary"
                InputLabelProps={{
                  shrink: true
                }}
                placeholder={t('changePassword.drawer.field.currentPassword.placeholder')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowCurrentPassword}
                        onMouseDown={(e) => e.preventDefault()} // Prevents focus loss on the input field
                        edge="end"
                      >
                        {showCurrentPassword ? <VisibilityOffOutlinedIcon /> : <RemoveRedEyeOutlinedIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            {/* Each Row  */}

            {/* Each Row  */}
            <Grid item xs={12} className="mb-28">
              <TextField
                fullWidth
                label={t('changePassword.drawer.field.newPassword.label')}
                required
                size="small"
                id="newPassword"
                name="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={values.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.newPassword && Boolean(errors.newPassword)}
                helperText={touched.newPassword && t(errors.newPassword)}
                color="secondary"
                inputProps={{
                  maxLength: 33
                }}
                InputLabelProps={{
                  shrink: true
                }}
                placeholder={t('changePassword.drawer.field.newPassword.placeholder')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowNewPassword}
                        onMouseDown={(e) => e.preventDefault()} // Prevents focus loss on the input field
                        edge="end"
                      >
                        {showNewPassword ? <VisibilityOffOutlinedIcon /> : <RemoveRedEyeOutlinedIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            {/* Each Row  */}

            {/* Each Row  */}
            <Grid item xs={12} className="mb-28">
              <TextField
                fullWidth
                label={t('changePassword.drawer.field.confirmNewPassword.label')}
                required
                size="small"
                id="confirmNewPassword"
                name="confirmNewPassword"
                type={showConfirmNewPassword ? 'text' : 'password'}
                value={values.confirmNewPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirmNewPassword && Boolean(errors.confirmNewPassword)}
                helperText={touched.confirmNewPassword && t(errors.confirmNewPassword)}
                color="secondary"
                inputProps={{
                  maxLength: 33
                }}
                InputLabelProps={{
                  shrink: true
                }}
                placeholder={t('changePassword.drawer.field.confirmNewPassword.placeholder')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowConfirmNewPassword}
                        onMouseDown={(e) => e.preventDefault()} // Prevents focus loss on the input field
                        edge="end"
                      >
                        {showConfirmNewPassword ? <VisibilityOffOutlinedIcon /> : <RemoveRedEyeOutlinedIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            {/* Each Row  */}

            <Alert severity="info">{t('changePassword.drawer.message.validation')}</Alert>

            <Grid item xs={12} className="mb-15">
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="secondary"
                className="text-ellipsis position-end line-1 mt-15"
                disabled={isLoading}
              >
                {isLoading && (
                  <div className="mr-10">
                    <ProgressSpinner standalone={true} active={isLoading} />
                  </div>
                )}
                {!isLoading && <div className="material-symbols-outlined mr-8">save</div>}
                <div className="button">{t('changePassword.drawer.submit.update')}</div>
              </Button>
            </Grid>
            {/* Each Row  */}
          </Grid>
          {/* Form wrapper */}
        </Grid>
      </Box>
    </Drawer>
  );
};

ChangePasswordDrawer.propTypes = {
  navOpen: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired
};
