import SearchIcon from '@mui/icons-material/Search';
import {
  Autocomplete,
  Box,
  Button,
  createTheme,
  Dialog,
  Grid,
  InputAdornment,
  MenuItem,
  TextField,
  ThemeProvider,
  Typography,
  useTheme
} from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import Image from 'next/image';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import DeleteDialog from 'shared/dialog/delete-dialog';

const data = [
  {
    phonenumber: '123WSP',
    vehicle: 'Ambulance',
    callername: 'Winger',
    incidentdatetime: 'Hope Hospital'
  },
  {
    phonenumber: '123WSP',
    vehicle: 'Ambulance',
    callername: 'Winger',
    incidentdatetime: 'Hope Hospital'
  },
  {
    phonenumber: '123WSP',
    vehicle: 'Ambulance',
    callername: 'Winger',
    incidentdatetime: 'Hope Hospital'
  },
  {
    phonenumber: '123WSP',
    vehicle: 'Ambulance',
    callername: 'Winger',
    incidentdatetime: 'Hope Hospital'
  },
  {
    phonenumber: '123WSP',
    vehicle: 'Ambulance',
    callername: 'Winger',
    incidentdatetime: 'Hope Hospital'
  },
  {
    phonenumber: '123WSP',
    vehicle: 'Ambulance',
    callername: 'Winger',
    incidentdatetime: 'Hope Hospital'
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

function Incidents() {
  //const [open, setOpen] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  //delete dialog
  const handleClickOpenDelete = () => {
    setOpenDeleteDialog(true);
  };
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const theme = useTheme();
  const columns = useMemo(
    () => [
      {
        accessorKey: 'phonenumber', //access nested data with dot notation
        header: 'Phone Number',
        size: 50
      },
      {
        accessorKey: 'vehicle', //normal accessorKey
        header: 'Vehicle',
        size: 200
      },
      {
        accessorKey: 'callername',
        header: 'Caller Name',
        size: 150
      },
      {
        accessorKey: 'incidentdatetime',
        header: 'Incident Date Time',
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
          <Link className="text-deco-none text-black" component={Link} to="/manage/create-incidents">
            <MenuItem id="view_item" key="item_0" sx={{ m: 0, fontSize: '15px' }}>
              <div className="material-symbols-outlined mr-8">visibility</div>
              View
            </MenuItem>
          </Link>

          <MenuItem id="delete_item" key="item_2" onClick={handleClickOpenDelete} sx={{ m: 0, fontSize: '15px' }}>
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
                Incidents{' '}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4} md={4} className="red pb-15">
            <Link className="text-deco-none" component={Link} to="/manage/create-incidents">
              <Button variant="contained" id="blinking" color="secondary" className="text-ellipsis position-end position-btn-mobile line-1">
                <div className="material-symbols-outlined mr-8">add_circle</div>
                Create incident
              </Button>
            </Link>
          </Grid>
        </Grid>
        {/* Heading  */}

        {/* Banner */}
        <Grid container className="mb-30 header-banner " justifyContent="flex-start ">
          <Grid item xs={9} sm={7} md={7} lg={7} xl={7} alignItems="center" className="d-flex lift-banner-text">
            <Box className="each-row">
              <Typography variant="h2" className="text-ellipsis line-2 white-color mb-5">
                Manage your Incident
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
                  label="Phone number"
                  fullWidth
                  size="small"
                  id="phonenumber"
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
    </Box>
  );
}

export default Incidents;
