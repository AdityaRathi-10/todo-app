import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"

async function verifyJWT(req, res, next) {
    try {
        const token = req.cookies?.accessToken

        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        if (!decodedToken) {
            return new ApiError(401, "Token expired")
        }
    
        const user = await User.findById(decodedToken._id).select("-password -refreshToken")
    
        if (!user) {
            return new ApiError(401, "Invalid access token")
        }
    
        req.user = user
        next()
    } catch (err) {
        return res.status(err.statusCode || 500).redirect("/")
    }
}

export { verifyJWT }