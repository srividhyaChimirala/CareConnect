import JobEvidence from "../models/JobEvidence.js";
import Booking from "../models/Booking.js";
import Provider from "../models/Provider.js";

// PROVIDER ADDS JOB EVIDENCE
export const addJobEvidence = async (req, res) => {
  try {
    const { bookingId, type, fileUrl, description } = req.body;

    // Validate required fields
    if (!bookingId || !type || !fileUrl) {
      return res.status(400).json({
        message: "Booking ID, type and file URL are required",
      });
    }

    // Find provider profile
    const provider = await Provider.findOne({
      user: req.user._id,
    });

    if (!provider) {
      return res.status(404).json({
        message: "Provider profile not found",
      });
    }

    // Find booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Check booking ownership
    if (
      booking.provider.toString() !== provider._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only add evidence to your own bookings",
      });
    }

    // Validate evidence type
    if (!["before", "after", "attachment"].includes(type)) {
      return res.status(400).json({
        message: "Invalid evidence type",
      });
    }

    // Create evidence
    const evidence = await JobEvidence.create({
      booking: bookingId,
      provider: provider._id,
      type,
      fileUrl,
      description,
    });

    res.status(201).json({
      message: "Job evidence added successfully",
      evidence,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add job evidence",
      error: error.message,
    });
  }
};


// GET ALL EVIDENCE FOR A BOOKING
export const getBookingEvidence = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const evidence = await JobEvidence.find({
      booking: req.params.bookingId,
    })
      .populate({
        path: "provider",
        populate: {
          path: "user",
          select: "name",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: evidence.length,
      evidence,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch job evidence",
      error: error.message,
    });
  }
};