import { makeStyles} from "@mui/styles";

const useStyles=makeStyles((theme)=>({
    stepperColors: {
        "& .Mui-active .MuiStepIcon-root": { color: "red" },
        "& .Mui-completed .MuiStepIcon-root": { color: "green" },
      },
    userBox:{
        display:"flex",
        gap:"20px",
        border:"1px solid black",
        flexDirection:"column",
        borderRadius:"8px",
        marginBottom:"20px",
        backgroundColor:"#eeeded",
        overflow:"hidden"
    },
    userHeading:{
        backgroundColor:"black",
        color:"white",
        padding:"10px"
    },
    orderFieldBox:{
        display:"flex"
    }

}));
export default useStyles;