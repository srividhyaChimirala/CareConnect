import mongoose from "mongoose";

const disputeSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: [true, "Dispute title is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Dispute description is required"],
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "open",
        "in_review",
        "resolved",
        "closed",
      ],
      default: "open",
    },

    resolution: {
      type: String,
      trim: true,
      default: "",
    },

    handledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Dispute = mongoose.model("Dispute", disputeSchema);

export default Dispute;