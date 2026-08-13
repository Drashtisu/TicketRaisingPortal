import User from "../models/User.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, "Users fetched successfully", {
      users
    })
  );
});

export const updateUser = asyncHandler(async (req, res) => {
  const { role, isActive } = req.body;

  if (role !== undefined && !["user", "agent", "admin"].includes(role)) {
    throw new ApiError(400, "Invalid user role.");
  }

  if (isActive !== undefined && typeof isActive !== "boolean") {
    throw new ApiError(400, "isActive must be a boolean.");
  }

  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found.");

  if (user._id.equals(req.user._id) && (role !== undefined || isActive === false)) {
    throw new ApiError(400, "You cannot change your own role or deactivate yourself.");
  }

  if (role !== undefined) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;
  await user.save();

  const userData = await User.findById(user._id).select("-password");
  return res.status(200).json(new ApiResponse(200, "User updated successfully", userData));
});
