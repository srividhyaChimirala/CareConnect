import ServiceRequest from "../models/ServiceRequest.js";
import Category from "../models/Category.js";

// CREATE SERVICE REQUEST - Customer only
export const createServiceRequest = async (req, res) => {
  try {
    const {
      category,
      title,
      description,
      serviceLocation,
      preferredDate,
      preferredTime,
    } = req.body;

    // Check required fields
    if (
      !category ||
      !title ||
      !description ||
      !serviceLocation ||
      !preferredDate ||
      !preferredTime
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check whether category exists
    const categoryExists = await Category.findById(category);

    if (!categoryExists || !categoryExists.isActive) {
      return res.status(400).json({
        message: "Invalid or inactive category",
      });
    }

    // Create service request
    const serviceRequest = await ServiceRequest.create({
      customer: req.user._id,
      category,
      title,
      description,
      serviceLocation,
      preferredDate,
      preferredTime,
    });

    res.status(201).json({
      message: "Service request created successfully",
      serviceRequest,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create service request",
      error: error.message,
    });
  }
};


// GET MY SERVICE REQUESTS - Customer
export const getMyServiceRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({
      customer: req.user._id,
    })
      .populate("category", "name description")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: requests.length,
      requests,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch service requests",
      error: error.message,
    });
  }
};


// GET ALL OPEN SERVICE REQUESTS - Providers
export const getOpenServiceRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({
  status: { $in: ["open", "quoted"] },
})
      .populate("customer", "name")
      .populate("category", "name description")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: requests.length,
      requests,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch open service requests",
      error: error.message,
    });
  }
};


// CANCEL SERVICE REQUEST - Owner only
export const cancelServiceRequest = async (req, res) => {
  try {
    const serviceRequest = await ServiceRequest.findById(
      req.params.id
    );

    if (!serviceRequest) {
      return res.status(404).json({
        message: "Service request not found",
      });
    }

    // Check ownership
    if (
      serviceRequest.customer.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only cancel your own service request",
      });
    }

    // Only allow cancellation before completion
    if (
      ["completed", "cancelled"].includes(
        serviceRequest.status
      )
    ) {
      return res.status(400).json({
        message: "This service request cannot be cancelled",
      });
    }

    serviceRequest.status = "cancelled";

    await serviceRequest.save();

    res.status(200).json({
      message: "Service request cancelled successfully",
      serviceRequest,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to cancel service request",
      error: error.message,
    });
  }
};