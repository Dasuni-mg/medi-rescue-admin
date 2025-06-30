// library imports
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { Box, Button, Grid, Paper, TextField, Tooltip, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { authService } from 'services/auth-service';
import { ProgressSpinner } from 'ui-component/extended/progress-bars';
import MiniLogo from 'ui-component/mini-logo';
import { confirmPasswordSchema } from 'utils/form-schemas';
import Toaster from 'utils/toaster';
import '../../assets/scss/custom-styles.scss';
import InnerPageLoader from '../../shared/loaders/inner-page-loader';
import { useRouter } from 'next/navigation';
import IconButton from '@mui/material/IconButton';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
// ==============================|| LOGIN PAGE ||============================== //

const ConfirmPassword = () => {
  const defaultTheme = useTheme();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const email = searchParams.get('email');
  const token = sessionStorage.getItem('token');
  const router = useRouter();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /**
   * Handles the click event on the show/hide new password button.
   * It toggles the state of the showNewPassword variable.
   */
  const handleToggleNewPasswordVisibility = () => {
    setShowNewPassword((prev) => !prev);
  };
  /**
   * Handles the click event on the show/hide confirm password button.
   * It toggles the state of the showConfirmPassword variable.
   */

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const { mutate: forgotpassword } = useMutation({
    mutationFn: (data) => authService.forgotPassword(data),
    mutationKey: 'confirm-password'
  });

  /**
   * Handles the form submission.
   * @param {Object} values - The form values object
   * @returns {void}
   */

  const handleOnSubmit = async (values) => {
    setIsLoading(true);
    let newPwd = {
      newPassword: values.newPassword,
      confirmNewPassword: values.confirmNewPassword,
      email: email,
      otpToken: token
    };
    forgotpassword(newPwd, {
      /**
       * Called when the confirm password mutation is successful.
       * Displays a success message and resets the loading state.
       * @param {Object} data - The response data from the API.
       */

      onSuccess: (data) => {
        setIsLoading(false);
        Toaster.success(t('confirmPassword.submit.success.message'));
        router.push('/auth/login');
      },

      /**
       * Called when the confirm password mutation fails.
       * Displays an error message and resets the loading state.
       * @param {Error} error - The error that occurred during the mutation.
       */

      onError: (error) => {
        setIsLoading(false);

        // Check for the specific error code
        if (error.code === 1703) {
          Toaster.error(t('confirmPassword.submit.error.recentPassword'));
        } else {
          // Display the common error message for other cases
          Toaster.error(t('confirmPassword.submit.error.message'));
        }
      }
    });
  };
  /**
   *  Handles the formik validation and submission.
   */
  const { values, handleChange, handleBlur, handleSubmit, touched, errors } = useFormik({
    initialValues: (() => {
      let initVal = {
        newPassword: '',
        confirmNewPassword: ''
      };

      return initVal;
    })(),
    validationSchema: confirmPasswordSchema.omit(['confirmPasswordSchema']),
    onSubmit: handleOnSubmit
  });

  return (
    <ThemeProvider theme={defaultTheme}>
      <>
        {/* background 2 color sections */}
        <Box className=" d-flex login-wrapper">
          <Box className="login-bg"></Box>
          <Box></Box>
        </Box>
        {/* background 2 color sections */}

        {/* form */}
        <Grid container className="grid-wrapper">
          {isLoading && <InnerPageLoader />}
          <Grid container className="grid-form-wrapper" xs={12} sx={{ boxShadow: defaultTheme.shadows[3] }}>
            <Grid
              item
              xs={false}
              sm={false}
              md={6}
              sx={{
                height: { xs: '200px', md: 'auto' },
                backgroundImage: 'url(/images/auth/login-bg.png)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}
            >
              <Box
                className="login-side-logo-wrapper login-side-logo-wrapper-img"
                style={{ position: 'absolute', bottom: '48px', left: '-65px' }}
              >
                <Image
                  className="mediportalLogo"
                  src="/images/auth/left_logo.png"
                  fill={true}
                  style={{
                    objectFit: 'cover'
                  }}
                  alt="Login medirescue logo"
                />
              </Box>
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              p={4}
              sx={{ padding: { xs: '30px', md: '150px 50px 150px 50px', xl: '150px 50px 150px 50px' } }}
              component={Paper}
              elevation={6}
              square
            >
              <Box sx={{ display: 'flex' }} className="align-items-center">
                <Box className="d-flex h-start v-center ">
                  <Box className="login-logo-wrapper">
                    <MiniLogo className="login-logo-wrapper-img" />
                  </Box>
                  <Box sx={{ marginTop: '4px', marginLeft: '10px' }}>
                    <Typography variant="h2" lineHeight={'28px'}>
                      {t('confirmPassword.title.medirescueAdmin')}
                    </Typography>
                    <Typography variant="h3" mt={3} fontWeight={'200'} color={defaultTheme.palette.success.text}>
                      / {t('confirmPassword.title.confirmPassword')}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Reset password */}
              <Box component="form" noValidate className="mt-28">
                <Grid item xs={12} className="mb-28 d-flex v-center">
                  <TextField
                    fullWidth
                    required
                    size="small"
                    placeholder={t('confirmPassword.field.newPassword.placeholder')}
                    label={t('confirmPassword.field.newPassword.label')}
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={values.newPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.newPassword && Boolean(errors.newPassword)}
                    helperText={touched.newPassword && t(errors.newPassword)}
                    color="secondary"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleToggleNewPasswordVisibility} edge="end">
                            {showNewPassword ? <VisibilityOffOutlinedIcon /> : <RemoveRedEyeOutlinedIcon />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} className="mb-28 d-flex v-center">
                  <TextField
                    fullWidth
                    required
                    size="small"
                    placeholder={t('confirmPassword.field.confirmNewPassword.placeholder')}
                    label={t('confirmPassword.field.confirmNewPassword.label')}
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={values.confirmNewPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.confirmNewPassword && Boolean(errors.confirmNewPassword)}
                    helperText={touched.confirmNewPassword && t(errors.confirmNewPassword)}
                    color="secondary"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleToggleConfirmPasswordVisibility} edge="end">
                            {showConfirmPassword ? <VisibilityOffOutlinedIcon /> : <RemoveRedEyeOutlinedIcon />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Alert severity="info">{t('confirmPassword.info.message')}</Alert>

                <Grid container mt={defaultTheme.spacing(7)} mb={defaultTheme.spacing(7)} className="h-end">
                  <Grid item>
                    <Button variant="contained" color="secondary" className="br-25" onClick={handleSubmit}>
                      <div className="material-symbols-outlined mr-8">lock_reset</div> {t('confirmPassword.button.resetPassword')}
                      <ProgressSpinner className="mr-8" standalone={true} />
                    </Button>
                  </Grid>
                </Grid>
              </Box>
              {/* Reset password */}
            </Grid>
          </Grid>
        </Grid>
        {/* form */}
      </>
    </ThemeProvider>
  );
};

export default ConfirmPassword;
