// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import connectDB from "./config/db.js";

// dotenv.config();

// const app = express();

// // Connect to MongoDB
// connectDB();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Test route
// app.get("/", (req, res) => {
//   res.send("CareConnect API is running...");
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import providerRoutes from "./routes/providerRoutes.js";
import serviceRequestRoutes from "./routes/serviceRequestRoutes.js";
import quoteRoutes from "./routes/quoteRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import availabilityRoutes from "./routes/availabilityRoutes.js";
import jobEvidenceRoutes from "./routes/jobEvidenceRoutes.js";
import jobNoteRoutes from "./routes/jobNoteRoutes.js";
import disputeRoutes from "./routes/disputeRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/service-requests", serviceRequestRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/job-evidence", jobEvidenceRoutes);
app.use("/api/job-notes", jobNoteRoutes);
app.use("/api/disputes", disputeRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

connectDB();

app.get("/", (req, res) => {
  res.send("CareConnect API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});