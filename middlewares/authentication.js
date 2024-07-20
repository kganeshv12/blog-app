// import cookie from "cookie-parser";
import auth from "../services/authentication.js";
const { createTokenForUser, validateToken } = auth;

function checkForAuthenticationCookie(cookieName){
    return(req,res,next) => {
        const tokenCookieValue = req.cookies[cookieName]
        if(!tokenCookieValue){
            console.log("token not found!")
            
            return next();
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
        } catch (error) {
            console.log("error from middlewares/auth is : " ,error)
        }
        return next();
    }
}


export default checkForAuthenticationCookie;