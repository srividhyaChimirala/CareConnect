// import express from "express";
// import {
//   registerUser,
//   loginUser,
// } from "../controllers/authController.js";
// import { protect } from "../middleware/authMiddleware.js";
// import {
//   protect,
//   authorizeRoles,
// } from "../middleware/authMiddleware.js";
// const router = express.Router();

// router.post("/register", registerUser);
// router.post("/login", loginUser);

// // Protected test route
// router.get("/profile", protect, (req, res) => {
//   res.status(200).json({
//     message: "Protected route accessed successfully",
//     user: req.user,
//   });
// });



// router.get(
//   "/admin-test",
//   protect,
//   authorizeRoles("admin"),
//   (req, res) => {
//     res.json({
//       message: "Welcome Admin",
//     });
//   }
// );



// export default router;



import express from "express";
import {
  registerUser,
  loginUser,
} from "../controllers/authController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Protected profile route
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

// Admin test route
router.get(
  "/admin-test",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({
      message: "Welcome Admin",
    });
  }
);

export default router;