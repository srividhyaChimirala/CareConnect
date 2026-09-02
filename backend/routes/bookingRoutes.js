import express from "express";

import {
  acceptQuoteAndCreateBooking,
  getMyCustomerBookings,
  getMyProviderBookings,
  updateBookingStatus,
  confirmBookingCompletion,
} from "../controllers/bookingController.js";



import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Customer accepts a quote and creates booking
router.post(
  "/accept/:quoteId",
  protect,
  authorizeRoles("customer"),
  acceptQuoteAndCreateBooking
);

// Customer views own bookings
router.get(
  "/my-bookings",
  protect,
  authorizeRoles("customer"),
  getMyCustomerBookings
);

// Provider views assigned bookings
router.get(
  "/provider/my-bookings",
  protect,
  authorizeRoles("provider"),
  getMyProviderBookings
);



// Provider updates job status
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("provider"),
  updateBookingStatus
);

// Customer confirms completion
router.patch(
  "/:id/confirm",
  protect,
  authorizeRoles("customer"),
  confirmBookingCompletion
);



export default router;