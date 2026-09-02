import express from "express";

import {
  createDispute,
  getMyDisputes,
  getAllDisputes,
  updateDispute,
} from "../controllers/disputeController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Customer creates a dispute
router.post(
  "/",
  protect,
  authorizeRoles("customer"),
  createDispute
);

// Customer views own disputes
router.get(
  "/my-disputes",
  protect,
  authorizeRoles("customer"),
  getMyDisputes
);

// Support Agent or Admin views all disputes
router.get(
  "/",
  protect,
  authorizeRoles("support", "admin"),
  getAllDisputes
);

// Support Agent or Admin updates a dispute
router.patch(
  "/:id",
  protect,
  authorizeRoles("support", "admin"),
  updateDispute
);

export default router;