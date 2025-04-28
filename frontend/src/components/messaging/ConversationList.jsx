import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import messageService from "../../services/messageService";
import { formatDateRelative } from "../../utils/formatters";
import LoadingSpinner from "../common/LoadingSpinner";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";

const ConversationList = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const data = await messageService.getConversations();
        setConversations(data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-600 text-white p-4">
        <h2 className="text-xl font-semibold">Messages</h2>
      </div>

      {conversations.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No conversations yet. Start by messaging a seller!
        </div>
      ) : (
        <div className="divide-y">
          {conversations.map((conversation, index) => {
            const otherUser = conversation.participants.find(
              (p) => p.id !== user.id
            );

            return (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ backgroundColor: "#f9fafb" }}
              >
                <Link
                  to={`/messages/${conversation.id}`}
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                      {otherUser?.profilePhoto ? (
                        <img
                          src={otherUser.profilePhoto}
                          alt={`${otherUser.firstName} ${otherUser.lastName}`}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-500 text-lg font-medium">
                          {otherUser?.firstName.charAt(0)}
                          {otherUser?.lastName.charAt(0)}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-medium text-gray-900 truncate">
                          {otherUser?.firstName} {otherUser?.lastName}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatDateRelative(
                            conversation.lastMessage?.created_at
                          )}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500 truncate mt-1">
                        {conversation.lastMessage?.content || "No messages yet"}
                      </p>
                    </div>

                    {conversation.unreadCount > 0 && (
                      <div className="h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-medium">
                          {conversation.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ConversationList;
