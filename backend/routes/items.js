
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
const itemController = require("../controllers/itemController");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");
// Add these below your existing routes
const { getFeaturedItems, getRecentItems } = require("../controllers/itemController");


// Route to get featured items
router.get("/featured", protect, getFeaturedItems);

// Route to get recent items
router.get("/recent", protect, getRecentItems);


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

// Add these two routes below your existing routes:

// Get featured items
router.get("/featured", protect, getFeaturedItems);

// Get recent items
router.get("/recent", protect, getRecentItems);

router.get("/featured", itemController.getFeaturedItems);

// POST route to add a new item
router.post('/', itemController.createItem);


module.exports = router;
