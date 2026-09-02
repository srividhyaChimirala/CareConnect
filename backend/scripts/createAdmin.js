import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to database
    await connectDB();

    // Check if admin already exists
    const adminExists = await User.findOne({
      email: "admin@careconnect.com",
    });

    if (adminExists) {
      console.log("Admin already exists");
      process.exit();
    }

    // Create admin
    const admin = await User.create({
      name: "CareConnect Admin",
      email: "admin@careconnect.com",
      password: "Admin123",
      role: "admin",
    });

    console.log("Admin created successfully!");
    console.log("Email:", admin.email);
    console.log("Role:", admin.role);

    process.exit();
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();