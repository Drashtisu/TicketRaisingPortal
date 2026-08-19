import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getUsers = asyncHandler(async (req, res) => {
  let { page = 1, limit = 10 } = req.query;
  page = Math.max(Number(page) || 1, 1);
  limit = Math.min(Math.max(Number(limit) || 10, 1), 100);

  const [totalUsers, users] = await Promise.all([
    User.countDocuments(),
    User.find().select("-password").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit)
  ]);

  const totalPages = Math.ceil(totalUsers / limit);

  return res.status(200).json(
    new ApiResponse(200, "Users fetched successfully", {
      users,
      pagination: {
        totalUsers,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
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

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) throw new ApiError(404, "User not found.");

  if (user._id.equals(req.user._id)) {
    throw new ApiError(400, "You cannot delete your own account.");
  }

  await user.deleteOne();
  return res.status(200).json(new ApiResponse(200, "User deleted successfully"));
});
