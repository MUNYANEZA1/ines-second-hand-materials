// routes/messages.js
const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getConversation,
  getConversations,
  markAsRead,
  deleteMessage,
} = require("../controllers/messageController");
const { protect, authorize } = require("../middleware/auth");

// Send message
router.post("/", protect, sendMessage);

// Get all conversations for current user
router.get("/conversations", protect, getConversations);

// Get conversation with specific user
router.get("/conversation/:userId", protect, getConversation);

// Mark message as read
router.put("/:messageId/read", protect, markAsRead);

// Delete message (admin only or sender)
router.delete("/:messageId", protect, deleteMessage);

module.exports = router;
