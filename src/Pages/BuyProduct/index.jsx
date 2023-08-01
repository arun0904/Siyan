import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFirebase } from "../../Context/Firebase";
import useStyles from "./style";
import {
  query,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  serverTimestamp,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import {
  Box,
  CircularProgress,
  Modal,
  Typography,
  Stack,
  Button,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import {
  KeyboardArrowUpRounded,
  KeyboardArrowDownRounded,
  CheckCircleSharp,
} from "@mui/icons-material";
import AddressForm from "../../Components/addressForm";
import logo from "../../Assets/images/logo/logo.png";

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export default function BuyProduct() {
  const scrollTopElement=useRef();
  const classes = useStyles();
  const firebase = useFirebase();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [userData, setUserData] = useState(null);
  const [address, setAddress] = useState(null);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [showDefaultAddress, setshowDefaultAddress] = useState(false);
  const [cartIds, setcartIds] = useState([]);
  const [product, setProduct] = useState([]);
  const [wait, setWait] = useState(false);
  const [checkData, setCheckData] = useState(location.state);
  const [placed, setPlaced] = useState(false);
  const [count, setCounter] = useState(10);
  const [cost, setCost] = useState(null);
  const [allProducts, setAllProducts] = useState([]);

  const emptyCart = async () => {
    Promise.all(
      cartIds.map(
        async (item) =>
          await deleteDoc(
            doc(
              firebase.db,
              "users",
              firebase?.userAccountInfo.uid,
              "cart",
              item
            )
          )
      )
    )
      .then(() => {
        setPlaced(true);
        setTimeout(() => {
          setCheckData(false);
          navigate("/");
        }, 10000);
        setInterval(() => setCounter((count) => count - 1), 1000);
      })
      .catch((err) => console.log(err));
  };

  async function displayRazorpay(amount) {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razropay failed to load!!");
      return;
    }

    const options = {
      key: "rzp_test_Q8PhSkeZJBKVtS", // Enter the Key ID generated from the Dashboard
      amount: amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "Siyan",
      description: "The Next Generation Clothing Mart",
      image: logo,
      callback_url: "localhost:3000",
      handler: function (response) {
        setWait(true);
        createOrder(response.razorpay_payment_id);
      },
      prefill: {
        name: `${userData.data().firstName} ${userData.data().lastName}`, //your customer's name
        email: userData.data().email,
        contact: userData.data().mobile,
      },
      Notes: {
        Name: address.fullName,
        Mobile: address.mobile,
        Address: `${address.houseNo} ${address.landmark} ${address.street}, ${address.city}, ${address.state}, ${address.country} `,
      },
      theme: {
        color: "#f50e31",
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  const createOrder = async (payment_Id) => {
    await addDoc(
      collection(firebase.db, "users", firebase.userAccountInfo.uid, "orders"),
      {
        userId: userData.id,
        orderId: "",
        timestamp: serverTimestamp(),
        paymentId: payment_Id,
        deliveryAddress: address,
        priceDetail: {
          subTotal: cost.price,
          shippingCharge: cost.shipping,
          total: cost.total,
        },
        productDetail: product,
        orderStage: { pending: { value: true, timestamp: serverTimestamp() } },
        currentStage: "pending",
        orderStep: {
          placed: { value: true, timestamp: serverTimestamp() },
          confirm: { value: false },
          dispatch: { value: false },
          arrived: { value: false },
          deliver: { value: false },
        },
      }
    )
      .then(async (result) => {
        const docRef = doc(
          firebase.db,
          "users",
          firebase.userAccountInfo.uid,
          "orders",
          result.id
        );
        emptyCart();
        updateQuantity();
        await updateDoc(docRef, { orderId: result.id })
          .then(() => {})
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  const updateQuantity = async () => {
    product.forEach((item, index) => {
      allProducts.forEach((data, ind) => {
        for (const key in data.size) {
          if (key === item.size && item.id === data.id) {
            data.size[key].map((sizeItem) => {
              if (item.color === sizeItem.color) {
                const docRef = doc(firebase.db, "products", data.docId);
                const add = updateDoc(docRef, {
                  [`size.${key}`]: arrayUnion({
                    ...sizeItem,
                    quantity: sizeItem.quantity - item.quantity,
                  }),
                });
                const remove = updateDoc(docRef, {
                  [`size.${key}`]: arrayRemove(sizeItem),
                });
                Promise.all([remove, add]);
              }
            });
          }
        }
      });
    });
  };

  const getData = async () => {
    await firebase
      ?.usersInformation()
      .then((result) => {
        const cartData = [];
        const productData = [];
        const Ids = [];
        const availableProducts = [];
        let subTotalCost = 0;
        let shippingCost = 0;
        setUserData(result);
        if (result.data().deliveryAddress !== undefined) {
          setShowForm(false);
        }
        setAddress(result.data().deliveryAddress);
        setDefaultAddress(result.data().deliveryAddress);
        const q = query(collection(firebase?.db, "users", result.id, "cart"));
        const p = query(collection(firebase?.db, "products"));
        onSnapshot(q, (querySnapshot) => {
          querySnapshot?.forEach((doc, index) => {
            cartData.push(doc.data());
            Ids.push(doc.id);
          });
          if (cartData.length === 0) {
            navigate("/");
          }
          setcartIds(Ids);
        });
        onSnapshot(p, (querySnapshot) => {
          querySnapshot?.forEach((doc, index) => {
            availableProducts.push({ ...doc.data(), docId: doc.id });
            cartData.forEach((item2, index2) => {
              if (item2.id === doc.data().id) {
                const shippingCharge =
                  item2.price * item2.quantity < 500 ? 50 : 0;
                shippingCost = shippingCost + shippingCharge;
                subTotalCost = subTotalCost + item2.quantity * item2.price;
                productData.push({
                  ...item2,
                  title: doc.data().title,
                  category: doc.data().category,
                  subCategory: doc.data().subCategory,
                  shipping: shippingCharge,
                  total: item2.quantity * item2.price + shippingCharge,
                });
              }
            });
          });
          setAllProducts(availableProducts);
          setProduct(productData);
          setCost({
            price: subTotalCost,
            shipping: shippingCost,
            total: subTotalCost + shippingCost,
          });
        });
    scrollTopElement?.current.scrollIntoView({behavior:"smooth"})

      })
      .catch((err) => console.log(err));
  };

  const checkFunction = (
    name,
    mobile,
    pincode,
    houseNo,
    street,
    landmark,
    city,
    state
  ) => {
    name.length >= 3 ? (name = true) : (name = false);
    mobile.length === 10 ? (mobile = true) : (mobile = false);
    pincode.length === 6 ? (pincode = true) : (pincode = false);
    houseNo.length > 0 ? (houseNo = true) : (houseNo = false);
    street.length > 0 ? (street = true) : (street = false);
    landmark.length > 0 ? (landmark = true) : (landmark = false);
    city.length >= 3 ? (city = true) : (city = false);
    state.length !== 0 ? (state = true) : (state = false);
    return (
      name &&
      mobile &&
      pincode &&
      houseNo &&
      street &&
      landmark &&
      city &&
      state
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const check = checkFunction(
      data.get("name"),
      data.get("mobile"),
      data.get("pincode"),
      data.get("houseNo"),
      data.get("street"),
      data.get("landmark"),
      data.get("city"),
      data.get("state")
    );
    if (check) {
      const obj = {
        fullName: data.get("name"),
        mobile: data.get("mobile"),
        pincode: data.get("pincode"),
        houseNo: data.get("houseNo"),
        street: data.get("street"),
        landmark: data.get("landmark"),
        city: data.get("city"),
        state: data.get("state"),
        country: "India",
      };
      if (defaultAddress === undefined) {
        const docRef = doc(
          firebase.db,
          "users",
          firebase.firebaseAuth?.currentUser?.uid
        );
        await updateDoc(docRef, {
          deliveryAddress: obj,
        })
          .then(() => {
            setDefaultAddress(obj);
          })
          .catch((err) => console.log(err));
      }
      setAddress(obj);
      setShowForm(false);
    } else {
      setAlertMessage("Please Entert Valid Data");
      setIsSnackbarOpen(true);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("user") || !checkData) {
      navigate("/");
    } else {
      getData();
    }
  }, [localStorage.getItem("user")]);

  return (
    <>
      <Stack className={classes.mainStack} ref={scrollTopElement}>
        {showForm ? (
          <Box>
            <AddressForm
              submitFunction={handleSubmit}
              showCancelButton={defaultAddress !== undefined}
            />
            <Box textAlign="right">
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "red",
                  "&:hover": { backgroundColor: "red" },
                }}
                onClick={() => {
                  defaultAddress !== undefined
                    ? setShowForm(false)
                    : navigate("/cart");
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <Box display="flex" gap="20px" flexDirection="column">
            <Box className={classes.addressBox} sx={{ width: { sm: "600px" } }}>
              <Typography
                variant="h5"
                textAlign="center"
                bgcolor="black"
                color="white"
                p={2}
              >
                Current Delivery Address
              </Typography>
              <Box p={2} bgcolor="#eeeded">
                <Typography variant="h6">{address?.fullName}</Typography>
                <Typography variant="h6" textTransform="capitalize">
                  {address?.houseNo},{address?.street},{address?.landmark}
                </Typography>
                <Typography variant="h6" textTransform="capitalize">
                  {address?.city}, {address?.state}, {address?.country},{" "}
                  {address?.pincode}
                </Typography>
                <Typography variant="h6">
                  Mobile No.: {address?.mobile}
                </Typography>
                <Typography
                  className={classes.buttonContainer}
                  textAlign="right"
                >
                  <Button
                    variant="contained"
                    sx={{ width: "100px" }}
                    onClick={() => setShowForm(true)}
                  >
                    Change
                  </Button>
                </Typography>
                <Box
                  className={classes.viewDefaultStack}
                  onClick={() => setshowDefaultAddress(!showDefaultAddress)}
                >
                  <Typography variant="h6">View Default Address</Typography>
                  {showDefaultAddress ? (
                    <KeyboardArrowUpRounded />
                  ) : (
                    <KeyboardArrowDownRounded />
                  )}
                </Box>

                <Box
                  display={showDefaultAddress ? "block" : "none"}
                  bgcolor="white"
                >
                  <Typography variant="h5" p={1} color="#f50e31">
                    Default Delivery Address
                  </Typography>
                  <Box sx={{ padding: "0 10px 10px" }}>
                    <Typography variant="h6">
                      {defaultAddress?.fullName}
                    </Typography>
                    <Typography variant="h6" textTransform="capitalize">
                      {defaultAddress?.houseNo},{defaultAddress?.street},
                      {defaultAddress?.landmark}
                    </Typography>
                    <Typography variant="h6" textTransform="capitalize">
                      {defaultAddress?.city}, {defaultAddress?.state},{" "}
                      {defaultAddress?.country}, {defaultAddress?.pincode}
                    </Typography>
                    <Typography variant="h6">
                      Mobile No.: {defaultAddress?.mobile}
                    </Typography>
                  </Box>
                  <Typography
                    textAlign="right"
                    className={classes.buttonContainer}
                  >
                    <Button
                      variant="contained"
                      onClick={() => setAddress(defaultAddress)}
                    >
                      Use It
                    </Button>
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box className={classes.addressBox} sx={{ width: { sm: "600px" } }}>
              <Typography
                variant="h5"
                textAlign="center"
                bgcolor="black"
                color="white"
                p={2}
              >
                Order Summary
              </Typography>
              <Box p={2} bgcolor="#eeeded">
                <Stack className={classes.textFlex}>
                  <Typography variant="h6">Subtotal:</Typography>
                  <Typography variant="h5" noWrap>
                    ₹ {parseFloat(cost?.price).toFixed(2)}
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
                    ₹ {cost?.shipping}
                  </Typography>
                </Stack>
                <Divider
                  variant=""
                  color="black"
                  sx={{ borderBottomWidth: 3 }}
                />
                <Stack className={classes.textFlex}>
                  <Typography variant="h5" py={2}>
                    Total:
                  </Typography>
                  <Typography variant="h5" noWrap color="#B12704">
                    ₹ {parseFloat(cost?.total).toFixed(2)}
                  </Typography>
                </Stack>
                <Divider
                  variant=""
                  color="black"
                  sx={{ borderBottomWidth: 3 }}
                />
              </Box>
            </Box>
            <Button
              variant="contained"
              className={classes.paymentButton}
              onClick={() => displayRazorpay(cost.total)}
            >
              Proceed To Pay
            </Button>
          </Box>
        )}
      </Stack>

      <Modal
        open={userData === null || cartIds.length === 0}
        onClose={userData !== null}
      >
        <Stack className={classes.modalStack}>
          <CircularProgress sx={{color:"#f50e31"}}/>
        </Stack>
      </Modal>
      <Modal open={wait} onClose={() => setWait(!wait)}>
        <Stack className={classes.modalStack}>
          {!placed ? (
            <Stack alignItems="center" gap="30px">
              <CircularProgress  sx={{color:"#f50e31"}}/>
              <Typography variant="h5" color="#f50e31">
                Please Wait . . . .{" "}
              </Typography>
            </Stack>
          ) : (
            <Stack alignItems="center" gap="30px" color="green">
              <Typography variant="h1">
                <CheckCircleSharp fontSize="200px" />
              </Typography>
              <Typography variant="h3" textAlign="center">
                Order Placed Successfully
              </Typography>
              <Typography variant="h6" color="white">
                Redirecting To The Home Screen In...
              </Typography>
              <Box display="flex">
                <Typography variant="h5" color="#f50e31">
                  {" "}
                  {count}{" "}
                </Typography>
                &ensp;
                <Typography variant="h6" color="white">
                  sec
                </Typography>
              </Box>
            </Stack>
          )}
        </Stack>
      </Modal>
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
    </>
  );
}
