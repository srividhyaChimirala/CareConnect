import Availability from "../models/Availability.js";
import Provider from "../models/Provider.js";

// PROVIDER CREATES AN AVAILABILITY SLOT
export const createAvailability = async (req, res) => {
  try {
    const { date, startTime, endTime } = req.body;

    // Check required fields
    if (!date || !startTime || !endTime) {
      return res.status(400).json({
        message: "Date, start time and end time are required",
      });
    }

    // Validate time range
    if (startTime >= endTime) {
      return res.status(400).json({
        message: "End time must be after start time",
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

    // Check for overlapping availability slots
    const overlappingSlot = await Availability.findOne({
      provider: provider._id,
      date: new Date(date),
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    });

    if (overlappingSlot) {
      return res.status(400).json({
        message: "This availability slot overlaps with an existing slot",
      });
    }

    // Create availability slot
    const availability = await Availability.create({
      provider: provider._id,
      date,
      startTime,
      endTime,
    });

    res.status(201).json({
      message: "Availability slot created successfully",
      availability,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create availability slot",
      error: error.message,
    });
  }
};


// PROVIDER GETS OWN AVAILABILITY
export const getMyAvailability = async (req, res) => {
  try {
    const provider = await Provider.findOne({
      user: req.user._id,
    });

    if (!provider) {
      return res.status(404).json({
        message: "Provider profile not found",
      });
    }

    const slots = await Availability.find({
      provider: provider._id,
    }).sort({ date: 1, startTime: 1 });

    res.status(200).json({
      count: slots.length,
      slots,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch availability",
      error: error.message,
    });
  }
};


// DELETE AVAILABILITY SLOT - PROVIDER ONLY
export const deleteAvailability = async (req, res) => {
  try {
    const provider = await Provider.findOne({
      user: req.user._id,
    });

    if (!provider) {
      return res.status(404).json({
        message: "Provider profile not found",
      });
    }

    const availability = await Availability.findOne({
      _id: req.params.id,
      provider: provider._id,
    });

    if (!availability) {
      return res.status(404).json({
        message: "Availability slot not found",
      });
    }

    await availability.deleteOne();

    res.status(200).json({
      message: "Availability slot deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete availability slot",
      error: error.message,
    });
  }
};


// CUSTOMER VIEWS PROVIDER AVAILABILITY
export const getProviderAvailability = async (req, res) => {
  try {
    const slots = await Availability.find({
      provider: req.params.providerId,
      isAvailable: true,
    }).sort({ date: 1, startTime: 1 });

    res.status(200).json({
      count: slots.length,
      slots,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch provider availability",
      error: error.message,
    });
  }
};