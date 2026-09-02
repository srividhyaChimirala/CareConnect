import express from "express";

import {
  createAvailability,
  getMyAvailability,
  deleteAvailability,
  getProviderAvailability,
} from "../controllers/availabilityController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Provider creates an availability slot
router.post(
  "/",
  protect,
  authorizeRoles("provider"),
  createAvailability
);

// Provider views own availability
router.get(
  "/my-slots",
  protect,
  authorizeRoles("provider"),
  getMyAvailability
);

// Customer/anyone views a provider's availability
router.get(
  "/provider/:providerId",
  getProviderAvailability
);

// Provider deletes own availability slot
router.delete(
  "/:id",
  protect,
  authorizeRoles("provider"),
  deleteAvailability
);

export default router;