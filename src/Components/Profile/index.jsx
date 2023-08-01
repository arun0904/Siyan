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

export default function UserProfile() {
  const classes = useStyle();
  const firebase = useFirebase();
  const [profilePic, setProfilePic] = useState(null);
  const [imageurl, setImageurl] = useState(firebase.firebaseAuth?.currentUser?.photoURL);
  const [userProfile, setUserProfile] = useState(null);
  const [anchorEl1, setAnchorEl1] = useState(null);
  const open1 = Boolean(anchorEl1);
  const [openDialog, setOpenDialog] = useState(false);

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
    firebase.updateProfilePic(profilePic);

    // const imagesRef = ref(
    //   storage,
    //   `users/profilePic/${userDisplayName}image.jpg`
    // );
    // uploadBytes(imagesRef, profilePic)
    //   .then((result) => {
    //     getDownloadURL(ref(storage, result.ref.fullPath)).then((url) => {
    //       updateProfile(firebaseAuth.currentUser, {
    //         photoURL: url,
    //       }).then(()=>{});
    //     });

    //     const docRef = doc(db, "users", firebaseAuth?.currentUser?.uid);
    //     updateDoc(docRef, { profilePicPath: result.ref.fullPath })
    //       .then(() => {})
    //       .catch(() => console.log("no"));
    //   })
    //   .catch((err) => console.log(err));
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
                  {imageurl === null ? (
                    <AccountCircle sx={{ color: " #0000004a", fontSize: 80 }} />
                  ) : (
                    <Box>
                      <CardMedia component="img" image={imageurl} />
                    </Box>
                  )}
                </Box>
                <Typography variant="h6" textTransform="capitalize" textAlign="center">
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
                    open={open1}
                    onClose={handleClose1}
                  >
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
    </>
  );
}
