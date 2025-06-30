// library imports
import { Box, Button, Grid, Link, Paper, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { MuiOtpInput } from 'mui-one-time-password-input';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { otpService } from 'services/otp-service';
import { ProgressSpinner } from 'ui-component/extended/progress-bars';
import MiniLogo from 'ui-component/mini-logo';
import Toaster from 'utils/toaster';
import { authService } from 'services/auth-service';
import '../../assets/scss/custom-styles.scss';
import InnerPageLoader from '../../shared/loaders/inner-page-loader'; // Ensure this is the correct path
// ==============================|| LOGIN PAGE ||============================== //

const OTP = () => {
  const defaultTheme = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const email = searchParams.get('email');
  const numberValidationRegex = /^\d+$/;

  const back = () => {
    router.push('/auth/forgot-password');
  };

  const { mutate: otpvalidationMutate } = useMutation({
    mutationFn: (data) => otpService.otpvalidation(data),
    mutationKey: 'otp-validation'
  });

  /**
   * Handles the submission of the OTP form by validating the OTP and
   * redirecting the user to the confirm password page if the OTP is valid.
   * @param {Object} values - The values of the OTP form.
   */

  const handleOnSubmit = async (values) => {
    if (!numberValidationRegex.test(otp)) {
      Toaster.error(t('otp.field.otp.validation.invalid'));
      return;
    } else if (otp.length !== 6) {
      Toaster.error(t('otp.field.otp.validation.maxLength'));
      return;
    }
    let otpCode = {
      otpCode: otp,
      otpType: 2,
      email: email
    };

    setIsLoading(true);
    otpvalidationMutate(otpCode, {
      /**
       * Called when the OTP validation mutation is successful.
       * Displays a success message, resets loading state, and redirects
       * the user to the confirm password page with the email and token as
       * query parameters if the OTP is valid.
       * @param {Object} data - The response data from the API.
       */

      onSuccess: (data) => {
        setIsLoading(false);
        Toaster.success(t('otp.submit.success.message'));
        if (data?.token != null) {
          sessionStorage.setItem('token', data?.token);
          router.push(`/auth/confirm-password?email=${email}`);
        }
      },

      /**
       * Called when the OTP validation mutation fails.
       * Displays an error message and resets the loading state.
       * @param {Error} error - The error that occurred during the mutation.
       */
      onError: (error) => {
        setIsLoading(false);
        // Check for the specific error code
        if (error.code === 1414) {
          Toaster.error('otp.submit.error.otpValidation');
        } else {
          // Display the common error message for other cases
          Toaster.error(t('otp.submit.error.message'));
        }
      }
    });
  };

  const { mutate: forgotPwdMutate } = useMutation({
    mutationFn: (data) => authService.forgotPwd(data),
    mutationKey: 'forgot-password'
  });

  const handleResendClick = () => {
    let forgotpwdObj = {
      email: email
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

  const { handleSubmit, touched, errors } = useFormik({
    initialValues: (() => {
      let initVal = {
        otpCode: otp,
        otpType: 2,
        email: email
      };

      return initVal;
    })(),
    // validationSchema: OTPvalidate.omit(['OTPvalidate']),
    onSubmit: handleOnSubmit
  });

  // const handleChange = (newValue) => {
  //   setOtp(newValue);
  // };
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
          {/* Progress Bar */}
          {isLoading && <InnerPageLoader />}
          {/* End of Progress Bar */}
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
                      / {t('forgotPassword.title.verifyWithOTP')}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Reset password */}
              <Box component="form" noValidate className="mt-40">
                <Grid item xs={12} className="mb-28 d-flex v-center">
                  <Alert severity="info">{t('otp.info.message')}</Alert>
                </Grid>
                <Grid item xs={12} className="mb-28 d-flex v-center">
                  <MuiOtpInput value={otp} length={6} onChange={(value) => setOtp(value)} />
                </Grid>
                <Grid container justifyContent={'end'}>
                  <Grid item>
                    <Typography variant="p" mt={3} fontWeight={'200'}>
                      {t('otp.resend.notReceive')}
                    </Typography>
                    <span onClick={() => handleResendClick()}>
                      <Link sx={{ cursor: 'pointer' }}>{'  Resend '}</Link>
                    </span>
                  </Grid>
                </Grid>
                <Grid container mt={defaultTheme.spacing(7)} mb={defaultTheme.spacing(7)} className="h-end">
                  <Grid item>
                    <Button onClick={back} variant="outlined" color="primary" className="br-25 mr-8">
                      <div className="material-symbols-outlined mr-8">keyboard_arrow_left</div> {t('otp.button.back')}
                      <ProgressSpinner className="mr-8" standalone={true} />
                    </Button>
                    <Button variant="contained" color="secondary" className="br-25" onClick={handleSubmit}>
                      <div className="material-symbols-outlined mr-8">task_alt</div>
                      {t('otp.button.verify')}
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

export default OTP;
