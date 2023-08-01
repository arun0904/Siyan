import React, { useState, useEffect } from "react";
import {
  CardContent,
  CardMedia,
  Typography,
  Button,
  Card,
  Box,
  IconButton,
  Skeleton,
  Snackbar,
  Alert,
  Stack,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import useStyle from "./style.js";
import { Favorite } from "@mui/icons-material";
import { doc, setDoc } from "firebase/firestore";
import { useFirebase } from "../../Context/Firebase.jsx";
import { useNavigate } from "react-router-dom";

export default function CardContainer({ ...props }) {
  const classes = useStyle();
  const firebase = useFirebase();
  const navigate = useNavigate();
  const [wishlistAdd, setWishlistAdd] = useState(false);
  const [sizeObject, setSizeObject] = useState(null);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  const handleWishlistAdd = () => {
    if (localStorage.getItem("user")) {
      if (wishlistAdd === true) {
        firebase
          .removeElementOfArray("wishlist", {
            id: props.data.id,
            price: props.data.price,
            size: sizeObject.itemSize,
            color: sizeObject.color,
          })
          .then(async () => {
            setWishlistAdd(!wishlistAdd);
            setAlertMessage("Item is Removed Successfully From Your Wishlist");
            setIsSnackbarOpen(true);
          });
      } else {
        firebase.addElementOfArray("wishlist", {
          id: props.data.id,
          price: props.data.price,
          size: sizeObject.itemSize,
          color: sizeObject.color,
        });
        setWishlistAdd(!wishlistAdd);
        setAlertMessage("Item is Added Successfully To Your Wishlist");
        setIsSnackbarOpen(true);
      }
    } else {
      setAlertMessage("Please LogIn To Add Items In Your Wishlist");
      setIsSnackbarOpen(true);
    }
  };

  const handleCartAdd = async () => {
    if (localStorage.getItem("user")) {
      await setDoc(
        doc(
          firebase.db,
          "users",
          firebase.userAccountInfo.uid,
          "cart",
          `${props.data.id}${sizeObject.itemSize}${sizeObject.color}`
        ),
        {
          id: props.data.id,
          size: sizeObject.itemSize,
          color: sizeObject.color,
          price: props.data.price,
          quantity: 1,
          imgUrl: sizeObject.imageSrc,
        }
      )
        .then(() => {
          setAlertMessage("Item is Added Successfully To The Cart");
          setIsSnackbarOpen(true);
        })
        .catch((err) => console.log(err));
    } else {
      setAlertMessage("Please LogIn To Add Items In Cart");
      setIsSnackbarOpen(true);
    }
  };

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
            getWishlist(key, obj.color);
          })
          .catch((err) => {
            console.log(err);
          });
        break;
      }
    }
  };

  const getWishlist = async (size, color) => {
    if (localStorage.getItem("user")) {
      await firebase
        ?.usersInformation()
        .then((result) => {
          result.data().wishlist.map((items, index) => {
            if (
              items.id === props.data.id &&
              items.size === size &&
              items.color === color
            ) {
              return setWishlistAdd(true);
            }
          });
        })
        .catch((error) => console.log(error));
    } else {
      return setWishlistAdd(false);
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
              sx={{ margin: "10px", width: "250px", aspectRatio: "1/1.2" }}
              height={"100%"}
            />
          ) : (
            <Box>
              <CardMedia component="img" image={sizeObject?.imageSrc} />
              <IconButton
                size="large"
                className={classes.wishlistIcon}
                onClick={() => handleWishlistAdd()}
              >
                <FavoriteBorderIcon
                  fontSize="inherit"
                  sx={{ display: wishlistAdd ? "none" : "inline-block" }}
                />
                <Favorite
                  fontSize="inherit"
                  sx={{ display: wishlistAdd ? "inline=block" : "none" }}
                />
              </IconButton>
            </Box>
          )}
        </Box>
        {sizeObject === null ? (
          <Box m={1}>
            <Skeleton variant="text" sx={{ fontSize: "2rem" }} />
            <Skeleton
              variant="rectangular"
              width={"100%"}
              sx={{ margin: "10px 0" }}
              height={60}
            />
            <Skeleton variant="text" sx={{ fontSize: "2rem" }} />
            <Skeleton variant="rounded" width={"100%"} height={60} />
          </Box>
        ) : (
          <CardContent
            py={0}
            sx={{
              padding: "0 10px",
              "&:last-child": {
                paddingBottom: "10px",
              },
            }}
          >
            <Typography
              variant="h5"
              sx={{ height: "30px", overflow: "hidden" }}
            >
              {props.data.title}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{ height: "33px", lineHeight: "1.2", overflow: "hidden" }}
            >
              {props.data.description}
            </Typography>
            <Typography fontSize="24px">Price ₹ {props.data.price} </Typography>
            <Box display="flex" alignItems="baseline">
              <Typography variant="h6">MRP:&nbsp;</Typography>{" "}
              <Typography sx={{ textDecoration: "line-through" }}>
                {" "}
                ₹{props.data.mrp}
              </Typography>
              <Typography width="250px" color="red">
                &ensp;({props.data.discount}% off)
              </Typography>
            </Box>

            <Typography
              variant="h6"
              color={parseInt(sizeObject?.quantity) > 2 ? "green" : "red"}
            >
              {sizeObject?.quantity > 2
                ? "Available"
                : `Only ${sizeObject?.quantity} remaining`}
            </Typography>

            <Stack gap={2}>
              <Button
                variant="contained"
                sx={{ backgroundColor: "rgb(255,52,20) !important " }}
                onClick={() => handleCartAdd()}
              >
                Add to cart
              </Button>
              <Button
                variant="contained"
                onClick={() =>
                  navigate("/productdetail", {
                    state: { ...props.data, ...sizeObject },
                  })
                }
              >
                View Details
              </Button>
            </Stack>
          </CardContent>
        )}
      </Card>
      <Snackbar
        open={isSnackbarOpen}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={3000}
        onClose={() => setIsSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setIsSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
