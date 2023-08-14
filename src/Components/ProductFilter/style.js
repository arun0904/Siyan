import { makeStyles } from "@mui/styles";

const useStyle = makeStyles((theme) => ({
  filterDiv: {
    color: "white",
    fontFamily: "arial",
    padding: "20px",
    lineHeight: "30px",
    width: "100%",
    "& .MuiFormControlLabel-root": { whiteSpace: "nowrap" },
    "& .MuiRadio-root": {
      color: "rgb(255, 52, 20)",
      "&.Mui-checked": {
        color: "rgb(255, 52, 20)",
      },
    },
  },
}));
export default useStyle;
