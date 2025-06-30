import { Box, createTheme, Grid, MenuItem, ThemeProvider, useTheme } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import PropTypes from 'prop-types';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { organizationService } from 'services/organization-service';
import DeleteDialog from 'shared/dialog/delete-dialog';
import { hasPermission } from 'utils/permission';
import Toaster from 'utils/toaster';
import InnerPageLoader from '../../shared/loaders/inner-page-loader';

export const OrganizationTable = memo(
  ({ search, toggleDrawer, isSuperAdmin, tenant, selectedAction, setSelectedAction }) => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [organizationPage, setOrganizationPage] = useState({});
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
    const [toBedeleteOrganization, setToBedeleteOrganization] = useState({});
    const [searchPermError, setSearchPermError] = useState(false);

    /**
     * Handle the delete button click on the row
     * @param {{ row: TableRow, closeMenu: () => void }} row
     * @returns {void}
     */
    const handleClickOpenDelete = (row) => {
      setOpenDeleteDialog(true);
      setToBedeleteOrganization(row);
    };

    /**
     * Handle the close event of the delete dialog
     * @param {string} type delete or cancel
     * @returns {void}
     */
    const handleCloseDeleteDialog = (type) => {
      // Close the delete dialog
      setOpenDeleteDialog(false);

      // If the user clicked the delete button
      if (type === 'delete') {
        // Open the loader
        setIsLoading(true);
        // If the row has an id, delete the organization
        if (toBedeleteOrganization?.row?.original?.id) {
          // Close the menu
          toBedeleteOrganization?.closeMenu();

          // Call the delete service
          organizationService
            .deleteOrganization(
              toBedeleteOrganization?.row?.original?.id,
              // If the user is a super admin, use the tenant id from the row
              // Otherwise, use the current tenant id
              isSuperAdmin ? toBedeleteOrganization?.row?.original?.tenant?.id ?? null : tenant?.id ?? null
            )
            .then((response) => {
              // Clear the to be delete organization
              setToBedeleteOrganization({});
              toggleDrawer(false, {
                row: {},
                type: 'deleted'
              });
              // Show a success message
              Toaster.success(t('organization.table.deleteOrganization.success.message'));
            })
            .catch((error) => {
              // If the error is 1707, show the error message
              if (error?.code && error?.code === 1707) {
                Toaster.error(error?.reason ?? t('organization.table.deleteOrganization.error.unknown'));
              } else if (error?.code && error?.code === 1713) {
                Toaster.error(error?.reason ?? t('organization.table.deleteOrganization.error.unknown'));
              } else {
                // Otherwise, show a generic error message
                Toaster.error(t('organization.table.deleteOrganization.error.unknown'));
              }
              // Clear the to be delete organization
              setToBedeleteOrganization({});
              toggleDrawer(false, {
                row: {},
                type: 'void'
              });
            })
            .finally(() => {
              setIsLoading(false); // End loading once data is fetched
            });
        }
      } else {
        // If the user clicked the cancel button
        // Clear the to be delete organization
        setToBedeleteOrganization({});
        // Close the menu
        toBedeleteOrganization?.closeMenu();
      }
    };

    useEffect(() => {
      toggleDrawer(false, {
        row: {},
        type: 'paged'
      });
    }, [pagination, sorting]);

    useEffect(() => {
      if (
        selectedAction?.type === 'searched' ||
        selectedAction?.type === 'created' ||
        selectedAction?.type === 'updated' ||
        selectedAction?.type === 'deleted' ||
        selectedAction?.type === 'paged'
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
            case 'name':
              id = 'name';
              break;
            case 'type':
              id = 'organizationType.name';
              break;
            case 'emailaddress':
              id = 'email';
              break;
            case 'createdAt':
              id = 'createdAt';
              break;
            default:
              break;
          }
          return `${id},${s.desc ? 'desc' : 'asc'}`;
        });

        if (isSuperAdmin && !tenant?.id) {
          return;
        }

        setSearchPermError(false);
        setIsLoading(true);

        // Call the search service
        organizationService
          .searchOrganization(search, pagination.pageIndex, pagination.pageSize, sort, tenant?.id)
          .then((response) => {
            setOrganizationPage(response);
            toggleDrawer(false, {
              row: {},
              type: 'void'
            });
          })
          .catch((error) => {
            if (error?.code && error?.code === 1707) {
              setSearchPermError(true);
            } else if (error?.code && error?.code === 1302) {
              if (error?.attribute === 'Tenant') {
                Toaster.error(t('organization.table.search.error.group.notFound'));
              } else {
                Toaster.error(error?.reason);
              }
            }
            toggleDrawer(false, {
              row: {},
              type: 'void'
            });
          })
          .finally(() => {
            setIsLoading(false); // End loading once data is fetched
          });
      }
    }, [selectedAction, search, pagination, sorting, tenant]);

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

    const columns = useMemo(
      () => [
        {
          id: 'name',
          accessorKey: 'name', //access nested data with dot notation
          header: t('organization.table.columns.name'),
          size: 100
        },
        {
          id: 'type',
          accessorKey: 'type', //normal accessorKey
          header: t('organization.table.columns.type'),
          size: 100
        },
        {
          id: 'emailaddress',
          accessorKey: 'emailaddress',
          header: t('organization.table.columns.emailaddress'),
          size: 100
        }
      ],
      []
    );

    const emptyRowsFallback = useCallback((table) => {
      if (search === '' && !(hasPermission('smtadmin_organization.create') || hasPermission('smtadmin_organization.createAny'))) {
        return t('organization.table.tableFallback.permission');
      } else if (search === '') {
        return t('organization.table.tableFallback.empty');
      } else if (search !== '' && (organizationPage?.content?.length ?? 0) === 0) {
        return t('organization.table.tableFallback.noResult');
      }
    });

    const table = useMaterialReactTable({
      onSortingChange: setSorting,
      onPaginationChange: setPagination,
      state: {
        pagination,
        sorting
      },
      manualPagination: true,
      muiPaginationProps: {
        rowsPerPageOptions: [5, 10, 20]
      },
      columns,
      data: (organizationPage?.content ?? []).map((organization) => {
        return {
          id: organization?.id ?? '',
          name: organization?.name ?? '',
          type: organization?.organizationType?.name ?? '',
          emailaddress: organization?.email ?? '',
          tenant: {
            id: organization.tenant?.id ?? null
          }
        };
      }),
      muiTableHeadCellProps: {
        sx: () => ({
          // Add a light gray border to the top of each header cell
          borderTop: '1px solid #ddd',
          // Set the background color to a light gray color
          background: '#FBFBFB',
          // Make the font weight normal
          fontWeight: 400
        })
      },
      muiTableBodyCellProps: {
        classes: {
          root: 'font_tables'
        },
        /**
         * The style options for the table body cells.
         * @type {object}
         */
        sx: () => ({
          // This is useful for long strings of text.
          wordBreak: 'break-word',
          // Set the font weight of the table body cells.
          fontWeight: 400
        })
      },
      muiTableBodyRowProps: {
        sx: () => ({
          // Change the background color of the table body rows when the user hovers over them.
          '&:hover td': {
            background: '#eef5fb'
          }
        })
      },
      muiTablePaperProps: {
        sx: () => ({
          // Remove the box shadow from the table container.
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
      rowCount: organizationPage?.page?.totalElements ?? 0,
      localization: {
        actions: t('organization.table.columns.actions'),
        rowsPerPage: t('organization.table.bottom.rowsPerPage')
      },

      /**
       * A function that renders a fallback when there are no rows in the table.
       * @param {object} table The table object.
       * @returns {JSX.Element} A JSX element.
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
       * Renders the row action menu items.
       * @param {{ row: TableRow, closeMenu: () => void }} props The props.
       * @returns {ReactNode} The JSX element.
       */
      renderRowActionMenuItems: (row) => {
        return (
          <Box>
            {/*Pre loader component*/}
            {isLoading && <InnerPageLoader />}
            {/*Pre loader component*/}

            {/* View button */}
            {(hasPermission('smtadmin_organization.viewAny') || hasPermission('smtadmin_organization.view')) && (
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
                {t('organization.table.actions.view')}
              </MenuItem>
            )}
            {/* Delete button */}
            {(hasPermission('smtadmin_organization.deleteAny') || hasPermission('smtadmin_organization.delete')) && (
              <MenuItem id="delete_item" key="item_2" onClick={() => handleClickOpenDelete(row)} sx={{ m: 0, fontSize: '15px' }}>
                <div className="material-symbols-outlined mr-8">delete</div>
                {t('organization.table.actions.delete')}
              </MenuItem>
            )}
            {/* Delete dialog */}
            <>
              {/* Delete in a Common Component */}
              <Dialog className="dialog-padding" open={openDeleteDialog} onClose={() => handleCloseDeleteDialog('cancel')}>
                <DeleteDialog
                  body={t('organization.table.deleteDialog.body')}
                  handleCloseDeleteDialog={(e) => handleCloseDeleteDialog('cancel')}
                  handleDelete={() => handleCloseDeleteDialog('delete')}
                />
              </Dialog>
              {/* Delete in a Common Component */}
            </>
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
      prevProps.tenant?.id === nextProps.tenant?.id &&
      prevProps.selectedAction?.type === nextProps.selectedAction?.type
    );
  }
);

OrganizationTable.propTypes = {
  search: PropTypes.string.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  isSuperAdmin: PropTypes.bool.isRequired,
  tenant: PropTypes.object.isRequired,
  selectedAction: PropTypes.object.isRequired,
  setSelectedAction: PropTypes.func.isRequired
};
