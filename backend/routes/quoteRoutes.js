import express from "express";

import {
  createQuote,
  getQuotesForRequest,
} from "../controllers/quoteController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Provider sends a quote
router.post(
  "/",
  protect,
  authorizeRoles("provider"),
  createQuote
);

// Customer views quotes for their service request
router.get(
  "/request/:requestId",
  protect,
  authorizeRoles("customer"),
  getQuotesForRequest
);

export default router;