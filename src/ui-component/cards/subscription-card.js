import { Avatar, Box, Button, Divider, Typography, useTheme } from '@mui/material';
// import { IconCategoryPlus } from "@tabler/icons-react";
import CircleIcon from '@mui/icons-material/Circle';
import Image from 'next/image';
import arrowiconblue from '../../../public/images/home/arrow-icon-blue.png';

import PropTypes from 'prop-types';

/**
 * The SubscriptionCard component.
 * @param {Object} props - The component props.
 * @param {string} props.title - The title of the subscription.
 * @param {number} props.price - The price of the subscription.
 * @param {ReactNode} props.icon - The icon of the subscription.
 * @param {string} props.description - The description of the subscription.
 * @param {string} props.btnColor - The color of the button.
 * @param {string} props.btnText - The text of the button.
 * @param {string} props.bgColor - The background color of the card.
 * @param {boolean} props.active - Whether the subscription is active or not.
 * @returns {ReactElement} - The component.
 */
export const SubscriptionCard = ({ title, price, icon, description, btnColor, btnText, bgColor, active }) => {
  SubscriptionCard.propTypes = {
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    icon: PropTypes.node.isRequired,
    description: PropTypes.string.isRequired,
    btnColor: PropTypes.string.isRequired,
    btnText: PropTypes.string.isRequired,
    bgColor: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired
  };

  const theme = useTheme();

  return (
    <Box height={'100%'} boxShadow={theme.shadows[7]}>
      <Box
        sx={{ background: bgColor, flexDirection: { sm: 'column', lg: 'row' } }}
        p={theme.spacing(7)}
        display={'flex'}
        alignItems={'center'}
        minHeight={130}
      >
        <Box sx={{ mr: { xs: theme.spacing(5), sm: 0, lg: theme.spacing(5) }, position: 'relative' }}>
          <Avatar sx={{ width: 72, height: 72, background: theme.palette.background.paper, border: `1px solid #EBEBEB` }}>
            <Avatar sx={{ width: 48, height: 48, boxShadow: theme.shadows[5], background: theme.palette.background.paper }}>{icon}</Avatar>
          </Avatar>
          {active ? (
            <CircleIcon
              color="success"
              fontSize="small"
              sx={{ stroke: '#ffffff', strokeWidth: 3, position: 'absolute', left: 48, top: 53 }}
            />
          ) : (
            <></>
          )}
        </Box>
        <Box display={'flex'} flexDirection={'column'} mt={{ sm: theme.spacing(5), lg: 0 }}>
          <Typography sx={{ wordBreak: 'break-word' }} className="text-elipses" color={theme.palette.background.paper} variant="h2">
            {title} (Active)
          </Typography>
        </Box>
      </Box>
      <Box pl={theme.spacing(7)} pr={theme.spacing(7)} pb={theme.spacing(7)}>
        <Divider sx={{ marginTop: theme.spacing(3.752), marginBottom: theme.spacing(3.752) }} />
        <Typography variant="h3" textAlign={'center'}>
          $ <p className="textPrimary">{price}</p>
        </Typography>
        <Box textAlign={'center'}>
          <Typography variant="para">Practitioner / Month</Typography>
        </Box>
        <Divider sx={{ marginTop: theme.spacing(3.752), marginBottom: theme.spacing(7) }} />

        <Typography className="text-elipses" sx={{ wordBreak: 'break-word' }} variant="h3" textAlign={'center'} mb={theme.spacing(7)}>
          Plan Details
        </Typography>
        <Typography variant="mediumtext" textAlign={'center'}>
          {description}
        </Typography>

        <Box mt={theme.spacing(7)}>
          <Box display={'flex'} alignItems={'center'} mb={theme.spacing(3.752)}>
            <Image src={arrowiconblue} alt="Arrow-icon" />
            <Typography className="text-elipses" sx={{ wordBreak: 'break-word' }} ml={2} variant="para">
              Network profile
            </Typography>
          </Box>
          <Box display={'flex'} alignItems={'center'} mb={theme.spacing(3.752)}>
            <Image src={arrowiconblue} alt="Arrow-icon" />
            <Typography className="text-elipses" sx={{ wordBreak: 'break-word' }} ml={2} variant="para">
              Phone enquiries
            </Typography>
          </Box>
          <Box display={'flex'} alignItems={'center'} mb={theme.spacing(3.752)}>
            <Image src={arrowiconblue} alt="Arrow-icon" />
            <Typography className="text-elipses" sx={{ wordBreak: 'break-word' }} ml={2} variant="para">
              Exiting online patient bookings
            </Typography>
          </Box>
          <Box display={'flex'} alignItems={'center'} mb={theme.spacing(3.752)}>
            <Image src={arrowiconblue} alt="Arrow-icon" />
            <Typography className="text-elipses" sx={{ wordBreak: 'break-word' }} ml={2} variant="para">
              New online patient bookings
            </Typography>
          </Box>
          <Box display={'flex'} alignItems={'center'} mb={theme.spacing(3.752)}>
            <Image src={arrowiconblue} alt="Arrow-icon" />
            <Typography className="text-elipses" sx={{ wordBreak: 'break-word' }} ml={2} variant="para">
              Higher search position
            </Typography>
          </Box>
          <Box display={'flex'} alignItems={'center'} mb={theme.spacing(3.752)}>
            <Image src={arrowiconblue} alt="Arrow-icon" />
            <Typography className="text-elipses" sx={{ wordBreak: 'break-word' }} ml={2} variant="para">
              Health Promotions
            </Typography>
          </Box>
          <Box display={'flex'} alignItems={'center'} mb={theme.spacing(3.752)}>
            <Image src={arrowiconblue} alt="Arrow-icon" />
            <Typography className="text-elipses" sx={{ wordBreak: 'break-word' }} ml={2} variant="para">
              Capped new patient cost
            </Typography>
          </Box>
          <Box display={'flex'} alignItems={'center'} mb={theme.spacing(3.752)}>
            <Image src={arrowiconblue} alt="Arrow-icon" />
            <Typography className="text-elipses" sx={{ wordBreak: 'break-word' }} ml={2} variant="para">
              Self serve
            </Typography>
          </Box>
          <Box display={'flex'} alignItems={'center'} mb={theme.spacing(3.752)}>
            <Image src={arrowiconblue} alt="Arrow-icon" />
            <Typography className="text-elipses" sx={{ wordBreak: 'break-word' }} ml={2} variant="para">
              Basic support
            </Typography>
          </Box>
          <Box display={'flex'} alignItems={'center'} mb={theme.spacing(3.752)}>
            <Image src={arrowiconblue} alt="Arrow-icon" />
            <Typography className="text-elipses" sx={{ wordBreak: 'break-word' }} ml={2} variant="para">
              Dedicated customer success
            </Typography>
          </Box>
          <Box display={'flex'} alignItems={'center'}>
            <Image src={arrowiconblue} alt="Arrow-icon" />
            <Typography className="text-elipses" sx={{ wordBreak: 'break-word' }} ml={2} variant="para">
              Manager
            </Typography>
          </Box>
          <Box textAlign={'center'}>
            <Button id={btnText} sx={{ mt: theme.spacing(10) }} size="large" type="submit" variant="contained" color={btnColor}>
              {btnText}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default SubscriptionCard;
