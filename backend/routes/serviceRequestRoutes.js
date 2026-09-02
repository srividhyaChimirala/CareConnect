import express from "express";

import {
  createServiceRequest,
  getMyServiceRequests,
  getOpenServiceRequests,
  cancelServiceRequest,
} from "../controllers/serviceRequestController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Customer creates a service request
router.post(
  "/",
  protect,
  authorizeRoles("customer"),
  createServiceRequest
);

// Customer views their own requests
router.get(
  "/my-requests",
  protect,
  authorizeRoles("customer"),
  getMyServiceRequests
);

// Provider views open service requests
router.get(
  "/open",
  protect,
  authorizeRoles("provider"),
  getOpenServiceRequests
);

// Customer cancels their own request
router.patch(
  "/:id/cancel",
  protect,
  authorizeRoles("customer"),
  cancelServiceRequest
);

export default router;