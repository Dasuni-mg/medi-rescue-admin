import { Box, Grid, useTheme } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Toaster from 'utils/toaster';

function Home() {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();

  // Check if session expired flag exists
  const sessionExpired = localStorage.getItem('sessionExpired');
  if (sessionExpired) {
    Toaster.success(t('signin.signin.success'));
    localStorage.removeItem('sessionExpired'); // Clear session expired flag
  }

  return (
    <Box sx={{ flexGrow: 1 }} className="bg-load">
      <Grid>
        {/* Heading  */}
        <Grid container className="title vehicle-heading lift-header-title">
          <Box className="d-flex landing-wrapper align-items-center h-center white">
            <Grid item xs={12} sm={8} md={8} className="p-30">
              <Box className="each-row pb-30">
                <Box className="d-flex h-center v-center">
                  <Box className="landing-small-icon mr-30">
                    <Image
                      src="/images/home/cube.png"
                      layout="fill"
                      objectFit="cover"
                      alt="Cube of Mediportal"
                      className="max-width-none"
                    />
                  </Box>
                  <Box>
                    <h3>{t('welcome.header.title')}</h3>
                  </Box>
                </Box>
              </Box>

              <Box className="each-row">
                <Grid container>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={7} alignItems="center">
                    <Box className="landing-welcome-img d-flex align-items-center h-center">
                      <Image
                        src="/images/home/medirescue-welcome-image.png"
                        layout="fill"
                        objectFit="cover"
                        alt="Welcome to Mediwave"
                        className=""
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={5} alignItems="center" className="p-30 d-flex align-items-center">
                    <Box className="d-flex align-items-center align-items-start">
                      <Box className="vertical-bar mr-30">
                        <Image
                          src="/images/home/vertical-line.png"
                          layout="fill"
                          objectFit="cover"
                          alt="Cube of Mediportal"
                          className="max-width-none"
                        />
                      </Box>
                      <Box>
                        <h1 className="line-2 h1_color fw-400">{t('welcome.header.content')}</h1>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Box>
        </Grid>
        {/* Heading */}
      </Grid>
    </Box>
  );
}

export default Home;
