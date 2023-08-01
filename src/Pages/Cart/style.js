import { makeStyles } from "@mui/styles";

const useStyle = makeStyles((theme) => ({
  cardWrapper: {
    boxShadow: "0 2px 4px ",
    borderRadius: "8px",
    margin: "5px 0",
  },
  textFlex: {
    flexDirection: "row !important",
    alignItems: "flex-end",
    justifyContent: "space-between",
    fontSize: "25px",
    margin: "10px 0",
  },
  cartImageDiv:{
    display:"flex",
    backgroundColor:"#00000017",
    padding:"60px 60px 60px 50px",
    aspectRatio:1,
    borderRadius:"50%"
  },
  shoppingButton:{  backgroundColor: "black !important",
}
}));

export default useStyle;
