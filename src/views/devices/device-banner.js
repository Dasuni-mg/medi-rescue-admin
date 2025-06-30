import { Box, Grid, Typography } from '@mui/material';
import { t } from 'i18next';
import Image from 'next/image';

const DeviceBanner = ({ theme }) => {
  return (
    <Grid container>
      {/* Banner */}
      <Grid container className="mb-30 header-banner" justifyContent="flex-start">
        <Grid item xs={9} sm={7} md={7} lg={7} xl={7} alignItems="center" className="d-flex lift-banner-text">
          <Box className="each-row">
            <Typography variant="h2" className="text-ellipsis line-1 white-color pb-5">
              {t('device.banner.title')}
            </Typography>
            <Typography variant="p" className="text-ellipsis line-2 white-color">
              {t('device.banner.subtitle')}{' '}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={3} sm={5} md={5} lg={5} xl={5} className="d-flex pr-30 header-banner-img">
          <Image src="/images/Medical-checkup.png" layout="fill" objectFit="cover" alt="banner-img-vehicle" />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DeviceBanner;
