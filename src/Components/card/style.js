import { makeStyles } from "@mui/styles";
const useStyle = makeStyles((theme) => ({
  card_wrapper: {
    position: "relative",
    maxWidth: "280px",
    "&:hover": {
      boxShadow: "0 2px 5px 5px #66616199",
    },
    "& .MuiCardMedia-root": {
      padding:"10px",
      height:"250px",
      aspectRatio:"1/1.2", objectFit:"contain",
      "&:hover": {
        transform: "perspective(800px) translatez(20px)",
        transitionProperty: "transform",
        transitionDuration: "0.5s",
      },
      
    },
    "& .MuiButton-contained": {
      backgroundColor: "black",
      "&:hover": {
        backgroundColor: "black",
      },
      "&:active": {
        backgroundColor: "rgb(255,52,20)",
      },
    },
  },
  wishlistIcon: {
    color: "red !important",
    position: "absolute !important",
    right: "10px",
    top: "10px",
    cursor: "pointer",
  },
}));
export default useStyle;
