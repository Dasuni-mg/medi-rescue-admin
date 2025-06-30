import { Box, createTheme, Dialog, Grid, MenuItem, Switch, Typography, useTheme } from '@mui/material';
import { ThemeProvider } from '@mui/system';
import { useMutation } from '@tanstack/react-query';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { debounce, set } from 'lodash';
import { useTranslation } from 'react-i18next';
import DeleteDialog from 'shared/dialog/delete-dialog';
import EnableDialog from 'shared/dialog/enable-dialog';
import UnassignDialog from 'shared/dialog/unassign-dialog';
import InnerPageLoader from 'shared/loaders/inner-page-loader';
import { hasPermission } from 'utils/permission';
import Toaster from 'utils/toaster';
import { vehicleService } from '../../services/vehicle-service';
import { vehicleTypeService } from '../../services/vehicle-type-service';

/**
 * A table component for displaying a list of vehicles
 * @param {Object} props Component props
 * @param {Array} props.vehicles List of vehicles to display
 * @param {function} props.toggleDrawer Function to toggle the drawer
 * @param {function} props.viewVehicle Function to view a vehicle
 * @param {number} props.vehicleID Vehicle ID to view
 * @param {function} props.setVehicleID Function to set the vehicle ID
 * @param {function} props.debouncedSearchVehicles Function to search vehicles
 * @param {string} props.textOrganization Search text for organization
 * @param {string} props.textNumber Search text for vehicle number
 * @param {string} props.textGroup Search text for vehicle group
 * @returns {JSX.Element} The table component
 */
export const VehicleTable = ({
  toggleDrawer,
  vehicles,
  setMode,
  viewVehicle,
  vehicleID,
  setVehicleID,
  debouncedSearchVehicles,
  textOrganization,
  textNumber,
  textGroup,
  setVehicleTypeUpdate,
  setVehicles,
  totalRowCount,
  setTotalRowCount,
  setPagination,
  setSorting,
  pagination,
  sorting,
  orderBy,
  setOrderBy
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  /**
   * Theme provider for the table
   * @type {Theme}
   */
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
   * State for the dialogs
   * @type {Object}
   */
  const [open, setOpen] = useState(false); // Dialog state
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // Delete dialog state
  const [openUnassignDialog, setOpenUnassignDialog] = useState(false); // Delete unassign state
  const [openEnableDialog, setOpenEnableDialog] = useState(false); // Enable dialog state
  const [newStatus, setNewStatus] = useState(null); // Status switch state
  const [organizationID, setOrganizationID] = useState(null); // Selected organization ID
  const [vehicle, setVehicle] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle dialog open/close
  const handleDialogClose = () => setOpen(false);
  const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);
  const handleCloseUnassignDialog = () => setOpenUnassignDialog(false);
  const [dialogRowId, setDialogRowId] = useState(null);

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
   * Handle the delete vehicle action
   */
  const handleDelete = () => {
    if (setVehicleID) {
      // Delete the vehicle
      deleteVehicle(vehicleID);
      // Close the delete dialog
      setOpenDeleteDialog(false);
    }
  };

  /**
   * Handle the unassign vehicle action
   * @return {void}
   */
  const handleUnassign = () => {
    if (setVehicleID) {
      // Unassign the vehicle
      unassignVehicle(vehicleID);
      // Close the unassign dialog
      setOpenUnassignDialog(false);
    }
  };

  /**
   * Handles the enable vehicle action
   * @return {void}
   */
  const handleEnable = () => {
    if (setVehicleID) {
      // Enable the vehicle
      vehiclEnableAndDisableById(vehicleID);
      // Close the enable dialog
      setOpenEnableDialog(false);
    }
  };

  /**
   * Handles the open event of the delete dialog.
   */
  const handleClickOpenDelete = () => {
    // Open the delete dialog
    setOpenDeleteDialog(true);
  };

  const handleClickCancelDelete = () => {
    // Open the delete dialog
    setOpenDeleteDialog(false);
  };

  /**
   * Handles the open event of the unassign dialog.
   */
  const handleClickOpenUnassign = () => {
    // Open the unassign dialog
    setOpenUnassignDialog(true);
  };

  const { mutate: deleteVehicle } = useMutation({
    mutationFn: (vehicleID) => vehicleService.deleteVehicleById(vehicleID),
    onSuccess: () => {
      setIsLoading(false);
      Toaster.success(t('vehicle.table.deleteVehicle.success.message'));
      debouncedSearchVehiclesIndexChanding(textOrganization, textNumber, textGroup);
    },
    /**
     * Called when the mutation fails.
     * Shows an error message and refetches the list of vehicles.
     * @param {Error} error - The error that occurred during the mutation.
     */
    onError: (error) => {
      setIsLoading(false);
      // If the error is due to an active incident, show an error message.
      if (error.code === 1713 && error.attribute === 'Tenant') {
        Toaster.error(t('vehicle.table.deleteVehicle.error.tenant'));
        debouncedSearchVehiclesIndexChanding(textOrganization, textNumber, textGroup);
      }
      // If the error is due to an active incident, show an error message.
      else if (error.code === 1713) {
        debouncedSearchVehiclesIndexChanding(textOrganization, textNumber, textGroup);
        Toaster.error(t('vehicle.table.deleteVehicle.error.incident'));
      } else {
        // For all other errors, show a generic error message.
        Toaster.error(t('vehicle.table.deleteVehicle.error.unknown'));
      }
    }
  });

  const { mutate: unassignVehicle } = useMutation({
    mutationFn: () => vehicleService.unassignVehicleById(vehicleID, organizationID),
    /**
     * Handles the success event of the unassign vehicle mutation.
     * Shows a toast success message and refreshes the table.
     */
    onSuccess: () => {
      setIsLoading(false);
      Toaster.success(t('vehicle.table.unassign.success.message'));
      debouncedSearchVehiclesIndexChanding(textOrganization, textNumber, textGroup);
    },
    /**
     * Handles errors that occur during the unassign vehicle mutation.
     * If the error is due to an active incident, shows a toast error message.
     * Otherwise, logs the error and shows a toast error message.
     * @param {Error} error - The error that occurred during the mutation.
     */
    onError: (error) => {
      setIsLoading(false);
      if (error.code === 1713 && error.attribute === 'Tenant') {
        Toaster.error(t('vehicle.table.unassign.error.tenant'));
        debouncedSearchVehiclesIndexChanding(textOrganization, textNumber, textGroup);
      } else if (error.code === 1713) {
        // The vehicle is assigned to an active incident, show a toast error message
        debouncedSearchVehiclesIndexChanding(textOrganization, textNumber, textGroup);
        Toaster.error(t('vehicle.table.unassign.error.incident'));
      } else {
        // Log the error and show a toast error message
        Toaster.error(t('vehicle.table.unassign.error.unknown'));
        debouncedSearchVehiclesIndexChanding(textOrganization, textNumber, textGroup);
      }
    }
  });

  /**
   * @function getListVehicleTypes
   * @description Fetches the list of vehicle types from the API and updates the state.
   * @param {string} tenantIds - tenant ID or IDs to filter by
   * @returns {Promise<void>} Resolves when the vehicle types are fetched and the state is updated.
   */
  const getListVehicleTypes = async (tenantIds) => {
    try {
      setVehicleTypeUpdate([]);
      const response = await vehicleTypeService.listVehicleTypes(tenantIds); // Wait for the API call to complete
      setVehicleTypeUpdate(response); // Update the state with the fetched data
    } catch (error) {
      console.error('Error fetching vehicle by id:', error); // Log the error if API call fails
    }
  };

  /**
   * Calls the vehicle service to enable or disable a vehicle by ID
   * @param {string} vehicleID - The ID of the vehicle to enable or disable
   * @param {boolean} status - The status to set the vehicle to (true = enabled, false = disabled)
   * @returns {Promise<void>}
   */
  const vehiclEnableAndDisableById = async (vehicleID, status) => {
    setIsLoading(true);
    try {
      // Call the vehicle service to enable or disable the vehicle
      await vehicleService.putVehiclEnableAndDisableById(status, vehicleID);
      // If the API call was successful, fetch the updated list of vehicles
      if (status) {
        Toaster.success(t('vehicle.table.actions.status.enable.success'));
      } else {
        Toaster.success(t('vehicle.table.actions.status.disable.success'));
      }
      debouncedSearchVehicles(textOrganization, textNumber, textGroup);
    } catch (error) {
      if (error.code === 1713 && error.attribute === 'Tenant') {
        Toaster.error(t('vehicle.table.vehicleStatus.error.tenant'));
        debouncedSearchVehiclesIndexChanding(textOrganization, textNumber, textGroup);
      }
      // Handle errors from the API call
      else if (error.code === 1713) {
        // If the error is because the vehicle is assigned to an active incident, show an error message
        Toaster.error(t('vehicle.table.vehicleStatus.error.incident'));
        // Fetch the updated list of vehicles
        debouncedSearchVehiclesIndexChanding(textOrganization, textNumber, textGroup);
      } else {
        // For all other errors, show an error message
        if (status) {
          Toaster.success(t('vehicle.table.actions.status.enable.error'));
        } else {
          Toaster.success(t('vehicle.table.actions.status.disable.error'));
        }
        // Fetch the updated list of vehicles
        debouncedSearchVehiclesIndexChanding(textOrganization, textNumber, textGroup);
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * @function debouncedSearchVehicles
   * @description Return vehicles fpr relevant searching criterias
   * @returns {function} A function that can be used as an event search vehicles.
   */
  const debouncedSearchVehiclesIndexChanding = useCallback(
    debounce(async (textOrganization, textNumber, textGroup) => {
      try {
        if (sorting.length === 0) {
          sorting.push({
            id: 'createdAt',
            desc: true
          });
        }

        const sort = sorting.map((s) => {
          let id = '';
          const setOrderByName = s.desc ? 'desc' : 'asc';
          setOrderBy(setOrderByName);
          switch (s.id) {
            case 'number':
              id = 'number';
              break;
            case 'emergencyTypeName':
              id = 'emergencyTypeName';
              break;
            case 'vehicleTypeName':
              id = 'vehicleTypeName';
              break;
            case 'organizationName':
              id = 'organizationName';
              break;
            case 'createdAt':
              id = 'createdAt';
              break;
            default:
              id = 'createdAt';
              break;
          }
          return id;
        });

        setIsLoading(true);
        const response = await vehicleService.searchVehicles(
          textOrganization,
          textNumber,
          textGroup,
          pagination.pageIndex,
          pagination.pageSize,
          sort,
          orderBy
        );
        setVehicles(response.data); // Set the state with the fetched data
        setTotalRowCount(response.total);
      } catch (error) {
        setVehicles([]);
        setTotalRowCount(0);
        console.error('Error fetching vehicle data:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300), // 300 ms delay before calling backend
    [pagination, sorting]
  );

  /**
   * Columns for the table
   * @type {Array}
   */
  const columns = useMemo(
    () =>
      [
        {
          id: 'number',
          accessorKey: 'number', //access nested data with dot notation
          header: t('vehicle.table.columns.number'),
          size: 50
        },
        {
          id: 'emergencyTypeName',
          accessorKey: 'emergencyTypeName', //normal accessorKey
          header: t('vehicle.table.columns.emergencyType'),
          size: 200
        },
        {
          id: 'vehicleTypeName',
          accessorKey: 'vehicleTypeName',
          header: t('vehicle.table.columns.vehicleType'),
          size: 150
        },
        {
          id: 'organizationName',
          accessorKey: 'organizationName',
          header: t('vehicle.table.columns.organization'),
          size: 150,
          Cell: ({ row }) => {
            // Check if the organization name is empty or null, and display 'Not Assigned'
            return row.original.organizationName ? row.original.organizationName : t('vehicle.table.unassign.cell.notAssign');
          }
        },
        // Inside your columns definition
        (hasPermission('smtadmin_vehicle.status') || hasPermission('smtadmin_vehicle.statusAny')) && {
          accessorKey: 'status',
          header: t('vehicle.table.columns.status'),
          enableSorting: false,
          size: 150,
          Cell: ({ row }) => {
            const initialChecked = row.original.status; // Determine initial checked status

            // Function to handle switch changes
            const handleSwitchChange = (rowIndex) => (event) => {
              const isChecked = event.target.checked; // Get current checked state of the switch
              setNewStatus(isChecked); // Update status based on the switch's state
              setDialogRowId(rowIndex); // Track the current row
              setOpenEnableDialog(true); // Open the dialog
            };

            const title = newStatus ? t('vehicle.table.statusDialog.title.enable') : t('vehicle.table.statusDialog.title.disable');
            const body = newStatus ? t('vehicle.table.statusDialog.body.enable') : t('vehicle.table.statusDialog.body.disable');

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
                  vehiclEnableAndDisableById={vehiclEnableAndDisableById} // Pass the vehicle enable/disable function
                  vehicleId={row.original.id} // Pass the vehicle ID to the dialog
                  newStatus={newStatus} // Pass the new status to the dialog
                  theme={theme} // Pass theme if needed
                  title={title}
                  body={body}
                />
              </>
            );
          }
        }
      ].filter(Boolean),
    [dialogRowId, open, newStatus]
  );

  useEffect(() => {
    debouncedSearchVehiclesIndexChanding(textOrganization, textNumber, textGroup);
  }, [pagination, sorting]);

  /**
   * Table props
   * @type {Object}
   */
  const table = useMaterialReactTable({
    columns,
    data: vehicles ?? [],
    state: {
      pagination,
      sorting
    },
    manualPagination: true, // Enable manual pagination (handled via backend)
    manualSorting: true,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount: totalRowCount,
    muiPaginationProps: {
      rowsPerPageOptions: [5, 10, 20]
    },
    muiTableHeadCellProps: {
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
      sx: () => ({
        wordBreak: 'break-word',
        fontWeight: 400
      })
    },
    muiTableBodyRowProps: {
      sx: () => ({
        '&:hover td': {
          background: '#eef5fb'
        }
      })
    },
    muiTablePaperProps: {
      sx: () => ({
        boxShadow: 'none'
      })
    },
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
    localization: {
      actions: t('vehicle.table.columns.actions'),
      rowsPerPage: t('vehicle.table.bottom.rowsPerPage')
    },

    // Custom empty message when there are no vehicles
    renderEmptyRowsFallback: () => (
      <Typography
        style={{
          paddingTop: '2rem',
          paddingBottom: '2rem',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          textAlign: 'center'
        }}
      >
        {textNumber !== '' ? (
          <>{t('vehicle.table.tableFallback.noResult')}</> // If textNumber is null, show "No data found"
        ) : hasPermission('smtadmin_vehicle.createAny') || hasPermission('smtadmin_vehicle.create') ? (
          <>{t('vehicle.table.tableFallback.empty')}</> // If textNumber is not null and user has permission
        ) : (
          <>{t('vehicle.table.tableFallback.permission')}</> // If textNumber is not null but user doesn't have permission
        )}
      </Typography>
    ),

    renderRowActionMenuItems: ({ row, closeMenu }) => {
      return (
        <Box>
          {/* Progress Bar */}
          {isLoading && <InnerPageLoader />}
          {/* End of Progress Bar */}

          {(hasPermission('smtadmin_vehicle.view') || hasPermission('smtadmin_vehicle.viewAny')) && (
            <MenuItem
              id="view_item"
              key="item_0"
              onClick={() => {
                closeMenu();
                setMode('update');
                toggleDrawer(true)();
                setVehicleID(row.original.id);
                viewVehicle(row.original.id);
                const userData = JSON.parse(localStorage.getItem('userData'));
                if (userData?.tenantId) {
                  getListVehicleTypes(userData.tenantId); // Call with the first tenant's ID or any relevant value
                } else {
                  getListVehicleTypes(textGroup);
                }
              }}
              sx={{ m: 0, fontSize: '15px' }}
            >
              <div className="material-symbols-outlined mr-8">visibility</div>
              {t('vehicle.table.actions.view')}
            </MenuItem>
          )}
          {row.original.organizationId !== null &&
            (hasPermission('smtadmin_vehicle.unassign') || hasPermission('smtadmin_vehicle.unassignAny')) && (
              <MenuItem
                id="unassign_item"
                key="item_1"
                onClick={() => {
                  handleClickOpenUnassign();
                  setVehicleID(row.original.id);
                  setOrganizationID(row.original.organizationId);
                }}
                sx={{ m: 0, fontSize: '15px' }}
              >
                <div className="material-symbols-outlined mr-8">link_off</div>
                {t('vehicle.table.actions.unassign')}
              </MenuItem>
            )}
          {(hasPermission('smtadmin_vehicle.delete') || hasPermission('smtadmin_vehicle.deleteAny')) && (
            <MenuItem
              id="delete_item"
              key="item_2"
              onClick={() => {
                handleClickOpenDelete();
                setVehicleID(row.original.id);
              }}
              sx={{ m: 0, fontSize: '15px' }}
            >
              <div className="material-symbols-outlined mr-8">delete</div>
              {t('vehicle.table.actions.delete')}
            </MenuItem>
          )}
          <>
            {/* UnAssign Dialog */}
            <Dialog className="dialog-padding" open={openUnassignDialog} onClose={handleCloseUnassignDialog}>
              <UnassignDialog
                open={openUnassignDialog}
                handleCloseUnassignDialog={() => {
                  handleCloseUnassignDialog();
                  closeMenu(); // Close menu on successful delete
                }}
                handleUnassign={() => {
                  handleUnassign();
                  closeMenu(); // Close menu on successful delete
                }}
                body={t('vehicle.table.unassignDialog.body')}
              />
            </Dialog>

            {/* Delete in a Common Component */}
            <Dialog
              className="dialog-padding"
              open={openDeleteDialog}
              onClose={() => {
                handleClickCancelDelete();
              }}
            >
              <DeleteDialog
                open={openDeleteDialog}
                handleCloseDeleteDialog={() => {
                  handleClickCancelDelete();
                  closeMenu(); // Close menu on successful delete
                }}
                handleDelete={() => {
                  handleDelete();
                  closeMenu(); // Close menu on successful delete
                }}
                body={t('vehicle.table.deleteDialog.body')}
              />
            </Dialog>
          </>
        </Box>
      );
    }
  });

  return (
    <Grid item xs={12} className="mb-30">
      <Box boxShadow={theme.shadows[1]} padding={theme.spacing(7)} className="white-bg">
        <ThemeProvider theme={tableTheme}>
          <MaterialReactTable table={table} />
        </ThemeProvider>
      </Box>
    </Grid>
  );
};

VehicleTable.propTypes = {
  toggleDrawer: PropTypes.func.isRequired,
  vehicles: PropTypes.arrayOf(PropTypes.object).isRequired,
  mode: PropTypes.string.isRequired,
  setMode: PropTypes.func.isRequired,
  viewVehicle: PropTypes.func.isRequired,
  vehicleID: PropTypes.number.isRequired,
  setVehicleID: PropTypes.func.isRequired,
  debouncedSearchVehicles: PropTypes.func.isRequired,
  textOrganization: PropTypes.string.isRequired,
  textNumber: PropTypes.string.isRequired,
  textGroup: PropTypes.string.isRequired
};
