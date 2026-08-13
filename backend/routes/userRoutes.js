import express from "express";
import { getUsers, updateUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, authorize("admin"), getUsers);
router.put("/:id", protect, authorize("admin"), updateUser);

export default router;
