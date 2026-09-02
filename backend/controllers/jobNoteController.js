import JobNote from "../models/JobNote.js";
import Booking from "../models/Booking.js";
import Provider from "../models/Provider.js";

// PROVIDER ADDS A JOB NOTE
export const addJobNote = async (req, res) => {
  try {
    const { bookingId, note, status } = req.body;

    // Validate required fields
    if (!bookingId || !note) {
      return res.status(400).json({
        message: "Booking ID and note are required",
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

    // Check whether booking belongs to this provider
    if (
      booking.provider.toString() !==
      provider._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only add notes to your own bookings",
      });
    }

    // Validate status
    const validStatuses = [
      "started",
      "inspection",
      "in_progress",
      "completed",
    ];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid job note status",
      });
    }

    // Create job note
    const jobNote = await JobNote.create({
      booking: bookingId,
      provider: provider._id,
      note,
      status: status || "in_progress",
    });

    res.status(201).json({
      message: "Job note added successfully",
      jobNote,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add job note",
      error: error.message,
    });
  }
};


// GET ALL JOB NOTES FOR A BOOKING
export const getBookingNotes = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Only customer or assigned provider can view notes
    const provider = await Provider.findOne({
      user: req.user._id,
    });

    const isCustomer =
      booking.customer.toString() === req.user._id.toString();

    const isAssignedProvider =
      provider &&
      booking.provider.toString() === provider._id.toString();

    if (!isCustomer && !isAssignedProvider) {
      return res.status(403).json({
        message: "You do not have permission to view these job notes",
      });
    }

    const notes = await JobNote.find({
      booking: req.params.bookingId,
    })
      .populate({
        path: "provider",
        populate: {
          path: "user",
          select: "name",
        },
      })
      .sort({ createdAt: 1 });

    res.status(200).json({
      count: notes.length,
      notes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch job notes",
      error: error.message,
    });
  }
};