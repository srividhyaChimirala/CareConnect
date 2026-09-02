import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import Provider from "../models/Provider.js";

// CUSTOMER CREATES A REVIEW
export const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    // Find booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Check booking ownership
    if (
      booking.customer.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only review your own booking",
      });
    }

    // Customer must confirm completion first
    if (!booking.customerConfirmed) {
      return res.status(400).json({
        message: "Please confirm service completion before submitting a review",
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      booking: bookingId,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this booking",
      });
    }

    // Create review
    const review = await Review.create({
      booking: bookingId,
      customer: req.user._id,
      provider: booking.provider,
      rating,
      comment,
    });

    // Update provider rating
    const provider = await Provider.findById(booking.provider);

    const reviews = await Review.find({
      provider: booking.provider,
    });

    const totalReviews = reviews.length;

    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) /
      totalReviews;

    provider.rating = Number(averageRating.toFixed(1));
    provider.totalReviews = totalReviews;

    await provider.save();

    res.status(201).json({
      message: "Review submitted successfully",
      review,
      providerRating: provider.rating,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to submit review",
      error: error.message,
    });
  }
};


// GET REVIEWS FOR A PROVIDER
export const getProviderReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      provider: req.params.providerId,
    })
      .populate("customer", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};