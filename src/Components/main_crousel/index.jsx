import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper";
import { Box, Typography } from "@mui/material";
import useStyles from "./style.js";
import { useNavigate } from "react-router-dom";

export default function MainCarousel({ ...props }) {
  const classes = useStyles();
  const navigate = useNavigate();
  return (
    <Box>
      <Swiper
        style={{
          "--swiper-pagination-color": "#fff",
          "--swiper-navigation-color": "#fff",
          "--swiper-navigation-size": "30px",
        }}
        navigation={true}
        loop={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Navigation, Autoplay, Pagination]}
        centeredSlides={true}
        className="mySwiper"
      >
        {props.data.map((item, index) => (
          <SwiperSlide key={index}>
            <Box className={classes.swiperslide_inner_box}>
              <img src={item.image_src} alt="fashion_image" />
              <Box
                className={classes.slider_text_box}
                sx={{ paddingLeft: { sm: "5px", xs: "30px" } }}
              >
                <Typography
                  variant="h3"
                  fontFamily="palmatonfont"
                  fontWeight={700}
                  sx={{
                    fontSize: {
                      sm: 50,
                      xs: 0,
                    },
                  }}
                >
                  {item.brand_name}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: {
                      sm: 30,
                      xs: 0,
                    },
                  }}
                >
                  {item.offer1}
                </Typography>
                <Typography
                  sx={{
                    fontSize: {
                      sm: 18,
                      xs: 0,
                    },
                  }}
                >
                  {item.offer2}
                </Typography>
                <Typography
                  variant="h6"
                  onClick={() =>
                    navigate("/products", {
                      state: { category: "men", subCategory: "all" },
                    })
                  }
                >
                  see more
                </Typography>
              </Box>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
