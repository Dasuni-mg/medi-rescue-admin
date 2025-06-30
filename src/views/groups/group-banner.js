import { Box, Grid, Typography } from '@mui/material';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

/**
 * The GroupBanner component is used to display the header of the Groups page.
 * It displays the title and a subtitle, as well as a banner image.
 * @returns {ReactElement} The GroupBanner component.
 */
export const GroupBanner = () => {
  const { t } = useTranslation();

  return (
    // The container that contains the title, subtitle and the banner image
    <Grid container className="mb-30 header-banner " justifyContent="flex-start ">
      {/* The container that contains the title and subtitle */}
      <Grid item xs={9} sm={7} md={7} lg={7} xl={7} alignItems="center" className="d-flex lift-banner-text">
        <Box className="each-row">
          {/* The title of the banner */}
          <Typography variant="h2" className="text-ellipsis line-2 white-color mb-5">
            {t('group.banner.title')}
          </Typography>
          {/* The subtitle of the banner */}
          <Typography variant="h4" className="text-ellipsis line-2 white-color">
            {t('group.banner.subtitle')}
          </Typography>
        </Box>
      </Grid>
      {/* The container that contains the banner image */}
      <Grid item xs={3} sm={5} md={5} lg={5} xl={5} className="d-flex pr-30 header-banner-img">
        {/*
        <Box
          sx={{ backgroundImage: `url(${HeaderImage})` }}
          className="position-end header-banner-img"
        ></Box>
        */}
        {/*
        <img
          style={{ position: 'absolute', bottom: 0, left: -40 }}
          src={HeaderImage}
          alt="sidebar-img"
        />
        */}
        {/* The banner image */}
        <Image
          src="/images/Medical-checkup.png"
          fill={true}
          style={{
            objectFit: 'cover'
          }}
          alt="Banner image medical check up"
        />
      </Grid>
    </Grid>
  );
};
