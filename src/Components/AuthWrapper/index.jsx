import React from 'react'
import { Box, Typography } from '@mui/material';
import logo from "../../Assets/NavBar/logo.png";
import useStyles from "./style";
import useMediaQuery from "@mui/material/useMediaQuery";

const AuthWrapper = (props) => {
    const classes = useStyles();
    const Mobile1 = useMediaQuery("(max-width:860px)");
    return (
        <Box sx={{ width: '100%', height: '100vh', padding: '2%' }}>
            <Box sx={{ width: '100%', height: '100%', boxShadow: "0 9px 5px rgba(0, 0, 0, 0.5)", display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ width: '50%', height: '100%', display: Mobile1 ? "none" : "flex", justifyContent: "center", alignItems: 'center', backgroundColor: 'antiquewhite', overflow: 'scroll' }}>
                    <Box sx={{ py: 5, }}>
                        <Box className={classes.LogoDiv}>
                            <img src={logo} alt="logo" className={classes.NavBarLogo} />
                        </Box>
                        <Box>
                            <Typography className={classes.Siyan}>SIYAN</Typography>
                            <Typography className={classes.Next}>
                                The Next Generation Clothing Mart
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ width: Mobile1 ? "100%" : "50%", height: '100%' }}>
                    {props.children}
                </Box>
            </Box>
        </Box>
    )
}

export default AuthWrapper