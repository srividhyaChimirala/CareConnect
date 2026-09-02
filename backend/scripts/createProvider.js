import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const createProvider = async () => {
  try {
    await connectDB();

    const providerExists = await User.findOne({
      email: "provider@careconnect.com",
    });

    if (providerExists) {
      console.log("Provider already exists");
      process.exit(0);
    }

    const provider = await User.create({
      name: "Test Provider",
      email: "provider@careconnect.com",
      password: "Provider123",
      role: "provider",
    });

    console.log("Provider created successfully!");
    console.log("Email:", provider.email);
    console.log("Role:", provider.role);

    process.exit(0);
  } catch (error) {
    console.error("Error creating provider:", error.message);
    process.exit(1);
  }
};

createProvider();