// library imports
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { Box, Button, Divider, Grid, Link, Paper, TextField, Typography } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRouter } from 'next/navigation';
// custom imports
import { authService } from '../../services/auth-service';
import { storageService } from '../../services/storage-service';
// import { setMode } from '../../store/app-slice';
// import { signIn, signOut } from '../../store/auth-slice';
import { signinSchema } from '../../utils/form-schemas';
// asset imports
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import IconButton from '@mui/material/IconButton';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import LoginLoader from 'shared/loaders/login-loader';
import { ProgressSpinner } from 'ui-component/extended/progress-bars';
import MiniLogo from 'ui-component/mini-logo';
import Toaster from 'utils/toaster';
import '../../assets/scss/custom-styles.scss';
// ==============================|| LOGIN PAGE ||============================== //

const AuthLogin = () => {
  const { t } = useTranslation();
  const defaultTheme = useTheme();
  // const navigate = useNavigate();
  const router = useRouter();
  // const dispatch = useDispatch();
  // const [searchParams, setSearchParams] = useSearchParams();
  const [isFormLoading, setIsFormLoading] = useState(false);

  const handleLogout2 = () => {
    // eslint-disable-next-line react/no-unknown-property
    // return <navigate to="/auth/forgot-password" replace={true} />;
    // navigate('/auth/forgot-password');
    router.push('/auth/forgot-password');
  };

  // Login Form Mutate
  const { mutate: loginMutate } = useMutation({
    mutationFn: (data) => authService.authenticate(data),
    mutationKey: 'login-form'
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    } else {
      router.push('/home');
    }
  }, []);

  // // Auto Login Mutate
  // const { mutate: autoLoginMutate } = useMutation({
  //   mutationFn: authenticatByToken,
  //   mutationKey: 'autologin'
  // });

  // /**
  //  * Handling callback for auth token verification (query params)
  //  */
  // const handleTokenAuth = useCallback(
  //   async (token, redirectUrl) => {
  //     autoLoginMutate(
  //       { token },
  //       {
  //         onSuccess: (data) => {
  //           console.log(data);
  //           // dispatch(signIn({ ...data, isAuthenticated: true }));
  //           Toaster.success('Welcome! You have successfully logged into your account');
  //           setTimeout(() => {
  //             if (redirectUrl) {
  //               window.location.href = redirectUrl;
  //             } else {
  //               navigate('/', { replace: true });
  //             }
  //           }, 2000);
  //         },
  //         onError: () => {
  //           Toaster.error('Login failed');
  //         }
  //       }
  //     );
  //   },
  //   [autoLoginMutate]
  // );

  /**
   * Handling token, app mode from query params
   */
  // useEffect(() => {
  //   // Auto logout when comes to login page
  //   // dispatch(signOut());
  //   const redirectUrl = searchParams.has('redirectUrl') && searchParams.get('redirectUrl');
  //   const mode = searchParams.has('mode') && searchParams.get('mode');
  //   // Set app mode if mode query param exists
  //   // mode && dispatch(setMode(searchParams.get('mode')));

  //   // Set authenticate token if token query param exists
  //   if (searchParams.has('token')) {
  //     const token = searchParams.get('token');
  //     handleTokenAuth(token, redirectUrl);
  //   }

  //   return () => {
  //     searchParams.has('token') && searchParams.delete('token');
  //     searchParams.has('mode') && searchParams.delete('mode');
  //     searchParams.has('redirectUrl') && searchParams.delete('redirectUrl');
  //     setSearchParams(searchParams);
  //   };
  // }, [searchParams, setSearchParams, handleTokenAuth, autoLoginMutate]);

  const handleOnSubmit = async (values) => {
    setIsFormLoading(true);
    loginMutate(
      { username: values.userName, password: values.password },
      {
        onSuccess: (data) => {
          setIsFormLoading(false);
          // Set a flag for session expiration
          localStorage.setItem('sessionExpired', true);
          const user = {
            firstName: data.firstName,
            mobileNumber: data.mobileNumber,
            lastName: data.lastName,
            tenantId: data.tenantId,
            userId: data.userId,
            email: data.email,
            services: data.services,
            roleIds: data.roleIds
          };
          storageService.storeData(data);
          router.push('/home');
        },
        onError: (error) => {
          setIsFormLoading(false);
          if (error?.code && error?.code === 1402) {
            Toaster.error(t('signin.signin.errortext.locked'));
          } else if (error?.code && (error?.code === 1401 || error?.code === 1302)) {
            Toaster.error(t('signin.signin.errortext.invalid'));
          } else {
            Toaster.error(t('signin.signin.errortext.unknown'));
          }
        }
      }
    );
  };

  const { handleSubmit, handleChange, values, errors, handleBlur, touched } = useFormik({
    initialValues: {
      userName: '',
      password: ''
    },
    validationSchema: signinSchema,
    onSubmit: handleOnSubmit
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <>
        {/*Pre loader component*/}
        <LoginLoader />
        {/*Pre loader component*/}

        {/* background 2 color sections */}
        <Box className=" d-flex login-wrapper">
          <Box className="login-bg"></Box>
          <Box></Box>
        </Box>
        {/* background 2 color sections */}

        {/* form */}
        <Grid container className="grid-wrapper">
          <Grid container className="grid-form-wrapper" xs={12} sx={{ boxShadow: defaultTheme.shadows[3] }}>
            <Grid
              item
              xs={false}
              sm={false}
              md={6}
              sx={{
                height: { xs: '200px', md: 'auto' },
                backgroundImage: 'url(/images/auth/medi-resc-login-img.jpg)',
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
                  alt="Login medi rescue logo"
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
                      Medirescue Admin
                    </Typography>
                    <Typography variant="h3" mt={3} fontWeight={'200'} color={defaultTheme.palette.success.text}>
                      / Login
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box component="form" noValidate className="mt-28">
                <TextField
                  fullWidth
                  label={t('signin.field.userName.label')}
                  required
                  size="small"
                  name="userName"
                  autoComplete="userName"
                  className="text-field mb-28"
                  id="username"
                  color="secondary"
                  defaultValue={values.userName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.userName && Boolean(errors.userName)}
                  helperText={touched.userName && errors.userName}
                  placeholder={t('signin.field.userName.placeholder')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <PersonOutlinedIcon className="l-4" />
                      </InputAdornment>
                    )
                  }}
                  inputProps={{ maxLength: 50 }}
                />
                <TextField
                  required
                  fullWidth
                  size="small"
                  name="password"
                  label={t('signin.field.password.label')}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  defaultValue={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  placeholder={t('signin.field.password.placeholder')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={(e) => e.preventDefault()} // Prevents focus loss on the input field
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffOutlinedIcon /> : <RemoveRedEyeOutlinedIcon />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  inputProps={{ maxLength: 32 }}
                />

                <Box className="mt-15">
                  {/* <Alert variant="filled" severity="error" className="mb-28">
                    This is a filled error Alert.
                  </Alert> */}
                </Box>

                <Grid container justifyContent={'end'}>
                  <Grid item>
                    <Link sx={{ cursor: 'pointer' }} onClick={handleLogout2}>
                      {'Forgot Password'}
                    </Link>
                  </Grid>
                </Grid>

                <Grid container className="d-flex h-center" mt={defaultTheme.spacing(7)} mb={defaultTheme.spacing(7)}>
                  <Grid item>
                    <Button
                      onClick={handleSubmit}
                      variant="contained"
                      color="secondary"
                      className="mb-2 p-10 br-25"
                      disabled={isFormLoading}
                    >
                      {isFormLoading && (
                        <div className="mr-8">
                          <ProgressSpinner standalone={true} active={isFormLoading} />
                        </div>
                      )}
                      {!isFormLoading && <div className="material-symbols-outlined mr-8">login</div>} {t('signin.submit.signIn')}
                    </Button>
                  </Grid>
                  {/* <Grid item>
                    <Language />
                  </Grid> */}
                </Grid>

                <Divider className="mb-3 mt-2" />

                <Grid container className="h-center">
                  <Grid item>
                    {/* <Link className=".pointer" to="/register">
                      {"Don't have an account? Sign Up"}
                    </Link> */}
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

export default AuthLogin;
