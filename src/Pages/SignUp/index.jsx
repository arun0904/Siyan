import React, { useEffect } from "react";
import { useFirebase } from "../../Context/Firebase";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Link,
  Grid,
  Box,
  Typography,
  Stack,
  Fade,
  CircularProgress,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AuthWrapper from "../../Components/AuthWrapper";
import { useNavigate } from "react-router-dom";

const theme = createTheme();

const SignUp = () => {
  const firebase = useFirebase();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    firebase.signupUser(
      data.get("email"),
      data.get("password"),
      data.get("firstName"),
      data.get("lastName"),
      data.get("Mobile"),
      data.get("role")
    );
  };

  useEffect(() => {
    if (firebase.isLoggedIn) {
      navigate("/");
    }
  });

  return (
    <AuthWrapper>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: 3,
            px: 4,
            py: 2,
            overflow: "scroll",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
            <Grid item xs={12}>
            <FormLabel id="demo-radio-buttons-group-label">Role</FormLabel>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="user"
        name="role"
      >
        <Stack direction="row"><FormControlLabel value="user" control={<Radio />} label="User" />
        <FormControlLabel value="admin" control={<Radio />} label="Admin" /></Stack>
      </RadioGroup></Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  autoComplete="given-name"
                  name="firstName"
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="Mobile"
                  label="Mobile Number"
                  name="Mobile"
                  autoComplete="Mobile"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2" onClick={() => navigate("/signin")}>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
            <Stack m={3} alignItems="center">
              <Fade in={firebase.signUpLoading} unmountOnExit>
                <CircularProgress sx={{ color: "orange" }} />
              </Fade>
              <Typography
                color="orange"
                sx={{ display: firebase.signUpLoading ? "block" : "none" }}
              >
                please wait...
              </Typography>
            </Stack>
          </Box>
        </Box>
      </ThemeProvider>
    </AuthWrapper>
  );
};

export default SignUp;
