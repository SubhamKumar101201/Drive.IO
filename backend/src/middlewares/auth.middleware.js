import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler( async(req, _, next) => {

    const token = req.cookies?.accessToken || req.header("Authorization")?.split("Bearer")[1]
    
    if(!token) {
        return new ApiError(401, "Unauthorized request")
    }

    const decodeToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodeToken?._id).select("-password -refreshToken")

    if(!user) {
        return new ApiError(401, "Invalid Access Token")
    }

    req.user = user

    next()

})