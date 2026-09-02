import express from "express";

import {
  addJobNote,
  getBookingNotes,
} from "../controllers/jobNoteController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Provider adds a job progress note
router.post(
  "/",
  protect,
  authorizeRoles("provider"),
  addJobNote
);

// Customer or assigned provider views job notes
router.get(
  "/booking/:bookingId",
  protect,
  getBookingNotes
);

export default router;