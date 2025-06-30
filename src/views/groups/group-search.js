import SearchIcon from '@mui/icons-material/Search';
import { Grid, TextField } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * GroupSearch
 *
 * This component renders a search bar and a dropdown
 * It fetches the list of tenants and renders it in the dropdown
 * When the user selects a tenant, it sets the tenant in the state
 * It also has a search bar that allows the user to search for groups
 * When the user enters a search term, it sets the search term in the state
 *
 * @param {Object} props
 * @param {boolean} props.isSuperAdmin Whether the user is a super admin or not
 * @param {Function} props.setSearch Function to set the search term in the state
 * @param {Function} props.setTenant Function to set the tenant in the state
 */
export const GroupSearch = ({ setSearch }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(2);
  const [defaultValue, setDefaultValue] = useState(undefined);

  /**
   * Called when the user clicks on the search bar
   */
  const handleOpen = () => {
    setOpen(true);
  };

  /**
   * Called when the user clicks outside of the search bar
   */
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Grid container className="mb-30 lift-form-values" justifyContent="flex-start" spacing={5}>
      <Grid item xs={12} sm={6} md={6} lg={4} xl={4} className="" alignItems="center">
        <TextField
          fullWidth
          label={t('group.search.searchGroup.label')}
          placeholder={t('group.search.searchGroup.placeholder')}
          size="small"
          id="Search-Group"
          onChange={debounce((e) => setSearch(e.target.value), 500)}
          color="secondary"
          InputProps={{
            maxLength: 51,
            endAdornment: (
              <InputAdornment position="end">
                {loading ? <CircularProgress color="inherit" size={20} /> : <></>}
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
      </Grid>
    </Grid>
  );
};

GroupSearch.propTypes = {
  setSearch: PropTypes.func.isRequired,
  setTenant: PropTypes.func.isRequired,
  isSuperAdmin: PropTypes.bool.isRequired
};
