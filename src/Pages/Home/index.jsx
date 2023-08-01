import React, {useEffect, useRef} from "react";
import MainCarousel from "../../Components/main_crousel";
import {
  data1,
  categories_image,
  clothing_types,
  image15,
  image16,
} from "./data.js";
import CardContainer from "../../Components/card";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import useStyle from "./style.js";
import { useFirebase } from "../../Context/Firebase";
import { useNavigate } from "react-router-dom";

function Home() {
  const scrollTopElement=useRef()
  const classes = useStyle();
  const changeOrder = useMediaQuery("(max-width:1076px)");
  const navigate = useNavigate();
  const firebase = useFirebase();
  const products = firebase.product;

  useEffect(()=>{
    scrollTopElement?.current.scrollIntoView({behavior:"smooth"})
  },[])

  return (
    <Box ref={scrollTopElement}>
      <Box sx={{ boxShadow: "0 2px 20px 5px" }}>
        <MainCarousel data={data1} />
      </Box>
      {products.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "500px",
          }}
        >
          <CircularProgress sx={{color:"#f50e31"}}/>
        </Box>
      ) : (
        <Box className={classes.gridcomponent}>
          {products.map((item, index) => (
            <Box key={index}>
              <CardContainer data={item} />
            </Box>
          ))}
        </Box>
      )}
      <Box className={classes.banner}>
        <Box sx={{ padding: "5px" }}>
          <Typography variant="h3">DISCOVER THE </Typography>
          <Typography
            variant="h3"
            sx={{ textShadow: "1px 1px 0px white, -1px -1px 0px white" }}
            color="black"
          >
            PERFECT
          </Typography>
          <Typography variant="h3">BLEND OF STYLE</Typography>
          <Typography
            variant="h3"
            sx={{
              textShadow: "1px 1px 0px white, -1px -1px 0px white",
              color: "black",
            }}
          >
            AND
          </Typography>
          <Typography variant="h3">COMFORT</Typography>
        </Box>
        <Box className={classes.banner_image_div}>
          <CardMedia component="img" image={image16}></CardMedia>
        </Box>
      </Box>
      <Typography variant="h4" padding="20px">
        SHOP BY CATEGORIES
      </Typography>
      <Box className={classes.categories_div}>
        <Card
          onClick={() =>
            navigate("/products", {
              state: { category: "men", subCategory: "all" },
            })
          }
        >
          <CardMedia component="img" image={categories_image.man_image} />
          <Box>
            <Typography variant="h5">Men's Clothing</Typography>
          </Box>
        </Card>
        <Box sx={{ order: changeOrder ? "5" : "0" }}>
          <CardMedia component="img" image={image15} sx={{cursor:"pointer"}} onClick={()=>navigate("/")} />
          <Typography
            variant="h3"
            sx={{ color: "rgb(255, 20, 52)", textAlign: "center" }}
          >
            SIYAN
          </Typography>
        </Box>
        <Card
          onClick={() =>
            navigate("/products", {
              state: { category: "women", subCategory: "all" },
            })
          }
        >
          <CardMedia component="img" image={categories_image.woman_image} />
          <Box>
            <Typography variant="h5">Women's Clothing</Typography>
          </Box>
        </Card>
      </Box>
      <Typography variant="h4" padding="20px">
        MEN'S AND WOMEN'S CLOTHING
      </Typography>
      <Box className={classes.clothingtypes}>
        {clothing_types.map((item, index) => (
          <Card key={index}>
            <CardMedia component="img" image={item.image} />
            <Box
              onClick={() =>
                navigate("/products", {
                  state: {
                    category: item.category,
                    subCategory: item.subCategory,
                  },
                })
              }
            >
              <Typography>{item.text}</Typography>
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default Home;
