import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema(
  {
    serviceRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceRequest",
      required: true,
    },

    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },

    amount: {
      type: Number,
      required: [true, "Quote amount is required"],
      min: 0,
    },

    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },

    estimatedCompletion: {
      type: String,
      required: [true, "Estimated completion time is required"],
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Quote = mongoose.model("Quote", quoteSchema);

export default Quote;