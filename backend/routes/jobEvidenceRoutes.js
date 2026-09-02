import express from "express";

import {
  addJobEvidence,
  getBookingEvidence,
} from "../controllers/jobEvidenceController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Provider adds before/after evidence or attachment
router.post(
  "/",
  protect,
  authorizeRoles("provider"),
  addJobEvidence
);

// Customer or provider can view evidence for a booking
router.get(
  "/booking/:bookingId",
  protect,
  getBookingEvidence
);

export default router;