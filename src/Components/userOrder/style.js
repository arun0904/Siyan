import { makeStyles } from "@mui/styles";

 const useStyles=makeStyles((theme)=>({
    stepperColors: {
        "& .Mui-active .MuiStepIcon-root": { color: "red" },
        "& .Mui-completed .MuiStepIcon-root": { color: "green" },
      },
    orderBox:{
        border:"1px solid #eeeded",
        borderRadius:"8px",
        overflow:"hidden",
        backgroundColor:"#eeeded"
    },
    orderIdBox:{
        backgroundColor:"black",
        display:"flex",
        color:"white",
        padding:"10px",
        flexWrap:"wrap",
        "& .MuiTypography-root":{
            color:"white",
            fontSize:"20px",
            whiteSpace:"nowrap",
            overflow:"hidden",
            textOverflow:"ellipses"

        }  
    },
    loaderStack:{
        minHeight:"500px",
        justifyContent:"center",
        alignItems:"center",
    },
    productStack:{
        flexDirection:"row !important",
        gap:"20px",
        justifyContent:"space-between",
        flexWrap:"wrap"
    },
    orderFilter:{
        flexDirection:"row !important",
        padding:"10px",
        gap:"10px",
        height:"20px",
        marginBottom:"10px",
        "& .MuiTypography-root":{
            cursor:"pointer",
            width:"90px",
            "&:hover":{
                fontSize:"21px"
            }
        }
    },
    activeTab:{
        color:"#f50e31",
        textDecoration:"underline"
    }
}))

export default useStyles;