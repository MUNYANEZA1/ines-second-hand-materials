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

export default MessageList;