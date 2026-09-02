import User from "../models/User.js";
import Provider from "../models/Provider.js";
import Booking from "../models/Booking.js";
import ServiceRequest from "../models/ServiceRequest.js";
import Category from "../models/Category.js";

// ADMIN DASHBOARD STATISTICS
export const getDashboardStats = async (req, res) => {
  try {
    // User statistics
    const totalUsers = await User.countDocuments();

    const totalCustomers = await User.countDocuments({
      role: "customer",
    });

    const totalProviders = await User.countDocuments({
      role: "provider",
    });

    // Provider profile count
    const totalProviderProfiles =
      await Provider.countDocuments();

    // Service request statistics
    const totalServiceRequests =
      await ServiceRequest.countDocuments();

    // Booking statistics
    const totalBookings =
      await Booking.countDocuments();

    const completedBookings =
      await Booking.countDocuments({
        status: "completed",
      });

    const inProgressBookings =
      await Booking.countDocuments({
        status: "in_progress",
      });

    const confirmedBookings =
      await Booking.countDocuments({
        status: "confirmed",
      });

    // Category statistics
    const totalCategories =
      await Category.countDocuments();

    // Calculate total revenue from completed bookings
    const revenueResult = await Booking.aggregate([
      {
        $match: {
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$finalAmount",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    // Get recent bookings
    const recentBookings = await Booking.find()
      .populate("customer", "name email")
      .populate({
        path: "provider",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .populate("serviceRequest")
      .sort({ createdAt: -1 })
      .limit(5);


    // Category-wise service request statistics
const categoryStats = await ServiceRequest.aggregate([
  {
    $group: {
      _id: "$category",
      totalRequests: {
        $sum: 1,
      },
    },
  },
  {
    $lookup: {
      from: "categories",
      localField: "_id",
      foreignField: "_id",
      as: "categoryDetails",
    },
  },
  {
    $unwind: {
      path: "$categoryDetails",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $project: {
      _id: 0,
      category: "$categoryDetails.name",
      totalRequests: 1,
    },
  },
  {
    $sort: {
      totalRequests: -1,
    },
  },
]);


// Provider-wise performance statistics
const providerStats = await Booking.aggregate([
  {
    $group: {
      _id: "$provider",

      totalBookings: {
        $sum: 1,
      },

      completedJobs: {
        $sum: {
          $cond: [
            { $eq: ["$status", "completed"] },
            1,
            0,
          ],
        },
      },

      totalEarnings: {
        $sum: {
          $cond: [
            { $eq: ["$status", "completed"] },
            "$finalAmount",
            0,
          ],
        },
      },
    },
  },

  {
    $lookup: {
      from: "providers",
      localField: "_id",
      foreignField: "_id",
      as: "providerDetails",
    },
  },

  {
    $unwind: "$providerDetails",
  },

  {
    $lookup: {
      from: "users",
      localField: "providerDetails.user",
      foreignField: "_id",
      as: "userDetails",
    },
  },

  {
    $unwind: "$userDetails",
  },

  {
    $project: {
      _id: 0,
      providerId: "$providerDetails._id",
      providerName: "$userDetails.name",
      email: "$userDetails.email",
      totalBookings: 1,
      completedJobs: 1,
      totalEarnings: 1,
    },
  },

  {
    $sort: {
      completedJobs: -1,
    },
  },
]);

// Monthly booking and revenue statistics
const monthlyBookingStats = await Booking.aggregate([
  {
    $group: {
      _id: {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
      },

      totalBookings: {
        $sum: 1,
      },

      completedBookings: {
        $sum: {
          $cond: [
            { $eq: ["$status", "completed"] },
            1,
            0,
          ],
        },
      },

      totalRevenue: {
        $sum: {
          $cond: [
            { $eq: ["$status", "completed"] },
            "$finalAmount",
            0,
          ],
        },
      },
    },
  },
  {
    $sort: {
      "_id.year": 1,
      "_id.month": 1,
    },
  },
]);


    res.status(200).json({
      users: {
        total: totalUsers,
        customers: totalCustomers,
        providers: totalProviders,
        providerProfiles: totalProviderProfiles,
      },

      serviceRequests: {
        total: totalServiceRequests,
      },

      bookings: {
        total: totalBookings,
        confirmed: confirmedBookings,
        inProgress: inProgressBookings,
        completed: completedBookings,
      },

      categories: {
        total: totalCategories,
      },

      revenue: {
        total: totalRevenue,
      },
      categoryStats,
      providerStats,

monthlyBookingStats,

monthlyServiceRequestStats,
      recentBookings,
      
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};