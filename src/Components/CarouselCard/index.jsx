import React, { useState, useEffect } from "react";
import { CardMedia, Typography, Card, Box, Skeleton } from "@mui/material";
import useStyle from "./style.js";
import { useFirebase } from "../../Context/Firebase.jsx";
import { useNavigate } from "react-router-dom";

export default function CarouselCardContainer({ ...props }) {
  const classes = useStyle();
  const firebase = useFirebase();
  const navigate = useNavigate();
  const [sizeObject, setSizeObject] = useState(null);

  const autoSelectSize = async () => {
    for (const key in props?.data?.size) {
      if (props?.data?.size[key]?.length !== 0) {
        firebase
          .getImage(props?.data?.size[key][0]?.imgSrc)
          .then((url) => {
            const obj = {
              itemSize: key,
              color: props?.data?.size[key][0]?.color,
              imageSrc: url,
              quantity: props?.data?.size[key][0]?.quantity,
            };
            setSizeObject(obj);
          })
          .catch((err) => {
            console.log(err);
          });
        break;
      }
    }
  };

  useEffect(() => {
    autoSelectSize();
  }, [props.data, localStorage.getItem("user")]);
  return (
    <>
      <Card className={classes.card_wrapper}>
        <Box>
          {sizeObject === null ? (
            <Skeleton
              variant="rectangular"
              sx={{margin:"5px 5px 0 5px"}}
              height={"150px"}
            />
          ) : (
            <Box>
              <CardMedia component="img"  image={sizeObject?.imageSrc} />
            </Box>
          )}
        </Box>
        { sizeObject === null? (
          <Box m={1}>
            <Skeleton variant="text" sx={{ fontSize: "2.2rem" }} />
            <Skeleton variant="text" sx={{ fontSize: "2.5rem" }} />
            <Skeleton variant="rounded" width={"100%"} height={20} />
          </Box>
        ) : (
          <Box sx={{ padding: "0 10px 4px 10px" }}>
            <Typography
              variant="h6"
              sx={{ height: "25px", overflow: "hidden", cursor: "pointer" }}
            >
              {props.data.title}
            </Typography>

            <Typography variant="body1" pt={0.5}>
              Price ₹ {props.data.price}{" "}
            </Typography>
            <Box display="flex" alignItems="flex-end">
              <Typography variant="body1">MRP:&nbsp;</Typography>{" "}
              <Typography variant="caption" sx={{ textDecoration: "line-through" }}>
                {" "}
                ₹{props.data.mrp}
              </Typography>
              <Typography variant="caption" fontSize="0.8rem" width="250px" color="red">
                &ensp;({props.data.discount}% off)
              </Typography>
            </Box>

            <Typography
              variant="body1"
              color={parseInt(sizeObject?.quantity) > 2 ? "green" : "red"}
            >
              {sizeObject?.quantity > 2
                ? "Available"
                : `Only ${sizeObject?.quantity} remaining`}
            </Typography>
            <Typography
              variant="body2"
              className={classes.DetailsLink}
              onClick={() =>
                navigate("/productdetail", {
                  state: { ...props.data, ...sizeObject },
                })
              }
            >
              Details
            </Typography>
          </Box>
        )}
      </Card>
    </>
  );
}
