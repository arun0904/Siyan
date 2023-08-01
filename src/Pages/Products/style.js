import { makeStyles } from "@mui/styles";

const useStyle = makeStyles((theme) => ({
  wrapperDiv: {
    display: "flex",
    flexDirection: "column",
  },
  productGridDiv: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
  },
  CircularProgressBox: {
    display: "flex",
    bgcolor: "orange",
    width: "100%",
    height: "700px",
    justifyContent: "center",
    alignItems: "center",
  },
}));
export default useStyle;
