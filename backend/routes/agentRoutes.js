import express from "express";
import { getAssignedTickets, startWorking, addWorkLog, resolveTicket } from "../controllers/agentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect, authorize("agent"));
router.get("/tickets", getAssignedTickets);
router.patch("/tickets/:id/start", startWorking);
router.post("/tickets/:id/work-logs", addWorkLog);
router.patch("/tickets/:id/resolve", resolveTicket);

export default router;
