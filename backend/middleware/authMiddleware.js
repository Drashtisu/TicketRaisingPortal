import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";



export const protect = asyncHandler(async (req, res, next) => {

    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    
    if (!token) {
        throw new ApiError(
            401,
            "Access denied. No token provided."
        );
    }

    try {

       
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            throw new ApiError(
                401,
                "User not found."
            );
        }

       
        if (!user.isActive) {
            throw new ApiError(
                403,
                "Your account has been deactivated."
            );
        }

       
        req.user = user;

        next();

    } catch (error) {

        if (error.name === "TokenExpiredError") {
            throw new ApiError(
                401,
                "Token has expired. Please login again."
            );
        }

        if (error.name === "JsonWebTokenError") {
            throw new ApiError(
                401,
                "Invalid token."
            );
        }

        throw error;
    }

});