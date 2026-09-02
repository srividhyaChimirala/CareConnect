import mongoose from "mongoose";

const providerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    businessName: {
      type: String,
      required: [true, "Business name is required"],
      trim: true,
    },

    skills: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],

    serviceAreas: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],

    experience: {
      type: Number,
      required: true,
      min: 0,
    },

    pricing: {
      type: Number,
      required: true,
      min: 0,
    },

    documents: [
      {
        type: String,
      },
    ],

    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Provider = mongoose.model("Provider", providerSchema);

export default Provider;