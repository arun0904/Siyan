import React, { useEffect, useState } from "react";
import {
  Button,
  Fade,
  TextField,
  Grid,
  Stack,
  Link,
  Box,
  Typography,
  CircularProgress,
  Modal,
} from "@mui/material";
import AuthWrapper from "../../Components/AuthWrapper";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../../Context/Firebase";
import { Cancel, CheckCircleSharp } from "@mui/icons-material";

const SignIn = () => {
  const navigate = useNavigate();
  const firebase = useFirebase();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [wait, setWait] = useState(false);
  const [successShow, setSuccessShow] = useState(false);
  const [resetError, setResetError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    const data = new FormData(event.currentTarget);
    firebase
      .signinUser(data.get("email"), data.get("password"))
      .then((user) => {
        firebase.setIsLoggedIn(true);
        setLoading(false);
      })
      .catch(() => {
        setTimeout(() => {
          setErrorMessage("invalid Email or Password");
          setLoading(false);
        }, 1000);
      });
  };

  const handleResetEmail = () => {
    setWait(true);
    firebase
      .passwordReset(resetEmail)
      .then(() => {
        setSuccessShow(true);
        setWait(false);
        setTimeout(() => {
          setModalOpen(false);
          setSuccessShow(false);
          setResetError("");
        }, 4000);
      })
      .catch((err) => {
        if (err.code === "auth/invalid-email") {
          setResetError("Invalid Email Address !");
        } else {
          if (err.code === "auth/user-not-found") {
            setResetError("User Not Found !");
          } else {
            setResetError("Something Went Wrong !");
          }
        }
        setSuccessShow(true);
        setWait(false);
        setTimeout(() => {
          setModalOpen(false);
          setSuccessShow(false);
          setResetError("");
        }, 4000);
      });
  };

  useEffect(() => {
    if (firebase.isLoggedIn) {
      navigate("/");
    }
  });

  return (
    <>
      <AuthWrapper>
        <Box
          sx={{
            boxShadow: 3,
            px: 4,
            py: 8,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflow: "scroll",
          }}
        >
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              type="email"
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onFocus={() => setErrorMessage("")}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onFocus={() => setErrorMessage("")}
            />
            <Stack height="20px">
              <Typography variant="caption" color="red">
                {errorMessage}
              </Typography>
            </Stack>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: "black",
                "&:hover": { backgroundColor: "black" },
              }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link
                  sx={{ cursor: "pointer", color: "black" }}
                  variant="body2"
                  onClick={() => setModalOpen(true)}
                >
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link
                  variant="body2"
                  onClick={() => navigate("/signup")}
                  sx={{ cursor: "pointer", color: "black" }}
                >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Stack m={3} alignItems="center">
              <Fade in={loading} unmountOnExit>
                <CircularProgress sx={{ color: "orange" }} />
              </Fade>
              <Typography
                color="orange"
                sx={{ display: loading ? "block" : "none" }}
              >
                Verifying please wait...
              </Typography>
            </Stack>
          </Box>
        </Box>
      </AuthWrapper>
      <Modal
        open={modalOpen}
        sx={{ backgroundColor: "#000000d0" }}
        onClose={() => setModalOpen(false)}
      >
        <Stack justifyContent="center" height="100%" alignItems="center">
          {!wait ? (
            <Box>
              {successShow ? (
                <Box>
                  {resetError === "" ? (
                    <Stack alignItems="center" gap="30px" color="green">
                      <Typography variant="h1">
                        <CheckCircleSharp fontSize="200px" />
                      </Typography>
                      <Typography variant="h4" textAlign="center">
                        Password Reset Link Sent Successfully
                      </Typography>
                    </Stack>
                  ) : (
                    <Stack alignItems="center" gap="30px" color="red">
                      <Typography variant="h1">
                        <Cancel fontSize="200px" />
                      </Typography>
                      <Typography variant="h4" textAlign="center">
                        {resetError}
                      </Typography>
                    </Stack>
                  )}
                </Box>
              ) : (
                <Stack
                  p={2}
                  bgcolor="#eeeded"
                  gap="20px"
                  borderRadius="8px"
                  sx={{ width: { xs: "100%", sm: "600px" } }}
                >
                  <Typography pb={1} variant="h5" color="#f50e31">
                    Reset Password?
                  </Typography>
                  <TextField
                    type="email"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        // - The Input-root, inside the TextField-root
                        "& fieldset": {
                          // - The <fieldset> inside the Input-root
                          borderColor: "black", // - Set the Input border
                        },
                        "&.Mui-focused fieldset": {
                          // - Set the Input border when parent is focused
                          borderColor: "#f50e31",
                        },
                      },
                    }}
                    required
                    fullWidth
                    placeholder="Enter Email Address"
                    size="small"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                  ></TextField>
                  <Stack
                    flexDirection="row"
                    pt={2}
                    justifyContent="space-around"
                  >
                    <Button
                      variant="contained"
                      color="success"
                      sx={{ width: "90px" }}
                      onClick={() => handleResetEmail()}
                    >
                      Reset
                    </Button>
                    <Button
                      onClick={() => setModalOpen(false)}
                      variant="contained"
                      color="error"
                      sx={{ width: "90px" }}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Stack>
              )}
            </Box>
          ) : (
            <CircularProgress sx={{ color: "#f50e31" }} />
          )}
        </Stack>
      </Modal>
    </>
  );
};

export default SignIn;
