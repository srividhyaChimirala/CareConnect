import mongoose from "mongoose";

const jobEvidenceSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },

    type: {
      type: String,
      enum: ["before", "after", "attachment"],
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const JobEvidence = mongoose.model(
  "JobEvidence",
  jobEvidenceSchema
);

export default JobEvidence;