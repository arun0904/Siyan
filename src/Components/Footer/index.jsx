import React from "react";
import { Container, Typography, Link, Grid, Box } from "@mui/material";
import { Facebook, Instagram, Twitter } from "@mui/icons-material";
import logo from "../../Assets/NavBar/logo.png";
import useStyles from "./style";
import { useNavigate } from "react-router-dom";

function Footer() {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <Box
      component="footer"
      sx={{
        marginTop: "2%",
        backgroundColor: "Black",
        p: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            sm={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "30px",
            }}
          >
            <Box>
              <Box className={classes.LogoDiv} onClick={()=>navigate("/")}>
                <img src={logo} alt="logo" className={classes.NavBarLogo} />
              </Box>
              <Box>
                <Typography className={classes.Siyan}>SIYAN</Typography>
                <Typography className={classes.Next}>
                  The Next Generation Clothing Mart
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
            sx={{ textAlign: { xs: "center", md: "left" }, padding: "20px 0" }}
          >
            <Typography
              variant="h6"
              color="White"
              gutterBottom
              sx={{ cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              Home
            </Typography>
            <Typography
              variant="h6"
              color="White"
              gutterBottom
              sx={{ cursor: "pointer" }}
              onClick={() => navigate("/about")}
            >
              About Us
            </Typography>
            <Typography
              variant="h6"
              color="White"
              gutterBottom
              sx={{ cursor: "pointer" }}
              onClick={() =>
                navigate("/products", {
                  state: { category: "men", subCategory: "all" },
                })
              }
            >
              Men's
            </Typography>
            <Typography
              variant="h6"
              color="White"
              gutterBottom
              sx={{ cursor: "pointer" }}
              onClick={() =>
                navigate("/products", {
                  state: { category: "women", subCategory: "all" },
                })
              }
            >
              Women's
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
            sx={{
              textAlign: { xs: "center", md: "center", padding: "20px 0" },
            }}
          >
            <Typography variant="h6" color="White" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" color="White">
              123 Main Street, Anytown, USA
            </Typography>
            <Typography variant="body2" color="White">
              Email: info@example.com
            </Typography>
            <Typography variant="body2" color="White">
              Phone: +1 234 567 8901
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
            sx={{ textAlign: { xs: "center", md: "right", padding: "20px 0" } }}
          >
            <Typography variant="h6" color="White" gutterBottom>
              Follow Us
            </Typography>
            <Link href="https://www.facebook.com/" color="#fff">
              <Facebook />
            </Link>
            <Link
              href="https://www.instagram.com/"
              color="#fff"
              sx={{ pl: 1, pr: 1 }}
            >
              <Instagram />
            </Link>
            <Link href="https://www.twitter.com/" color="#fff">
              <Twitter />
            </Link>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Typography variant="body2" color="White" align="center">
            {"Copyright © "}
            <Link color="#fff" href="https://your-website.com/">
              Your Website
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
