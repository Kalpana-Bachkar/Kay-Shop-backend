import jwt from 'jsonwebtoken'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import User from '../Models/user.js'

export const verifyJwt = asyncHandler(async (req, res, next) => {
    try {
        console.log("Cookies received:", req.cookies);
        const token = req.cookies?.accessToken

        if (!token) {
            console.log("No access token found");
            throw new ApiError(401, 'Unauthorized request')
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if (!user) {
            throw new ApiError(403, 'Invalid access token')

        }
        req.user = user;
        next()
    }
    catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})