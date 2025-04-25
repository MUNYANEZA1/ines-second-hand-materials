
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
} = require("../controllers/itemController");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

// Create new item
router.post("/", protect, upload.single("photo"), createItem);

// Get all items (with filters)
router.get("/", protect, getItems);

// Get item by ID
router.get("/:id", protect, getItemById);

// Update item
router.put("/:id", protect, upload.single("photo"), updateItem);

// Delete item
router.delete("/:id", protect, deleteItem);

// Get all items by a specific user
router.get("/user/:userId", protect, getUserItems);

module.exports = router;
