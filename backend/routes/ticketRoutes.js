import express from "express";

import {
    createTicket,
    getMyTickets,
    getTicketById,
    updateTicket,
    deleteTicket
} from "../controllers/ticketController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();




router.post(
    "/",
    protect,
    authorize("user", "admin"),
    createTicket
);


router.get(
    "/my",
    protect,
    authorize("user", "admin"),
    getMyTickets
);


router.get(
    "/:id",
    protect,
    getTicketById
);


router.put(
    "/:id",
    protect,
    updateTicket
);


router.delete(
    "/:id",
    protect,
    deleteTicket
);

export default router;