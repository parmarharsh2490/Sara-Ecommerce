import User from "../model/User.model.js";
import jwt from "jsonwebtoken"
import ApiError from "../utils/ApiError.js";
import { ACCESS_TOKEN_SECRET_KEY } from "./../constants.js"
export const verifyJWT = async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
        const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET_KEY);
        const user = await User.findById(decodedToken?.data._id).select("-password -refreshToken")
        if (!user) {         
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        next(new ApiError(400,"Invalid access token"))
    }
    
}