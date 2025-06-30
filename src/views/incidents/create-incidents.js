import SearchIcon from '@mui/icons-material/Search';
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { ProgressSpinner } from 'ui-component/extended/progress-bars';

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
function CreateIncidents() {
  const theme = useTheme();

  return (
    <Box sx={{ flexGrow: 1 }} className="bg-load">
      <Grid container sx={{ padding: { xs: theme.spacing(7), md: theme.spacing(7) } }}>
        {/* Incident */}
        {/* Heading  */}
        <Grid container spacing={5} className="title lift-header-title v-start">
          <Grid item xs={12} sm={8} md={8} className="pb-15">
            <Box className="d-flex h-start v-center">
              <Box className="mr-15 material-symbols-outlined">arrow_forward</Box>
              <Typography variant="h1" className="text-ellipsis line-2 h1_color fw-400">
                Create Incident{' '}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4} md={4} className="pb-15">
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={top100Films}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Emergancy Type"
                  fullWidth
                  size="small"
                  id="emergancytype"
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
        {/* Heading  */}

        {/* Incident */}
        <Grid item xs={12}>
          <Box boxShadow={theme.shadows[1]} padding={theme.spacing(5)} className="white-bg">
            {/* Incidents Information */}
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6} md={4} className="">
                <TextField
                  placeholder="Enter Incident Number"
                  fullWidth
                  label="Incident Number"
                  required
                  size="small"
                  id="incidentnumber"
                  color="secondary"
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4} className="">
                <TextField
                  placeholder="Enter Phone Number"
                  fullWidth
                  label="Phone Number"
                  required
                  size="small"
                  id="phonenumber"
                  color="secondary"
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo-3"
                  options={top100Films}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Vehicle"
                      fullWidth
                      size="small"
                      color="secondary"
                      placeholder="Select vehicle"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <InputAdornment position="end">
                            <SearchIcon />
                          </InputAdornment>
                        )
                      }}
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  placeholder="Enter Caller Name"
                  fullWidth
                  label="Caller Name"
                  required
                  size="small"
                  id="callername"
                  color="secondary"
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  placeholder="Enter Incident Date"
                  fullWidth
                  type="date"
                  label="Incident Date"
                  required
                  size="small"
                  id="incidentdate"
                  color="secondary"
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  placeholder="Enter Incident Time"
                  fullWidth
                  type="time"
                  label="Incident Time"
                  required
                  size="small"
                  id="incidenttime"
                  color="secondary"
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>
            </Grid>
            {/* Incidents Information */}

            {/* Location Information */}
            <Box className="mt-30">
              {/* Heading  */}
              <Grid container className="title ">
                <Grid item xs={12} sm={8} md={8}>
                  <Box className="d-flex h-start v-center mb-20">
                    <Typography variant="h3" className="text-ellipsis line-2 h1_color fw-400">
                      Location Information
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              {/* Heading  */}

              <Grid container spacing={4}>
                <Grid item xs={12} sm={12} md={6}>
                  <Grid container spacing={4}>
                    <Grid item xs={12} sm={12} md={12}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo-4"
                        options={top100Films}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Service Type"
                            placeholder="Select Service Type"
                            fullWidth
                            size="small"
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
                    <Grid item xs={12} sm={12} md={12}>
                      <TextField
                        placeholder="Enter Google Address"
                        fullWidth
                        type="text"
                        label="From Location Google Address"
                        required
                        size="small"
                        id="fromlocation"
                        color="secondary"
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      <TextField
                        placeholder="Enter Google Address"
                        fullWidth
                        type="text"
                        label="To Location Google Address"
                        required
                        size="small"
                        id="tolocation"
                        color="secondary"
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </Grid>
                    {/* Each Row  */}
                    <Grid item xs={12}>
                      <FormControl>
                        <FormLabel className="radio-label">Trip Type</FormLabel>
                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                          <FormControlLabel value="female" control={<Radio />} label="One way" />
                          <FormControlLabel value="male" control={<Radio />} label="Two way" />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    {/* Each Row  */}
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={12} md={6}>
                  <div className="google-map-wrapper">
                    <iframe
                      title="google-map-react"
                      src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d126742.20195427403!2d79.8490624!3d6.9271552!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2slk!4v1724838518423!5m2!1sen!2slk"
                      loading="lazy"
                      className="google-map"
                    ></iframe>
                  </div>
                </Grid>
              </Grid>
            </Box>

            {/* Patient Information */}
            <Box className="mt-30">
              {/* Heading  */}
              <Grid container className="title ">
                <Grid item xs={12} sm={8} md={8}>
                  <Box className="d-flex h-start v-center mb-20">
                    <Typography variant="h3" className="text-ellipsis line-2 h1_color fw-400">
                      Patient Information
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              {/* Heading  */}
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    placeholder="Enter Patient Name"
                    fullWidth
                    type="text"
                    label="Patient Name"
                    required
                    size="small"
                    id="patientname"
                    color="secondary"
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    placeholder="Enter Age"
                    fullWidth
                    type="text"
                    label="Age"
                    required
                    size="small"
                    id="patientage"
                    color="secondary"
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo-3"
                    options={top100Films}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Gender"
                        fullWidth
                        size="small"
                        placeholder="Select Gender"
                        color="secondary"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <InputAdornment position="end">
                              <SearchIcon />
                            </InputAdornment>
                          )
                        }}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo-4"
                    options={top100Films}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Citizenship"
                        placeholder="Select Citizenship"
                        fullWidth
                        size="small"
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
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    placeholder="Enter Patient Symptom"
                    fullWidth
                    type="text"
                    label="Patient Symptom"
                    required
                    size="small"
                    id="patientsymtom"
                    color="secondary"
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    placeholder="Enter Patient Notes"
                    fullWidth
                    type="text"
                    label="Patient Notes"
                    required
                    size="small"
                    id="patientnote"
                    color="secondary"
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            <Grid container className="h-end mt-30">
              <Grid item>
                <Button variant="outlined" color="primary" className="br-25 mr-8">
                  <div className="material-symbols-outlined mr-8">close</div> Cancel
                  <ProgressSpinner className="mr-8" standalone={true} />
                </Button>
                <Button variant="contained" color="secondary" className="br-25">
                  <div className="material-symbols-outlined mr-8">add_circle</div> Create
                  <ProgressSpinner className="mr-8" standalone={true} />
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        {/* Table  */}
      </Grid>
    </Box>
  );
}

export default CreateIncidents;
