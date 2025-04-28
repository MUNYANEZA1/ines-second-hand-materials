// routes/items.js
const express = require("express");
const router = express.Router();

const {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  getUserItems,
  getFeaturedItems,
  getRecentItems,
} = require("../controllers/itemController");

const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

// ===============================
// Public routes (NO authentication needed)
// ===============================

// Route to get featured items
router.get("/featured", getFeaturedItems);

// Route to get recent items
router.get("/recent", getRecentItems);

// ===============================
// Protected routes (authentication needed)
// ===============================

// Create a new item (with photo upload)
router.post("/", protect, upload.single("photo"), createItem);

// Get all items (with filters/search)
router.get("/", protect, getItems);

// Get single item by ID
router.get("/:id", getItemById);

// Update an item
router.put("/:id", protect, upload.single("photo"), updateItem);

// Delete an item
router.delete("/:id", protect, deleteItem);

// Get all items by a specific user
router.get("/user/:userId", protect, getUserItems);

module.exports = router;
