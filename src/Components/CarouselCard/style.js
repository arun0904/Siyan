import { makeStyles } from "@mui/styles";
const useStyle = makeStyles((theme) => ({
  card_wrapper: {
    width: "200px",
    "&:hover": {
      boxShadow: "0 2px 5px 5px #66616199",
    },
    "& .MuiCardMedia-root": {
      height: "150px",
      padding: "10px",
      aspectRatio: "1/1",
      objectFit: "contain",
      "&:hover": {
        transform: "perspective(800px) translatez(20px)",
        transitionProperty: "transform",
        transitionDuration: "0.5s",
      },
    },
  },
  DetailsLink: {
    cursor: "pointer",
    textDecoration: "underline",
    "&:hover": {
      color: "#F50E31",
      
    },
  },
}));
export default useStyle;
