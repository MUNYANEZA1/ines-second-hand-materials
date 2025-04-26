// routes/users.js
const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");
const { getMe } = require("../controllers/authController");

// Add this above the ":id" route to avoid route conflicts
router.get("/me", protect, getMe);


// Get all users (admin only)
router.get("/", protect, authorize("admin"), getUsers);

// Get user by ID
router.get("/:id", protect, getUserById);

// Update user
router.put("/:id", protect, upload.single("profilePhoto"), updateUser);

// Delete user (admin only or own account)
router.delete("/:id", protect, deleteUser);

module.exports = router;
