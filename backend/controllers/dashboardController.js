import Ticket from "../models/Ticket.js";
import User from "../models/User.js";
import Department from "../models/Department.js";
import Category from "../models/Category.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  const { role, _id: userId } = req.user;
  const userRole = (role || "user").toString().toLowerCase().trim();

  let query = {};
  if (userRole === "admin") {
    query = {};
  } else if (userRole === "agent") {
    query = { assignedAgent: userId };
  } else {
    query = { createdBy: userId };
  }

  const [
    totalTickets,
    openTickets,
    inProgressTickets,
    resolvedTickets,
    closedTickets,
    myCreatedTicketsCount,
    myAssignedTicketsCount,
    tickets
  ] = await Promise.all([
    Ticket.countDocuments(query),
    Ticket.countDocuments({
      ...query,
      status: { $nin: ["Resolved", "Closed", "Rejected"] }
    }),
    Ticket.countDocuments({
      ...query,
      status: "In Progress"
    }),
    Ticket.countDocuments({
      ...query,
      status: "Resolved"
    }),
    Ticket.countDocuments({
      ...query,
      status: "Closed"
    }),
    Ticket.countDocuments({ createdBy: userId }),
    Ticket.countDocuments({ assignedAgent: userId }),
    Ticket.find(query)
      .populate("createdBy", "name email")
      .populate("assignedAgent", "name email")
      .populate("department", "name code")
      .populate("category", "name code")
      .sort({ updatedAt: -1 })
      .limit(10)
  ]);

  const userCreatedCount = userRole === "user" ? totalTickets : myCreatedTicketsCount;
  const agentAssignedCount = userRole === "agent" ? totalTickets : myAssignedTicketsCount;

  return res.status(200).json(
    new ApiResponse(200, "Dashboard fetched successfully", {
      role,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      },
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      closedTickets,
      myCreatedTicketsCount: userCreatedCount,
      myAssignedTicketsCount: agentAssignedCount,
      tickets
    })
  );
});
