import { makeStyles } from "@mui/styles";

const useStyle=makeStyles((theme)=>({
    mainBox:{
        display:"flex",
        justifyContent:"center",
        padding:"40px 0"
    },
    imageBox:{
        padding:"10px",
        "& .MuiCardMedia-root":{
            minWidth:"250px",
            objectFit:"contain"
        }
    },
    collectionText:{
        textTransform:"uppercase",
        fontWeight:"700 !important",
        color:"rgb(252,50,20)"
    },
    titleText:{
        fontWeight:"700 !important", 
        maxWidth:"500px"
    },
    priceBox:{
        display:"flex",
        margin:"10px 0 5px 0"
    },
    mrpText:{
        color:"#A0A0A0",
        textDecoration:"line-through"
    },
    selectSizeText:{
        color:"#A0A0A0",
    },
    sizeBoxContainer:
    {display:"flex",gap:"10px",margin:"10px 0",
    flexWrap:"wrap",
    "& .MuiButton-root":{
        aspectRatio:"1",
        borderRadius:"50%",
    }},
    colorBoxContainer:
    {display:"flex",gap:"10px",margin:"10px 0",
    "& .MuiBox-root":{
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        width:"60px",
        height:"60px",
        border:"3px solid #a0a0a0",
        cursor:"pointer",
        borderRadius:"10px",
        "& .MuiCardMedia-root":{
            height:"52px",
            objectFit:"contain"
        }
    }},
    wishlistButtonBox:{
        display:"flex",
        gap:"15px",
        margin:"20px 0",
        flexWrap:"wrap",
        "& .MuiButton-root":{
            width:"180px",
            height:"45px",           
            backgroundColor:"#a0a0a0"
        },
        "& :hover":{
            backgroundColor:"#F50E31 !important"
        }
    },gridcomponent: {
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
      tdiv:{
        // backgroundColor:"orange",
        display:"flex",
        flexDirection:"row",
        overflowX:"scroll",
        // margin:"0 30px",
     
      }
}))

export default useStyle;