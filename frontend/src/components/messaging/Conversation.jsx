// src/components/messaging/Conversation.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import messageService from "../../services/messageService";
import { formatDateRelative } from "../../utils/formatters";
import LoadingSpinner from "../common/LoadingSpinner";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";

const Conversation = () => {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const data = await messageService.getConversationMessages(
          conversationId
        );
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Set up polling for new messages
    const intervalId = setInterval(fetchMessages, 10000);

    return () => clearInterval(intervalId);
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const sentMessage = await messageService.sendMessage({
        conversationId,
        content: newMessage,
      });

      setMessages([...messages, sentMessage]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col h-[70vh] bg-gray-50 rounded-lg shadow-md">
      <div className="p-4 bg-blue-600 text-white font-medium rounded-t-lg">
        {messages.length > 0 && messages[0].otherUser ? (
          <span>
            {messages[0].otherUser.firstName} {messages[0].otherUser.lastName}
          </span>
        ) : (
          <span>Conversation</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${
              message.sender_id === user.id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                message.sender_id === user.id
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              <p className="text-sm md:text-base">{message.content}</p>
              <p className="text-xs mt-1 opacity-75">
                {formatDateRelative(message.created_at)}
              </p>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 py-2 px-4 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
          >
            Send
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default Conversation;
