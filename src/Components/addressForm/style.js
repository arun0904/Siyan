import { makeStyles } from "@mui/styles";
const useStyles = makeStyles((theme) => ({
  formBox: {
    marginTop: "30px",
    maxWidth: "600px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: "1px solid #eeeded",
    padding: "20px",
    "& .MuiTypography-root": {
      textAlign: "center",
      backgroundColor: "black",
      color: "white",
      width: "100%",
      padding: "20px",
      marginBottom: "10px",
    },
  },
}));
export default useStyles;
