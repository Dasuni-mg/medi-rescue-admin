// library imports
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { Box, Button, Grid, Paper, TextField, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { authService } from 'services/auth-service';
import { ProgressSpinner } from 'ui-component/extended/progress-bars';
import MiniLogo from 'ui-component/mini-logo';
import { forgotpwd } from 'utils/form-schemas';
import Toaster from 'utils/toaster';
import '../../assets/scss/custom-styles.scss';
import InnerPageLoader from '../../shared/loaders/inner-page-loader'; // Ensure this is the correct path
// ==============================|| LOGIN PAGE ||============================== //

const ForgortPassword = () => {
  const defaultTheme = useTheme();
  const router = useRouter();
  const [userName, setUserName] = useState({});
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const back = () => {
    router.push('/auth/login');
  };

  useEffect(() => {
    resetForm();
    setUserName({});
    setError(null);
  }, []);
  const next = () => {
    console.log('next');
  };

  const { mutate: forgotPwdMutate } = useMutation({
    mutationFn: (data) => authService.forgotPwd(data),
    mutationKey: 'forgot-password'
  });

  /**
   * Handles the form submission.
   * @param {Object} values - The form values object.
   * @returns {void}
   */

  const handleOnSubmit = async (values) => {
    let forgotpwdObj = {
      email: values.userName
    };

    setIsLoading(true);
    forgotPwdMutate(forgotpwdObj, {
      /**
       * Called when the forgot password mutation is successful.
       * Displays a success message, resets loading state, and redirects
       * the user to the OTP page with the email as a query parameter.
       * @param {Object} data - The response data from the API.
       */

      onSuccess: (data) => {
        setIsLoading(false);
        Toaster.success(t('forgotPassword.continue.success.message'));
        router.push(`/auth/otp?email=${data.email}`);
      },

      /**
       * Called when the forgot password mutation fails.
       * Displays an error message and resets the loading state.
       * @param {Error} error - The error that occurred during the mutation.
       */

      onError: (error) => {
        setIsLoading(false);
        const errorCode = error?.code;
        // Switch statement to handle different error codes
        switch (errorCode) {
          // 1302: user not found
          case 1302:
            Toaster.error(t('forgotPassword.continue.error.emailNotFound'));
            break;
          // 1207: User deleted
          case 1207:
            Toaster.error(t('forgotPassword.continue.error.accountDeleted'));
            break;
          // 1404: Account blocked
          case 1404:
            Toaster.error(t('forgotPassword.continue.error.accountBlocked'));
            break;
          // 1713: Tenant is not active or vehicle is assigned to an active incident
          case 1402:
            // Account locked
            Toaster.error(t('forgotPassword.continue.error.accountLocked'));
            break;
          case 1411:
            // Account deactivated
            Toaster.error(t('forgotPassword.continue.error.accountDeactivated'));
            break;
          default:
            // Unknown error
            Toaster.error(t('forgotPassword.continue.error.message'));
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
        userName: ''
      };

      return initVal;
    })(),
    validationSchema: forgotpwd.omit(['forgotpwd']),
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
                      {t('forgotPassword.title.medirescueAdmin')}
                    </Typography>
                    <Typography variant="h3" mt={3} fontWeight={'200'} color={defaultTheme.palette.success.text}>
                      / {t('forgotPassword.title.forgotPassword')}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box component="form" noValidate className="mt-28">
                <TextField
                  fullWidth
                  label={t('forgotPassword.field.userName.label')}
                  placeholder={t('forgotPassword.field.userName.placeholder')}
                  required
                  size="small"
                  name="userName"
                  autoComplete="userName"
                  className="text-field mb-28"
                  id="username"
                  value={values.userName}
                  color="secondary"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.userName && Boolean(errors.userName)}
                  helperText={touched.userName && t(errors.userName)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <PersonOutlinedIcon />
                      </InputAdornment>
                    )
                  }}
                />

                <Grid container mt={defaultTheme.spacing(7)} mb={defaultTheme.spacing(7)} className="h-end">
                  <Grid item>
                    <Button onClick={back} variant="outlined" color="primary" className="br-25 mr-8">
                      <div className="material-symbols-outlined mr-8">keyboard_arrow_left</div> {t('forgotPassword.button.back')}
                      <ProgressSpinner className="mr-8" standalone={true} />
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" color="secondary" className="br-25">
                      <div className="material-symbols-outlined mr-8">keyboard_arrow_right</div> {t('forgotPassword.button.continue')}
                      <ProgressSpinner className="mr-8" standalone={true} />
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        {/* form */}
      </>
    </ThemeProvider>
  );
};

export default ForgortPassword;
