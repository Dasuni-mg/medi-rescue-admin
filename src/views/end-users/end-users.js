import SearchIcon from '@mui/icons-material/Search';
import {
  Autocomplete,
  Box,
  Button,
  createTheme,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  ThemeProvider,
  Typography,
  useTheme
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import Drawer from '@mui/material/Drawer';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import InputAdornment from '@mui/material/InputAdornment';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import Image from 'next/image';
import React, { useMemo } from 'react';
import DeleteDialog from 'shared/dialog/delete-dialog';
import { ProgressSpinner } from 'ui-component/extended/progress-bars';

const data = [
  {
    username: '123WSP',
    userType: 'Ambulance',
    roles: 'Winger',
    status: 'Active',
    createddate: 'Hope Hospital',
    createdby: 'Hope Hospital'
  },
  {
    username: '123WSP',
    userType: 'Ambulance',
    roles: 'Winger',
    status: 'Active',
    createddate: 'Hope Hospital',
    createdby: 'Hope Hospital'
  },
  {
    username: '123WSP',
    userType: 'Ambulance',
    roles: 'Winger',
    status: 'Active',
    createddate: 'Hope Hospital',
    createdby: 'Hope Hospital'
  },
  {
    username: '123WSP',
    userType: 'Ambulance',
    roles: 'Winger',
    status: 'Active',
    createddate: 'Hope Hospital',
    createdby: 'Hope Hospital'
  },
  {
    username: '123WSP',
    userType: 'Ambulance',
    roles: 'Winger',
    status: 'Active',
    createddate: 'Hope Hospital',
    createdby: 'Hope Hospital'
  },
  {
    username: '123WSP',
    userType: 'Ambulance',
    roles: 'Winger',
    status: 'Inactive',
    createddate: 'Hope Hospital',
    createdby: 'Hope Hospital'
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

function EndUsers() {
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [navopen, setNavOpen] = React.useState(false);
  const [navopenReset, setNavOpenReset] = React.useState(false);

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

  const toggleDrawerReset = (newOpen) => () => {
    setNavOpenReset(newOpen);
  };

  const theme = useTheme();
  const columns = useMemo(
    () => [
      {
        id: 'username',
        accessorKey: 'username', //access nested data with dot notation
        header: 'User Name',
        size: 50
      },
      {
        id: 'userType',
        accessorKey: 'userType', //normal accessorKey
        header: 'User Type',
        size: 200
      },
      {
        id: 'roles',
        accessorKey: 'roles',
        header: 'Roles',
        size: 150
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        size: 150
      },
      {
        id: 'createddate',
        accessorKey: 'createddate',
        header: 'Created Date',
        size: 150
      },
      {
        id: 'createdby',
        accessorKey: 'createdby',
        header: 'Created By',
        size: 150
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
          <MenuItem id="edit_item" onClick={toggleDrawer(true)} key="item_1" sx={{ m: 0, fontSize: '15px' }}>
            <div className="material-symbols-outlined mr-8">edit_square</div>
            Edit
          </MenuItem>
          <MenuItem
            id="reset_item"
            key="item_2"
            onClick={() => {
              closeMenu();
              toggleDrawerReset(true)();
            }}
            sx={{ m: 0, fontSize: '15px' }}
          >
            <div className="material-symbols-outlined mr-8">lock_reset</div>
            Reset Password
          </MenuItem>
          <MenuItem
            id="delete_item"
            key="item_3"
            onClick={() => {
              handleClickOpenDelete();
            }}
            sx={{ m: 0, fontSize: '15px' }}
          >
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
        <Grid container className="title vehicle-heading lift-header-title">
          <Grid item xs={12} sm={8} md={8} className="red pb-15 mb-15-mobile">
            <Box className="d-flex h-start v-center">
              <Box className="mr-15 material-symbols-outlined">arrow_forward</Box>
              <Typography variant="h1" className="text-ellipsis line-2 h1_color fw-400">
                End Users{' '}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4} md={4} className="red pb-15">
            <Button
              id="blinking"
              variant="contained"
              color="secondary"
              className="text-ellipsis position-end position-btn-mobile line-1"
              onClick={toggleDrawer(true)}
            >
              <div className="material-symbols-outlined mr-8">add_circle</div>
              Create End User
            </Button>
          </Grid>
        </Grid>
        {/* Heading  */}

        {/* Banner */}
        <Grid container className="mb-30 header-banner " justifyContent="flex-start ">
          <Grid item xs={9} sm={7} md={7} lg={7} xl={7} alignItems="center" className="d-flex lift-banner-text">
            <Box className="each-row">
              <Typography variant="h2" className="text-ellipsis line-2 white-color mb-5">
                Manage end user
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
                  label="User"
                  fullWidth
                  size="small"
                  id="user"
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

      {/* create end user drawer */}
      <Drawer className="about-drawer" open={navopen} onClose={toggleDrawer(false)} anchor="right">
        <Box className="sidebar-p">
          <Grid container>
            {/* Title */}
            <Grid item xs={12}>
              <Box className="d-title-space d-flex v-center">
                <Typography variant="h3">Create End User</Typography>
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
                  placeholder="Enter User Name"
                  fullWidth
                  label="User Name"
                  required
                  size="small"
                  id="username"
                  color="secondary"
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>
              {/* Each Row  */}

              {/* Each Row  */}
              <Grid item xs={12} className="mb-28">
                <TextField
                  placeholder="Enter Display Name"
                  fullWidth
                  label="Display Name"
                  required
                  size="small"
                  id="displayname"
                  color="secondary"
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>
              {/* Each Row  */}

              {/* Each Row  */}
              <Grid item xs={12} className="mb-28">
                <TextField
                  placeholder="Enter Email Address"
                  fullWidth
                  label="Email Address"
                  required
                  size="small"
                  id="emailaddress"
                  color="secondary"
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>
              {/* Each Row  */}

              {/* Each Row  */}
              <Grid item xs={12} className="mb-28">
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={top100Films}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Organization"
                      label="Organization"
                      required
                      fullWidth
                      size="small"
                      id="organization"
                      color="secondary"
                      InputLabelProps={{
                        shrink: true
                      }}
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
              {/* Each Row  */}

              {/* Each Row  */}
              <Grid item xs={12} className="mb-28">
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={top100Films}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Entity/Entities"
                      label="Entity"
                      required
                      fullWidth
                      size="small"
                      id="entity"
                      color="secondary"
                      InputLabelProps={{
                        shrink: true
                      }}
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
              {/* Each Row  */}

              {/* Each Row  */}
              <Grid item xs={12} className="mb-28">
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={top100Films}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Role(s)"
                      label="Role"
                      required
                      fullWidth
                      size="small"
                      id="role"
                      color="secondary"
                      InputLabelProps={{
                        shrink: true
                      }}
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
              {/* Each Row  */}

              {/* Each Row  */}
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" className="switch-label">
                    Active User
                  </FormLabel>
                  <FormGroup aria-label="position">
                    <FormControlLabel
                      value="end"
                      control={<Switch color="primary" defaultChecked />}
                      // label="Active User"
                      // labelPlacement="end"
                    />
                  </FormGroup>
                </FormControl>
              </Grid>
              {/* Each Row  */}

              {/* Each Row  */}
              <Grid container mt={theme.spacing(7)} mb={theme.spacing(7)} className="h-end">
                <Grid item>
                  <Button variant="outlined" color="primary" className="br-25 mr-8">
                    <div className="material-symbols-outlined mr-8">restart_alt</div> Reset
                    <ProgressSpinner className="mr-8" standalone={true} />
                  </Button>
                  <Button variant="contained" color="secondary" className="br-25">
                    <div className="material-symbols-outlined mr-8">add_circle</div> Create
                    <ProgressSpinner className="mr-8" standalone={true} />
                  </Button>
                </Grid>
              </Grid>
              {/* Each Row  */}
            </Grid>
            {/* Form wrapper */}
          </Grid>
        </Box>
      </Drawer>
      {/* create end user drawer */}

      {/* Reset password drawer */}
      <Drawer className="about-drawer" open={navopenReset} onClose={toggleDrawerReset(false)} anchor="right">
        <Box className="sidebar-p">
          <Grid container>
            {/* Title */}
            <Grid item xs={12}>
              <Box className="d-title-space d-flex v-center">
                <Typography variant="h3">Reset password</Typography>
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
                  placeholder="Enter User Name"
                  fullWidth
                  label="User Name"
                  required
                  size="small"
                  id="username"
                  color="secondary"
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>
              {/* Each Row  */}

              {/* If break to two columns - each row */}
              <Grid container spacing={5}>
                <Grid item xs={6}>
                  <RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue="passwordreset" name="radio-buttons-group">
                    <FormControlLabel value="passwordreset" control={<Radio />} label="Password reset link" />
                  </RadioGroup>
                </Grid>
                <Grid item xs={6}>
                  <RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue="manual" name="radio-buttons-group">
                    <FormControlLabel value="" control={<Radio />} label="Reset password manually" />
                  </RadioGroup>
                </Grid>

                <Grid item className="position-end">
                  <Button variant="contained" color="secondary" className="br-25 mb-28">
                    {/* <div className="material-symbols-outlined mr-8">lock_reset</div> */}
                    Send password reset link
                    <ProgressSpinner className="mr-8" standalone={true} />
                  </Button>
                </Grid>
              </Grid>
              {/* If break to two columns - each row */}

              {/* Each Row  */}

              {/* Each Row  */}

              <Grid item xs={12} className="mb-28">
                <TextField
                  placeholder="Enter New Password"
                  fullWidth
                  label="New password"
                  required
                  size="small"
                  id="newpassword"
                  color="secondary"
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>
              <Grid item xs={12} className="mb-28">
                <TextField
                  placeholder="Enter Confirm Password"
                  fullWidth
                  label="Confirm Password"
                  required
                  size="small"
                  id="confirmpassword"
                  color="secondary"
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>
              {/* Each Row  */}
              <Grid container>
                <Grid item className="position-end">
                  <Button variant="contained" color="secondary" className="br-25 ">
                    {/* <div className="material-symbols-outlined mr-8">update</div> */}
                    Update password
                    <ProgressSpinner className="mr-8" standalone={true} />
                  </Button>
                </Grid>
              </Grid>
              {/* Each Row  */}
            </Grid>
            {/* Form wrapper */}
          </Grid>
        </Box>
      </Drawer>
      {/* create end user drawer */}
    </Box>
  );
}

export default EndUsers;
