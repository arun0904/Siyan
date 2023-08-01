import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../../Context/Firebase";
import useStyle from "./style";
import {states} from "./data"
import {
  Box,
  CircularProgress,
  Typography,
  Stack,
  Grid,
  FormLabel,
  TextField,
  Fade,
  Button,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";

export default function AddressForm({...props}) {
  const classes = useStyle();
  const firebase = useFirebase();
  const [state, setState] = useState('');

  const handleChange = (event) => {
    setState(event.target.value);
  };
  
  return (
    <>
      <Box component="form" className={classes.formBox} noValidate onSubmit={props.submitFunction}  sx={{  }}>
        <Typography variant="h5">Enter Address Details</Typography>
        <Grid container spacing={2} >
          <Grid item xs={12}>
          <FormLabel id="name">Full Name</FormLabel>
            <TextField
              required
              autoComplete="given-name"
              name="name"
              fullWidth
              id="name"
              autoFocus
            />
          </Grid>
          <Grid item xs={12}>
          <FormLabel id="mobile">Mobile No.</FormLabel>
            <TextField
              type="number"
              autoComplete="given-name"
              name="mobile"
              fullWidth
              id="mobile"
              autoFocus
              required
              InputProps={{ inputProps: { min: 1000000000, max: 9999999999 } }}
            />
          </Grid>
          <Grid item xs={12}>
          <FormLabel id="pincode">Pincode</FormLabel>
            <TextField
              required
              type="number"
              autoComplete="given-name"
              name="pincode"
              fullWidth
              id="pincode"
              autoFocus
              InputProps={{ inputProps: { min: 100000, max: 999999 } }}
            />
          </Grid>
          <Grid item xs={12} >
          <FormLabel id="houseNo">House No.</FormLabel>
            <TextField
              required
              autoComplete="given-name"
              name="houseNo"
              fullWidth
              id="houseNo"
              autoFocus
            />
          </Grid>
          <Grid item xs={12}>
          <FormLabel id="street">Street</FormLabel>
            <TextField
              required
              autoComplete="given-name"
              name="street"
              fullWidth
              id="street"
              autoFocus
            />
          </Grid>
          <Grid item xs={12}>
          <FormLabel id="name">Landmark</FormLabel>
            <TextField
              required
              autoComplete="given-name"
              name="landmark"
              fullWidth
              id="landmark"
              autoFocus
            />
          </Grid>
          <Grid item xs={12}>
          <FormLabel id="city">City</FormLabel>
            <TextField
              required
              autoComplete="given-name"
              name="city"
              fullWidth
              id="city"
              autoFocus
            />
          </Grid>
          <Grid item xs={12}>
        <InputLabel id="state">State</InputLabel>
        <Select
        sx={{ width:"100%"}}
        
          labelId="state"
          id="state"
          name="state"
          value={state}
          onChange={handleChange}
          xs={12}
        >
         {states.map((stateName, index)=><MenuItem key={index} value={stateName}>{stateName}</MenuItem>)}
        </Select></Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, backgroundColor:"black", "&:hover":{
            backgroundColor:"#F50E31"
          }}}
        >
          Save
        </Button>

        <Button
          type="reset"
          fullWidth
          variant="contained"
          sx={{ mt: 3, backgroundColor:"black", "&:hover":{
            backgroundColor:"#F50E31"
          }}}
          onClick={()=>setState('')}
        >
          Reset
        </Button>

        <Stack m={3} alignItems="center">
          <Fade in={firebase.signUpLoading} unmountOnExit>
            <CircularProgress sx={{color:"#f50e31"}}/>
          </Fade>
          <Typography
            color="#f50e31"
            sx={{ display: firebase.signUpLoading ? "block" : "none" }}
          >
            please wait...
          </Typography>
        </Stack>
      </Box>
    </>
  );
}
