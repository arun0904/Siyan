import { makeStyles } from "@mui/styles";

const useStyle = makeStyles((theme) => ({
  profileTabPanel: {
    width: "100%",
    padding: "10px",
    "& .MuiStack-root": {
      alignItems: "center",
      gap: "20px",
    },
  },
  profilePicBox: {
    width: "100px",
    aspectRatio: 1,
    borderRadius: "50%",
    overflow: "hidden",
  },
  profileStack: {
    flexDirection: "row !important",
    width: "100%",
    "& .MuiTypography-root": {
      flexBasis: "150px",
    },
  },
  profileCard: {
    
    backgroundColor: "#00000005",
    padding: "20px",
    borderRadius: "8px",
    "& .MuiStack-root": {
      flexDirection: "row",
      margin: "10px 0",
      justifyContent: "space-between",
    },
  },
}));

export default useStyle;