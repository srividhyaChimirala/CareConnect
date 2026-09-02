import express from "express";

import {
  createReview,
  getProviderReviews,
} from "../controllers/reviewController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Customer submits a review
router.post(
  "/",
  protect,
  authorizeRoles("customer"),
  createReview
);

// Anyone can view reviews for a provider
router.get(
  "/provider/:providerId",
  getProviderReviews
);

export default router;