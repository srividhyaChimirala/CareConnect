import express from "express";

import {
  createProviderProfile,
  getMyProviderProfile,
  updateProviderProfile,
  getProviders,
  getAllProviders,
  updateProviderVerification,
} from "../controllers/providerController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all verified providers - accessible to everyone
router.get("/", getProviders);

// Provider creates their profile
router.post(
  "/profile",
  protect,
  authorizeRoles("provider"),
  createProviderProfile
);

// Provider views their own profile
router.get(
  "/profile",
  protect,
  authorizeRoles("provider"),
  getMyProviderProfile
);

// Provider updates their own profile
router.put(
  "/profile",
  protect,
  authorizeRoles("provider"),
  updateProviderProfile
);


// Admin gets all providers
router.get(
  "/admin/all",
  protect,
  authorizeRoles("admin"),
  getAllProviders
);

// Admin verifies or rejects provider
router.patch(
  "/admin/:id/verification",
  protect,
  authorizeRoles("admin"),
  updateProviderVerification
);

export default router;