import { Box, Grid, Typography } from '@mui/material';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

/**
 * VehicleBanner component
 *
 * This component renders the header of the Vehicle page.
 * It displays a title, subtitle, and an image.
 * @returns {ReactElement} The VehicleBanner component.
 */
export const VehicleBanner = () => {
  const { t } = useTranslation();

  return (
    <Grid container className="mb-30 header-banner " justifyContent="flex-start ">
      <Grid item xs={9} sm={7} md={7} lg={7} xl={7} alignItems="center" className="d-flex lift-banner-text">
        <Box className="each-row">
          {/* Title of the banner */}
          <Typography variant="h1" className="text-ellipsis line-1 white-color pb-5">
            {t('vehicle.banner.title')}
          </Typography>
          {/* Subtitle of the banner */}
          <Typography variant="p" className="text-ellipsis line-2 white-color">
            {t('vehicle.banner.subtitle')}
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={3} sm={5} md={5} lg={5} xl={5} className="d-flex pr-30 header-banner-img">
        {/* <Box sx={{ backgroundImage: `url(${HeaderImage})` }} className="position-end header-banner-img"></Box> */}
        {/* <img style={{ position: 'absolute', bottom: 0, left: -40 }} src={HeaderImage} alt="sidebar-img" /> */}
        {/* The banner image */}
        <Image src="/images/Medical-checkup.png" layout="fill" objectFit="cover" alt="Banner image medical check up" />
      </Grid>
    </Grid>
  );
};
