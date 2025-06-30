import { Box, createTheme, Dialog, Grid, MenuItem, Switch, ThemeProvider, useTheme } from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import PropTypes from 'prop-types';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import deviceService from 'services/device-service';
import { deviceTypeService } from 'services/device-type-service';
import DeleteDialog from 'shared/dialog/delete-dialog';
import EnableDialog from 'shared/dialog/enable-dialog';
import UnassignDialog from 'shared/dialog/unassign-dialog';
import { hasPermission } from 'utils/permission';
import Toaster from 'utils/toaster';
import { vehicleService } from '../../services/vehicle-service';
import InnerPageLoader from '../../shared/loaders/inner-page-loader';

export const DeviceTable = memo(
  ({ search, toggleDrawer, isSuperAdmin, tenant, selectedAction, setSelectedAction }) => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [devicePage, setDevicePage] = useState({});
    const [sorting, setSorting] = useState([
      {
        id: 'createdAt',
        desc: true
      }
    ]);
    const [pagination, setPagination] = useState({
      pageIndex: 0,
      pageSize: 20
    });
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openUnassignDialog, setOpenUnassignDialog] = useState(false);
    const [toBedeleteDevice, setToBedeleteDevice] = useState({});
    const [toBeUnassignedDevice, setToBeUnassignedDevice] = useState({});
    const [searchPermError, setSearchPermError] = useState(false);
    const [vehicleMap, setVehicleMap] = useState({});
    const [deviceTypeMap, setDeviceTypeMap] = useState({});
    const [newStatus, setNewStatus] = useState(null); // Status switch state
    const [dialogRowId, setDialogRowId] = useState(null);
    const [openEnableDialog, setOpenEnableDialog] = useState(false); // Enable dialog state
    const [checked, setChecked] = useState();

    /**
     * Close the enable dialog
     */
    const handleCloseEnableDialog = () => {
      // Close the dialog
      setOpenEnableDialog(false);
      // Reset the row tracking
      setDialogRowId(null);
    };

    /**
     * Opens the delete dialog for a device.
     */
    const handleClickOpenDelete = (row) => {
      setOpenDeleteDialog(true);
      setToBedeleteDevice(row);
    };

    /**
     * Opens the unassign dialog for a device.
     */
    const handleClickOpenUnassignDialog = (row) => {
      setOpenUnassignDialog(true);
      setToBeUnassignedDevice(row);
    };

    /**
     * Opens the device assignment dialog.
     */
    const handleClickOpen = () => {
      setOpen(true);
    };

    /**
     * Called when the user clicks outside of the search bar
     */
    const handleClose = () => {
      setOpen(false);
    };

    /**
     * Enables or disables a device by ID using the API
     * @param {string} deviceId - The ID of the device to enable or disable
     * @param {boolean} status - The status to set the device to (true = enabled, false = disabled)
     * @returns {Promise<void>}
     */
    const deviceEnableAndDisableById = async (deviceId, status) => {
      setIsLoading(true);
      try {
        // Call the vehicle service to enable or disable the vehicle

        await deviceService
          .enableOrDisableDevice(deviceId, status)
          .then(() => {
            if (status) {
              Toaster.success(t('device.table.actions.status.enable.success'));
            } else {
              Toaster.success(t('device.table.actions.status.disable.success'));
            }
            setChecked(newStatus);
            setSelectedAction({ type: 'status' });
          })
          .catch((error) => {
            if (status) {
              Toaster.error(t('device.table.actions.status.enable.error'));
            } else {
              Toaster.error(t('device.table.actions.status.disable.error'));
            }
          });
      } finally {
        setIsLoading(false);
      }
    };

    /**
     * Handles the close event of the delete dialog
     */
    const handleCloseDeleteDialog = (type) => {
      setOpenDeleteDialog(false);
      if (type === 'delete') {
        if (toBedeleteDevice?.row?.original?.id) {
          toBedeleteDevice?.closeMenu();

          deviceService
            .deleteDevice(toBedeleteDevice?.row?.original?.id)
            .then((response) => {
              setToBedeleteDevice({});
              toggleDrawer(false, {
                row: {},
                type: 'deleted'
              });
              Toaster.success(t('device.table.deleteDevice.success.message'));
            })
            .catch((error) => {
              // If the error is 1707, show the error message
              if (error?.code && error?.code === 1707) {
                Toaster.error(error?.reason ?? t('device.table.deleteDevice.error.unknown'));
              } else {
                // Otherwise, show a generic error message
                Toaster.error(t('device.table.deleteDevice.error.unknown'));
              }
              // Clear the to be delete device
              setToBedeleteDevice({});
            });
        }
      } else {
        // If the user clicked the cancel button
        // Clear the to be delete device
        setToBedeleteDevice({});
        // Close the menu
        toBedeleteDevice?.closeMenu();
      }
    };

    /**
     * Handles the close event of the unassign dialog
     * */
    const handleCloseUnassignDialog = (type) => {
      setOpenUnassignDialog(false);

      if (type === 'unassign') {
        if (toBeUnassignedDevice?.row?.original?.id) {
          toBeUnassignedDevice?.closeMenu();
          setIsLoading(true);

          // Unassign the device
          const deviceId = toBeUnassignedDevice.row.original.id; // Get the device ID
          const vehicleIds = toBeUnassignedDevice.row.original.vehicleIds[0]; // Get the vehicle IDs

          deviceService
            .unassignDevice(deviceId, vehicleIds)
            .then((response) => {
              setToBeUnassignedDevice({});
              toBeUnassignedDevice?.closeMenu(); // Close the menu after unassigning
              setIsLoading(false);
              Toaster.success(t('device.table.unassign.success.message')); // Success message
              setSelectedAction({ type: 'unassigned' });
              toggleDrawer(false, {
                row: {},
                type: 'unassigned'
              });
            })
            .catch((error) => {
              setIsLoading(false);
              setToBeUnassignedDevice({}); // Clear in case of error
              Toaster.error(t('device.table.unassign.error.unknown')); // Error message
            });
        }
      } else {
        // Handle dialog cancellation (if needed)
        setToBeUnassignedDevice({});
      }
    };

    /**
     * Fetches all vehicles from the API and updates the vehicle options state.
     * */
    useEffect(() => {
      if (tenant?.id) {
        fetchVehicles();
      }
    }, [tenant?.id]);

    /**
     * Fetches all vehicles from the API and updates the vehicle options state.
     *
     * */
    const fetchVehicles = async () => {
      try {
        const vResponse = await vehicleService.searchVehicles('all', '', tenant?.id);
        // Create a new vehicle map object to avoid mutation
        const newVehicleMap = {};
        vResponse.data.forEach((vehicle) => {
          newVehicleMap[vehicle.id] = vehicle;
        });
        // Set the vehicle map with the new object
        setVehicleMap(newVehicleMap);
      } catch (error) {
        Toaster.error(t('device.table.unassign.error.unknown'));
      }
    };

    /**
     * Fetches all device types from the API and updates the device types state.
     */
    const fetchDeviceTypes = async () => {
      try {
        const deviceTypesResponse = await deviceTypeService.getDeviceTypes();
        deviceTypesResponse.forEach((type) => {
          deviceTypeMap[type.id] = type.name;
        });
        setDeviceTypeMap(deviceTypeMap);
      } catch (error) {
        Toaster.error(t('device.deviceTypes.error.message'));
      }
    };

    /**
     * Fetches all device types from the API and updates the device types state.
     */
    useEffect(() => {
      fetchDeviceTypes();
    }, []);

    /*
     * Fetches all vehicles from the API and updates the vehicle options state.
     */
    useEffect(() => {
      setSelectedAction({ type: 'searched' });
    }, [pagination, sorting]);

    /*
     * Acttion on search
     */
    useEffect(() => {
      if (
        selectedAction.type === 'unassigned' ||
        selectedAction.type === 'searched' ||
        selectedAction.type === 'created' ||
        selectedAction.type === 'updated' ||
        selectedAction.type === 'deleted' ||
        selectedAction.type === 'status'
      ) {
        if (sorting.length === 0) {
          sorting.push({
            id: 'createdAt',
            desc: true
          });
        }

        const sort = sorting.map((s) => {
          let id = '';
          switch (s.id) {
            case 'serialNumber':
              id = 'serialNumber';
              break;
            case 'name':
              id = 'name';
              break;
            case 'vehicleIds':
              id = 'vehicleIds';
              break;
            case 'deviceTypeId':
              id = 'deviceTypeId';
              break;
            case 'createdAt':
              id = 'createdAt';
              break;
            default:
              break;
          }
          return `${s.desc ? '-' : '+'}${id}`;
        });
        if (isSuperAdmin && !tenant?.id) {
          return;
        }

        setSearchPermError(false);
        setIsLoading(true);

        deviceService
          .searchDevices(
            sort,
            search?.notAssigned || false,
            pagination.pageIndex,
            pagination.pageSize,
            search?.vehicleNumber || '',
            search?.serialNumber || '',
            tenant?.id
          )
          .then((response) => {
            setDevicePage(response);
            setIsLoading(false);
            toggleDrawer(false, {
              row: {},
              type: 'void'
            });
          })
          .catch((error) => {
            if (error?.code && error?.code === 1707) {
              setSearchPermError(true);
            } else {
              // Toaster.error('Error in search the device.');
            }
            setIsLoading(false);
            toggleDrawer(false, {
              row: {},
              type: 'void'
            });
          });
      }
    }, [selectedAction, search, pagination, sorting, tenant, checked]);

    const theme = useTheme();

    const tableTheme = useMemo(
      () =>
        createTheme({
          palette: {
            primary: theme.palette.secondary
          }
        }),
      [theme]
    );

    /**
     * Columns for the table
     */
    const columns = useMemo(
      () =>
        [
          {
            id: 'id', // New id column
            accessorKey: 'id', // This matches the field from the API response
            header: 'ID',
            size: 50,
            hidden: true // Explicitly set the column as hidden
          },
          {
            id: 'serialNumber',
            accessorKey: 'serialNumber',
            header: t('device.table.columns.serialNumber'),
            size: 50
          },
          {
            id: 'name',
            accessorKey: 'name',
            header: t('device.table.columns.name'),
            size: 200
          },
          {
            id: 'deviceTypeId',
            accessorKey: 'deviceTypeId',
            header: t('device.table.columns.type'),
            size: 150,
            enableSorting: false,
            /**
             * Cell component for the 'deviceTypeId' column.
             * @param {{getValue: () => string}} cell - The cell object from Material React Table.
             * @returns {string} The device type name from the deviceTypeMap.
             */
            Cell: ({ cell }) => {
              const deviceTypeId = cell.getValue();
              return deviceTypeMap[deviceTypeId];
            }
          },
          {
            id: 'vehicleIds',
            accessorKey: 'vehicleIds',
            header: t('device.table.columns.vehicle'),
            size: 150,
            enableSorting: false,
            /**
             * Cell component for the 'vehicleIds' column.
             * @param {{getValue: () => number[]}} cell - The cell object from Material React Table.
             * @returns {string} The vehicle number and type name from the vehicleMap.
             * If the vehicle Ids are empty, it returns 'Not Assigned'.
             */
            Cell: ({ cell }) => {
              const vehicleIds = cell.getValue();

              if (!vehicleIds || vehicleIds.length === 0) {
                return 'Not Assigned';
              }
              return `${vehicleMap[vehicleIds]?.number} - ${vehicleMap[vehicleIds]?.vehicleTypeName}`;
            }
          },
          (hasPermission('smtadmin_vehicle.status') || hasPermission('smtadmin_vehicle.statusAny')) && {
            id: 'status',
            accessorKey: 'status', // Matches the field in the API response
            header: 'Status',
            size: 150,
            enableSorting: false,
            Cell: ({ row }) => {
              const initialChecked = row.original.status; // Determine initial checked status

              // Function to handle switch changes
              const handleSwitchChange = (rowIndex) => (event) => {
                const isChecked = event.target.checked; // Get current checked state of the switch
                setNewStatus(isChecked); // Update status based on the switch's state
                setDialogRowId(rowIndex); // Track the current row
                setOpenEnableDialog(true); // Open the dialog
              };

              const title = newStatus ? t('device.table.statusDialog.title.enable') : t('device.table.statusDialog.title.disable');
              const body = newStatus ? t('device.table.statusDialog.body.enable') : t('device.table.statusDialog.body.disable');

              return (
                <>
                  {/* Control the Switch using 'checked' instead of 'defaultChecked' */}
                  <Switch
                    checked={initialChecked} // Control checked status
                    onChange={handleSwitchChange(row.index)} // Handle switch change and open dialog
                  />
                  {/* Enable/Disable Dialog */}
                  <EnableDialog
                    open={dialogRowId === row.index} // Only show the dialog for the selected row
                    handleCloseEnableDialog={handleCloseEnableDialog} // Close dialog function
                    vehiclEnableAndDisableById={deviceEnableAndDisableById} // Pass the vehicle enable/disable function
                    vehicleId={row.original.id} // Pass the vehicle ID to the dialog
                    newStatus={newStatus} // Pass the new sta
                    tus
                    to
                    the
                    dialog
                    theme={theme} // Pass theme if needed
                    title={title}
                    body={body}
                  />
                </>
              );
            }
          }
        ].filter(Boolean),
      [dialogRowId, open, newStatus, vehicleMap]
    );

    const emptyRowsFallback = useCallback((table) => {
      if (searchPermError) {
        return t('device.table.tableFallback.permission');
      } else if (search === '') {
        return t('device.table.tableFallback.empty');
      } else if (search !== '' && (devicePage?.content?.length ?? 0) === 0) {
        return t('device.table.tableFallback.noResult');
      }
    });

    /**
     * Material React Table
     */
    const table = useMaterialReactTable({
      onSortingChange: setSorting,
      onPaginationChange: setPagination,
      state: {
        pagination,
        sorting
      },
      initialState: { columnVisibility: { id: false } },
      manualPagination: true,
      muiPaginationProps: {
        rowsPerPageOptions: [5, 10, 20]
      },
      columns,
      data: (devicePage?.content ?? []).map((device) => {
        return {
          id: device?.id ?? '',
          serialNumber: device?.serialNumber ?? '',
          name: device?.name ?? '',
          deviceTypeId: device?.deviceTypeId ?? '',
          vehicleIds: device?.vehicleIds ?? [],
          status: device?.status
        };
      }),
      muiTableHeadCellProps: {
        /**
         * sx prop for muiTableHeadCellProps.
         * Style for <TableCell> component in table header.
         * Adds a light gray border to the top of each header cell,
         * sets the background color to a light gray color,
         * and sets the font weight to normal.
         */
        sx: () => ({
          borderTop: '1px solid #ddd',
          background: '#FBFBFB',
          fontWeight: 400
        })
      },
      muiTableBodyCellProps: {
        classes: {
          root: 'font_tables'
        },
        /**
         * Style for <TableCell> component in table body.
         * Sets word break to 'break-word' and font weight to 400.
         */
        sx: () => ({
          wordBreak: 'break-word',
          fontWeight: 400
        })
      },
      muiTableBodyRowProps: {
        /**
         * Style for <TableRow> component in table body.
         * Sets the background color of the table row to a light gray color when hovered.
         */
        sx: () => ({
          '&:hover td': {
            background: '#eef5fb'
          }
        })
      },
      muiTablePaperProps: {
        /**
         * Style for <Paper> component.
         * Removes the default Material-UI box shadow from the table component.
         */
        sx: () => ({
          boxShadow: 'none'
        })
      },
      manualSorting: true,
      enableTopToolbar: false,
      enableColumnFilterModes: false,
      enableRowActions: true,
      enableRowSelection: false,
      showColumnFilters: false,
      enableColumnActions: false,
      positionActionsColumn: 'last',
      enableFullScreenToggle: false,
      enableHiding: false,
      enableDensityToggle: false,
      rowCount: devicePage?.page?.totalElements ?? 0,
      localization: {
        actions: t('device.table.columns.action'),
        rowsPerPage: t('device.table.bottom.rowsPerPage')
      },

      /**
       * Renders a fallback UI when there are no rows in the device table.
       * @param {object} table - The table object containing data and configurations.
       * @returns {JSX.Element} A JSX element displaying the fallback message centered within the table.
       */
      renderEmptyRowsFallback: ({ table }) => {
        /**
         * The fallback content when there are no rows in the table.
         * @type {JSX.Element}
         */
        const emptyRowsContent = (
          <div
            style={{
              paddingTop: '2rem',
              paddingBottom: '2rem',
              width: '100%',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            {emptyRowsFallback(table)}
          </div>
        );

        return emptyRowsContent;
      },

      /**
       * Render the row actions menu items
       * @param {{ row: TableRow, closeMenu: () => void }} props
       * @returns {ReactNode}
       */
      renderRowActionMenuItems: (row) => {
        return (
          <Box>
            {/* Progress Bar */}
            {isLoading && <InnerPageLoader />}

            {/* View Action */}
            {(hasPermission('smtadmin_device.view') || hasPermission('smtadmin_device.viewAny')) && (
              <MenuItem
                id="view_item"
                key="item_0"
                onClick={() => {
                  row.closeMenu();
                  toggleDrawer(true, {
                    row: row,
                    type: 'view'
                  });
                }}
                sx={{ m: 0, fontSize: '15px' }}
              >
                <div className="material-symbols-outlined mr-8">visibility</div>
                {t('device.table.actions.view')}
              </MenuItem>
            )}

            {/* Unassign Action */}
            {row.row.original.vehicleIds.length !== 0 &&
              (hasPermission('smtadmin_device.unassign') || hasPermission('smtadmin_device.unassignAny')) && (
                <MenuItem
                  id="unassign_item"
                  key="item_1"
                  onClick={() => handleClickOpenUnassignDialog(row)} // Correct function for unassign
                  sx={{
                    m: 0,
                    fontSize: '15px'
                  }}
                >
                  <div className="material-symbols-outlined mr-8">link_off</div> {/* Changed icon for unassign */}
                  {t('device.table.actions.unassign')} {/* Changed label */}
                </MenuItem>
              )}

            {/* Delete Action */}
            {(hasPermission('smtadmin_device.delete') || hasPermission('smtadmin_device.deleteAny')) && (
              <MenuItem
                id="delete_item"
                key="item_2"
                onClick={() => handleClickOpenDelete(row)} // This is for delete
                sx={{ m: 0, fontSize: '15px' }}
              >
                <div className="material-symbols-outlined mr-8">delete</div>
                {t('device.table.actions.delete')}
              </MenuItem>
            )}

            {/* UnAssign Dialog */}
            <Dialog className="dialog-padding" open={openUnassignDialog} onClose={handleCloseUnassignDialog}>
              <UnassignDialog
                open={openUnassignDialog}
                handleCloseUnassignDialog={(e) => handleCloseUnassignDialog('cancel')}
                handleUnassign={() => handleCloseUnassignDialog('unassign')}
                body={t('device.table.unassignDialog.body')}
              />
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={openDeleteDialog} onClose={() => handleCloseDeleteDialog('cancel')}>
              <DeleteDialog
                body={t('device.table.deleteDialog.body')}
                handleCloseDeleteDialog={(e) => handleCloseDeleteDialog('cancel')}
                handleDelete={() => handleCloseDeleteDialog('delete')}
              />
            </Dialog>
          </Box>
        );
      }
    });
    return (
      <Grid item xs={12} className="mb-30">
        <Box boxShadow={theme.shadows[1]} padding={theme.spacing(7)} className="white-bg">
          <ThemeProvider theme={tableTheme}>{isLoading ? <InnerPageLoader /> : <MaterialReactTable table={table} />}</ThemeProvider>
        </Box>
      </Grid>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.search === nextProps.search &&
      prevProps.searchVehiclesIds === nextProps.searchVehiclesIds &&
      prevProps.tenant?.id === nextProps.tenant?.id &&
      prevProps.selectedAction?.type === nextProps.selectedAction?.type
    );
  }
);

DeviceTable.propTypes = {
  search: PropTypes.string.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  isSuperAdmin: PropTypes.bool.isRequired,
  tenant: PropTypes.object.isRequired,
  selectedAction: PropTypes.object.isRequired,
  setSelectedAction: PropTypes.func.isRequired
};

export default DeviceTable;
