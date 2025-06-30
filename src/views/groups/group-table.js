import { Box, createTheme, Grid, MenuItem, ThemeProvider, useTheme } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { tenantService } from 'services/tenant-service';
import DeleteDialog from 'shared/dialog/delete-dialog';
import { hasPermission } from 'utils/permission';
import Toaster from 'utils/toaster';
import InnerPageLoader from '../../shared/loaders/inner-page-loader'; // Import the loader component

/**
 * A component to display the group table.
 * @param {object} props The props of the component.
 * @param {boolean} props.navOpen Whether the drawer is open or not.
 * @param {string} props.search The search query.
 * @param {function} props.toggleDrawer The function to toggle the drawer.
 * @param {boolean} props.isSuperAdmin Whether the user is a super admin or not.
 * @param {object} props.tenant The tenant object.
 * @returns {React.ReactElement} The rendered component.
 */
export const GroupTable = ({ navOpen, search, toggleDrawer, isSuperAdmin, tenant }) => {
  const { t } = useTranslation();
  const [groupPage, setGroupPage] = useState({});
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
  const [toBedeleteGroup, setToBedeleteGroup] = useState({});
  const [deletedResult, setDeletedResult] = useState({});
  const [searchPermError, setSearchPermError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const s3BucketUrl = 'https://s3.us-east-1.amazonaws.com/gp-dev-public/';

  /**
   * Handle the delete button click on the row
   * @param {{ row: TableRow, closeMenu: () => void }} row
   * @returns {void}
   */
  const handleClickOpenDelete = (row) => {
    setOpenDeleteDialog(true);
    setToBedeleteGroup(row);
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
      // If the row has an id, delete the group
      if (toBedeleteGroup?.row?.original?.id) {
        // Close the menu
        toBedeleteGroup?.closeMenu();

        // Call the delete service
        tenantService
          .deleteTenant(toBedeleteGroup?.row?.original?.id)
          .then((response) => {
            // Set the deleted result
            setDeletedResult(response);
            // Clear the to be delete group
            setToBedeleteGroup({});
            // Show a success message
            Toaster.success(t('group.table.deleteGroup.success.message'));
            fetchGroups();
          })
          .catch((error) => {
            // If the error is 1707, show the error message
            if (error?.code && error?.code === 1707) {
              Toaster.error(error?.reason ?? t('group.table.deleteGroup.error.unknown'));
            } else {
              // Otherwise, show a generic error message
              Toaster.error(t('group.table.deleteGroup.error.unknown'));
            }
            // Clear the to be delete group
            setToBedeleteGroup({});
          })
          .finally(() => {
            setIsLoading(false); // End loading once data is fetched
          });
      }
    } else {
      // If the user clicked the cancel button
      // Clear the to be delete group
      setToBedeleteGroup({});
      // Close the menu
      toBedeleteGroup?.closeMenu();
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [navOpen, search, pagination, sorting, deletedResult]);
  const fetchGroups = async () => {
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
          id = 'groupType.name';
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
      return `${s.desc ? '-' : '+'}${id}`;
    });
    setIsLoading(true);
    setSearchPermError(false);
    tenantService
      .searchTenant(pagination.pageIndex, pagination.pageSize, search, sort)
      .then((response) => {
        setGroupPage(response);
      })
      .catch((error) => {
        if (error?.code && error?.code === 1707) {
          setSearchPermError(true);
        } else {
          Toaster.error(t('group.table.tableFallback.fetchList'));
        }
      })
      .finally(() => {
        setIsLoading(false); // End loading once data is fetched
      });
  };

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
        header: t('group.table.columns.name'),
        size: 100,

        /**
         * Custom cell component to display the tenant name.
         * @param {object} props - The props passed to the cell.
         * @param {string} props.renderedCellValue - The value of the cell.
         * @param {object} props.row - The row data.
         * @returns {React.ReactElement} The rendered cell.
         */
        Cell: ({ renderedCellValue, row }) => (
          <Box className=" d-flex align-items-center">
            <Box className="img-resize-group-wrapper mr-15">
              <Image
                fill={true}
                style={{
                  objectFit: 'cover',
                  borderRadius: '50%'
                }}
                alt="avatar"
                src={row.original.logoName ? `${s3BucketUrl}` + row.original.logoName : '/images/hospital-icon.jpg'}
                loading="lazy"
                className="img-resize-group"
              />
            </Box>
            <p className="table-p-lift-if-icon min-w-250">{renderedCellValue}</p>
          </Box>
        )
      },
      {
        id: 'emailaddress',
        accessorKey: 'emailaddress',
        header: t('group.table.columns.emailaddress'),
        size: 100
      }
    ],
    []
  );

  const emptyRowsFallback = useCallback((table) => {
    if (search === '' && !hasPermission('smtadmin_tenant.create')) {
      return t('group.table.tableFallback.permission');
    } else if (search === '') {
      return t('group.table.tableFallback.empty');
    } else if (search !== '' && (groupPage?.totalRowCount ?? 0) === 0) {
      return t('group.table.tableFallback.noResult');
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
    data: (groupPage?.data ?? []).map((group) => {
      return {
        id: group?.id ?? '',
        name: group?.name ?? '',
        emailaddress: group?.email ?? '',
        logoName: group?.logoName ?? ''
      };
    }),
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
    rowCount: groupPage?.totalRowCount ?? 0,

    renderEmptyRowsFallback: ({ table }) => {
      return (
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
    },

    /**
     * Render the row actions menu items
     * @param {{ row: TableRow, closeMenu: () => void }} props
     * @returns {ReactNode}
     */
    renderRowActionMenuItems: (row) => {
      return (
        <Box>
          {/*Pre loader component*/}
          {isLoading && <InnerPageLoader />}
          {/*Pre loader component*/}

          {(hasPermission('smtadmin_tenant.viewAny') || hasPermission('smtadmin_tenant.view')) && (
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
              {t('group.table.actions.view')}
            </MenuItem>
          )}
          {(hasPermission('smtadmin_tenant.deleteAny') || hasPermission('smtadmin_tenant.delete')) && (
            <MenuItem id="delete_item" key="item_2" onClick={() => handleClickOpenDelete(row)} sx={{ m: 0, fontSize: '15px' }}>
              <div className="material-symbols-outlined mr-8">delete</div>
              {t('group.table.actions.delete')}
            </MenuItem>
          )}
          <>
            {/* Delete in a Common Component */}
            <Dialog className="dialog-padding" open={openDeleteDialog} onClose={() => handleCloseDeleteDialog('cancel')}>
              <DeleteDialog
                body={t('group.table.deleteDialog.body')}
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
};

GroupTable.propTypes = {
  navOpen: PropTypes.bool.isRequired,
  search: PropTypes.string.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  isSuperAdmin: PropTypes.bool.isRequired,
  tenant: PropTypes.object.isRequired
};
