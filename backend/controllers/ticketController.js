import mongoose from "mongoose";
import Ticket from "../models/Ticket.js";
import Department from "../models/Department.js";
import Category from "../models/Category.js";
import User from "../models/User.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateTicketNumber from "../utils/ticketNumber.js";

const priorities = ["Low", "Medium", "High", "Critical"];
const statuses = [
  "Pending",
  "Assigned",
  "In Progress",
  "Resolved",
  "Closed",
  "Rejected",
  "Reopened",
];
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const populateTicket = (query) =>
  query
    .populate("createdBy", "name email role")
    .populate("department", "name code")
    .populate("category", "name code")
    .populate("assignedAgent", "name email")
    .populate("workLogs.createdBy", "name email");

const validateRelations = async ({ department, category, assignedAgent }) => {


  if (assignedAgent !== undefined && assignedAgent !== null) {
    if (
      !isValidId(assignedAgent) ||
      !(await User.exists({
        _id: assignedAgent,
        role: "agent",
        isActive: true,
      }))
    ) {
      throw new ApiError(400, "Assigned agent must be an active agent.");
    }
  }
};

export const createTicket = asyncHandler(async (req, res) => {
  const { title, description, department, category, priority } = req.body;

  if (!title?.trim() || !description?.trim()) {
    throw new ApiError(400, "Title and description are required.");
  }

  if (priority !== undefined && !priorities.includes(priority)) {
    throw new ApiError(400, "Invalid priority.");
  }

  await validateRelations({ department, category });

  const ticket = await Ticket.create({
    ticketNumber: await generateTicketNumber(),

    title: title.trim(),

    description: description.trim(),

    department: department || null,

    category: category || null,

    priority: priority || null,

    createdBy: req.user._id,
  });

  const populatedTicket = await populateTicket(Ticket.findById(ticket._id));

  return res
    .status(201)
    .json(
      new ApiResponse(201, "Ticket created successfully.", populatedTicket),
    );
});


export const getMyTickets = asyncHandler(async (req, res) => {
  let {
   
    status,
    priority,
    department,
    category,
    startDate,
    endDate,
    sortBy = "createdAt",
    order = "desc",
  } = req.query;



  const query = { createdBy: req.user._id };

  if (status) {
    if (!statuses.includes(status)) throw new ApiError(400, "Invalid status.");

    query.status = status;
  }

  if (priority) {
    if (!priorities.includes(priority))
      throw new ApiError(400, "Invalid priority.");

    query.priority = priority;
  }

  if (department) {
    if (!isValidId(department))
      throw new ApiError(400, "Invalid Department ID.");
    query.department = department;
  }

  if (category) {
    if (!isValidId(category)) throw new ApiError(400, "Invalid Category ID.");
    query.category = category;
  }

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

 
  const allowedSort = [
    "createdAt",
    "updatedAt",
    "priority",
    "status",
    "ticketNumber",
  ];

  if (!allowedSort.includes(sortBy)) sortBy = "createdAt";

  const [totalTickets, tickets] = await Promise.all([
    Ticket.countDocuments(query),

    populateTicket(Ticket.find(query))
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit),
  ]);



  return res
    .status(200)
    .json(
      new ApiResponse(200, "Tickets fetched successfully.", {
        tickets,
        
      }),
    );
});

export const getTicketById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) throw new ApiError(400, "Invalid Ticket ID.");

  const ticket = await populateTicket(Ticket.findById(id));

  if (!ticket) throw new ApiError(404, "Ticket not found.");

  const ownsTicket = ticket.createdBy._id.equals(req.user._id);

  const isAssignedAgent = ticket.assignedAgent?._id.equals(req.user._id);

  if (!ownsTicket && req.user.role !== "admin" && !isAssignedAgent)
    throw new ApiError(403, "You are not authorized to view this ticket.");

  return res
    .status(200)
    .json(new ApiResponse(200, "Ticket fetched successfully.", ticket));
});

export const updateTicket = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) throw new ApiError(400, "Invalid Ticket ID.");

  const ticket = await Ticket.findById(id);

  if (!ticket) throw new ApiError(404, "Ticket not found.");

  const isOwner = ticket.createdBy.equals(req.user._id);

  if (req.user.role !== "admin" && !isOwner)
    throw new ApiError(403, "You are not allow to update this ticket.");

  if (ticket.status === "Closed")
    throw new ApiError(400, "Closed tickets cannot be updated.");

  const {
    title,
    description,
    priority,
    department,
    category,
    assignedAgent,
    status,
    resolution,
  } = req.body;

  if (
    req.user.role !== "admin" &&
    [priority, department, category, assignedAgent, status, resolution].some(
      (value) => value !== undefined,
    )
  ) {
    throw new ApiError(
      403,
      "Only an admin can change ticket assignment",
    );
  }

  if (title !== undefined) {
    if (!title.trim()) throw new ApiError(400, "Title cannot be empty.");
    ticket.title = title.trim();
  }

  if (description !== undefined) {
    if (!description.trim())
      throw new ApiError(400, "Description cannot be empty.");
    ticket.description = description.trim();
  }

  if (priority !== undefined && !priorities.includes(priority))
    throw new ApiError(400, "Invalid priority.");

  if (status !== undefined && !statuses.includes(status))
    throw new ApiError(400, "Invalid status.");
  await validateRelations({
    department: department !== undefined ? department : ticket.department,
    category: category !== undefined ? category : ticket.category,
    assignedAgent,
  });

  if (priority !== undefined) ticket.priority = priority;

  if (department !== undefined) ticket.department = department || null;

  if (category !== undefined) ticket.category = category || null;

  if (assignedAgent !== undefined) {
    ticket.assignedAgent = assignedAgent || null;
    if (assignedAgent && ticket.status === "Pending")
      ticket.status = "Assigned";
  }

  if (status !== undefined) ticket.status = status;

  if (resolution !== undefined) ticket.resolution = resolution.trim();

  if (ticket.status === "Closed" && !ticket.closedAt)
    ticket.closedAt = new Date();

  if (ticket.status === "Reopened") {
    ticket.closedAt = null;
    ticket.reopenedCount += 1;
  }

  await ticket.save();

  const populatedTicket = await populateTicket(Ticket.findById(ticket._id));

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Ticket updated successfully.", populatedTicket),
    );
});

export const deleteTicket = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) throw new ApiError(400, "Invalid Ticket ID.");

  const ticket = await Ticket.findById(id);

  if (!ticket) throw new ApiError(404, "Ticket not found.");

  if (req.user.role !== "admin" && !ticket.createdBy.equals(req.user._id))
    throw new ApiError(403, "You are not allow to delete this ticket.");

  if (ticket.status === "Closed")
    throw new ApiError(400, "Closed tickets cannot be deleted.");


  await ticket.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, "Ticket deleted successfully.", null));
});
