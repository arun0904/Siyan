import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Divider,
  Pagination,
  Stack,
  CircularProgress,
  Drawer,
} from "@mui/material";

import useStyle from "./style.js";
import ProductFilter from "../../Components/ProductFilter/index.jsx";
import CardContainer from "../../Components/card";
import { useFirebase } from "../../Context/Firebase.jsx";
import { useLocation } from "react-router-dom";
import { Sort } from "@mui/icons-material";

export default function Products() {
  const scrollTopElement = useRef();
  const classes = useStyle();
  const firebase = useFirebase();
  const location = useLocation();
  const data = firebase?.product;
  const [subCategory, setSubCategory] = useState(location.state.subCategory);
  const [price, setPrice] = useState("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [product, setProduct] = useState();

  const myFilter = (item, subcate, prices) => {
    if (
      item.category === location.state.category &&
      (item.subCategory === subcate || subcate === "all")
    ) {
      switch (prices) {
        case "lower":
          {
            if (item.price < 1000) {
              return true;
            }
          }
          break;
        case "medium":
          {
            if (item.price >= 1000 && item.price < 5000) {
              return true;
            }
          }
          break;
        case "higher":
          {
            if (item.price >= 5000 && item.price < 10000) {
              return true;
            }
          }
          break;
        case "highest":
          {
            if (item.price >= 10000) {
              return true;
            }
          }
          break;
        default:
          return true;
      }
    } else return false;
  };

  const setData = (subccc, pri) => {
    setProduct(() => data.filter((item) => myFilter(item, subccc, pri)));
  };

  useEffect(() => {
    setData(location.state.subCategory, "all");
    window.addEventListener("resize", () => setDrawerOpen(false));
    scrollTopElement?.current.scrollIntoView({ behavior: "smooth" });
  }, [location.state.category, firebase.product]);
  return (
    <Box ref={scrollTopElement}>
      {data.length === 0 ? (
        <Box className={classes.CircularProgressBox}>
          {" "}
          <CircularProgress sx={{ color: "#f50e31" }} />{" "}
        </Box>
      ) : (
        <Box>
          <Typography
            variant="h4"
            sx={{ fontSize: "1.8rem", padding: "10px 20px" }}
          >
            {location?.state.category === "men" ? "Men's" : "Women's"} Clothing
          </Typography>
          <Divider />
          <Box sx={{ display: { xs: "block", sm: "none" } }}>
            <Stack
              justifyContent="center"
              alignItems="center"
              width="77px"
              height="35px"
              onClick={() => setDrawerOpen(true)}
              color="#f65d5d"
            >
              <Sort />
            </Stack>
          </Box>
          <Stack flexDirection="row">
            <Box
              sx={{
                width: "300px",
                backgroundColor: "black",
                display: { xs: "none", sm: "block" },
              }}
            >
              <ProductFilter
                price={setPrice}
                selectedCategory={location.state.subCategory}
                subCategory={setSubCategory}
                category={location.state.category}
                ssc={subCategory}
                pp={price}
                setIt={setData}
              />
            </Box>
            <Box width="100%">
              {product?.length===0?<Stack justifyContent="center" height="100%" alignItems="center">
                <Typography variant="h5" color="#f50e31">Sorry No Item Available !</Typography>
              </Stack>:
            <Box className={classes.productGridDiv} py={2}>
              {product?.map((item, index) => (
                <CardContainer key={index} data={item} />
              ))}
            </Box>}
            </Box>
          </Stack>
          <Divider />
          <Stack alignItems="center" pt={2}>
            {/* <Pagination size="large" count={10} /> */}
          </Stack>

          <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
            <Box backgroundColor="black" height="100%">
              <ProductFilter
                price={setPrice}
                selectedCategory={location.state.subCategory}
                subCategory={setSubCategory}
                category={location.state.category}
                ssc={subCategory}
                pp={price}
                setIt={setData}
              />
            </Box>
          </Drawer>
        </Box>
      )}
    </Box>
  );
}
