import CircleIcon from '@mui/icons-material/Circle';
import { Avatar, Box, Button, Divider, Typography, useTheme } from '@mui/material';
import { IconCategoryPlus } from '@tabler/icons-react';

/**
 * The AddonCard component.
 * @param {Object} props - The component props.
 * @param {string} props.title - The title of the addon.
 * @param {number} props.price - The price of the addon.
 * @param {string} props.description - The description of the addon.
 * @param {string} props.message - The message of the addon.
 * @param {string} props.btnColor - The color of the button.
 * @param {string} props.btnText - The text of the button.
 * @param {Function} props.onClick - The function to call when the button is clicked.
 * @returns {ReactElement} - The component.
 */
export const Card = ({ title, price, description, message, btnColor, btnText, onClick }) => {
  // Add 'description' to the props validation
  Card.propTypes = {
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    btnColor: PropTypes.string.isRequired,
    btnText: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  };

  const theme = useTheme();

  return (
    <Box mt={theme.spacing(7)} sx={{ boxShadow: theme.shadows[1], padding: theme.spacing(7) }}>
      <Box>
        {/* Title and Icon */}
        <Box display={'flex'} alignItems={'center'}>
          <Box display={'flex'} alignItems={'center'} mr={theme.spacing(5)}>
            <Avatar sx={{ width: 72, height: 72, background: theme.palette.background.paper, border: `1px solid #EBEBEB` }}>
              <Avatar sx={{ width: 48, height: 48, boxShadow: theme.shadows[5], background: theme.palette.background.paper }}>
                <IconCategoryPlus />
              </Avatar>
            </Avatar>
          </Box>
          <Box width={'100%'} display={'flex'} alignItems={'center'} justifyContent={'space-between'} flexWrap={'wrap'}>
            <Typography mr={4} className="text-elipses" sx={{ wordBreak: 'break-word' }} variant="h2">
              {title}
            </Typography>
            <Box display={'flex'} className="addon-titile">
              <CircleIcon color="success" fontSize="small" />
              <Typography ml={2} variant="para">
                Free
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Divider */}
        <Divider sx={{ marginTop: theme.spacing(3.752), marginBottom: theme.spacing(3.752) }} />

        {/* Price and Message */}
        <Box display={'flex'} justifyContent={'space-between'}>
          <Box>
            <Typography variant="h2">
              ${' '}
              <p className="text-primary">
                <p className="textPrimary">{price}</p>
              </p>
            </Typography>
            <Typography variant="para">Practitioner / Month</Typography>
          </Box>
          <Typography className="text-elipses" sx={{ wordBreak: 'break-word', textAlign: 'end' }} ml={2} variant="para">
            {' '}
            {message}
          </Typography>
        </Box>
        <Divider sx={{ marginTop: theme.spacing(3.752), marginBottom: theme.spacing(3.752) }} />

        {/* Description */}
        <Typography variant="mediumtext">{description}</Typography>

        {/* Button */}
        <Box display={'flex'} justifyContent={'center'}>
          <Button
            id={btnText}
            sx={{ mt: theme.spacing(10) }}
            size="large"
            type="submit"
            variant="contained"
            color={btnColor}
            onClick={onClick}
          >
            {btnText}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Card;
