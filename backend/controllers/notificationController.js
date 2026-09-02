import Notification from "../models/Notification.js";

// GET LOGGED-IN USER'S NOTIFICATIONS
export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};


// MARK ONE NOTIFICATION AS READ
export const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(
      req.params.id
    );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    // Check notification ownership
    if (
      notification.recipient.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only update your own notifications",
      });
    }

    notification.isRead = true;

    await notification.save();

    res.status(200).json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update notification",
      error: error.message,
    });
  }
};


// MARK ALL NOTIFICATIONS AS READ
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        recipient: req.user._id,
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    res.status(200).json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update notifications",
      error: error.message,
    });
  }
};


// DELETE A NOTIFICATION
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(
      req.params.id
    );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    // Check ownership
    if (
      notification.recipient.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only delete your own notifications",
      });
    }

    await notification.deleteOne();

    res.status(200).json({
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete notification",
      error: error.message,
    });
  }
};