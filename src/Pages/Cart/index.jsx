import React, { useState, useEffect } from "react";
import {
  Box,
  CardMedia,
  Stack,
  Typography,
  IconButton,
  Button,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import useStyle from "./style.js";
import cartImage from "../../Assets/images/cart/cartImage.png";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../../Context/Firebase";
import {
  onSnapshot,
  query,
  collection,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

function CartItemCard({ ...props }) {
  const cartData = props.data.data();
  const firebase = useFirebase();
  const classes = useStyle();
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [item, setItem] = useState();
  const [itemImage, setItemImage] = useState();
  const [quantity, setQuantity] = useState(cartData.quantity);
  const [total, setTotal] = useState(cartData.quantity * cartData.price);

  const getProducts = async () => {
    const q = query(
      collection(firebase.db, "products"),
      where("id", "==", cartData.id)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      productToShow(doc.data());
    });
  };

  const productToShow = (itemss) => {
    for (const key in itemss.size) {
      if (cartData.size === key) {
        itemss.size[key].forEach((item) => {
          if (cartData.color === item.color) {
            setItem({
              name: itemss.title,
              size: key,
              price: cartData.price,
              ...item,
            });

            firebase
              .getImage(item.imgSrc)
              .then((url) => {
                setItemImage(url);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        });
      }
    }
  };

  const removeItem = () => {
    deleteDoc(
      doc(
        firebase.db,
        "users",
        firebase?.userAccountInfo.uid,
        "cart",
        props.data.id
      )
    )
      .then(() => {

      })
      .catch((err) => console.log(err));
      setIsSnackbarOpen(true);
      setAlertMessage("Item Removed Successfully")
  };

  const increaseQuantity = async () => {
    if (quantity >= 5) {
      setAlertMessage("Max Quantity For Each Person is 5");
      setIsSnackbarOpen(true);
    } else {
      if (quantity <= item.quantity - 1) {
        setQuantity(quantity + 1);
        setTotal((quantity + 1) * item.price);
        await updateDoc(
          doc(
            firebase.db,
            "users",
            firebase?.userAccountInfo.uid,
            "cart",
            props.data.id
          ),
          {
            quantity: quantity + 1,
          }
        );
      } else {
        setAlertMessage(`Only ${item.quantity} Items Are Left`);
        setIsSnackbarOpen(true);
      }
    }
  };

  const decreaseQuantity = async () => {
    if (quantity <= 1) {
      setAlertMessage("Minimum Quantity Should Be 1");
      return setIsSnackbarOpen(true);
    } else {
      setQuantity(quantity - 1);
      setTotal((quantity - 1) * item.price);
      await updateDoc(
        doc(
          firebase.db,
          "users",
          firebase?.userAccountInfo.uid,
          "cart",
          props.data.id
        ),
        {
          quantity: quantity - 1,
        }
      );
    }
  };

  useEffect(() => {
    getProducts();
  },[props.data]);

  return (
    <Stack
      p={2}
      m={2}
      className={classes.cardWrapper}
      sx={{
        width: { lg: "950px", md: "600px" },
        flexDirection: { md: "row", ms: "column" },
      }}
      justifyContent="space-between"
    >
      <CardMedia
        component="img"
        sx={{
          width: "150px",
          aspectRatio:"1/1.3",
          margin: { xs: "auto", md: "0" },
          objectFit: "contain",
        }}
        image={itemImage}
      />
      <Stack
        sx={{
          width: { md: "80%" },
          flexDirection: { lg: "row", md: "column" },
        }}
        justifyContent="space-between"
      >
        <Stack sx={{ maxWidth: "250px" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {item?.name}
          </Typography>
          <Box display="flex">
            <Typography>Size:</Typography>
            <Typography textTransform="uppercase">
              &emsp;{item?.size}
            </Typography>
          </Box>
          <Typography>Color: {item?.color}</Typography>
          <Stack direction="row" justifyContent="space-between">
            {" "}
            <Typography>
              Qty:
              <IconButton
                aria-label="removeItem"
                onClick={() => decreaseQuantity()}
              >
                <RemoveIcon />
              </IconButton>
              {quantity}
              <IconButton
                aria-label="addItem"
                onClick={() => increaseQuantity()}
              >
                <AddIcon />
              </IconButton>
            </Typography>
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={() => removeItem()}
            >
              Remove
            </Button>
          </Stack>
        </Stack>
        <Stack className={classes.textFlex}>
          Price:{" "}
          <Typography variant="h5" noWrap>
            &emsp;₹ {item?.price}
          </Typography>
        </Stack>
        <Stack className={classes.textFlex}>
          Total:{" "}
          <Typography variant="h5" noWrap>
            &emsp;₹ {total.toFixed(2)}
          </Typography>
        </Stack>
      </Stack>
      <Snackbar
        open={isSnackbarOpen}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={3000}
        onClose={() => setIsSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setIsSnackbarOpen(false)}
          severity="warning"
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
}

export default function Cart() {
  const navigate = useNavigate();
  const firebase = useFirebase();
  const classes = useStyle();
  const [cartItem, setCartItem] = useState(null);
  const [shippingCharge, setShippingCharge] = useState(0);
  const [total, setTotal] = useState(0);

  const getCartItems = async () => {
    await firebase
      ?.usersInformation()
      .then((result) => {
        const q = query(collection(firebase?.db, "users", result.id, "cart"));
        onSnapshot(q, (querySnapshot) => {
          const data = [];
          querySnapshot?.forEach((doc) => {
            data.push(doc);
          });
          setCartItem(data);
          setTotal(
            parseFloat(
              data
                .reduce(
                  (total, item) =>
                    total + item.data().price * item.data().quantity,
                  0
                )
                .toFixed(2)
            )
          );
          setShippingCharge(
            data.reduce(
              (total, item) =>
                item.data().price * item.data().quantity < 500
                  ? total + 50
                  : total + 0,
              0
            )
          );
        });
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      getCartItems();
    } else {
      navigate("/signin");
    }
  }, [firebase]);

  return (
    <>
      <Typography variant="h3" p={2} m={0}>
        Shopping Cart
      </Typography>
      <Divider />
      {cartItem === null ? (
        <Stack
          sx={{
            height: "600px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress sx={{color:"#f50e31"}}/>
        </Stack>
      ) : (
        <Box>
          <Stack
            alignItems="center"
            display={cartItem?.length === 0 ? "flex" : "none"}
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
              my={2}
            >
              Your cart is empty
            </Typography>
            <Button
              variant="contained"
              sx={{ margin: "20px 0", fontSize: "25px" }}
              className={classes.shoppingButton}
              onClick={() => navigate("/")}
            >
              Shoppe Now
            </Button>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            display={cartItem?.length === 0 ? "none" : "flex"}
          >
            <Stack alignItems="center" sx={{ width: "100%" }}>
              {cartItem.map((items, index) => (
                <Box key={index}>
                  <CartItemCard data={items} />
                </Box>
              ))}
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
                  ₹ {total}
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
                  ₹ {parseFloat((total + shippingCharge).toFixed(2))}
                </Typography>
              </Stack>
              <Divider variant="" color="black" sx={{ borderBottomWidth: 3 }} />
              <Stack my={2}>
                <Button
                  sx={{
                    backgroundColor: "black",
                    color: "white",
                    "&:hover": { backgroundColor: "black" },
                  }}
                  onClick={() =>
                    navigate("/buyproduct", {
                      state:true
                    })
                  }
                >
                  Proceed to Buy
                </Button>
                <Typography variant="paragraph" mt={2}>
                  Need help? Call us at 1-877-707-6272
                </Typography>
              </Stack>
              <Divider variant="" color="black" sx={{ borderBottomWidth: 3 }} />
            </Box>
          </Stack>
        </Box>
      )}
      <Divider />
    </>
  );
}
