import express from "express";
import { createDepartment, getDepartments, getDepartmentById, updateDepartment, deleteDepartment } from "../controllers/departmentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect, authorize("admin"));
router.route("/").post(createDepartment)
router.route("/").get(getDepartments);
router.route("/:id").get(getDepartmentById)
router.route("/:id").put(updateDepartment)
router.route("/:id").delete(deleteDepartment);

export default router;
