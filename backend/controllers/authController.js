import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/genrateToken.js";


export const registerUser = asyncHandler(async (req, res) => {

    const { name, email, password, phone } = req.body;

   
    if (!name || !email || !password) {
        throw new ApiError(400, "Name, Email and Password are required");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(409, "User already exists");
    }

   
    const user = await User.create({
        name,
        email,
        password,
        phone
    });

   
    const token = generateToken(user);

   
    const userData = await User.findById(user._id).select("-password");

    return res.status(201).json(
        new ApiResponse(
            201,
            "User registered successfully",
            {
                token,
                user: userData
            }
        )
    );

});



export const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and Password are required");
    }

   
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    
    if (!user.isActive) {
        throw new ApiError(403, "Your account has been deactivated");
    }

  
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        throw new ApiError(401, "Invalid email or password");
    }

  
    user.lastLogin = new Date();
    await user.save();

   
    const token = generateToken(user);

  
    user.password = undefined;

    return res.status(200).json(
        new ApiResponse(
            200,
            "Login successful",
            {
                token,
                user
            }
        )
    );

});




export const getProfile = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            "Profile show successfully",
            user
        )
    );

});




export const logoutUser = asyncHandler(async (req, res) => {

    return res.status(200).json(
        new ApiResponse(
            200,
            "Logout successful"
        )
    );

});
