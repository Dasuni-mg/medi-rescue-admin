import { Box, Grid, useTheme } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { GroupBanner } from './group-banner';
import { GroupDrawer } from './group-drawer';
import { GroupHeader } from './group-header';
import { GroupSearch } from './group-search';
import { GroupTable } from './group-table';
import { hasPermission } from 'utils/permission';

/**
 * The main component for the Groups view.
 *
 * This component renders the UI for the Groups view, which includes a
 * header, banner, search, table, and drawer. The drawer is used to create or
 * update an group, and the search is used to filter the table.
 *
 * @returns {React.ReactElement} The Groups view component.
 */
function Groups() {
  const [navOpen, setNavOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedAction, setSelectedAction] = useState({});
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [tenant, setTenant] = useState(null);

  /**
   * Toggle the drawer open or closed and set the selected action.
   *
   * @param {boolean} newOpen Whether to open or close the drawer.
   * @param {Object} action The selected action to perform in the drawer.
   */
  const toggleDrawer = useCallback((newOpen, action) => {
    setNavOpen(newOpen);
    setSelectedAction(action ?? {});
  }, []);

  /**
   * Determine if the user is a super admin.
   */
  useEffect(() => {
    setIsSuperAdmin(hasPermission('smtadmin_tenant.list'));
  }, []);

  const theme = useTheme();

  return (
    <Box sx={{ flexGrow: 1 }} className="bg-load">
      <Grid container sx={{ padding: { xs: theme.spacing(7), md: theme.spacing(8) } }}>
        {/* Heading  */}
        <GroupHeader toggleDrawer={toggleDrawer} />
        {/* Heading  */}

        {/* Banner */}
        <GroupBanner />
        {/* Banner */}

        {/* Search */}
        <GroupSearch setSearch={setSearch} />
        {/* Search */}

        {/* Table  */}
        <GroupTable navOpen={navOpen} search={search} toggleDrawer={toggleDrawer} />
        {/* Table  */}
      </Grid>

      {/* Drawer */}
      <GroupDrawer navOpen={navOpen} toggleDrawer={toggleDrawer} selectedAction={selectedAction} tenant={tenant} />
      {/* Drawer */}
    </Box>
  );
}

export default Groups;
