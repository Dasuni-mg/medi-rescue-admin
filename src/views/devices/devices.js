import SearchFilter from './device-search';
import DeviceHeader from './device-header';
import DeviceDrawer from './device-drawer';
import { Box, createTheme, Drawer, Grid, useTheme } from '@mui/material';
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { hasPermission } from 'utils/permission';
import 'react-toastify/dist/ReactToastify.css';
import DeviceTable from './device-table';
import DeviceBanner from './device-banner';
import InnerPageLoader from '../../shared/loaders/inner-page-loader';

/**
 * The Devices component is a page component that displays a table of devices.
 * It allows searching of devices by serial number, vehicle number, or device name.
 * It also allows creating, updating, and deleting of devices.
 *
 * The component makes use of the DeviceTable, DeviceHeader, DeviceBanner, and DeviceDrawer components.
 * The DeviceTable component displays a table of devices and allows the user to select a device to view its details.
 * The DeviceHeader component displays the page heading and allows the user to navigate to the create device page.
 * The DeviceBanner component displays a banner above the table with a call to action to create a device.
 * The DeviceDrawer component is a sidebar drawer that displays the details of a selected device and allows the user to edit or delete it.
 *
 * The component also makes use of the SearchFilter component to search for devices.
 *
 * @return {React.ReactElement} The component element.
 */
function Devices() {
  const [navOpen, setNavOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState({ type: 'init' });
  const [isSuperAdmin, setIsSuperAdmin] = useState(hasPermission('smtadmin_device.listAny'));
  const [tenant, setTenant] = useState(null);
  const [search, setSearch] = useState('');
  const [searchVehiclesIds, setSearchVehiclesIds] = useState('');

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

  /**
   * Table theme
   */
  const theme = useTheme();

  return (
    <Box sx={{ flexGrow: 1 }} className="bg-load">
      <Grid container sx={{ padding: { xs: theme.spacing(7), md: theme.spacing(8) } }}>
        {/*Pre loader component*/}
        {/* <InnerPageLoader /> */}
        {/* Heading */}
        <DeviceHeader toggleDrawer={toggleDrawer} />
        {/* Banner */}
        <DeviceBanner theme={theme} />
        {/* Search Filter */}
        <SearchFilter
          isSuperAdmin={isSuperAdmin}
          setSearch={setSearch}
          tenant={tenant}
          selectedAction={selectedAction}
          setSelectedAction={setSelectedAction}
          setTenant={setTenant}
          setSearchVehiclesIds={setSearchVehiclesIds}
        />

        {/* Table */}
        <DeviceTable
          search={search}
          toggleDrawer={toggleDrawer}
          isSuperAdmin={isSuperAdmin}
          tenant={tenant}
          selectedAction={selectedAction}
          setSelectedAction={setSelectedAction}
          searchVehiclesIds={searchVehiclesIds}
        />
        {/* Table */}
      </Grid>

      {/* <Drawer className="about-drawer" open={navopen} onClose={toggleDrawer(false)} anchor="right"> */}
      <DeviceDrawer
        navOpen={navOpen}
        toggleDrawer={toggleDrawer}
        selectedAction={selectedAction}
        isSuperAdmin={isSuperAdmin}
        tenant={tenant}
        setTenant={setTenant}
        setNavOpen={setNavOpen}
      />
    </Box>
  );
}

export default Devices;
