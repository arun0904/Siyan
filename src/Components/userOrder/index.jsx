import React, { useEffect, useState } from "react";
import {
  Box,
  CardMedia,
  CircularProgress,
  Stack,
  Typography,
  Stepper,
  Step,
  StepLabel,
  useMediaQuery,
  Button,
  Modal,
} from "@mui/material";
import useStyles from "./style";
import { useFirebase } from "../../Context/Firebase";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { KeyboardArrowDown, KeyboardArrowLeftSharp } from "@mui/icons-material";

const steps = ["Order Placed", "Confirmed", "Dispatch", "Arrived", "Delivered"];
const convertTime = (time) => {
  const fireBaseTime = new Date(
    time.seconds * 1000 + time.nanoseconds / 1000000
  );
  const date = fireBaseTime.toDateString();
  const atTime = fireBaseTime.toLocaleTimeString();
  return `${date} ${atTime}`;
};

export default function UserOrder() {
  const classes = useStyles();
  const firebase = useFirebase();
  const mediumViewport = useMediaQuery("(max-width:791px)");
  const [productShow, setProductShow] = useState();
  const [availableProduct, setAvailableProduct] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [wait, setWait] = useState(false);
  const [confirmm, setConfirmm] = useState(false);
  const [orderCancel, setOrderCancel] = useState();
  const [active, setActive] = useState([
    { label: "Pending", value: "pending", show: true },
    { label: "Delivered", value: "deliver", show: false },
    { label: "Cancelled", value: "cancel", show: false },
  ]);
  const [userOrders, setUserOrders] = useState(null);

  const getData = (value) => {
    const orderData = [];
    const showProduct = [];
    const products = [];
    const order = query(
      collection(
        firebase.db,
        "users",
        firebase.firebaseAuth.currentUser.uid,
        "orders"
      ),
      where("currentStage", "==", value)
    );
    const product = query(collection(firebase.db, "products"));
    onSnapshot(order, (orderSnapshot) => {
      orderSnapshot.forEach((data) => {
        orderData.push(data.data());
        showProduct.push(false);
      });
      setUserOrders(orderData);
      setProductShow(showProduct);
    });

    onSnapshot(product, (productSnapshot) => {
      productSnapshot.forEach((data) => {
        products.push({ docId: data.id, ...data.data() });
      });
      setAvailableProduct(products);
    });
  };

  const filterOrder = (value, index) => {
    setUserOrders(null);
    setActive(
      active.map((item, ind) =>
        ind === index ? { ...item, show: true } : { ...item, show: false }
      )
    );
    getData(value);
  };

  const handleStepper = (obj) => {
    let i = 0;
    for (const key in obj) {
      if (obj[key].value === true) {
        i++;
      }
    }
    return i;
  };

  const getTime = (obj, index) => {
    let time;
    switch (index) {
      case 0:
        time = obj.placed.timestamp;
        break;
      case 1:
        time = obj.confirm.timestamp;
        break;
      case 2:
        time = obj.dispatch.timestamp;
        break;
      case 3:
        time = obj.arrived.timestamp;
        break;
      default:
        time = obj.deliver.timestamp;
        break;
    }
    if (time === undefined) {
      return "pending";
    } else {
      return convertTime(time);
    }
  };

  const handleProductShow = (index) => {
    setProductShow(
      productShow.map((item, ind) => (ind === index ? !productShow[ind] : item))
    );
  };

  const handleConfirm = (order, getProducts) => {
    setOrderCancel({ orderId: order, products: getProducts });
    setModalOpen(true);
    setConfirmm(false);
  };

  const handleCancelOrder = async () => {
    setConfirmm(true);
    setWait(true);
    await orderCancel.products.forEach((item, index) => {
      availableProduct.forEach((data, ind) => {
        for (const key in data.size) {
          if (key === item.size && item.id === data.id) {
            data.size[key].map((sizeItem) => {
              if (item.color === sizeItem.color) {
                const docRef = doc(firebase.db, "products", data.docId);
                const add = updateDoc(docRef, {
                  [`size.${key}`]: arrayUnion({
                    ...sizeItem,
                    quantity: sizeItem.quantity + item.quantity,
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

    const docRef = doc(
      firebase.db,
      "users",
      firebase.firebaseAuth.currentUser.uid,
      "orders",
      orderCancel.orderId
    );
    await updateDoc(docRef, {
      currentStage: "cancel",
      "orderStage.cancel": {
        timestamp: serverTimestamp(),
        value: true,
      },
      "orderStage.pending.value": false,
    })
      .then(() => {
        setOrderCancel(null);
        setWait(false);
        setTimeout(() => {
          setModalOpen(false);
          getData("pending");
        }, 3000);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getData("pending");
  }, []);
  return (
    <>
      {!userOrders ? (
        <Stack className={classes.loaderStack}>
          <CircularProgress sx={{ color: "#f50e31" }} />
        </Stack>
      ) : (
        <Stack gap="20px" p={mediumViewport ? 0 : 3}>
          <Stack className={classes.orderFilter}>
            {active.map((item, index) => (
              <Typography
                variant="h6"
                onClick={() => filterOrder(item.value, index)}
                key={index}
                className={item.show ? classes.activeTab : null}
              >
                {item.label}
              </Typography>
            ))}
          </Stack>
          {userOrders.length === 0 ? (
            <Stack height="500px" justifyContent="center" alignItems="center">
              <Typography variant="h6" color="green">
                No{" "}
                {active.map((item) => {
                  if (item.show) {
                    return item.label;
                  }
                })}{" "}
                Orders
              </Typography>
            </Stack>
          ) : (
            userOrders.map((item, index) => (
              <Box key={index} className={classes.orderBox}>
                <Box className={classes.orderIdBox}>
                  <Typography>{index + 1}. </Typography>
                  &ensp;<Typography whiteSpace="nowrap">Order ID:</Typography>
                  &ensp;<Typography>{item.orderId}</Typography>
                </Box>
                <Box p={2}>
                  <Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      flexWrap="wrap"
                    >
                      <Box display="flex" alignItems="baseline" flexWrap="wrap">
                        <Typography variant="h6" fontWeight={700}>
                          Date:
                        </Typography>
                        &ensp;
                        <Typography variant="body2">
                          {convertTime(item.timestamp)}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="baseline" flexWrap="wrap">
                        <Typography variant="h6" fontWeight={700}>
                          Payment ID:
                        </Typography>
                        &ensp;
                        <Typography variant="body2" color="green">
                          {item.paymentId}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      py={2}
                      display={
                        item.currentStage === "cancel" ? "none" : "block"
                      }
                    >
                      <Stepper
                        activeStep={handleStepper(item.orderStep)}
                        alternativeLabel={!mediumViewport}
                        orientation={mediumViewport ? "vertical" : "horizontal"}
                      >
                        {steps.map((items, index) => {
                          return (
                            <Step key={index}>
                              <StepLabel>
                                <Box>
                                  <Typography>{items}</Typography>
                                  <Typography variant="caption">
                                    {getTime(item.orderStep, index)}
                                  </Typography>
                                </Box>
                              </StepLabel>
                            </Step>
                          );
                        })}
                      </Stepper>
                    </Box>
                    <Box
                      display="flex"
                      gap="20px"
                      justifyContent={
                        mediumViewport ? "space-between" : "space-around"
                      }
                      flexWrap="wrap"
                    >
                      <Box
                        className={classes.orderFieldBox}
                        flexDirection={mediumViewport ? "column" : "row"}
                      >
                        <Typography variant="h6" className={classes.fieldLabel}>
                          Amount Paid:
                        </Typography>
                        <Box pt={0.7} pl={1} display="flex">
                          <Box pr={1}>
                            <Typography whiteSpace="nowrap" fontWeight={700}>
                              Sub-Total
                            </Typography>
                            <Typography fontWeight={700}>Shipping</Typography>
                            <Typography fontWeight={700}>Total</Typography>
                          </Box>
                          <Box>
                            <Typography>
                              :&emsp;₹
                              {parseFloat(item?.priceDetail?.subTotal).toFixed(
                                2
                              )}
                            </Typography>
                            <Typography>
                              :&emsp;₹{item?.priceDetail?.shippingCharge}
                            </Typography>
                            <Typography>
                              :&emsp;₹
                              {parseFloat(item?.priceDetail?.total).toFixed(2)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Box flexDirection={mediumViewport ? "column" : "row"}>
                        <Typography variant="h6">Delivery Address:</Typography>
                        <Box pl={1}>
                          <Typography pt={0.7}>
                            {item?.deliveryAddress?.fullName}
                          </Typography>
                          <Typography>
                            {item?.deliveryAddress?.houseNo}{" "}
                            {item?.deliveryAddress?.landmark}{" "}
                            {item?.deliveryAddress?.street},{" "}
                            {item?.deliveryAddress?.city}
                          </Typography>
                          <Typography>
                            {item?.deliveryAddress?.state},{" "}
                            {item?.deliveryAddress?.country},{" "}
                            {item?.deliveryAddress?.pincode}
                          </Typography>
                          <Typography pb={2}>
                            Mobile: {item?.deliveryAddress?.mobile}
                          </Typography>
                        </Box>
                      </Box>
                      <Stack
                        width="100%"
                        justifyContent="flex-end"
                        alignItems="flex-end"
                        display={
                          item.currentStage === "cancel" ||
                          item.currentStage === "deliver"
                            ? "none"
                            : "flex"
                        }
                      >
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() =>
                            handleConfirm(item.orderId, item.productDetail)
                          }
                        >
                          Cancel Order
                        </Button>
                      </Stack>
                    </Box>

                    <Box>
                      <Box
                        display="flex"
                        mt={2}
                        p={0.5}
                        alignItems="center"
                        sx={{ background: "linear-gradient(white, green)" }}
                        justifyContent="space-between"
                      >
                        <Typography variant="h6">Product Detail:</Typography>
                        <Typography
                          onClick={() => handleProductShow(index)}
                          sx={{ cursor: "pointer" }}
                        >
                          {!productShow[index] ? (
                            <KeyboardArrowLeftSharp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </Typography>
                      </Box>
                      <Stack
                        gap="20px"
                        display={productShow[index] ? "flex" : "none"}
                      >
                        {item.productDetail.map((item, index) => (
                          <Stack key={index} bgcolor="white">
                            <Typography
                              color="#f50e31"
                              p={1}
                              fontWeight={700}
                              sx={{
                                background: "linear-gradient(white, #eeeded)",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.title}
                            </Typography>
                            <Stack className={classes.productStack}>
                              <CardMedia
                                component="img"
                                sx={{
                                  width: "80px",
                                  margin: { xs: "auto", md: "0" },
                                }}
                                image={item.imgUrl}
                              />

                              <Stack
                                flexDirection="row "
                                p={1}
                                flexGrow={1}
                                gap="10px"
                                sx={{ flexWrap: "wrap !important" }}
                                justifyContent="space-between"
                              >
                                <Box>
                                  <Typography fontWeight="bold">
                                    Size
                                  </Typography>
                                  <Typography textTransform="uppercase">
                                    {item.size}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography fontWeight="bold">
                                    Color
                                  </Typography>
                                  <Typography textTransform="capitalize">
                                    {item.color}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography fontWeight="bold">
                                    Quantity:
                                  </Typography>
                                  <Typography>{item.quantity}</Typography>
                                </Box>
                                <Box>
                                  <Typography fontWeight="bold">
                                    Price
                                  </Typography>
                                  <Typography>
                                    ₹ {parseFloat(item.price).toFixed(2)}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography fontWeight="bold">
                                    Shipping
                                  </Typography>
                                  <Typography>₹ {item.shipping}</Typography>
                                </Box>
                                <Box>
                                  <Typography fontWeight="bold">
                                    Total
                                  </Typography>
                                  <Typography>
                                    ₹ {parseFloat(item.total).toFixed(2)}
                                  </Typography>
                                </Box>
                              </Stack>
                            </Stack>
                          </Stack>
                        ))}
                      </Stack>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))
          )}
        </Stack>
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Stack
          height="100%"
          justifyContent="center"
          alignItems="center"
          bgcolor="#000000d0"
        >
          {!confirmm ? (
            <Stack alignItems="center" gap="10px">
              <Typography variant="h5" color="white">
                Confirm To Cancel?
              </Typography>
              <Box display="flex" gap="10px">
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleCancelOrder()}
                  color="success"
                >
                  confirm
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  color="error"
                  onClick={() => {
                    setOrderCancel(null);
                    setModalOpen(false);
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Stack>
          ) : (
            <Box>
              {wait ? (
                <CircularProgress sx={{ color: "#f50e31" }} />
              ) : (
                <Box>
                  <Typography variant="h5" color="red" textAlign="center">
                    Order Cancelled Successfully
                  </Typography>
                  <Typography variant="body1" textAlign="center" color="white">
                    Your Refund Will Be Initiated Soon
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Stack>
      </Modal>
    </>
  );
}
