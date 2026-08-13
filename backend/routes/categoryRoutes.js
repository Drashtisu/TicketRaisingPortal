import express from "express";
import { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect);
router.route("/").get(getCategories).post(authorize("admin"), createCategory);
router.route("/:id")
  .get(getCategoryById)
  .put(authorize("admin"), updateCategory)
  .delete(authorize("admin"), deleteCategory);

export default router;
