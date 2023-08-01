import React, { useEffect } from "react";
import { useState } from "react";
import { Box, Typography, FormControlLabel, Radio, Stack } from "@mui/material";
import useStyle from "../../Components/ProductFilter/style.js";

export default function ProductFilter({ ...props }) {
  const [selectedCategorie, setSelectedCategorie] = useState(
    props.selectedCategory
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");

  const handleChangeCategorie = (event) => {
    setSelectedCategorie(event.target.value);
    props.subCategory(event.target.value);
    props.setIt(event.target.value, props.pp);
  };

  const handleChangePriceRange = (event) => {
    setSelectedPriceRange(event.target.value);
    props.price(event.target.value);
    props.setIt(props.ssc, event.target.value);
  };

  const controlProps1 = (item) => ({
    checked: selectedCategorie === item,
    onChange: handleChangeCategorie,
    value: item,
    name: "categorie",
    inputProps: { "aria-label": item },
  });

  const controlProps2 = (item) => ({
    checked: selectedPriceRange === item,
    onChange: handleChangePriceRange,
    value: item,
    name: "priceRange",
    inputProps: { "aria-label": item },
  });
  const classes = useStyle();

  useEffect(()=>{
    setSelectedCategorie("all");
    setSelectedPriceRange("all");
  },[props.category])

  return (
    <>
      <Box className={classes.filterDiv}>
        <Typography variant="h6">Categories</Typography>
        <Box pl={2}>
          <Box
            sx={{
              fontWeight: "bold",
              textDecoration: "underline",
            }}
          >
            {props.category === "men" ? "Men's" : "Women's"}
          </Box>
          <Stack>
            <FormControlLabel
              value="all"
              control={<Radio {...controlProps1("all")} size="small" />}
              label="Both"
            />
            <FormControlLabel
              value="topwear"
              control={<Radio {...controlProps1("topwear")} size="small" />}
              label="Topwear"
            />
            <FormControlLabel
              value="bottomwear"
              control={<Radio {...controlProps1("bottomwear")} size="small" />}
              label="Bottomwear"
            />
          </Stack>
        </Box>
        <Typography variant="h6" mt={5}>
          Price Range
        </Typography>
        <Stack pl={2}>
          <FormControlLabel
            value="all"
            control={<Radio {...controlProps2("all")} size="small" />}
            label="All"
          />
          <FormControlLabel
            value="lower"
            control={<Radio {...controlProps2("lower")} size="small" />}
            label="Under ₹1000"
          />
          <FormControlLabel
            value="medium"
            control={<Radio {...controlProps2("medium")} size="small" />}
            label="₹1000 - ₹5000"
          />
          <FormControlLabel
            value="higher"
            control={<Radio {...controlProps2("higher")} size="small" />}
            label="₹5000 - ₹10000"
          />
          <FormControlLabel
            value="highest"
            control={<Radio {...controlProps2("highest")} size="small" />}
            label="Above ₹10000"
          />
        </Stack>
      </Box>
    </>
  );
}
