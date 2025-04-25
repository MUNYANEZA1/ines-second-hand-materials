// routes/auth.js
const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

// Register user with optional profile photo upload
router.post("/register", upload.single("profilePhoto"), register);

// Login user
router.post("/login", login);

// Get current user profile
router.get("/me", protect, getMe);

module.exports = router;
