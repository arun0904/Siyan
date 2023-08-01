import { makeStyles } from "@mui/styles";
const useStyles = makeStyles((theme) => ({
  swiperslide_inner_box: {
    width: "100%",
    aspectRatio: "5.5/2.5",
    overflow: "hidden",
    position: "relative",
    "& img": { width: "100%", objectPosition: "top center" },
  },
  slider_text_box: {
    position: "absolute",
    textShadow: "0 2px 5px black",
    color: "white",
    bottom: "10%",
    left: "6%",
    " & .MuiTypography-h3": {
      color: "white",
      textShadow: "0 2px 5px black",
    },
    " & .MuiTypography-h6": {
      color: "white",
      textShadow: "0 2px 5px orange",
      cursor: "pointer",
      "&:hover": {
        color: "#B8F62A",
        textShadow: "0 2px 5px red",
      },
    },
  },
}));
export default useStyles;
