import React, { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import useStyle from "./style";

const AboutUs = () => {
  const scrollTopElement = useRef();
  const classes = useStyle();

  useEffect(
    () => scrollTopElement?.current.scrollIntoView({ behavior: "smooth" }),
    []
  );

  return (
    <Box ref={scrollTopElement}>
      <Box sx={{ padding: "30px 5%", marginTop: "2%" }} >
        <Typography
          variant="h3"
          sx={{ textAlign: "center", textDecoration: "underline" }}
        >
          ABOUT US
        </Typography>
        <Typography
          sx={{
            fontSize: "0.9rem",
            fontFamily: "sans-serif",
            marginTop: "40px",
            color: "#3e3e3e",
          }}
        >
          SIYAN is home to a multitude of leading international and national
          brands for apparels catering to the needs of the entire family. We
          aspire to provide our customers a memorable international shopping
          experience. We are one of the largest chain of Clothing stores across
          India.
        </Typography>
        <Typography variant="h5" sx={{ marginTop: "20px" }}>
          Our Vision Is
        </Typography>
        <Typography
          sx={{
            fontSize: "1.1rem",
            fontFamily: "sans-serif",
            marginTop: "10px",
            color: "#3e3e3e",
          }}
        >
          “To be an inspirational and trusted brand, transforming customers'
          lives through fashion and delightful shopping experience every time”
        </Typography>
        <Typography
          sx={{
            fontSize: "0.9rem",
            fontFamily: "sans-serif",
            marginTop: "20px",
            color: "#3e3e3e",
          }}
        >
          We have a team of professional associates who strive endlessly to
          provide the best shopping experience to each of our customers. We have
          adopted a new philosophy of "Start Something New" to give retail a new
          dimension and innovation is our key driver to attain excellence in
          customer service.
        </Typography>
      </Box>
    </Box>
  );
};

export default AboutUs;
