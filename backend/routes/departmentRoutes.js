import express from "express";
import { createDepartment, getDepartments, getDepartmentById, updateDepartment, deleteDepartment } from "../controllers/departmentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect);
router.route("/").get(getDepartments).post(authorize("admin"), createDepartment);
router.route("/:id")
  .get(getDepartmentById)
  .put(authorize("admin"), updateDepartment)
  .delete(authorize("admin"), deleteDepartment);

export default router;
