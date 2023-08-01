import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  CardMedia,
  Stack,
  Typography,
  Button,
  Divider,
  Checkbox,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import useStyle from "./style.js";
import cartImage from "../../Assets/images/wishlist/wishlist-icon-design-free-vector.jpeg";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../../Context/Firebase";
import {
  onSnapshot,
  query,
  collection,
  doc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";

function WishlistItemCard({ ...props }) {
  const scrollTopElement = useRef();
  const classes = useStyle();
  const navigate = useNavigate();
  const firebase = useFirebase();
  const productData = firebase?.product;
  const [selectDeselect, setSelectDeselect] = useState(props.data.inCart);
  const [item, setItem] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [showProduct, setShowProduct] = useState(null);

  const handleSelect = async () => {
    selectDeselect
      ? await deleteDoc(
          doc(
            firebase.db,
            "users",
            firebase?.userAccountInfo.uid,
            "cart",
            `${props.data.id}${props.data.size}${props.data.color}`
          )
        )
          .then(() => {
            setSelectDeselect(false);
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
            `${props.data.id}${props.data.size}${props.data.color}`
          ),
          {
            id: props.data.id,
            size: props.data.size,
            color: props.data.color,
            price: props.data.price,
            quantity: 1,
            imgUrl: productImage,
          }
        )
          .then(() => {
            setSelectDeselect(true);
            setAlertMessage("Item Successfully Added In Your Cart");
            setIsSnackbarOpen(true);
          })
          .catch((err) => console.log(err));
  };

  const handleRemove = () => {
    firebase
      .removeElementOfArray("wishlist", {
        id: props.data.id,
        price: props.data.price,
        size: item.size,
        color: item.color,
      })
      .then(async () => {
        setAlertMessage("Item Successfully Removed From Your Wishlist");
        setIsSnackbarOpen(true);
        props.getDataFunction();
      });
  };

  const productToShow = () => {
    productData.forEach((items, index) => {
      if (props.data.id === items.id) {
        for (const key in items.size) {
          if (props.data.size === key) {
            items.size[key].forEach((item, index) => {
              if (props.data.color === item.color) {
                setItem({
                  name: items.title,
                  size: key,
                  price: items.price,
                  ...item,
                });
                setShowProduct(items);
                firebase
                  .getImage(item.imgSrc)
                  .then((url) => {
                    setProductImage(url);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
            });
          }
        }
      }
    });
  };

  useEffect(() => {
    productToShow();
  }, [props.data]);

  return (
    <Stack
      ref={scrollTopElement}
      p={2}
      className={classes.cardWrapper}
      sx={{
        width: { lg: "950px", md: "600px" },
        flexDirection: { md: "row", xs: "column" },
      }}
      justifyContent="space-between"
    >
      <CardMedia
        component="img"
        
        sx={{
          width: "100px",
          aspectRatio: "1/1.2",
          margin: { xs: "auto", m: "0", lg:"0 0 0 50px" },
           cursor: "pointer"
        }}
        image={productImage}
        onClick={() =>
          navigate("/productdetail", {
            state: {
              imageSrc: productImage,
              itemSize: item.size,
              ...showProduct,
              color: props.data.color,
            },
          })
        }
      />
      
      <Stack width="250px">
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {item.name}
        </Typography>
        <Typography sx={{ textTransform: "uppercase" }}>
          Size: {item.size}
        </Typography>
        <Typography sx={{ textTransform: "uppercase" }}>
          Color: {item.color}
        </Typography>

        <Button
          variant="outlined"
          size="small"
          color="error"
          onClick={() => handleRemove()}
        >
          Remove
        </Button>
      </Stack>
      <Stack className={classes.textFlex}>
        Price:{" "}
        <Typography variant="h5" noWrap>
          &emsp;₹ {item.price}
        </Typography>
      </Stack>
      <Box>
        <Checkbox
          color="success"
          checked={selectDeselect ? true : false}
          sx={{ display: { md: "inline-flex", xs: "none" } }}
          onChange={handleSelect}
        />
        <Button
          variant={selectDeselect ? "contained" : "contained"}
          color={selectDeselect ? "success" : "error"}
          sx={{ display: { md: "none", xs: "flex", width: "100%" } }}
          onClick={() => handleSelect()}
        >
          {selectDeselect ? "Added to cart" : "Not in cart"}
        </Button>
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
    </Stack>
  );
}

export default function Wishlist() {
  const navigate = useNavigate();
  const firebase = useFirebase();
  const [wait, setWait] = useState(true);
  const [wishlistItem, setWishlistItem] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [shippingCharge, setShippingCharge] = useState(0);

  const classes = useStyle();

  const getData = async () => {
    let data = [];
    let abc = [];
    await firebase
      ?.usersInformation()
      .then((result) => {
        const q = query(collection(firebase?.db, "users", result.id, "cart"));
        onSnapshot(q, (querySnapshot) => {
          querySnapshot?.forEach((doc) => {
            data.push(doc.id);
          });
          if (result.data().wishlist !== undefined) {
            result.data().wishlist.forEach((item1, index) => {
              let inCart = false;
              data.map((item2, index) =>
                item2 === `${item1.id}${item1.size}${item1.color}`
                  ? (inCart = true)
                  : null
              );
              abc.push({ ...item1, inCart });
            });
          }
          setWait(false);
          setWishlistItem(abc);
        });

        setTotalCost(
          result
            .data()
            .wishlist?.reduce((total, item) => total + item.price, 0)
            .toFixed(2)
        );
        setShippingCharge(
          result
            .data()
            .wishlist?.reduce(
              (total, item) => (item.price <= 500 ? total + 50 : total + 0),
              0
            )
        );
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getData();
  }, [firebase]);

  return (
    <>
      <Typography variant="h3" p={2} m={0} color="rgb(255,52,20)">
        My Wishlist
      </Typography>
      <Divider />

      {!localStorage.getItem("user") ? (
        <Stack
          height="500px"
          my={2}
          justifyContent="center"
          alignItems="center"
        >
          <Box
            className={classes.cartImageDiv}
            my={2}
            sx={{ width: { sm: "300px", xs: "280px" } }}
          >
            <CardMedia component="img" image={cartImage} />
          </Box>
          <Typography variant="h4">PLEASE LOG IN</Typography>
          <Typography my={3}>Login to view items in your wishlist.</Typography>
          <Button
            variant="contained"
            sx={{
              width: { sm: "400px", xs: "280px" },
              backgroundColor: "black",
              "&:hover": { backgroundColor: "black" },
            }}
            onClick={() => navigate("/signin")}
          >
            Log in
          </Button>
        </Stack>
      ) : wait ? (
        <Stack height="450px" justifyContent="center" alignItems="center">
          <CircularProgress sx={{ color: "#f50e31" }} />
        </Stack>
      ) : wishlistItem === null ? (
        <Stack
          sx={{
            width: "100%",
            height: "600px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress sx={{ color: "#f50e31" }} />
        </Stack>
      ) : (
        <Box>
          <Stack
            alignItems="center"
            display={wishlistItem.length === 0 ? "flex" : "none"}
          >
            <Box
              className={classes.cartImageDiv}
              my={2}
              sx={{ width: { sm: "400px", xs: "280px" } }}
            >
              <CardMedia component="img" image={cartImage} />
            </Box>
            <Typography
              variant="h3"
              fontSize={{ sm: "48px", xs: "34px" }}
              color="red"
              my={2}
            >
              Your Wishlist is empty
            </Typography>
            <Typography>seems like you don't have wishes here</Typography>
            <Typography>Make a wish</Typography>
            <Button
              variant="contained"
              sx={{ margin: "20px 0", fontSize: "25px" }}
              className={classes.shoppingButton}
              onClick={() => navigate("/")}
            >
              Start Shopping
            </Button>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            display={wishlistItem.length === 0 ? "none" : "flex"}
          >
            <Stack alignItems="center" sx={{ width: "100%" }}>
              {wishlistItem.map((items, index) => {
                return (
                  <Box key={index}>
                    <WishlistItemCard
                      data={items}
                      getDataFunction={() => getData()}
                    />
                  </Box>
                );
              })}
              <Button
                variant="contained"
                sx={{
                  margin: "20px 0",
                  fontSize: "25px",
                  width: { md: "600px", xs: "100%" },
                }}
                className={classes.shoppingButton}
                onClick={() => navigate("/")}
              >
                Add More Items
              </Button>
            </Stack>
            <Box
              p={2}
              sx={{
                backgroundColor: "#00000017",
                width: { sm: "320px", xs: "100%" },
              }}
            >
              <Typography variant="h4" mb={2}>
                Summary
              </Typography>
              <Divider variant="" color="black" sx={{ borderBottomWidth: 3 }} />
              <Stack className={classes.textFlex}>
                Subtotal:
                <Typography variant="h5" noWrap>
                  ₹ {totalCost}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                alignItems="flex-end"
                justifyContent="space-between"
                sx={{ fontSize: "20px" }}
                my={2}
              >
                Shipping:
                <Typography variant="h6" noWrap>
                  ₹ {shippingCharge}
                </Typography>
              </Stack>
              <Divider variant="" color="black" sx={{ borderBottomWidth: 3 }} />
              <Stack className={classes.textFlex}>
                Total:
                <Typography variant="h5" noWrap color="#B12704">
                  ₹ {parseFloat(totalCost) + parseFloat(shippingCharge)}
                </Typography>
              </Stack>
              <Divider variant="" color="black" sx={{ borderBottomWidth: 3 }} />
              <Stack my={2}>
                <Button
                  mb={2}
                  sx={{
                    backgroundColor: "black",
                    color: "white",
                    marginBottom: "20px",
                    "&:hover": { backgroundColor: "black" },
                  }}
                  onClick={() => navigate("/cart")}
                >
                  Go to Cart
                </Button>
                <Typography variant="paragraph" mt={2}>
                  Need help? Call us at 1-877-707-6272
                </Typography>
              </Stack>
              <Divider color="black" sx={{ borderBottomWidth: 3 }} />
            </Box>
          </Stack>
        </Box>
      )}
      <Divider />
    </>
  );
}
