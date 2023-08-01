import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Tabs,
  Tab,
  Box,
  Divider,
  Stack,
  useMediaQuery
} from "@mui/material";
import LoginAndSecurity from "../../Components/LoginAndSecurity";
import UserProfile from "../../Components/Profile";
import UserOrder from "../../Components/userOrder";
import useStyle from "./style";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      width="100%"
    >
      {value === index && (
        <Box sx={{ minHeight: "550px" }}>{children}</Box>
      )}
    </Box>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}


const steps = ["Order Placed", "Confirmed", "Dispatch", "Arrived", "Delivered"];

export default function UserDashboard() {
  const classes=useStyle();
  const [value, setValue] = useState(0);
  const mediumViewport = useMediaQuery("(max-width:650px)");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, display: mediumViewport?"block":"flex" }}>
        <Tabs
          className={classes.tabStyle}
          orientation={mediumViewport ? "horizontal" : "vertical"}
          variant="scrollable"
          value={value}
          onChange={handleChange}
         
          aria-label="Vertical tabs example"
          sx={{
            minWidth:"170px",
          }}
          TabIndicatorProps={{style:{background:"#f50e31"}}}
        >
          <Tab label="Profile" {...a11yProps(0)} />
          <Tab label="Your Orders" {...a11yProps(1)} sx={{whiteSpace:"nowrap"}}/>
          <Tab label="Login & Security" {...a11yProps(2)} sx={{whiteSpace:"nowrap"}}/>
        </Tabs>
        <Stack width="100%"> 
        <TabPanel value={value} width="100%" index={0}>
          <UserProfile />
        </TabPanel>

        <TabPanel value={value} index={1} >
          <UserOrder />
        </TabPanel>

        <TabPanel value={value} width="100%" index={2}>
          <LoginAndSecurity />
        </TabPanel>
        </Stack>
      </Box>
      <Divider />
    </>
  );
}
