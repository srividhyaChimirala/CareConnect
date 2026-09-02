import Provider from "../models/Provider.js";

// CREATE PROVIDER PROFILE
export const createProviderProfile = async (req, res) => {
  try {
    const {
      businessName,
      skills,
      serviceAreas,
      experience,
      pricing,
      documents,
    } = req.body;

    // Check if provider profile already exists
    const existingProvider = await Provider.findOne({
      user: req.user._id,
    });

    if (existingProvider) {
      return res.status(400).json({
        message: "Provider profile already exists",
      });
    }

    // Create provider profile
    const provider = await Provider.create({
      user: req.user._id,
      businessName,
      skills,
      serviceAreas,
      experience,
      pricing,
      documents,
    });

    res.status(201).json({
      message: "Provider profile created successfully",
      provider,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create provider profile",
      error: error.message,
    });
  }
};

// GET MY PROVIDER PROFILE
export const getMyProviderProfile = async (req, res) => {
  try {
    const provider = await Provider.findOne({
      user: req.user._id,
    }).populate("user", "name email");

    if (!provider) {
      return res.status(404).json({
        message: "Provider profile not found",
      });
    }

    res.status(200).json({
      provider,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch provider profile",
      error: error.message,
    });
  }
};

// UPDATE MY PROVIDER PROFILE
export const updateProviderProfile = async (req, res) => {
  try {
    const provider = await Provider.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!provider) {
      return res.status(404).json({
        message: "Provider profile not found",
      });
    }

    res.status(200).json({
      message: "Provider profile updated successfully",
      provider,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update provider profile",
      error: error.message,
    });
  }
};

// GET ALL VERIFIED PROVIDERS
export const getProviders = async (req, res) => {
  try {
    const providers = await Provider.find({
      verificationStatus: "verified",
    }).populate("user", "name email");

    res.status(200).json({
      count: providers.length,
      providers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch providers",
      error: error.message,
    });
  }
};









// GET ALL PROVIDERS - Admin only
export const getAllProviders = async (req, res) => {
  try {
    const providers = await Provider.find()
      .populate("user", "name email role");

    res.status(200).json({
      count: providers.length,
      providers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch providers",
      error: error.message,
    });
  }
};

// VERIFY OR REJECT PROVIDER - Admin only
export const updateProviderVerification = async (req, res) => {
  try {
    const { verificationStatus } = req.body;

    if (!["verified", "rejected"].includes(verificationStatus)) {
      return res.status(400).json({
        message: "Verification status must be verified or rejected",
      });
    }

    const provider = await Provider.findByIdAndUpdate(
      req.params.id,
      { verificationStatus },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    res.status(200).json({
      message: `Provider ${verificationStatus} successfully`,
      provider,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update provider verification",
      error: error.message,
    });
  }
};