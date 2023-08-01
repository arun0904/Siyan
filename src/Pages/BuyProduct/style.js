import { makeStyles } from "@mui/styles";
const useStyles = makeStyles((theme) => ({
  mainStack: {
    alignItems: "center",
    padding: "20px",
  },
  addressBox: { borderRadius: "8px", overflow: "hidden" },
  viewDefaultStack: {
    display:"flex",
    cursor: "pointer",
    padding: "2px 10px",
    borderRadius: "8px",
    color: "#8b8888",
    background: "linear-gradient(white, #eeeded)",
    flexDirection:"row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalStack: {
    height: "100%",
    width: "100%",
    backgroundColor: "#282726f4",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer:{
    padding:"10px",
    "& .MuiButton-root":{
      width:"100px",
      backgroundColor:"black",
      "&:hover":{
        backgroundColor:"black"
      }
    }
  },
  textFlex:{flexDirection:"row !important",
  justifyContent:"space-between",
  alignItems:"center"
},
paymentButton:{
  width:"100%",
  backgroundColor:"#f50e31 !important"
}
}));

export default useStyles;
