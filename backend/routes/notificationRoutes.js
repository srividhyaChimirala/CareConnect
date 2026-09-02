import express from "express";

import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get logged-in user's notifications
router.get(
  "/",
  protect,
  getMyNotifications
);

// Mark all notifications as read
router.patch(
  "/read-all",
  protect,
  markAllNotificationsAsRead
);

// Mark one notification as read
router.patch(
  "/:id/read",
  protect,
  markNotificationAsRead
);

// Delete a notification
router.delete(
  "/:id",
  protect,
  deleteNotification
);

export default router;