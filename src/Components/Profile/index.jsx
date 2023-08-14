import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  CardMedia,
  Typography,
  Tooltip,
  Menu,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  AccountCircle,
  Edit,
  PersonOutline,
  CalendarMonth,
  PhoneEnabled,
  Email,
  Home,
} from "@mui/icons-material";
import useStyle from "./style";
import { useFirebase } from "../../Context/Firebase";
import { updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function UserProfile() {
  const classes = useStyle();
  const firebase = useFirebase();
  const [profilePic, setProfilePic] = useState(null);
  const [imageurl, setImageurl] = useState(
    firebase.firebaseAuth?.currentUser?.photoURL
  );
  const [userProfile, setUserProfile] = useState(null);
  const [anchorEl1, setAnchorEl1] = useState(null);
  const open1 = Boolean(anchorEl1);
  const [openDialog, setOpenDialog] = useState(false);
  const [wait, setWait] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen]=useState(false);

  const profileCardData = [
    {
      label: "Name:",
      value: `${userProfile?.firstName} ${userProfile?.lastName}`,
      icon: <PersonOutline fontSize="medium" />,
    },
    {
      label: "Date of Birth:",
      value: userProfile?.DOB,
      icon: <CalendarMonth fontSize="medium" />,
    },
    {
      label: "Mobile:",
      value: userProfile?.mobile,
      icon: <PhoneEnabled fontSize="medium" />,
    },
    {
      label: "Email:",
      value: userProfile?.email,
      icon: <Email fontSize="medium" />,
    },
    {
      label: "Address:",
      value: userProfile?.address,
      icon: <Home fontSize="medium" />,
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setWait(true);
    const imagesRef = ref(
      firebase.storage,
      `users/profilePic/${firebase.firebaseAuth.currentUser.uid}image.jpg`
    );
    uploadBytes(imagesRef, profilePic)
      .then((result) => {
        getDownloadURL(ref(firebase.storage, result.ref.fullPath)).then(
          (url) => {
            updateProfile(firebase.firebaseAuth.currentUser, {
              photoURL: url,
            }).then(() => {
              setImageurl(url);
              setIsSnackbarOpen(true);
              setAnchorEl1(null);
              setTimeout(() => setWait(false), 1000);
            });
          }
        );
      })
      .catch((err) => console.log(err));
  };

  const handleClick1 = (event) => {
    setAnchorEl1(event.currentTarget);
  };
  const handleClose1 = () => {
    setAnchorEl1(null);
  };

  const handlePersonalInfoSubmit = (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    firebase
      .updateProfileInfo(
        data.get("firstName"),
        data.get("lastName"),
        data.get("DOB"),
        data.get("mobile"),
        data.get("address")
      )
      .then(() => {
        setOpenDialog(false);
        console.log("data updated");
      })
      .catch((err) => console.log(err));
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    setImageurl(firebase.firebaseAuth?.currentUser?.photoURL);
    firebase
      .usersInformation()
      .then((result) => {
        setUserProfile(result.data());
      })
      .catch((err) => console.log(err));
  });

  return (
    <>
      {userProfile === null ? (
        <Stack
          sx={{
            height: "700px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress sx={{ color: "#f50e31" }} />
        </Stack>
      ) : (
        <Box>
          <Box className={classes.profileTabPanel}>
            <Stack>
              <Box sx={{ position: "relative" }}>
                <Box className={classes.profilePicBox}>
                  {imageurl === null? (
                    <AccountCircle sx={{ color: " #0000004a", fontSize: 98 }} />
                  ) : (
                    <Box>
                      <CardMedia component="img" image={imageurl}/>
                    </Box>
                  )}
                </Box>
                <Typography
                  variant="h6"
                  textTransform="capitalize"
                  textAlign="center"
                >
                  {userProfile?.role}
                </Typography>
                <Typography
                  sx={{
                    position: "absolute",
                    cursor: "pointer",
                    bottom: "30px",
                    right: "-10px",
                    color: "red",
                  }}
                >
                  <Tooltip title="Update Profile Pic">
                    <Edit
                      id="basic-button"
                      aria-controls={open1 ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open1 ? "true" : undefined}
                      onClick={handleClick1}
                    />
                  </Tooltip>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl1}
                    elevation={0}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                    open={open1}
                    onClose={handleClose1}
                    className={classes.menu}
                  >
                    {!wait ? (
                      <Stack
                        px={1}
                        gap="10px"
                        component="form"
                        onSubmit={handleSubmit}
                      >
                        <TextField
                          type="file"
                          size="small"
                          onChange={(e) => setProfilePic(e.target.files[0])}
                        />
                        <Button
                          variant="outlined"
                          color="error"
                          sx={{ color: "#f50e31" }}
                          type="submit"
                        >
                          Change
                        </Button>
                      </Stack>
                    ) : (
                      <Stack
                        sx={{
                          width: "300px",
                          height: "80px",
                          borderRadius: "8px",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <CircularProgress sx={{ color: "#f50e31" }} />
                      </Stack>
                    )}
                  </Menu>
                </Typography>
              </Box>
              <Box sx={{ width: "100%" }}></Box>
              {profileCardData.map((item, index) => (
                <Box
                  className={classes.profileCard}
                  sx={{ width: { xs: "100%", sm: "600px" } }}
                  key={index}
                >
                  <Stack>
                    <Typography variant="h5">{item.label}</Typography>
                    <Typography color="#f50e31">{item.icon}</Typography>
                  </Stack>
                  <Stack>
                    <Typography
                      variant="h6"
                      sx={{ fontSize: { xs: "15px", sm: "25px" } }}
                      color="#5b5e5b"
                    >
                      {item.value}
                    </Typography>
                  </Stack>
                </Box>
              ))}
              <Button
                color="error"
                variant="outlined"
                onClick={() => setOpenDialog(true)}
              >
                Update Personal Information{" "}
              </Button>
            </Stack>
          </Box>
          <Dialog
            component="form"
            onSubmit={handlePersonalInfoSubmit}
            open={openDialog}
            onClose={handleCloseDialog}
          >
            <DialogTitle>Edit Personal Information</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                required
                margin="dense"
                id="firstName"
                name="firstName"
                label="First Name"
                type="text"
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                required
                margin="dense"
                id="lastName"
                name="lastName"
                label="Last Name"
                type="text"
                fullWidth
                variant="standard"
              />
              <TextField
                margin="dense"
                id="DOB"
                name="DOB"
                label="Date of Birth"
                type="date"
                placeholder=""
                fullWidth
                focused
                variant="standard"
              />
              <TextField
                autoFocus
                margin="dense"
                id="mobile"
                name="mobile"
                label="Mobile Number"
                type="number"
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                margin="dense"
                id="address"
                name="address"
                label="Address"
                type="text"
                fullWidth
                variant="standard"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} sx={{ color: "black" }}>
                Cancel
              </Button>
              <Button type="submit" sx={{ color: "black" }}>
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
      <Snackbar
     open={isSnackbarOpen}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={3000}
        onClose={() => setIsSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setIsSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}>
            Profile Picture Updated Successfully
          </Alert>
      </Snackbar>
    </>
  );
}
