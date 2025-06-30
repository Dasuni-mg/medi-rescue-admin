import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { Avatar, Box, ButtonBase, Card, Grid, InputAdornment, OutlinedInput, Popper } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

// third-party
import PopupState, { bindPopper, bindToggle } from 'material-ui-popup-state';

// project imports
import Transitions from 'ui-component/extended/transitions';

// assets
import CloseIcon from '@mui/icons-material/Close';
import { shouldForwardProp } from '@mui/system';
import { IconSearch, IconX } from '@tabler/icons-react';

// styles
const PopperStyle = styled(Popper, { shouldForwardProp })(({ theme }) => ({
  zIndex: 1100,
  width: '99%',
  top: '-60px !important',
  padding: '0 12px',
  [theme.breakpoints.down('sm')]: {
    padding: '0 10px'
  }
}));

const OutlineInputStyle = styled(OutlinedInput, { shouldForwardProp })(({ theme }) => ({
  width: 287,
  height: 42,
  marginLeft: 40,
  paddingLeft: 16,
  paddingRight: 16,
  borderRadius: 50,
  '& input': {
    background: 'transparent !important',
    paddingLeft: '4px !important'
  },
  [theme.breakpoints.down('lg')]: {
    width: 250
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
    marginLeft: 4,
    marginTop: 10,
    background: '#fff'
  }
}));

const HeaderAvatarStyle = styled(Avatar, { shouldForwardProp })(({ theme }) => ({
  ...theme.typography.commonAvatar,
  ...theme.typography.mediumAvatar,
  background: theme.palette.background.paper,
  color: theme.palette.secondary.dark,
  borderRadius: '50px',
  width: 40,
  height: 40,
  border: `1px solid ${theme.palette.dark.light50}`
}));

// ==============================|| SEARCH INPUT - MOBILE||============================== //

const MobileSearch = ({ value, setValue, popupState }) => {
  const theme = useTheme();

  return (
    <OutlineInputStyle
      id="input-search-header"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Search"
      startAdornment={
        <InputAdornment position="start">
          <IconSearch stroke={1.5} size="1rem" fill={theme.palette.background.paper} color={theme.palette.grey[500]} />
        </InputAdornment>
      }
      endAdornment={
        <InputAdornment position="end">
          <Box sx={{ ml: 2 }}>
            <ButtonBase sx={{ borderRadius: '12px' }}>
              <Avatar
                variant="rounded"
                sx={{
                  ...theme.typography.commonAvatar,
                  ...theme.typography.mediumAvatar,
                  background: theme.palette.orange.light,
                  color: theme.palette.orange.dark,
                  '&:hover': {
                    background: theme.palette.orange.dark,
                    color: theme.palette.orange.light
                  }
                }}
                {...bindToggle(popupState)}
              >
                <IconX stroke={1.5} size="1.3rem" />
              </Avatar>
            </ButtonBase>
          </Box>
        </InputAdornment>
      }
      aria-describedby="search-helper-text"
      inputProps={{ 'aria-label': 'weight' }}
    />
  );
};

MobileSearch.propTypes = {
  value: PropTypes.string,
  setValue: PropTypes.func,
  popupState: PopupState
};

// ==============================|| SEARCH INPUT ||============================== //

const SearchSection = () => {
  const theme = useTheme();
  const [value, setValue] = useState('');

  return (
    <>
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <PopupState variant="popper" popupId="demo-popup-popper">
          {(popupState) => (
            <>
              <Box sx={{ ml: 2 }}>
                <ButtonBase sx={{ borderRadius: '12px' }}>
                  <HeaderAvatarStyle variant="rounded" {...bindToggle(popupState)}>
                    <IconSearch stroke={1.5} size="1.2rem" />
                  </HeaderAvatarStyle>
                </ButtonBase>
              </Box>
              <PopperStyle {...bindPopper(popupState)} transition>
                {({ TransitionProps }) => (
                  <Transitions type="zoom" {...TransitionProps} sx={{ transformOrigin: 'center left' }}>
                    <Card
                      sx={{
                        background: '#fff',
                        [theme.breakpoints.down('sm')]: {
                          border: 0,
                          boxShadow: 'none'
                        }
                      }}
                    >
                      <Box sx={{ p: 2 }}>
                        <Grid container alignItems="center" justifyContent="space-between">
                          <Grid item xs>
                            <MobileSearch value={value} setValue={setValue} popupState={popupState} />
                          </Grid>
                        </Grid>
                      </Box>
                    </Card>
                  </Transitions>
                )}
              </PopperStyle>
            </>
          )}
        </PopupState>
      </Box>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <OutlineInputStyle
          id="input-search-header"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search"
          startAdornment={
            <InputAdornment position="start">
              <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <CloseIcon stroke={1.5} size="1.3rem" sx={{ color: theme.palette.dark.light100 }} />
            </InputAdornment>
          }
          aria-describedby="search-helper-text"
          inputProps={{ 'aria-label': 'weight' }}
        />
      </Box>
    </>
  );
};

export default SearchSection;
