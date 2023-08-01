import { makeStyles } from "@mui/styles";



export const useStyles = makeStyles((theme) => ({
    navBarBackGround: {
        backgroundColor: "White !important",
        color: "black !important",
        margin: 0,
        maxWidth: "100% !important",
    },
    hr1: {

        borderLeft: "3px solid rgba(227, 26, 8, 0.718)",
    },

    Siyan: {
        fontSize: "2rem !important",
        fontFamily: "cursive !important",
        letterSpacing: "3px !important",
    },
    

    Next: {
        whiteSpace: "nowrap ",
        fontFamily: "fantasy !important",
        fontSize: "0.8rem !important",
    },

    LogoDiv: {
        display: "flex",
    },

    NavBarLogo: {
        width: "100%",
        aspectRatio: "1/1 !important",
    },
    CompanyNametext: {
        fontSize: '40px !important',
        textShadow: "1px 6px 5px #4bc8ff",
        color: "black",
        bottom: "10%",
        left: "6%",
    },
    SignInLogo: {
        fontSize: '1.8rem !important',
        marginLeft: "10px",
        marginTop:"5px",
        cursor:"pointer"
    },
}));
export default useStyles;