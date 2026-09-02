import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    serviceLocation: {
      type: String,
      required: [true, "Service location is required"],
      trim: true,
    },

    preferredDate: {
      type: Date,
      required: true,
    },

    preferredTime: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "open",
        "quoted",
        "booked",
        "in_progress",
        "completed",
        "cancelled",
      ],
      default: "open",
    },
  },
  {
    timestamps: true,
  }
);

const ServiceRequest = mongoose.model(
  "ServiceRequest",
  serviceRequestSchema
);

export default ServiceRequest;