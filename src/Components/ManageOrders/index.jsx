import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Stack,
  Stepper,
  Step,
  StepLabel,
  Button,
  Modal,
  Snackbar,
  Alert,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";

import useStyle from "./style.js";
import { useFirebase } from "../../Context/Firebase";
import {
  query,
  collection,
  where,
  getDocs,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";

const steps = ["Order Placed", "Confirmed", "Dispatch", "Arrived", "Delivered"];

const convertTime = (time) => {
  const fireBaseTime = new Date(
    time.seconds * 1000 + time.nanoseconds / 1000000
  );
  const date = fireBaseTime.toDateString();
  const atTime = fireBaseTime.toLocaleTimeString();
  return `${date} ${atTime}`;
};

const OrderDetails = ({ ...props }) => {
  const data = props.data;
  const classes = useStyle();
  const mediumViewport = useMediaQuery("(max-width:520px)");

  return (
    <>
      <Box p={1}>
        <Box className={classes.orderFieldBox}>
          <Typography variant="h6" className={classes.fieldLabel}>
            Date:
          </Typography>
          <Typography variant="body1" pt={0.6}>
            &emsp;{convertTime(data.timestamp)}
          </Typography>
        </Box>
        <Box
          className={classes.orderFieldBox}
          flexDirection={mediumViewport ? "column" : "row"}
        >
          <Typography variant="h6" className={classes.fieldLabel}>
            Payment ID:
          </Typography>{" "}
          <Typography variant="h6" color="red" pb={1} pl={1}>
            {data.paymentId}
          </Typography>
        </Box>
        <Box
          className={classes.orderFieldBox}
          flexDirection={mediumViewport ? "column" : "row"}
        >
          <Typography variant="h6" className={classes.fieldLabel}>
            Delivery Address:
          </Typography>
          <Box pl={1}>
            <Typography pt={0.7}>{data?.deliveryAddress?.fullName}</Typography>
            <Typography>
              {data?.deliveryAddress?.houseNo} {data?.deliveryAddress?.landmark}{" "}
              {data?.deliveryAddress?.street}, {data?.deliveryAddress?.city}
            </Typography>
            <Typography>
              {data?.deliveryAddress?.state}, {data?.deliveryAddress?.country},{" "}
              {data?.deliveryAddress?.pincode}
            </Typography>
            <Typography pb={2}>
              Mobile: {data?.deliveryAddress?.mobile}
            </Typography>
          </Box>
        </Box>
        <Box
          className={classes.orderFieldBox}
          flexDirection={mediumViewport ? "column" : "row"}
        >
          <Typography variant="h6" className={classes.fieldLabel}>
            Amount Paid:
          </Typography>
          <Box pt={0.7} pl={1} flexBasis={mediumViewport ? "85px" : "210px"}>
            <Box display="flex" justifyContent="space-between">
              <Typography whiteSpace="nowrap" fontWeight={700}>
                Sub-Total:
              </Typography>
              <Typography>&emsp;₹{data?.priceDetail?.subTotal}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography fontWeight={700}>Shipping Charge:</Typography>
              <Typography>
                &emsp;₹{data?.priceDetail?.shippingCharge}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography fontWeight={700}>Total:</Typography>
              <Typography>&emsp;₹{data?.priceDetail?.total}</Typography>
            </Box>
          </Box>
        </Box>
        <Stack>
          <Typography variant="h6" className={classes.fieldLabel}>
            Product Details:
          </Typography>
          <Box>
            {data?.productDetail?.map((item, index) => (
              <Box
                key={index}
                display="flex"
                flexWrap="wrap"
                sx={{ padding: "5px", border: "1px solid #eeeded" }}
              >
                <Box display="flex" flexWrap="nowrap" flexBasis="100px">
                  <Typography fontWeight={700}>ID:</Typography>
                  <Typography>{item.id}</Typography>
                </Box>
                <Box display="flex" flexWrap="nowrap" flexBasis="300px">
                  <Typography fontWeight={700}>Category:</Typography>
                  <Typography whiteSpace="nowrap" textTransform="capitalize">
                    &emsp;{item.category}-{item.subCategory}
                  </Typography>
                </Box>{" "}
                <Box display="flex" flexWrap="nowrap" flexBasis="200px">
                  <Typography fontWeight={700}>Color:</Typography>
                  <Typography textTransform="capitalize">
                    {" "}
                    &emsp;{item.color}
                  </Typography>
                </Box>
                <Box display="flex" flexWrap="nowrap" flexBasis="100px">
                  <Typography fontWeight={700}>Size:</Typography>
                  <Typography textTransform="uppercase">
                    &emsp;{item.size}
                  </Typography>
                </Box>
                <Box display="flex" flexWrap="nowrap" flexBasis="100px">
                  <Typography fontWeight={700}>Quantity:</Typography>
                  <Typography>&emsp;{item.quantity}</Typography>
                </Box>
                <Box display="flex" flexWrap="nowrap" flexBasis="200px">
                  <Typography whiteSpace="nowrap" fontWeight={700}>
                    Total Cost:
                  </Typography>
                  <Typography>&emsp;₹ {item.total}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Stack>
      </Box>
    </>
  );
};

export default function ManageOrders({ ...props }) {
  const classes = useStyle();
  const firebase = useFirebase();
  const mediumViewport = useMediaQuery("(max-width:899px)");
  const [users, setUsers] = useState(null);
  const [productArr, setProductArr] = useState([]);
  const [modalData, setModalData] = useState({ open: false });
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertVariant, setAlertVariant] = useState("success");
  const [stepUpdateObj, setStepUpdateObj] = useState({ open: false });

  const modalHandler = (open, confirm, userId, orderId, products) => {
    const obj = {
      open: open,
      confirm: confirm,
      user: userId,
      order: orderId,
      product: products,
    };
    setModalData(obj);
  };

  const handleUpdateStep = (open, step, userId, orderId) => {
    const obj = {
      open: open,
      step: step,
      user: userId,
      order: orderId,
    };
    setStepUpdateObj(obj);
  };

  const updateStep = async (step, userId, orderId) => {
    const stepsValue = ["placed", "confirm", "dispatch", "arrived", "deliver"];
    const docRef = doc(firebase.db, "users", userId, "orders", orderId);
    if (step !== 4) {
      await updateDoc(docRef, {
        [`orderStep.${stepsValue[step]}.value`]: true,
        [`orderStep.${stepsValue[step]}.timestamp`]: serverTimestamp(),
      })
        .then(() => {
          setIsSnackbarOpen(true);
          setStepUpdateObj({ open: false });
          setAlertMessage("Step Update Successfully");
          setAlertVariant("success");
          getData();
        })
        .catch((err) => console.log(err));
    } else {
      await updateDoc(docRef, {
        [`orderStep.${stepsValue[step]}.value`]: true,
        [`orderStep.${stepsValue[step]}.timestamp`]: serverTimestamp(),
        currentStage: "deliver",
        "orderStage.deliver": { value: true, timestamp: serverTimestamp() },
      })
        .then(() => {
          setIsSnackbarOpen(true);
          setStepUpdateObj({ open: false });
          setAlertMessage("Step Update Successfully");
          setAlertVariant("success");
          getData();
        })
        .catch((err) => console.log(err));
    }
  };

  const confirmOrder = async (confirm, userId, orderId) => {
    const docRef = doc(firebase.db, "users", userId, "orders", orderId);
    if (confirm === "Confirm") {
      await updateDoc(docRef, {
        "orderStep.confirm.value": true,
        "orderStep.confirm.timestamp": serverTimestamp(),
      })
        .then(() => {
          setIsSnackbarOpen(true);
          setModalData({ open: false });
          setAlertMessage("Order Confirmed Successfully");
          setAlertVariant("success");
          getData();
        })
        .catch((err) => console.log(err));
    } else {
      await updateDoc(docRef, {
        "orderStage.cancel.value": "cancel",
        "orderStage.cancel.timestamp": serverTimestamp(),
        currentStage: "cancel",
      })
        .then(() => {
          updateQuantity();
          setIsSnackbarOpen(true);
          setModalData({ open: false });
          setAlertMessage("Order Rejected Successfully");
          setAlertVariant("warning");
          getData();
        })
        .catch((err) => console.log(err));
    }
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

  const updateQuantity = async () => {
    modalData.product.forEach((item, index) => {
      productArr.forEach((data, ind) => {
        for (const key in data.size) {
          if (key === item.size && item.id === data.id) {
            data.size[key].map((sizeItem) => {
              if (item.color === sizeItem.color) {
                const docRef = doc(
                  firebase.db,
                  "products",
                  data.productDocumentId
                );
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
  };

  const getData = async () => {
    let userData = [];
    let products = [];
    let i = 0;
    let length = 0;
    const q = query(collection(firebase.db, "users"));
    const querySnapshot = await getDocs(q);
    length = querySnapshot.docs.length;
    // console.log("length", length)
    querySnapshot.forEach(async (doc) => {
      let pendingOrders = [];
      const p = query(
        collection(firebase.db, "users", doc.id, "orders"),
        where("currentStage", "==", "pending")
      );
      const orderSnapshot = await getDocs(p);
      ++i;

      orderSnapshot.forEach((order) => {
        pendingOrders.push(order.data());
      });
      if (pendingOrders.length !== 0) {
        userData.push({
          userId: doc.id,
          ...doc.data(),
          orders: [...pendingOrders],
        });
      }
      if (i === length) {
        console.log(userData);
        setUsers(userData);
      }
    });

    const product = query(collection(firebase.db, "products"));
    onSnapshot(product, (productSnapshot) => {
      productSnapshot.forEach((item) => {
        products.push({ productDocumentId: item.id, ...item.data() });
      });
      setProductArr(products);
    });
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      {users === null ? (
        <Stack justifyContent="center" alignItems="center" height="500px">
          <CircularProgress sx={{ color: "#f50e31" }} />
        </Stack>
      ) : (
        <Box>
          {users.length === 0 ? (
            <Stack height="500px" justifyContent="center" alignItems="center">
              <Typography variant="h4" color="green">
                No Pending Orders
              </Typography>
            </Stack>
          ) : (
            <Box>
              {users.map((userItem, index) => (
                <Box key={index} className={classes.userBox}>
                  <Typography variant="h6" className={classes.userHeading}>
                    {index + 1}. UserId: {userItem.userId}
                  </Typography>
                  <Box>
                    <Typography variant="h5" px={1}>
                      Pending Orders:
                    </Typography>
                    <Stack px={1} gap="20px">
                      {userItem.orders?.map((orderItem, index) => (
                        <Box
                          key={index}
                          bgcolor="white"
                          sx={{ border: "1px solid black" }}
                        >
                          <Box
                            display={"flex"}
                            p={1}
                            sx={{
                              background: "linear-gradient(white,#eeeded)",
                            }}
                          >
                            <Typography variant="h6">{index + 1}.</Typography>
                            <Typography variant="h6">
                              Order ID: {orderItem.orderId}
                            </Typography>
                          </Box>
                          {orderItem.orderStep.confirm.value ? (
                            <Box p={1} pl={5}>
                              <Stepper
                                activeStep={handleStepper(orderItem.orderStep)}
                                alternativeLabel={!mediumViewport}
                                orientation={
                                  mediumViewport ? "vertical" : "horizontal"
                                }
                              >
                                {steps.map((item, index) => {
                                  return (
                                    <Step key={index}>
                                      <StepLabel>
                                        <Box>
                                          <Typography>{item}</Typography>
                                          <Typography variant="caption">
                                            {getTime(
                                              orderItem.orderStep,
                                              index
                                            )}
                                          </Typography>
                                        </Box>
                                      </StepLabel>
                                    </Step>
                                  );
                                })}
                              </Stepper>
                              <Typography textAlign="right" p={1}>
                                <Button
                                  variant="contained"
                                  onClick={() =>
                                    handleUpdateStep(
                                      true,
                                      handleStepper(orderItem.orderStep),
                                      userItem.userId,
                                      orderItem.orderId
                                    )
                                  }
                                >
                                  Update Step
                                </Button>
                              </Typography>
                            </Box>
                          ) : (
                            <Box display="flex" gap="20px" p={1}>
                              <Button
                                variant="contained"
                                color="success"
                                onClick={() =>
                                  modalHandler(
                                    true,
                                    "Confirm",
                                    userItem.userId,
                                    orderItem.orderId
                                  )
                                }
                              >
                                Confirm
                              </Button>
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() =>
                                  modalHandler(
                                    true,
                                    "Reject",
                                    userItem.userId,
                                    orderItem.orderId,
                                    orderItem.productDetail
                                  )
                                }
                              >
                                Reject
                              </Button>
                            </Box>
                          )}

                          <OrderDetails data={orderItem} />
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}
      <Modal
        open={modalData.open}
        onClose={() => setModalData({ open: false })}
      >
        <Stack height="100%" justifyContent="center" alignItems="center">
          <Stack bgcolor="black" p={2} borderRadius="8px">
            <Typography variant="h6" color="white">
              Are You Sure You Want To {modalData.confirm} Order?
            </Typography>
            <Box>
              <Button
                color="success"
                onClick={() =>
                  confirmOrder(
                    modalData.confirm,
                    modalData.user,
                    modalData.order
                  )
                }
              >
                OK
              </Button>
              <Button
                color="error"
                onClick={() => setModalData({ open: false })}
              >
                Cancel
              </Button>
            </Box>
          </Stack>
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
          severity={alertVariant}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>

      <Modal
        open={stepUpdateObj.open}
        onClose={() => setStepUpdateObj({ open: false })}
      >
        <Stack height="100%" justifyContent="center" alignItems="center">
          <Stack bgcolor="black" p={2} borderRadius="8px">
            <Typography variant="h6" color="white">
              Confirm to Update The Present Step
            </Typography>
            <Box>
              <Button
                color="success"
                onClick={() =>
                  updateStep(
                    stepUpdateObj.step,
                    stepUpdateObj.user,
                    stepUpdateObj.order
                  )
                }
              >
                OK
              </Button>
              <Button
                color="error"
                onClick={() => setStepUpdateObj({ open: false })}
              >
                Cancel
              </Button>
            </Box>
          </Stack>
        </Stack>
      </Modal>
    </>
  );
}
