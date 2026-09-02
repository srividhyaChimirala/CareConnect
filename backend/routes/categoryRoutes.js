import express from "express";

import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all active categories - accessible to all users
router.get("/", getCategories);

// Create category - Admin only
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createCategory
);

// Update category - Admin only
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateCategory
);

// Delete category - Admin only
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteCategory
);

export default router;