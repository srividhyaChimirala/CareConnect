import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    serviceRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceRequest",
      required: true,
      unique: true,
    },

    quote: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quote",
      required: true,
      unique: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },

    scheduledDate: {
      type: Date,
      required: true,
    },

    scheduledTime: {
      type: String,
      required: true,
      trim: true,
    },

    finalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
      ],
      default: "confirmed",
    },

    customerConfirmed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;