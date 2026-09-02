import Quote from "../models/Quote.js";
import Provider from "../models/Provider.js";
import ServiceRequest from "../models/ServiceRequest.js";
import Notification from "../models/Notification.js";

// PROVIDER CREATES A QUOTE
export const createQuote = async (req, res) => {
  try {
    const {
      serviceRequest,
      amount,
      message,
      estimatedCompletion,
    } = req.body;

    // Check provider profile
    const provider = await Provider.findOne({
      user: req.user._id,
    });

    if (!provider) {
      return res.status(404).json({
        message: "Provider profile not found",
      });
    }

    // Check provider verification
    if (provider.verificationStatus !== "verified") {
      return res.status(403).json({
        message: "Only verified providers can send quotes",
      });
    }

    // Check service request
    const request = await ServiceRequest.findById(serviceRequest);

    if (!request) {
      return res.status(404).json({
        message: "Service request not found",
      });
    }

    // Only open requests can receive quotes
   if (!["open", "quoted"].includes(request.status)) {
  return res.status(400).json({
    message: "Quotes can only be sent for available service requests",
  });
}

    // Prevent the same provider from sending multiple quotes
    const existingQuote = await Quote.findOne({
      serviceRequest,
      provider: provider._id,
    });

    if (existingQuote) {
      return res.status(400).json({
        message: "You have already sent a quote for this request",
      });
    }

    // Create quote
    const quote = await Quote.create({
      serviceRequest,
      provider: provider._id,
      amount,
      message,
      estimatedCompletion,
    });

    // Create notification for customer
await Notification.create({
  recipient: request.customer,
  title: "New Quote Received",
  message: `A provider has sent a quote of ₹${amount} for your service request.`,
  type: "quote",
  relatedId: quote._id,
});

    // Update request status
    request.status = "quoted";
    await request.save();

    res.status(201).json({
      message: "Quote sent successfully",
      quote,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create quote",
      error: error.message,
    });
  }
};

// CUSTOMER VIEWS QUOTES FOR THEIR SERVICE REQUEST
export const getQuotesForRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.requestId);

    if (!request) {
      return res.status(404).json({
        message: "Service request not found",
      });
    }

    // Only the owner can view quotes
    if (request.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only view quotes for your own service request",
      });
    }

    const quotes = await Quote.find({
      serviceRequest: req.params.requestId,
    })
      .populate({
        path: "provider",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .sort({ amount: 1 });

    res.status(200).json({
      count: quotes.length,
      quotes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch quotes",
      error: error.message,
    });
  }
};