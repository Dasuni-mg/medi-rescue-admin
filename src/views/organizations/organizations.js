import { Box, Grid, useTheme } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { hasPermission } from 'utils/permission';
import { OrganizationBanner } from './organization-banner';
import { OrganizationDrawer } from './organization-drawer';
import { OrganizationHeader } from './organization-header';
import { OrganizationSearch } from './organization-search';
import { OrganizationTable } from './organization-table';

/**
 * The main component for the Organizations view.
 *
 * This component renders the UI for the Organizations view, which includes a
 * header, banner, search, table, and drawer. The drawer is used to create or
 * update an organization, and the search is used to filter the table.
 *
 * @returns {React.ReactElement} The Organizations view component.
 */
function Organizations() {
  const [navOpen, setNavOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedAction, setSelectedAction] = useState({ type: 'init' });
  const [isSuperAdmin, setIsSuperAdmin] = useState(hasPermission('smtadmin_organization.listAny'));
  const [tenant, setTenant] = useState(null);

  useEffect(() => {
    if (tenant) {
      setSelectedAction({ type: 'searched' });
    }
  }, [tenant]);

  useEffect(() => {
    setSelectedAction({ type: 'searched' });
  }, [search]);

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

  const theme = useTheme();

  return (
    <Box sx={{ flexGrow: 1 }} className="bg-load">
      <Grid container sx={{ padding: { xs: theme.spacing(7), md: theme.spacing(8) } }}>
        {/* Heading  */}
        <OrganizationHeader toggleDrawer={toggleDrawer} />
        {/* Heading  */}

        {/* Banner */}
        <OrganizationBanner />
        {/* Banner */}

        {/* Search */}
        <OrganizationSearch setSearch={setSearch} setTenant={setTenant} isSuperAdmin={isSuperAdmin} />
        {/* Search */}

        {/* Table  */}
        <OrganizationTable
          search={search}
          toggleDrawer={toggleDrawer}
          isSuperAdmin={isSuperAdmin}
          tenant={tenant}
          selectedAction={selectedAction}
          setSelectedAction={setSelectedAction}
        />
        {/* Table  */}
      </Grid>

      {/* Drawer */}
      <OrganizationDrawer
        navOpen={navOpen}
        toggleDrawer={toggleDrawer}
        selectedAction={selectedAction}
        isSuperAdmin={isSuperAdmin}
        tenant={tenant}
      />
      {/* Drawer */}
    </Box>
  );
}

export default Organizations;
