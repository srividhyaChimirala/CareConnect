// import Booking from "../models/Booking.js";
// import Quote from "../models/Quote.js";
// import ServiceRequest from "../models/ServiceRequest.js";
// import Provider from "../models/Provider.js";
// import Availability from "../models/Availability.js";
// import Notification from "../models/Notification.js";

// // CUSTOMER ACCEPTS A QUOTE AND CREATES BOOKING
// export const acceptQuoteAndCreateBooking = async (req, res) => {
//   try {
//     const { quoteId } = req.params;

//     // Find quote
//     const quote = await Quote.findById(quoteId);

//     if (!quote) {
//       return res.status(404).json({
//         message: "Quote not found",
//       });
//     }

//     // Find service request
//     const serviceRequest = await ServiceRequest.findById(
//       quote.serviceRequest
//     );

//     if (!serviceRequest) {
//       return res.status(404).json({
//         message: "Service request not found",
//       });
//     }

//     // Check request ownership
//     if (
//       serviceRequest.customer.toString() !==
//       req.user._id.toString()
//     ) {
//       return res.status(403).json({
//         message: "You can only accept quotes for your own service request",
//       });
//     }

//     // Check whether request is already booked
//     const existingBooking = await Booking.findOne({
//       serviceRequest: serviceRequest._id,
//     });

//     if (existingBooking) {
//       return res.status(400).json({
//         message: "This service request is already booked",
//       });
//     }
//     // Check provider availability
// const providerAvailability = await Availability.findOne({
//   provider: quote.provider,
//   date: {
//     $gte: new Date(
//       serviceRequest.preferredDate.toISOString().split("T")[0]
//     ),
//     $lt: new Date(
//       new Date(
//         serviceRequest.preferredDate.toISOString().split("T")[0]
//       ).getTime() + 24 * 60 * 60 * 1000
//     ),
//   },
//   isAvailable: true,
// });

// if (!providerAvailability) {
//   return res.status(400).json({
//     message: "Provider is not available on the selected date",
//   });
// }


// const providerAlreadyBooked = await Booking.findOne({
//   provider: quote.provider,
//   scheduledDate: serviceRequest.preferredDate,
//   status: {
//     $in: ["confirmed", "in_progress"],
//   },
// });

// if (providerAlreadyBooked) {
//   return res.status(400).json({
//     message: "Provider already has a booking on this date",
//   });
// }

//     // Accept selected quote
//     quote.status = "accepted";
//     await quote.save();

//     // Reject all other quotes
//     await Quote.updateMany(
//       {
//         serviceRequest: serviceRequest._id,
//         _id: { $ne: quote._id },
//       },
//       {
//         status: "rejected",
//       }
//     );

//     // Update service request
//     serviceRequest.status = "booked";
//     await serviceRequest.save();

//     // Create booking
//     const booking = await Booking.create({
//       serviceRequest: serviceRequest._id,
//       quote: quote._id,
//       customer: req.user._id,
//       provider: quote.provider,
//       scheduledDate: serviceRequest.preferredDate,
//       scheduledTime: serviceRequest.preferredTime,
//       finalAmount: quote.amount,
//     });


//     // Find the provider profile
// const selectedProvider = await Provider.findById(
//   quote.provider
// );

// // Create notification for provider
// await Notification.create({
//   recipient: selectedProvider.user,
//   title: "Quote Accepted",
//   message: `Your quote has been accepted. A new booking has been created for ₹${quote.amount}.`,
//   type: "booking",
//   relatedId: booking._id,
// });



//     res.status(201).json({
//       message: "Quote accepted and booking created successfully",
//       booking,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to create booking",
//       error: error.message,
//     });
//   }
// };


// // CUSTOMER GETS OWN BOOKINGS
// export const getMyCustomerBookings = async (req, res) => {
//   try {
//     const bookings = await Booking.find({
//       customer: req.user._id,
//     })
//       .populate("serviceRequest")
//       .populate("provider")
//       .populate("quote")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       count: bookings.length,
//       bookings,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to fetch bookings",
//       error: error.message,
//     });
//   }
// };


// // PROVIDER GETS OWN BOOKINGS
// export const getMyProviderBookings = async (req, res) => {
//   try {
//     // Find logged-in provider profile
//     const provider = await Provider.findOne({
//       user: req.user._id,
//     });

//     if (!provider) {
//       return res.status(404).json({
//         message: "Provider profile not found",
//       });
//     }

//     const bookings = await Booking.find({
//       provider: provider._id,
//     })
//       .populate("serviceRequest")
//       .populate("customer", "name email")
//       .populate("quote")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       count: bookings.length,
//       bookings,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to fetch provider bookings",
//       error: error.message,
//     });
//   }
// };



// // PROVIDER UPDATES JOB STATUS
// export const updateBookingStatus = async (req, res) => {
//   try {
//     const { status } = req.body;

//     if (!["in_progress", "completed"].includes(status)) {
//       return res.status(400).json({
//         message: "Status must be in_progress or completed",
//       });
//     }

//     // Find provider profile
//     const provider = await Provider.findOne({
//       user: req.user._id,
//     });

//     if (!provider) {
//       return res.status(404).json({
//         message: "Provider profile not found",
//       });
//     }

//     // Find booking
//     const booking = await Booking.findById(req.params.id);

//     if (!booking) {
//       return res.status(404).json({
//         message: "Booking not found",
//       });
//     }

//     // Ensure this booking belongs to the provider
//     if (booking.provider.toString() !== provider._id.toString()) {
//       return res.status(403).json({
//         message: "You can only update your own bookings",
//       });
//     }

//     // Update status
//     booking.status = status;
//     await booking.save();

//     res.status(200).json({
//       message: "Booking status updated successfully",
//       booking,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to update booking status",
//       error: error.message,
//     });
//   }
// };


// await Notification.create({
//   recipient: booking.customer,
//   title: "Booking Status Updated",
//   message: `Your booking status has been updated to: ${booking.status}.`,
//   type: "booking",
//   relatedId: booking._id,
// });


// // CUSTOMER CONFIRMS JOB COMPLETION
// export const confirmBookingCompletion = async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id);

//     if (!booking) {
//       return res.status(404).json({
//         message: "Booking not found",
//       });
//     }

//     // Check ownership
//     if (
//       booking.customer.toString() !==
//       req.user._id.toString()
//     ) {
//       return res.status(403).json({
//         message: "You can only confirm your own bookings",
//       });
//     }

//     // Booking must be completed first
//     if (booking.status !== "completed") {
//       return res.status(400).json({
//         message: "Booking must be completed before confirmation",
//       });
//     }

//     booking.customerConfirmed = true;
//     await booking.save();

//     res.status(200).json({
//       message: "Service completion confirmed successfully",
//       booking,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to confirm booking completion",
//       error: error.message,
//     });
//   }
// };






import Booking from "../models/Booking.js";
import Quote from "../models/Quote.js";
import ServiceRequest from "../models/ServiceRequest.js";
import Provider from "../models/Provider.js";
import Availability from "../models/Availability.js";
import Notification from "../models/Notification.js";


// CUSTOMER ACCEPTS A QUOTE AND CREATES BOOKING
export const acceptQuoteAndCreateBooking = async (req, res) => {
  try {
    const { quoteId } = req.params;

    // Find quote
    const quote = await Quote.findById(quoteId);

    if (!quote) {
      return res.status(404).json({
        message: "Quote not found",
      });
    }

    // Find service request
    const serviceRequest = await ServiceRequest.findById(
      quote.serviceRequest
    );

    if (!serviceRequest) {
      return res.status(404).json({
        message: "Service request not found",
      });
    }

    // Check request ownership
    if (
      serviceRequest.customer.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only accept quotes for your own service request",
      });
    }

    // Check whether request is already booked
    const existingBooking = await Booking.findOne({
      serviceRequest: serviceRequest._id,
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "This service request is already booked",
      });
    }

    // Check provider availability
    const providerAvailability = await Availability.findOne({
      provider: quote.provider,
      date: {
        $gte: new Date(
          serviceRequest.preferredDate.toISOString().split("T")[0]
        ),
        $lt: new Date(
          new Date(
            serviceRequest.preferredDate.toISOString().split("T")[0]
          ).getTime() +
            24 * 60 * 60 * 1000
        ),
      },
      isAvailable: true,
    });

    if (!providerAvailability) {
      return res.status(400).json({
        message: "Provider is not available on the selected date",
      });
    }

    // Check if provider already has another booking
    const providerAlreadyBooked = await Booking.findOne({
      provider: quote.provider,
      scheduledDate: serviceRequest.preferredDate,
      status: {
        $in: ["confirmed", "in_progress"],
      },
    });

    if (providerAlreadyBooked) {
      return res.status(400).json({
        message: "Provider already has a booking on this date",
      });
    }

    // Accept selected quote
    quote.status = "accepted";
    await quote.save();

    // Reject all other quotes
    await Quote.updateMany(
      {
        serviceRequest: serviceRequest._id,
        _id: { $ne: quote._id },
      },
      {
        status: "rejected",
      }
    );

    // Update service request status
    serviceRequest.status = "booked";
    await serviceRequest.save();

    // Create booking
    const booking = await Booking.create({
      serviceRequest: serviceRequest._id,
      quote: quote._id,
      customer: req.user._id,
      provider: quote.provider,
      scheduledDate: serviceRequest.preferredDate,
      scheduledTime: serviceRequest.preferredTime,
      finalAmount: quote.amount,
    });

    // Find selected provider
    const selectedProvider = await Provider.findById(
      quote.provider
    );

    if (!selectedProvider) {
      return res.status(404).json({
        message: "Selected provider not found",
      });
    }

    // Notify provider
    await Notification.create({
      recipient: selectedProvider.user,
      title: "Quote Accepted",
      message: `Your quote has been accepted. A new booking has been created for ₹${quote.amount}.`,
      type: "booking",
      relatedId: booking._id,
    });

    res.status(201).json({
      message: "Quote accepted and booking created successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create booking",
      error: error.message,
    });
  }
};


// CUSTOMER GETS OWN BOOKINGS
export const getMyCustomerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      customer: req.user._id,
    })
      .populate("serviceRequest")
      .populate("provider")
      .populate("quote")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};


// PROVIDER GETS OWN BOOKINGS
export const getMyProviderBookings = async (req, res) => {
  try {
    // Find logged-in provider profile
    const provider = await Provider.findOne({
      user: req.user._id,
    });

    if (!provider) {
      return res.status(404).json({
        message: "Provider profile not found",
      });
    }

    const bookings = await Booking.find({
      provider: provider._id,
    })
      .populate("serviceRequest")
      .populate("customer", "name email")
      .populate("quote")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch provider bookings",
      error: error.message,
    });
  }
};


// PROVIDER UPDATES JOB STATUS
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    if (!["in_progress", "completed"].includes(status)) {
      return res.status(400).json({
        message: "Status must be in_progress or completed",
      });
    }

    // Find logged-in provider profile
    const provider = await Provider.findOne({
      user: req.user._id,
    });

    if (!provider) {
      return res.status(404).json({
        message: "Provider profile not found",
      });
    }

    // Find booking
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Ensure booking belongs to this provider
    if (
      booking.provider.toString() !==
      provider._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only update your own bookings",
      });
    }

    // Update booking status
    booking.status = status;
    await booking.save();

    // Notify customer
    await Notification.create({
      recipient: booking.customer,
      title: "Booking Status Updated",
      message: `Your booking status has been updated to: ${booking.status}.`,
      type: "booking",
      relatedId: booking._id,
    });

    res.status(200).json({
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update booking status",
      error: error.message,
    });
  }
};


// CUSTOMER CONFIRMS JOB COMPLETION
export const confirmBookingCompletion = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Check customer ownership
    if (
      booking.customer.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only confirm your own bookings",
      });
    }

    // Booking must be completed first
    if (booking.status !== "completed") {
      return res.status(400).json({
        message:
          "Booking must be completed before confirmation",
      });
    }

    // Confirm completion
    booking.customerConfirmed = true;
    await booking.save();

    res.status(200).json({
      message: "Service completion confirmed successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to confirm booking completion",
      error: error.message,
    });
  }
};