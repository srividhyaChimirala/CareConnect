import Dispute from "../models/Dispute.js";
import Booking from "../models/Booking.js";
import Notification from "../models/Notification.js";
// CUSTOMER CREATES A DISPUTE
export const createDispute = async (req, res) => {
  try {
    const { bookingId, title, description } = req.body;

    // Check required fields
    if (!bookingId || !title || !description) {
      return res.status(400).json({
        message: "Booking ID, title and description are required",
      });
    }

    // Find booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Check booking belongs to logged-in customer
    if (
      booking.customer.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only raise disputes for your own bookings",
      });
    }

    // Create dispute
    const dispute = await Dispute.create({
      booking: bookingId,
      customer: req.user._id,
      title,
      description,
    });

    res.status(201).json({
      message: "Dispute created successfully",
      dispute,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create dispute",
      error: error.message,
    });
  }
};


// CUSTOMER GETS OWN DISPUTES
export const getMyDisputes = async (req, res) => {
  try {
    const disputes = await Dispute.find({
      customer: req.user._id,
    })
      .populate("booking")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: disputes.length,
      disputes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch disputes",
      error: error.message,
    });
  }
};


// SUPPORT / ADMIN GETS ALL DISPUTES
export const getAllDisputes = async (req, res) => {
  try {
    const disputes = await Dispute.find()
      .populate("customer", "name email")
      .populate("booking")
      .populate("handledBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: disputes.length,
      disputes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch disputes",
      error: error.message,
    });
  }
};


// SUPPORT / ADMIN UPDATES DISPUTE
export const updateDispute = async (req, res) => {
  try {
    const { status, resolution } = req.body;

    const dispute = await Dispute.findById(req.params.id);

    if (!dispute) {
      return res.status(404).json({
        message: "Dispute not found",
      });
    }

    const validStatuses = [
      "open",
      "in_review",
      "resolved",
      "closed",
    ];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid dispute status",
      });
    }

    // Update fields if provided
    if (status) {
      dispute.status = status;
    }

    if (resolution !== undefined) {
      dispute.resolution = resolution;
    }

    // Store the support agent/admin handling it
    dispute.handledBy = req.user._id;

    await dispute.save();

    // Notify customer about dispute update
await Notification.create({
  recipient: dispute.customer,
  title: "Dispute Updated",
  message: `Your dispute "${dispute.title}" has been updated to: ${dispute.status}.`,
  type: "dispute",
  relatedId: dispute._id,
});

    res.status(200).json({
      message: "Dispute updated successfully",
      dispute,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update dispute",
      error: error.message,
    });
  }
};