import Ticket from "../models/Ticket.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalTickets = await Ticket.countDocuments();
  const openTickets = await Ticket.countDocuments({ status: { $nin: ["Resolved", "Closed", "Rejected"] } });
  const resolvedTickets = await Ticket.countDocuments({ status: "Resolved" });
  const closedTickets = await Ticket.countDocuments({ status: "Closed" });

  return res.status(200).json(
    new ApiResponse(200, "Dashboard fetched successfully", {
      totalTickets,
      openTickets,
      resolvedTickets,
      closedTickets
    })
  );
});
