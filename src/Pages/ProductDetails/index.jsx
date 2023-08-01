import React, { useState, useEffect, useRef } from "react";
import { image16 } from "../Home/data.js";
import { useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import {
  Box,
  Button,
  CardMedia,
  Divider,
  Stack,
  Typography,
  CircularProgress,
  Skeleton,
  Snackbar,
  Alert,
} from "@mui/material";
import { AddShoppingCart, FavoriteRounded } from "@mui/icons-material";
import useStyle from "./style";
import CardContainer from "../../Components/card";
import CarouselCardContainer from "../../Components/CarouselCard";
import { useFirebase } from "../../Context/Firebase";
import {
  onSnapshot,
  query,
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

const sizeArray = ["xs", "s", "m", "l", "xl", "xxl"];

const ProductDetails = () => {
  const classes = useStyle();
  const location = useLocation();
  const data = location.state;
  const firebase = useFirebase();
  const scrollTopElement = useRef();
  const [image, setImage] = useState(data.imageSrc);
  const [size, setSize] = useState(data.itemSize);
  const [products, setProducts] = useState(null);
  const [colorImages, setColorImages] = useState([]);
  const [quantity, setQuantity] = useState(data.quantity);
  const [color, setColor] = useState(data.color);
  const [wishlistItem, setWishlistItem] = useState(null);
  const [cartItem, setCartItem] = useState(null);
  const [cartAdd, setCartAdd] = useState(false);
  const [wishlistAdd, setWishlistAdd] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const getProducts = async () => {
    let arr = [];
    const querySnapshot = await getDocs(collection(firebase.db, "products"));
    querySnapshot.forEach((doc) => {
      arr.push(doc.data());
    });
    setProducts(arr);
    setImage(data.imageSrc);
    handleSize(data.itemSize, data.imageSrc);
    setQuantity(data.quantity);
    if (localStorage.getItem("user")) {
      getWishlist(data.itemSize, data.color);
      getCart();
    }
  };

  const getWishlist = async (size, color) => {
    if (localStorage.getItem("user")) {
      await firebase
        ?.usersInformation()
        .then((result) => {
          if (result.data().wishlist === undefined) {
            setWishlistItem([]);
          } else {
            setWishlistItem(result.data().wishlist);
            result.data().wishlist.map((items, index) => {
              if (
                items.id === data.id &&
                items.size === size &&
                items.color === color
              ) {
                return setWishlistAdd(true);
              }
            });
          }
        })
        .catch((error) => console.log(error));
    } else {
      return setWishlistAdd(false);
    }
  };

  const getCart = async () => {
    if (localStorage.getItem("user")) {
      await firebase
        ?.usersInformation()
        .then((result) => {
          const q = query(collection(firebase?.db, "users", result.id, "cart"));
          onSnapshot(q, (querySnapshot) => {
            let cartData = [];
            querySnapshot?.forEach((doc) => {
              cartData.push(doc.id);
            });
            setCartItem(cartData);
            cartData.map((item, index) =>
              item === `${data.id}${size}${color}` ? setCartAdd(true) : null
            );
          });
        })
        .catch((error) => console.log(error));
    } else {
      return setCartAdd(false);
    }
  };

  const handleWishlistAdd = () => {
    if (localStorage.getItem("user")) {
      if (wishlistAdd === true) {
        firebase
          .removeElementOfArray("wishlist", {
            id: data.id,
            price: data.price,
            size: size,
            color: color,
          })
          .then(() => {
            getWishlist(size, color);
            setWishlistAdd(!wishlistAdd);
            setAlertMessage("Item is Removed Successfully From Your Wishlist");
            setIsSnackbarOpen(true);
          });
      } else {
        firebase
          .addElementOfArray("wishlist", {
            id: data.id,
            price: data.price,
            size: size,
            color: color,
          })
          .then(() => {
            getWishlist(size, color);
            setWishlistAdd(!wishlistAdd);
            setAlertMessage("Item is Added Successfully To Your Wishlist");
            setIsSnackbarOpen(true);
          });
      }
    } else {
      setAlertMessage("Please LogIn To Add Items In Your Wishlist");
      setIsSnackbarOpen(true);
    }
  };

  const handleCartAddRemove = async () => {
    if (localStorage.getItem("user")) {
      cartAdd
        ? await deleteDoc(
            doc(
              firebase.db,
              "users",
              firebase?.userAccountInfo.uid,
              "cart",
              `${data.id}${size}${color}`
            )
          )
            .then(() => {
              setCartAdd(false);
              setAlertMessage("Item Removed Successfully From Your Cart");
              setIsSnackbarOpen(true);
            })
            .catch((err) => console.log(err))
        : await setDoc(
            doc(
              firebase.db,
              "users",
              firebase.userAccountInfo.uid,
              "cart",
              `${data.id}${size}${color}`
            ),
            {
              id: data.id,
              size: size,
              color: color,
              price: data.price,
              quantity: 1,
              imgUrl: image,
            }
          )
            .then(() => {
              setCartAdd(true);
              setAlertMessage("Item Successfully Added In Your Cart");
              setIsSnackbarOpen(true);
            })
            .catch((err) => console.log(err));
    } else {
      setCartAdd(false);
      setAlertMessage("Please LogIn To Add Item In Your Cart");
      setIsSnackbarOpen(true);
    }
  };

  const handleSize = async (size, selectedImage) => {
    setWishlistAdd(false);
    setCartAdd(false);
    setColorImages([]);
    Promise.all(
      data.size[size]?.map(
        async (item, index) => await firebase.getImage(item.imgSrc)
      )
    )
      .then((result) => {
        setColorImages(result);

        selectedImage ? setImage(data.imageSrc) : setImage(result[0]);

        setQuantity(data.size[size][0].quantity);
        setColor(data.size[size][0].color);
        wishlistItem?.map((items, index) => {
          if (
            items.id === data.id &&
            items.size === size &&
            items.color === data.size[size][0].color
          ) {
            return setWishlistAdd(true);
          }
        });

        cartItem?.map((item, index) =>
          item === `${data.id}${size}${data.size[size][0].color}`
            ? setCartAdd(true)
            : null
        );
      })
      .catch((err) => console.log(err));
    setSize(size);
  };

  const handleImage = (colorImage, index) => {
    setWishlistAdd(false);
    setCartAdd(false);
    setImage(colorImage);
    setQuantity(data.size[size][index].quantity);
    setColor(data.size[size][index].color);
    wishlistItem.map((items, ind) => {
      if (
        items.id === data.id &&
        items.size === size &&
        items.color === data?.size[size][index]?.color
      ) {
        return setWishlistAdd(true);
      }
    });
    cartItem.map((item, ind) =>
      item === `${data.id}${size}${data.size[size][index].color}`
        ? setCartAdd(true)
        : null
    );
  };

  useEffect(() => {
    getProducts();
    scrollTopElement?.current.scrollIntoView({ behavior: "smooth" });
  }, [location.state]);
  return (
    <Box ref={scrollTopElement}>
      <Box className={classes.mainBox}>
        <Box
          className={classes.imageBox}
          sx={{ display: { xs: "none", sm: "block" } }}
        >
          <CardMedia
            height={"500px"}
            sx={{ aspectRatio: "1" }}
            component="img"
            image={image}
          />
        </Box>
        <Stack p={1}>
          <Typography variant="h6" className={classes.collectionText}>
            {data.category} Collection
          </Typography>
          <Typography variant="h4" className={classes.titleText}>
            {data.title}
          </Typography>
          <Box
            className={classes.imageBox}
            p={0}
            sx={{ display: { xs: "block", sm: "none" } }}
          >
            <CardMedia component="img" image={image} />
          </Box>
          <Stack>
            <Box className={classes.priceBox}>
              <Typography
                className={classes.mrpText}
              >{`₹ ${data.mrp}`}</Typography>
              <Typography color="red">
                {" "}
                &emsp;{` (${data.discount}% OFF)`}
              </Typography>
            </Box>
            <Typography variant="h4">{`₹ ${data.price}`}</Typography>
          </Stack>

          <Box>
            <Typography variant="h6" className={classes.selectSizeText}>
              COLOR
            </Typography>
            <Box className={classes.colorBoxContainer}>
              {colorImages.length === 0 ? (
                <Stack>
                  <Box>
                    <Skeleton variant="rounded" width="100%" height="100%" />
                  </Box>
                  <Skeleton variant="text" sx={{ fontSize: "1.2rem" }} />
                </Stack>
              ) : (
                colorImages.map((item, index) => (
                  <Stack key={index}>
                    <Box
                      onClick={() => handleImage(item, index)}
                      border={
                        item === image ? "3px solid #F50E31 !important" : null
                      }
                    >
                      <CardMedia component="img" image={item} />
                    </Box>
                    <Typography
                      variant="subtitle2"
                      textAlign="center"
                      textTransform="capitalize"
                    >
                      {data?.size[size][index]?.color}
                    </Typography>
                  </Stack>
                ))
              )}
            </Box>
          </Box>
          <Stack>
            <Typography variant="h6" className={classes.selectSizeText}>
              SELECT SIZE
            </Typography>
            <Box className={classes.sizeBoxContainer}>
              {sizeArray.map((item, index) => (
                <Button
                  key={index}
                  sx={{
                    backgroundColor: item === size ? "#F50E31" : "#eeeded",
                  }}
                  disabled={
                    data.size[item]?.length === 0 ||
                    data.size[item] === undefined
                      ? true
                      : false
                  }
                  onClick={() => handleSize(item)}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      textTransform: "uppercase",
                      color:
                        data.size[item]?.length === 0 ||
                        data.size[item] === undefined
                          ? "#cbc4c4"
                          : "black",
                    }}
                  >
                    {item}
                  </Typography>
                </Button>
              ))}
            </Box>
          </Stack>
          <Typography variant="h4" color={quantity > 3 ? "green" : "red"}>
            {quantity > 3 ? "In Stock" : `Only ${quantity} left`}
          </Typography>
          <Box className={classes.wishlistButtonBox}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: wishlistAdd ? "#F50E31 !important" : null,
                width: { xs: "100% !important", sm: "180px !important" },
              }}
              onClick={() => handleWishlistAdd()}
            >
              <FavoriteRounded />
              &emsp; WISHLIST
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: cartAdd ? "#F50E31 !important" : null,
                width: { xs: "100% !important", sm: "180px !important" },
              }}
              onClick={() => handleCartAddRemove()}
            >
              <AddShoppingCart />
              &emsp; ADD TO CART
            </Button>
          </Box>
        </Stack>
      </Box>
      <Box width="100%" p={2}>
        <Typography variant="h6" fontWeight={700}>
          Product Description:
        </Typography>
        <Typography variant="body2">{data.description}</Typography>
      </Box>
      <Divider />
      <Box p={4}>
        <Typography variant="h4" textTransform="uppercase">{`${
          data.category === "men" ? "Men" : "Women"
        } ${
          data.subCategory === "topwear" ? "Topwear" : "Bottomwear"
        }`}</Typography>
        {products === null ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "350px",
            }}
          >
            <CircularProgress sx={{ color: "#f50e31" }} />
          </Box>
        ) : (
          <Box py={1}>
            <Swiper
              navigation={true}
              style={{
                "--swiper-navigation-color": "#000000",
                "--swiper-navigation-size": "30px",
              }}
              breakpoints={{
                480: { slidesPerView: 2 },
                667: { slidesPerView: 3 },
                880: { slidesPerView: 4 },
                1000: { slidesPerView: 5 },
                1125: { slidesPerView: 6 },
              }}
              modules={[Navigation]}
              className="mySwiper"
            >
              {products?.map((item, index) =>
                item.category === data.category &&
                item.subCategory === data.subCategory ? (
                  <SwiperSlide key={index}>
                    <Box p={0.5} display="flex" justifyContent="center">
                      <CarouselCardContainer data={item} />
                    </Box>
                  </SwiperSlide>
                ) : null
              )}
            </Swiper>
          </Box>
        )}
      </Box>
      <Divider />

      <Box p={4}>
        <Typography variant="h4" textTransform="uppercase">
          More in {data.category === "men" ? "Men" : "Women"} category
        </Typography>
        {products === null ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "350px",
            }}
          >
            <CircularProgress sx={{ color: "#f50e31" }} />
          </Box>
        ) : (
          <Box py={1} sx={{ border: "1px solid #eeeded" }}>
            <Swiper
              navigation={true}
              spaceBetween={10}
              style={{
                "--swiper-navigation-color": "#000000",
                "--swiper-navigation-size": "30px",
              }}
              breakpoints={{
                480: { slidesPerView: 2 },
                667: { slidesPerView: 3 },
                880: { slidesPerView: 4 },
                1000: { slidesPerView: 5 },
                1125: { slidesPerView: 6 },
              }}
              modules={[Navigation]}
              className="mySwiper"
            >
              {products.map((item, index) =>
                item.category === data.category ? (
                  <SwiperSlide key={index}>
                    <Box p={0.5} display="flex" justifyContent="center">
                      {" "}
                      <CarouselCardContainer data={item} />
                    </Box>
                  </SwiperSlide>
                ) : null
              )}
            </Swiper>
          </Box>
        )}
      </Box>
      <Divider />

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

      <Box p={4}>
        <Typography variant="h4">MORE ITEM YOU MAY LIKE</Typography>
        {products === null ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "500px",
            }}
          >
            <CircularProgress sx={{ color: "#f50e31" }} />
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
      </Box>
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
    </Box>
  );
};

export default ProductDetails;
