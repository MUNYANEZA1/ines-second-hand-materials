// src/components/MessageList.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const MessageList = ({
  conversations,
  onSelectConversation,
  selectedUserId,
}) => {
  const { currentUser } = useAuth();

  if (!conversations || conversations.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No conversations yet.</p>
      </div>
    );
  }

  return (
    <div className="border-r border-gray-200">
      <h2 className="p-4 font-bold border-b">Conversations</h2>
      <div className="overflow-y-auto max-h-[600px]">
        {conversations.map((convo) => {
          const isSelected = convo.userId === selectedUserId;
          const hasUnread = convo.unreadCount > 0;

          return (
            <button
              key={convo.userId}
              className={`w-full text-left p-4 border-b transition-colors hover:bg-gray-50 ${
                isSelected ? "bg-blue-50" : ""
              }`}
              onClick={() => onSelectConversation(convo.userId)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-semibold">
                    {convo.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <div className="font-medium">{convo.name}</div>
                    <p className="text-sm text-gray-500 truncate max-w-xs">
                      {convo.lastMessage}
                    </p>
                  </div>
                </div>
                {hasUnread && (
                  <span className="bg-blue-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs">
                    {convo.unreadCount}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// src/components/ConversationView.jsx
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";

const ConversationView = ({
  messages,
  recipientId,
  recipientName,
  onSendMessage,
  isLoading,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(recipientId, newMessage.trim());
      setNewMessage("");
    }
  };

  if (!recipientId) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <p>Select a conversation to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b font-medium">
        <h2>Conversation with {recipientName}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex justify-center">
            <p>Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 my-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isFromCurrentUser = message.sender_id === currentUser.id;

              return (
                <div
                  key={message.id}
                  className={`flex ${
                    isFromCurrentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                      isFromCurrentUser
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(message.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 border rounded-l-lg py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg"
            disabled={!newMessage.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

// src/pages/MessagesPage.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import MessageList from "../components/MessageList";
import ConversationView from "../components/ConversationView";
import axios from "axios";

const MessagesPage = () => {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch conversations (users you've messaged with)
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get("/api/messages/conversations");
        setConversations(response.data);
        setLoading(false);

        // Auto-select the first conversation if none selected
        if (response.data.length > 0 && !selectedUserId) {
          setSelectedUserId(response.data[0].userId);
          setSelectedUserName(response.data[0].name);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchConversations();
    }
  }, [currentUser]);

  // Fetch messages for selected conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUserId) return;

      try {
        setLoading(true);
        const response = await axios.get(`/api/messages/${selectedUserId}`);
        setMessages(response.data);

        // Mark messages as read
        await axios.post(`/api/messages/${selectedUserId}/read`);

        // Update unread count in conversations list
        setConversations((prevConversations) =>
          prevConversations.map((convo) =>
            convo.userId === selectedUserId
              ? { ...convo, unreadCount: 0 }
              : convo
          )
        );
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedUserId) {
      fetchMessages();
    }
  }, [selectedUserId]);

  const handleSelectConversation = (userId) => {
    const selectedConvo = conversations.find(
      (convo) => convo.userId === userId
    );
    if (selectedConvo) {
      setSelectedUserId(userId);
      setSelectedUserName(selectedConvo.name);
    }
  };

  const handleSendMessage = async (recipientId, content) => {
    try {
      const response = await axios.post("/api/messages", {
        receiver_id: recipientId,
        content,
      });

      // Add the new message to the current conversation
      setMessages((prev) => [...prev, response.data]);

      // Update the conversations list with the new last message
      setConversations((prevConversations) => {
        const existingConvoIndex = prevConversations.findIndex(
          (convo) => convo.userId === recipientId
        );

        if (existingConvoIndex >= 0) {
          // Update existing conversation
          const updatedConversations = [...prevConversations];
          updatedConversations[existingConvoIndex] = {
            ...updatedConversations[existingConvoIndex],
            lastMessage: content,
            timestamp: new Date().toISOString(),
          };
          return updatedConversations;
        } else {
          // Should not happen if already in conversation view
          return prevConversations;
        }
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="container mx-auto my-8 p-4">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>

      {loading && !conversations.length ? (
        <div className="text-center py-8">
          <p>Loading conversations...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 h-[600px]">
            <div className="md:col-span-1 border-r border-gray-200">
              <MessageList
                conversations={conversations}
                onSelectConversation={handleSelectConversation}
                selectedUserId={selectedUserId}
              />
            </div>
            <div className="md:col-span-2">
              <ConversationView
                messages={messages}
                recipientId={selectedUserId}
                recipientName={selectedUserName}
                onSendMessage={handleSendMessage}
                isLoading={loading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
