import { makeStyles } from "@mui/styles";

const useStyle = makeStyles((theme) => ({

  tabStyle:{
    borderRight: "1px solid #cccccc",
    backgroundColor:"#eeeded",
       
    "& .MuiTab-root":{
        color:"black",
        "&.Mui-selected": {
            color: "#f50e31"
          },
    },
},
}));

export default useStyle;
