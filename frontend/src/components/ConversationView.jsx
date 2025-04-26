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

export default ConversationView;