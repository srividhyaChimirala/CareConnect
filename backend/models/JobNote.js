import mongoose from "mongoose";

const jobNoteSchema = new mongoose.Schema(
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

    note: {
      type: String,
      required: [true, "Job note is required"],
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "started",
        "inspection",
        "in_progress",
        "completed",
      ],
      default: "in_progress",
    },
  },
  {
    timestamps: true,
  }
);

const JobNote = mongoose.model("JobNote", jobNoteSchema);

export default JobNote;