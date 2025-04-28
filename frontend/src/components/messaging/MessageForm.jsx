// src/components/messaging/MessageForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import messageService from "../../services/messageService";
import useAuth from "../../hooks/useAuth";
import { motion } from "framer-motion";

const MessageForm = ({ recipientId, itemId = null, onClose = () => {} }) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setError("Please enter a message");
      return;
    }

    try {
      setSending(true);
      const result = await messageService.startConversation({
        recipientId,
        content: message,
        itemId,
      });

      setSending(false);
      setMessage("");
      onClose();

      // Redirect to the conversation
      navigate(`/messages/${result.conversationId}`);
    } catch (error) {
      setError("Failed to send message. Please try again.");
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700"
        >
          Message
        </label>
        <textarea
          id="message"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Hi, I'm interested in this item..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={sending}
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        type="submit"
        disabled={sending}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
      >
        {sending ? "Sending..." : "Send Message"}
      </motion.button>
    </form>
  );
};

export default MessageForm;
