import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Tab,
  Tabs,
  Box,
  Divider,
  useMediaQuery,
} from "@mui/material";
import UserProfile from "../../Components/Profile";
import LoginAndSecurity from "../../Components/LoginAndSecurity";
import AddProduct from "../../Components/AddProducts";
import useStyle from "./style.js";
import ManageOrders from "../../Components/ManageOrders";



function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: { xs: 0, md: 3 } }}>{children}</Box>}
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



export default function AdminDashboard() {
  const classes = useStyle();
  const mediumViewport = useMediaQuery("(max-width:899px)");
  const [value, setValue] = useState(0);
  

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(()=>{
    window.scrollTo(0, 20);
  },[])
 
  return (
    <>
      <Box sx={{ flexGrow: 1, display: { xs: "block", md: "flex" } }}>
        <Tabs
          className={classes.tabStyle}
          orientation={mediumViewport ? "horizontal" : "vertical"}
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{
            width: { xs: "100%", md: "300px" },
          }}
          TabIndicatorProps={{style: {background:'#f50e31', color:"red !important"}}}
        >
          <Tab className="Prince" label="Profile" {...a11yProps(0)} />
          <Tab label="Login & Security" {...a11yProps(1)} />
          <Tab label="Add Product" {...a11yProps(2)} />
          <Tab label="Manage Orders" {...a11yProps(2)} />
        </Tabs>
        <Box width="100%">
          <TabPanel value={value} index={0}>
            <UserProfile />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <LoginAndSecurity />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <AddProduct />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <ManageOrders/>
          </TabPanel>
        </Box>
      </Box>
      <Divider />
    </>
  );
}
