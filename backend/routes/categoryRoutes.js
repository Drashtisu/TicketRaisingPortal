import express from "express";
import { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect, authorize("admin"));
router.route("/").post(createCategory)
router.route("/").get(getCategories);
router.route("/:id").get(getCategoryById)
router.route("/:id").put(updateCategory)
router.route("/:id").delete(deleteCategory);

export default router;
