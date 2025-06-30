import SearchIcon from '@mui/icons-material/Search';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  createTheme,
  Dialog,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  ThemeProvider,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import Drawer from '@mui/material/Drawer';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import Image from 'next/image';
import React, { useMemo } from 'react';
import DeleteDialog from 'shared/dialog/delete-dialog';

const data = [
  {
    rolename: 'Location Admin',
    description: 'Jean Ten'
  },
  {
    rolename: 'Location Admin',
    description: 'Jean Ten'
  },
  {
    rolename: 'Location Admin',
    description: 'Jean Ten'
  },
  {
    rolename: 'Location Admin',
    description: 'Jean Ten'
  },
  {
    rolename: 'Location Admin',
    description: 'Jean Ten'
  },
  {
    rolename: 'Location Admin',
    description: 'Jean Ten'
  }
];

const top100Films = [
  { label: 'The Shawshank Redemption', year: 1994 },
  { label: 'The Godfather', year: 1972 },
  { label: 'The Godfather: Part II', year: 1974 }
];

export const colourOptions = [
  { value: 'ocean', label: 'Ocean', color: '#00B8D9' },
  { value: 'green', label: 'Green', color: '#36B37E' },
  { value: 'forest', label: 'Forest', color: '#00875A' },
  { value: 'slate', label: 'Slate', color: '#253858' },
  { value: 'silver', label: 'Silver', color: '#666666' }
];

// import { DataGrid } from '@mui/x-data-grid';
function SystemRoles() {
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [navopen, setNavOpen] = React.useState(false);

  //delete dialog
  const handleClickOpenDelete = () => {
    setOpenDeleteDialog(true);
  };
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const toggleDrawer = (newOpen) => () => {
    setNavOpen(newOpen);
  };

  const theme = useTheme();
  const columns = useMemo(
    () => [
      {
        id: 'rolename',
        accessorKey: 'rolename',
        header: 'Role Name',
        size: 50
      },
      {
        id: 'description',
        accessorKey: 'description',
        header: 'Description',
        size: 200
      }
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
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
    enableRowSelection: true,
    showColumnFilters: false,
    enableColumnActions: false,
    positionActionsColumn: 'last',
    enableFullScreenToggle: false,
    enableHiding: false,
    enableDensityToggle: false,

    renderRowActionMenuItems: ({ closeMenu }) => {
      return (
        <Box>
          <MenuItem id="view_item" key="item_0" onClick={toggleDrawer(true)} sx={{ m: 0, fontSize: '15px' }}>
            <div className="material-symbols-outlined mr-8">visibility</div>
            View
          </MenuItem>
          <MenuItem id="unassign_item" key="item_1" sx={{ m: 0, fontSize: '15px' }}>
            <div className="material-symbols-outlined mr-8">edit_square</div>
            Edit
          </MenuItem>
          <MenuItem
            id="delete_item"
            key="item_2"
            onClick={() => {
              closeMenu();
              handleClickOpenDelete();
            }}
            sx={{ m: 0, fontSize: '15px' }}
          >
            {' '}
            <div className="material-symbols-outlined mr-8">delete</div>
            Delete
          </MenuItem>
          <>
            {/* Delete in a Common Component */}
            <Dialog className="dialog-padding" open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
              <DeleteDialog />
            </Dialog>
            {/* Delete in a Common Component */}
          </>
        </Box>
      );
    }
  });

  const tableTheme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: theme.palette.secondary
        }
      }),
    [theme]
  );

  return (
    <Box sx={{ flexGrow: 1 }} className="bg-load">
      <Grid container sx={{ padding: { xs: theme.spacing(7), md: theme.spacing(8) } }}>
        {/* Heading  */}
        <Grid container className="title lift-header-title">
          <Grid item xs={12} sm={8} md={8} className="pb-15">
            <Box className="d-flex h-start v-center">
              <Box className="mr-15 material-symbols-outlined">arrow_forward</Box>
              <Typography variant="h1" className="text-ellipsis line-2 h1_color fw-400">
                System roles{' '}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4} md={4} className="pb-15">
            <Button
              id="blinking"
              variant="contained"
              color="secondary"
              className="text-ellipsis position-end position-btn-mobile line-1"
              onClick={toggleDrawer(true)}
            >
              <div className="material-symbols-outlined mr-8">add_circle</div>
              Create system role
            </Button>
          </Grid>
        </Grid>
        {/* Heading  */}

        {/* Banner */}
        <Grid container className="mb-30 header-banner" justifyContent="flex-start">
          <Grid item xs={9} sm={8} md={8} lg={8} xl={8} alignItems="center" className="d-flex lift-banner-text">
            <Box className="each-row">
              <Typography variant="h2" className="text-ellipsis line-2 white-color mb-5">
                Manage system roles
              </Typography>
              <Typography variant="h4" className="text-ellipsis line-2 white-color">
                Emergency Response Management just gets better
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={3} sm={5} md={5} lg={5} xl={5} className="d-flex pr-30 header-banner-img">
            {/* <Box sx={{ backgroundImage: `url(${HeaderImage})` }} className="position-end header-banner-img"></Box> */}
            {/* <img style={{ position: 'absolute', bottom: 0, left: -40 }} src={HeaderImage} alt="sidebar-img" /> */}
            <Image
              src="/images/Medical-checkup.png"
              fill={true}
              style={{
                objectFit: 'cover'
              }}
              alt="Banner image medical check up"
            />
          </Grid>
        </Grid>
        {/* Banner */}

        {/* Search */}
        <Grid container className="mb-30 lift-form-values" justifyContent="flex-start" spacing={5}>
          <Grid item xs={12} sm={6} md={6} lg={4} xl={4} className="" alignItems="center">
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={top100Films}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Role Name"
                  fullWidth
                  size="small"
                  id="rolename"
                  color="secondary"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon />
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
        {/* Search */}

        {/* Table  */}
        <Grid item xs={12} className="mb-30">
          <Box boxShadow={theme.shadows[1]} padding={theme.spacing(7)} className="white-bg">
            <ThemeProvider theme={tableTheme}>
              <MaterialReactTable table={table} />
            </ThemeProvider>
          </Box>
        </Grid>
        {/* Table  */}
      </Grid>

      <Drawer className="about-drawer" open={navopen} onClose={toggleDrawer(false)} anchor="right">
        <Box className="sidebar-p">
          <Grid container>
            {/* Title */}
            <Grid item xs={12}>
              <Box className="d-title-space d-flex v-center">
                <Typography variant="h3">Change password</Typography>
                <IconButton aria-label="delete" className="position-end" onClick={toggleDrawer(false)}>
                  <div className="material-symbols-outlined">close</div>
                </IconButton>
              </Box>
              <Divider />
            </Grid>
            {/* Title */}

            {/* Form wrapper */}
            <Grid container className="d-title-space">
              {/* Each Row  */}
              <Grid item xs={12} className="mb-28">
                <TextField
                  placeholder="Enter Current Password"
                  fullWidth
                  label="Current Password"
                  required
                  size="small"
                  id="vehiclenumber"
                  color="secondary"
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>
              {/* Each Row  */}

              <Grid item xs={12} className="mb-28 d-flex v-center">
                <TextField
                  fullWidth
                  placeholder="Enter new Password"
                  label="New Password"
                  required
                  size="small"
                  id="qrcode"
                  color="secondary"
                  InputLabelProps={{
                    shrink: true
                  }}
                />
                <Tooltip title="New password" placement="right-start">
                  <div className=" ml-20 material-symbols-outlined">error</div>
                </Tooltip>
              </Grid>

              <Grid item xs={12} className="mb-28 d-flex v-center">
                <TextField
                  fullWidth
                  required
                  size="small"
                  placeholder="Confirm new Password"
                  label="Confirm New Password"
                  id="qrcode"
                  color="secondary"
                  InputLabelProps={{
                    shrink: true
                  }}
                />

                <Tooltip title="Confirm password" placement="right-start">
                  <div className=" ml-20 material-symbols-outlined">error</div>
                </Tooltip>
              </Grid>

              <Alert severity="info">
                **Please note that your password needs to be at least 8 characters long, and it should include both uppercase (A-Z) and
                lowercase (a-z) letters. Additionally, you must have at least one numeric digit (0-9) and include at least one special
                character, such as !, @, #, $, or %.
              </Alert>
            </Grid>
            {/* Form wrapper */}
          </Grid>
        </Box>
      </Drawer>
    </Box>
  );
}

export default SystemRoles;
