import { makeStyles } from "@mui/styles";

const useStyle= makeStyles((theme)=>({
    mainHeading:{
        backgroundColor:"black",
        color:"white",
        padding:"20px",
        width:"100%"
    },
    formBox:{
        display:"flex",
        flexDirection:"column",
        backgroundColor:"#00000010",
        gap:"20px",
        padding:"20px"
    },
    colorBox:{
        display:"flex",
        gap:"20px"
    }

}))

export default useStyle;