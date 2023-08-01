import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  Typography,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@mui/material";
import { useFirebase } from "../../Context/Firebase";
import useStyle from "./style.js";

export default function LoginAndSecurity() {
  const firebase = useFirebase();
  const classes = useStyle();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [matchPassword, setMatchPassword] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    firebase.updateUserEmail(data.get("email"));
    setOpenEmailDialog(false);
  };

  const handleSubmitPassword = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get("password") !== data.get("confirmPassword"))
      setMatchPassword("Password Does not match");
    else
      firebase
        .updateUserPassword(data.get("password"))
        .then(() => {
          setOpenPasswordDialog(false);
          alert("password updated");
        })
        .catch((error) => {
          setMatchPassword(error.message)
          console.log(error.message);
        });
  };

  return (
    <>
      <Stack sx={{width:{xs:"100%", sm:"600px"}}}   m={"auto"}>
        <Stack className={classes.updateEmailBox} sx={{fontSize:{xs:"15px", sm:"25px"}}}>
          <Typography variant="h4" my={2} sx={{fontSize:{xs:"25px", sm:"30px"}}}>
            Email:
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            gap="20px"
            flexWrap="wrap"
          >
            <Typography  flexGrow={1} textAlign="left" variant="h5" sx={{fontSize:{xs:"18px", sm:"25px"}}} >
              {firebase.userAccountInfo.email}
            </Typography>
            <Box flexGrow={1} textAlign="right">
            <Button
              variant="contained"
              onClick={() => setOpenEmailDialog(true)}
            >
              Update
            </Button>
            </Box>
          </Stack>
        </Stack>

        <Stack className={classes.updateEmailBox}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            gap="20px"
            flexWrap="wrap"
          >
            <Typography variant="h5">Change Password</Typography>
            <Box flexGrow={1} textAlign="end">
            <Button
              variant="contained"
              onClick={() => setOpenPasswordDialog(true)}
            >
              Change
            </Button>
            </Box>
            
          </Stack>
        </Stack>
        <Stack
          className={classes.updateEmailBox}
          justifyContent="space-between"
          direction="row"
          gap="20px"
          flexWrap="wrap"
        >
          <Typography variant="h5">Delete Account</Typography>
          <Box flexGrow="1" textAlign="right"><Button
            variant="contained"
            color="error"
            sx={{width:"95px"}}
            onClick={() => setOpenDeleteDialog(true)}
          >
            delete
          </Button></Box>
        </Stack>
      </Stack>

      <Dialog open={openEmailDialog} onClose={() => setOpenEmailDialog(false)}>
        <DialogTitle>Update Email</DialogTitle>
        <DialogContent>
          <DialogContentText>
            please enter your email address here. Which you want to update
          </DialogContentText>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              autoFocus
              required
              margin="dense"
              id="email"
              label="Email Address"
              type="email"
              name="email"
              fullWidth
              variant="standard"
            />
            <Button onClick={() => setOpenEmailDialog(false)}>Cancel</Button>
            <Button type="submit">Update</Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openPasswordDialog}
        onClose={() => setOpenPasswordDialog(false)}
      >
        <DialogTitle>Update Password</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmitPassword}>
            <TextField
              onFocus={() => setMatchPassword(null)}
              autoFocus
              required
              margin="dense"
              id="password"
              label="New Password"
              type="password"
              name="password"
              fullWidth
              variant="standard"
            />
            <TextField
              onFocus={() => setMatchPassword(null)}
              autoFocus
              required
              margin="dense"
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              fullWidth
              variant="standard"
            />
            <Typography variant="caption" color="red">
              {matchPassword}
            </Typography>
            <br />
            <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
            <Button type="submit">Update</Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you Sure you want to delete your Account?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button
            color="error"
            onClick={() => firebase.deleteAccount()}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
