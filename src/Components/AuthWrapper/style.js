import { makeStyles } from "@mui/styles";



export const useStyles = makeStyles((theme) => ({
    Siyan: {
        borderBottom: "1px solid #ffac0c",
        fontSize: "2.5rem !important",
        fontFamily: "cursive !important",
        letterSpacing: "5px !important",
        color: "#ff0c31",
        textAlign: 'center',
        padding: "15px 0",
    },
    Next: {
        whiteSpace: "nowrap",
        fontFamily: "fantasy !important",
        fontSize: "1rem !important",
        color: "Black",
        textAlign: 'center',
        padding: "15px 0",
    },

    LogoDiv: {
        borderBottom: "1px solid #ffac0c",
        paddingBottom: "15px",
        display: "flex",
        justifyContent: "center",

    },

    NavBarLogo: {
        width: "100px",
        aspectRatio: "1/1 !important",
    },
}));
export default useStyles;