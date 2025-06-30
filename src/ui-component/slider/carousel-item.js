import { Avatar, Box, Divider, Switch, Typography, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * The CarouselItem component.
 * @param {Object} props - The component props.
 * @param {string} props.title - The title of the carousel item.
 * @param {number} props.price - The price of the carousel item.
 * @param {string} props.description - The description of the carousel item.
 * @param {ReactNode} props.icon - The icon of the carousel item.
 * @returns {ReactElement} - The component.
 */
export const CarouselItem = ({ title, price, description, icon }) => {
  CarouselItem.propTypes = {
    /** The title of the carousel item. */
    title: PropTypes.string.isRequired,
    /** The price of the carousel item. */
    price: PropTypes.number.isRequired,
    /** The description of the carousel item. */
    description: PropTypes.string.isRequired,
    /** The icon of the carousel item. */
    icon: PropTypes.node.isRequired
  };

  const theme = useTheme();

  return (
    <Box className="carousel-item-container">
      {/* The carousel item container. */}
      <Box className="carousel-item">
        {/* The avatar and title container. */}
        <Avatar
          sx={{
            width: 72,
            height: 72,
            background: theme.palette.background.paper,
            border: `1px solid #EBEBEB`
          }}
        >
          {/* The avatar. */}
          <Avatar
            sx={{
              width: 48,
              height: 48,
              boxShadow: theme.shadows[5],
              background: theme.palette.background.paper
            }}
          >
            {icon}
          </Avatar>
        </Avatar>
        {/* The title of the carousel item. */}
        <Typography className="text-elipses carosel-title" sx={{ wordBreak: 'break-word' }} variant="h2" ml={theme.spacing(5)}>
          {title}
        </Typography>
      </Box>
      {/* The divider between the title and the content. */}
      <Divider
        sx={{
          marginTop: theme.spacing(3.752),
          marginBottom: theme.spacing(3.752)
        }}
      />
      {/* The content container. */}
      <Box className="inner-box">
        {/* The price and description container. */}
        <Box>
          {/* The price of the carousel item. */}
          <Typography variant="h2">
            $ <p className="textPrimary">{price}</p>
          </Typography>
          {/* The description of the carousel item. */}
          <Typography variant="para">Practitioner / Month</Typography>
        </Box>
        {/* The switch container. */}
        <Box className="d-flex">
          {/* The switch. */}
          <Switch />
        </Box>
      </Box>
      {/* The divider between the content and the description. */}
      <Divider
        sx={{
          marginTop: theme.spacing(3.752),
          marginBottom: theme.spacing(3.752)
        }}
      />
      {/* The description of the carousel item. */}
      <Typography variant="mediumtext">{description}</Typography>
    </Box>
  );
};
export default CarouselItem;
