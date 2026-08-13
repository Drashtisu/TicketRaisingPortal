
import mongoose from "mongoose";
import Ticket from "../models/Ticket.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);


const populateTicket = (query) => 
  
  query
    .populate("createdBy", "name email")
    .populate("department", "name code")
    .populate("category", "name code")
    .populate("assignedAgent", "name email")
    .populate("assignedBy", "name email")
    .populate("workLogs.createdBy", "name email");

const getAssignedTicket = async (id, agentId) => {

  if (!isValidId(id)) throw new ApiError(400, "Invalid Ticket ID.");

  const ticket = await Ticket.findById(id);

  if (!ticket) throw new ApiError(404, "Ticket not found.");

  if (!ticket.assignedAgent || !ticket.assignedAgent.equals(agentId)) {

    throw new ApiError(403, "This ticket is not assigned to you.");
  }
  return ticket;
};

export const getAssignedTickets = asyncHandler(async (req, res) => {

  let {
    page = 1,
    limit = 10,
    status,
    priority,
    search = "",
    sortBy = "updatedAt",
    order = "desc",
  } = req.query;

  page = Math.max(Number(page) || 1, 1);

  limit = Math.min(Math.max(Number(limit) || 10, 1), 100);

  const query = { assignedAgent: req.user._id };

  const allowedStatuses = [
    "Assigned",
    "In Progress",
    "Resolved",
    "Closed",
    "Rejected",
    "Reopened",
  ];


  const priorities = ["Low", "Medium", "High", "Critical"];

  if (status) {

    if (!allowedStatuses.includes(status))

      throw new ApiError(400, "Invalid status.");

    query.status = status;
  }

  if (priority) {

    if (!priorities.includes(priority))

      throw new ApiError(400, "Invalid priority.");

    query.priority = priority;

  }

  if (search)

    query.$or = ["title", "description", "ticketNumber"].map((field) => ({

      [field]: { $regex: search, $options: "i" },

    }));

  const allowedSort = [
    "createdAt",
    "updatedAt",
    "priority",
    "status",
    "ticketNumber",
  ];
  if (!allowedSort.includes(sortBy)) sortBy = "updatedAt";

  const [totalTickets, tickets] = await Promise.all([

    Ticket.countDocuments(query),

    populateTicket(Ticket.find(query))
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit),
  ]);

  const totalPages = Math.ceil(totalTickets / limit);

  return res

    .status(200)
    .json(
      new ApiResponse(200, "Assigned tickets fetched successfully.", {

        tickets,
        pagination: {
          totalTickets,
          totalPages,
          currentPage: page,
          limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      }),
    );
});

export const startWorking = asyncHandler(async (req, res) => {

  const ticket = await getAssignedTicket(req.params.id, req.user._id);

  if (!["Assigned", "Reopened"].includes(ticket.status)) {

    throw new ApiError(
      400,
      "Only assigned or reopened tickets can be started.",
    );
  }

  ticket.status = "In Progress";

  ticket.startedAt ??= new Date();

  await ticket.save();

  const populatedTicket = await populateTicket(Ticket.findById(ticket._id));
  
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Ticket work started successfully.",
        populatedTicket,
      ),
    );
});

export const addWorkLog = asyncHandler(async (req, res) => {
 
  const { message } = req.body;
  
  if (!message?.trim())
    
    throw new ApiError(400, "Work log message is required.");
 
    const ticket = await getAssignedTicket(req.params.id, req.user._id);
 
    if (ticket.status !== "In Progress")
    
      throw new ApiError(
      400,
      "Work logs can only be added while a ticket is in progress.",
    );

  ticket.workLogs.push({ message: message.trim(), createdBy: req.user._id });
 
  await ticket.save();
 
  const populatedTicket = await populateTicket(Ticket.findById(ticket._id));
  return res
    .status(201)
    .json(
      new ApiResponse(201, "Work log added successfully.", populatedTicket),
    );
});

export const resolveTicket = asyncHandler(async (req, res) => {
  
  const { resolution } = req.body;
  
  if (!resolution?.trim()) throw new ApiError(400, "Resolution is required.");
  
  const ticket = await getAssignedTicket(req.params.id, req.user._id);
  
  if (ticket.status !== "In Progress")
  
    
    throw new ApiError(400, "Only tickets in progress can be resolved.");
  
    ticket.status = "Resolved";
  
    ticket.resolution = resolution.trim();
  
    ticket.resolvedAt = new Date();
  
    await ticket.save();
  
    const populatedTicket = await populateTicket(Ticket.findById(ticket._id));
  
    return res
    
    .status(200)
    
    .json(
      new ApiResponse(200, "Ticket resolved successfully.", populatedTicket),
    );
});
