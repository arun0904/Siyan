import { makeStyles } from "@mui/styles";

const useStyle = makeStyles((theme) => ({
  gridcomponent: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    padding: "20px",
    justifyContent: "center",
  },
  banner: {
    backgroundColor: "black",
    color: "white",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
    minHeight: "400px",
    padding:"20px",
    "& .MuiCardMedia-root": {
      maxWidth: "200px",
      transform: "rotate(8deg)",
    },
    "& .MuiTypography-root": {
      fontWeight: "bold",
    },
  },
  banner_image_div: {
    transform: "rotate(-8deg)",
    backgroundColor: "orange",
  },
  categories_div: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "space-around",
    padding: "20px",
    "& .MuiCard-root": {
      padding: "20px",
      backgroundColor: "black",

      cursor: "pointer",
      "& .MuiCardMedia-root": {
        transitionProperty: "transform",
        transitionDuration: "0.3s",
      },
      "&:hover": {
        "& .MuiCardMedia-root": {
          transform: "perspective(800px) translatez(20px)",
        },
      },
    },

    "& .MuiCardMedia-root": {
      maxWidth: "500px",
    },
    "& .MuiTypography-h5": {
      color: "white",
      padding: "10px",
      textAlign: "center",
    },
  },
  clothingtypes: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: "20px",
    gap: "20px",
    "& .MuiCard-root": {
      maxWidth: "320px",

      position: "relative",
      "& .MuiCardMedia-root": {
        height: "500px",
      },
      "& .MuiBox-root": {
        cursor: "pointer",
        position: "absolute",
        bottom: "-115px",
        backgroundColor: "black",
        padding: "30px",
        color: "white",
        textAlign: "center",
        width: "100%",
        height: "200px",
        margin: "auto",
        borderRadius: "50%",
        "& .MuiTypography-root": {
          fontSize: "20px",
        },
      },
    },
  },
}));
export default useStyle;
