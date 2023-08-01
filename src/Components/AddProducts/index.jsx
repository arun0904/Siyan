import React, { useState } from "react";
import useStyle from "./style.js";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  Button,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  Stack,
  Modal,
  CircularProgress,
} from "@mui/material";
import {
  Cancel,
  CheckCircleSharp,
  Clear,
  KeyboardArrowDown,
  KeyboardArrowLeft,
} from "@mui/icons-material";
import { useFirebase } from "../../Context/Firebase.jsx";

const productSize = [
  { title: "XS", show: false },
  { title: "S", show: false },
  { title: "M", show: false },
  { title: "L", show: false },
  { title: "XL", show: false },
  { title: "XXL", show: false },
];

export default function AddProduct() {
  const classes = useStyle();
  const firebase = useFirebase();
  const [xsColors, setxsColors] = useState([]);
  const [sColors, setsColors] = useState([]);
  const [mColors, setmColors] = useState([]);
  const [lColors, setlColors] = useState([]);
  const [xlColors, setxlColors] = useState([]);
  const [xxlColors, setxxlColors] = useState([]);
  const [colorObject, setColorObject] = useState({
    color: "",
    quantity: "",
    imgSrc: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [wait, setWait] = useState(false);
  const [sizeArr, setSizeArr] = useState(productSize);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleShow = (index) => {
    setSizeArr(
      sizeArr.map((item, ind) =>
        ind === index ? { ...item, show: !item.show } : { ...item, show: false }
      )
    );
  };

  const handleColorArray = (index) => {
    switch (index) {
      case 0:
        return xsColors;
      case 1:
        return sColors;
      case 2:
        return mColors;
      case 3:
        return lColors;
      case 4:
        return xlColors;
      case 5:
        return xxlColors;
    }
  };

  const handleColorAdd = (number) => {
    if (
      colorObject.color === "" ||
      colorObject.quantity === "" ||
      colorObject.imgSrc === ""
    ) {
      alert("please fill required filled first");
      return null;
    } else {
      switch (number) {
        case 0:
          setxsColors([...xsColors, colorObject]);
          break;
        case 1:
          setsColors([...sColors, colorObject]);
          break;
        case 2:
          setmColors([...mColors, colorObject]);
          break;
        case 3:
          setlColors([...lColors, colorObject]);
          break;
        case 4:
          setxlColors([...xlColors, colorObject]);
          break;
        case 5:
          setxxlColors([...xxlColors, colorObject]);
          break;
      }
      setColorObject({ color: "", quantity: "", imgSrc: "" });
    }
  };

  const handleDelete = (number, index) => {
    switch (number) {
      case 0:
        setxsColors((xsColors) =>
          xsColors.filter((item, ind) => ind !== index)
        );
        break;
      case 1:
        setsColors((sColors) => sColors.filter((item, ind) => ind !== index));
        break;
      case 2:
        setmColors((mColors) => mColors.filter((item, ind) => ind !== index));
        break;
      case 3:
        setlColors((lColors) => lColors.filter((item, ind) => ind !== index));
        break;
      case 4:
        setxlColors((xlColors) =>
          xlColors.filter((item, ind) => ind !== index)
        );
        break;
      case 5:
        setxxlColors((xxlColors) =>
          xxlColors.filter((item, ind) => ind !== index)
        );
        break;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setModalOpen(true);
    setWait(true);
    let checkId = false;
    const size = {
      xs: xsColors,
      s: sColors,
      m: mColors,
      l: lColors,
      xl: xlColors,
      xxl: xxlColors,
    };
    const data = new FormData(event.currentTarget);
    console.log(firebase.product);
    firebase.product.map((item) => {
      if (item.id === data.get("productid")) {
        setErrorMessage("Product with same Id already Exist");
        setWait(false);
        setTimeout(() => {
          setModalOpen(false);
          setErrorMessage(null);
        }, 3000);
        checkId = true;
      }
    });
    if (!checkId) {
      firebase
        .addProduct(
          data.get("productid"),
          data.get("name"),
          data.get("description"),
          data.get("category"),
          data.get("subCategory"),
          parseFloat(data.get("mrp")),
          parseFloat(data.get("discount")),
          size
        )
        .then(() => {
          firebase.productView();
          setWait(false);
          setTimeout(() => setModalOpen(false), 3000);
        })
        .catch((err) => {
          setErrorMessage("Something Went Wrong!");
          setWait(false);
          setTimeout(() => {
            setModalOpen(false);
            setErrorMessage(null);
          }, 3000);
        });
    }
  };

  return (
    <>
      <Box border="1px solid #eeeded">
        <Typography variant="h5" className={classes.mainHeading}>
          Add Product
        </Typography>
        <Box>
          <Box
            component="form"
            className={classes.formBox}
            onSubmit={handleSubmit}
          >
            <TextField
              label="Product ID"
              id="productid"
              name="productid"
              type="text"
              required
            />
            <TextField
              label="Product Name"
              id="name"
              name="name"
              type="text"
              required
            />
            <TextField
              label="Description"
              id="description"
              name="description"
              type="text"
              multiline
              required
            />
            <Box>
              <FormControl>
                <FormLabel id="category">Category</FormLabel>
                <RadioGroup aria-labelledby="category" name="category" required>
                  <FormControlLabel
                    value="men"
                    control={<Radio />}
                    label="Men"
                  />
                  <FormControlLabel
                    value="women"
                    control={<Radio />}
                    label="Women"
                  />
                </RadioGroup>
              </FormControl>

              <FormControl>
                <FormLabel id="subCategory">Sub-Category</FormLabel>
                <RadioGroup aria-labelledby="subCategory" name="subCategory">
                  <FormControlLabel
                    value="topwear"
                    control={<Radio />}
                    label="Topwear"
                  />
                  <FormControlLabel
                    value="bottomwear"
                    control={<Radio />}
                    label="Bottomwear"
                  />
                </RadioGroup>
              </FormControl>
            </Box>

            <TextField
              label="MRP"
              id="mrp"
              name="mrp"
              type="number"
              required
              InputProps={{ inputProps: { min: 0 } }}
            />
            <TextField
              label="Discount"
              id="discount"
              name="discount"
              type="number"
              defaultValue={0}
              InputProps={{ inputProps: { min: 0, max: 100 } }}
            />

            {sizeArr.map((item, index) => (
              <Box bgcolor="white" borderRadius="8px" overflow="hidden">
                <Stack
                  p={1}
                  sx={{ background: "linear-gradient(white, #eeeded)" }}
                  flexDirection="row"
                  justifyContent="space-between"
                >
                  <Typography>{item.title}</Typography>
                  <Typography
                    onClick={() => handleShow(index)}
                    sx={{ cursor: "pointer" }}
                  >
                    {item.show ? <KeyboardArrowDown /> : <KeyboardArrowLeft />}
                  </Typography>
                </Stack>
                <Box px={2} sx={{ display: item.show ? "block" : "none" }}>
                  {handleColorArray(index).map((colorItem, colorIndex) => (
                    <Box key={colorIndex} display="flex" gap="20px" my={2}>
                      <Box className={classes.colorBox}>
                        <Typography variant="h5">Color:</Typography>
                        <Typography variant="h6">{colorItem.color}</Typography>
                        <Typography variant="h5">Quantity:</Typography>
                        <Typography variant="h6">
                          {colorItem.quantity}
                        </Typography>
                        <Typography variant="h5">Image:</Typography>
                        <Typography variant="h6">
                          {colorItem?.imgSrc?.name}
                        </Typography>
                      </Box>

                      <Typography
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleDelete(index, colorIndex)}
                      >
                        <Clear />
                      </Typography>
                    </Box>
                  ))}{" "}
                  <Box display="flex" gap="20px" my={2} flexWrap="wrap">
                    {" "}
                    <TextField
                      label="Color"
                      id="color"
                      name="color"
                      type="text"
                      size="small"
                      sx={{ width: "250px" }}
                      value={colorObject.color}
                      onChange={(e) => {
                        setColorObject({
                          ...colorObject,
                          color: e.target.value,
                        });
                      }}
                    />
                    <TextField
                      label="Quantity"
                      id="quantity"
                      name="quantity"
                      type="number"
                      size="small"
                      sx={{ width: "250px" }}
                      value={colorObject.quantity}
                      onChange={(e) => {
                        setColorObject({
                          ...colorObject,
                          quantity: parseInt(e.target.value),
                        });
                      }}
                      InputProps={{ inputProps: { min: 1 } }}
                    />
                    <TextField
                      label="Image Source"
                      id="image"
                      name="image"
                      type="file"
                      size="small"
                      sx={{ width: "250px" }}
                      onChange={(e) => {
                        setColorObject({
                          ...colorObject,
                          imgSrc: e.target.files[0],
                        });
                      }}
                      focused
                    />{" "}
                    <Typography textAlign="right">
                      <Button onClick={() => handleColorAdd(index)}>Add</Button>
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}

            <Button type="submit">Add</Button>
            <Button type="reset">Reset</Button>
          </Box>
        </Box>
      </Box>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Stack
          height="100%"
          backgroundColor="#282726f4"
          justifyContent="center"
          alignItems="center"
        >
          {wait ? (
            <Stack alignItems="center" gap="30px">
              <CircularProgress sx={{ color: "#f50e31" }} />
              <Typography variant="h5" color="#f50e31">
                Please Wait . . . .{" "}
              </Typography>
            </Stack>
          ) : (
            <Box>
              {errorMessage === null ? (
                <Stack color="green">
                  <Typography variant="h1" textAlign="center">
                    <CheckCircleSharp fontSize="200px" />
                  </Typography>
                  <Typography variant="h3" textAlign="center">
                    Product Added Successfully
                  </Typography>
                </Stack>
              ) : (
                <Stack color="red">
                  <Typography variant="h1" textAlign="center">
                    <Cancel fontSize="200px" />
                  </Typography>
                  <Typography variant="h3" textAlign="center">
                    {errorMessage}
                  </Typography>
                </Stack>
              )}
            </Box>
          )}
        </Stack>
      </Modal>
    </>
  );
}
