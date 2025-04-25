// controllers/messageController.js
const { Message, User } = require("../models");
const { Op } = require("sequelize");

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { receiver_id, content } = req.body;

    // Check if receiver exists
    const receiver = await User.findByPk(receiver_id);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    const message = await Message.create({
      sender_id: req.user.id,
      receiver_id,
      content,
    });

    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get conversation with another user
exports.getConversation = async (req, res) => {
  try {
    const otherUserId = req.params.userId;

    // Check if other user exists
    const otherUser = await User.findByPk(otherUserId);
    if (!otherUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: req.user.id, receiver_id: otherUserId },
          { sender_id: otherUserId, receiver_id: req.user.id },
        ],
      },
      order: [["created_at", "ASC"]],
      include: [
        {
          model: User,
          as: "Sender",
          attributes: ["id", "firstName", "lastName", "profilePhoto"],
        },
        {
          model: User,
          as: "Receiver",
          attributes: ["id", "firstName", "lastName", "profilePhoto"],
        },
      ],
    });

    // Mark messages as read
    await Message.update(
      { read: true },
      {
        where: {
          receiver_id: req.user.id,
          sender_id: otherUserId,
          read: false,
        },
      }
    );

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all user conversations
exports.getConversations = async (req, res) => {
  try {
    // Find all users the current user has exchanged messages with
    const sentMessages = await Message.findAll({
      where: { sender_id: req.user.id },
      attributes: ["receiver_id"],
      group: ["receiver_id"],
    });

    const receivedMessages = await Message.findAll({
      where: { receiver_id: req.user.id },
      attributes: ["sender_id"],
      group: ["sender_id"],
    });

    // Extract unique user IDs
    const userIds = new Set();
    sentMessages.forEach((msg) => userIds.add(msg.receiver_id));
    receivedMessages.forEach((msg) => userIds.add(msg.sender_id));

    // Get latest message with each user
    const conversations = [];

    for (const userId of userIds) {
      const latestMessage = await Message.findOne({
        where: {
          [Op.or]: [
            { sender_id: req.user.id, receiver_id: userId },
            { sender_id: userId, receiver_id: req.user.id },
          ],
        },
        order: [["created_at", "DESC"]],
        include: [
          {
            model: User,
            as: "Sender",
            attributes: ["id", "firstName", "lastName", "profilePhoto"],
          },
          {
            model: User,
            as: "Receiver",
            attributes: ["id", "firstName", "lastName", "profilePhoto"],
          },
        ],
      });

      // Count unread messages
      const unreadCount = await Message.count({
        where: {
          sender_id: userId,
          receiver_id: req.user.id,
          read: false,
        },
      });

      conversations.push({
        otherUser: userId,
        otherUserInfo:
          latestMessage.sender_id === req.user.id
            ? latestMessage.Receiver
            : latestMessage.Sender,
        latestMessage: latestMessage,
        unreadCount: unreadCount,
      });
    }

    res.json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findByPk(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Only the receiver can mark a message as read
    if (message.receiver_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this message" });
    }

    await Message.update({ read: true }, { where: { id: messageId } });

    res.json({ message: "Message marked as read" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete message (admin only)
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findByPk(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Only admin or the sender can delete a message
    if (message.sender_id !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this message" });
    }

    await Message.destroy({ where: { id: messageId } });

    res.json({ message: "Message deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
