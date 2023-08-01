import React, { useEffect, useState, useRef } from "react";
import {
  AppBar,
  Alert,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  Tooltip,
  MenuItem,
  Snackbar,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import useStyles from "./style";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FavoriteBorderTwoToneIcon from "@mui/icons-material/FavoriteBorderTwoTone";
import logo from "../../Assets/NavBar/logo.png";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../../Context/Firebase";

const pages = [
  { label: "Home", nav: "/" },
  { label: "About", nav: "/about" },
  { label: "Men", nav: "/products", data: "men" },
  { label: "Women", nav: "/products", data: "women" },
];

function NavBar() {
  const scrollTopElement=useRef()
  const classes = useStyles();
  const firebase = useFirebase();
  const Mobile = useMediaQuery("(max-width:500px)");
  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsSnackbarOpen(false);
  };

  useEffect(() => {
    setIsSnackbarOpen(!isSnackbarOpen);
    scrollTopElement?.current.scrollIntoView({behavior:"smooth"})
  }, [localStorage.getItem("user")]);

  return (
    <Box ref={scrollTopElement}>
      <AppBar position="sticky" className={classes.navBarBackGround} >
        <Container maxWidth="xl" className={classes.navBarBackGround}>
          <Toolbar
            disableGutters
            sx={{ justifyContent: { xs: "space-between", md: "none" } }}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "contents", md: "none" },
                justifyContent: "Right",
              }}
            >
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => {
                      navigate(page.nav, {
                        state: { category: page.data, subCategory: "all" },
                      });
                      handleCloseNavMenu();
                    }}
                  >
                    <Typography textAlign="center">{page.label}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Box className={classes.LogoDiv}>
              <Box
                sx={{
                  width: Mobile ? "50px" : "80px",
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  cursor: "pointer",
                }}
                onClick={() => {
                  navigate("/");
                }}
              >
                <img src={logo} alt="logo" className={classes.NavBarLogo} />
              </Box>
              <Box
                sx={{
                  display: Mobile ? "none" : "flex",
                  margin: "0 5%",
                  padding: "3% 0",
                }}
              >
                <hr className={classes.hr1} />
              </Box>
              <Box sx={{ display: Mobile ? "none" : "block" }}>
                <Typography className={classes.Siyan}>SIYAN</Typography>
                <Typography className={classes.Next}>
                  The Next Generation Clothing Mart
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "Right",
              }}
            >
              <Box
                sx={{ display: { xs: "none", md: "flex" }, marginRight: "4%" }}
              >
                {pages.map((page, index) => (
                  <Button
                    key={index}
                    onClick={() =>
                      navigate(page.nav, {
                        state: { category: page.data, subCategory: "all" },
                      })
                    }
                    sx={{
                      my: 2,
                      color: "black",
                      display: "block",
                      fontSize: "1rem",
                      fontFamily: "monospace",
                      margin: "0 8px",
                    }}
                  >
                    {page.label}
                  </Button>
                ))}
              </Box>
              <Box>
                <Tooltip title="Dashboard">
                  <AccountCircleSharpIcon
                    className={classes.SignInLogo}
                    onClick={handleOpenUserMenu}
                  />
                </Tooltip>

                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem
                    onClick={() => {
                      navigate("/dashboard");
                      handleCloseUserMenu();
                    }}
                  >
                    <Typography textAlign="center">Dashboard</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      localStorage.getItem("user")
                        ? firebase.logOut()
                        : navigate("/signin");
                      handleCloseUserMenu();
                    }}
                  >
                    <Typography textAlign="center">
                      {localStorage.getItem("user") ? "LogOut" : "LogIn"}
                    </Typography>
                  </MenuItem>
                </Menu>
              </Box>

              <Tooltip title="Wishlist">
                <FavoriteBorderTwoToneIcon
                  className={classes.SignInLogo}
                  onClick={() => navigate("/wishlist")}
                />
              </Tooltip>
              <Tooltip title="Cart">
                <ShoppingBagOutlinedIcon
                  className={classes.SignInLogo}
                  onClick={() => navigate("/cart")}
                />
              </Tooltip>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={isSnackbarOpen}
        autoHideDuration={2000}
        variant="success"
        onClose={handleClose}
        message="Login Successful !"
      >
        <Alert
          severity={localStorage.getItem("user") ? "success" : "warning"}
          sx={{ width: "100%" }}
        >
          {localStorage.getItem("user") ? `Welcome` : "Logout"}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default NavBar;
