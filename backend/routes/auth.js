// routes/auth.js
const express = require("express");
const router = express.Router();
const {
  register,
  loginUser,
  loginAdmin,
  getMe,
} = require("../controllers/authController");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

// Register user with optional profile photo upload
router.post("/register", upload.single("profilePhoto"), register);

// Register admin (requires authorization)
router.post(
  "/register-admin",
  protect, // Ensure the user is logged in
  authorize("admin"), // Ensure only admins can create other admins
  upload.single("profilePhoto"),
  register
);

// Login user (regular users only)
router.post("/login", loginUser);

// Login admin (admin only)
router.post("/admin/login", loginAdmin);

// Get current user profile
router.get("/me", protect, getMe);

// Add a dedicated verification endpoint
router.get("/verify", protect, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  // Return the user object from the auth middleware
  res.status(200).json({
    success: true,
    user: {
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      role: req.user.role,
      // Don't include sensitive data like password
    },
  });
});

module.exports = router;

