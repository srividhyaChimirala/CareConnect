import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
      trim: true,
    },

    endTime: {
      type: String,
      required: true,
      trim: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Availability = mongoose.model(
  "Availability",
  availabilitySchema
);

export default Availability;