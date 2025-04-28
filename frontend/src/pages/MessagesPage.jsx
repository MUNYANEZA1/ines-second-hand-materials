// src/pages/MessagesPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ConversationList from "../components/messaging/ConversationList";
import Conversation from "../components/messaging/Conversation";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import { messageService } from "../services/messageService";
import { useAuth } from "../hooks/useAuth";

const MessagesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch all conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const conversationsData = await messageService.getConversations();
        setConversations(conversationsData);

        // Set first conversation as active if available
        if (conversationsData.length > 0 && !activeConversation) {
          setActiveConversation(conversationsData[0]);
        }
      } catch (err) {
        setError("Failed to load conversations. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user, activeConversation]);

  // Fetch messages for active conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeConversation) return;

      try {
        const messagesData = await messageService.getMessagesByConversation(
          activeConversation.id
        );
        setMessages(messagesData);
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };

    fetchMessages();

    // Set up interval to check for new messages
    const messageInterval = setInterval(fetchMessages, 5000);

    return () => clearInterval(messageInterval);
  }, [activeConversation]);

  const selectConversation = (conversation) => {
    setActiveConversation(conversation);
  };

  const sendMessage = async (content) => {
    if (!activeConversation || !content.trim()) return;

    try {
      const newMessage = await messageService.sendMessage({
        receiverId:
          activeConversation.user.id === user.id
            ? activeConversation.otherUser.id
            : activeConversation.user.id,
        content: content,
      });

      setMessages((prev) => [...prev, newMessage]);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  if (!user) return null;
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-6">Messages</h1>

      {conversations.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">No messages yet</h2>
          <p className="text-gray-600">
            Start a conversation by contacting a seller about an item you're
            interested in.
          </p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-1/3"
          >
            <ConversationList
              conversations={conversations}
              activeConversation={activeConversation}
              onSelectConversation={selectConversation}
            />
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-full md:w-2/3"
          >
            {activeConversation ? (
              <Conversation
                messages={messages}
                currentUser={user}
                otherUser={
                  activeConversation.user.id === user.id
                    ? activeConversation.otherUser
                    : activeConversation.user
                }
                onSendMessage={sendMessage}
              />
            ) : (
              <div className="text-center p-8 bg-gray-50 rounded-lg h-full flex items-center justify-center">
                <p className="text-gray-600">
                  Select a conversation to start messaging
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default MessagesPage;
