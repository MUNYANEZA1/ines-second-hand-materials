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
  const [selectedProductInfo, setSelectedProductInfo] = useState(null);

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

          // If there's product info in the conversation, set it
          if (response.data[0].productInfo) {
            setSelectedProductInfo(response.data[0].productInfo);
          }
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchConversations();
    }
  }, [currentUser, selectedUserId]);

  // Fetch messages for selected conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUserId) return;

      try {
        setLoading(true);
        const response = await axios.get(`/api/messages/${selectedUserId}`);
        setMessages(response.data);

        // Fetch product information if it exists for this conversation
        try {
          const productResponse = await axios.get(
            `/api/messages/${selectedUserId}/product`
          );
          if (productResponse.data) {
            setSelectedProductInfo(productResponse.data);
          }
        } catch (productError) {
          console.error(
            "No product associated with this conversation:",
            productError
          );
          setSelectedProductInfo(null);
        }

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

      // Update product info if it exists for this conversation
      if (selectedConvo.productInfo) {
        setSelectedProductInfo(selectedConvo.productInfo);
      } else {
        setSelectedProductInfo(null);
      }
    }
  };

  const handleSendMessage = async (recipientId, content) => {
    try {
      const response = await axios.post("/api/messages", {
        receiver_id: recipientId,
        content,
        product_id: selectedProductInfo?.id, // Include product ID if there's a product being discussed
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

  // Handle price offer submission
  const handleSendOffer = async (recipientId, amount) => {
    if (!selectedProductInfo) return;

    try {
      // Create a formatted message with the offer
      const offerMessage = `I'd like to offer $${amount} for ${selectedProductInfo.name}`;

      await handleSendMessage(recipientId, offerMessage);

      // You might also want to record this as a formal offer in your database
      await axios.post("/api/offers", {
        product_id: selectedProductInfo.id,
        sender_id: currentUser.id,
        receiver_id: recipientId,
        amount: parseFloat(amount),
      });
    } catch (error) {
      console.error("Error sending offer:", error);
    }
  };

  // Handle accepting an offer
  const handleAcceptOffer = async (recipientId, offerId) => {
    try {
      await axios.post(`/api/offers/${offerId}/accept`);

      // Send a confirmation message in the chat
      await handleSendMessage(
        recipientId,
        "I've accepted your offer. Let's proceed with the transaction!"
      );
    } catch (error) {
      console.error("Error accepting offer:", error);
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
            <div className="md:col-span-1">
              <MessageList
                conversations={conversations}
                onSelectConversation={handleSelectConversation}
                selectedUserId={selectedUserId}
              />
            </div>
            <div className="md:col-span-2">
              {selectedProductInfo && (
                <div className="bg-blue-50 p-4 border-b border-blue-100">
                  <div className="flex items-center">
                    {selectedProductInfo.image && (
                      <img
                        src={selectedProductInfo.image}
                        alt={selectedProductInfo.name}
                        className="w-16 h-16 object-cover rounded mr-4"
                      />
                    )}
                    <div>
                      <h3 className="font-medium">
                        {selectedProductInfo.name}
                      </h3>
                      <p className="text-blue-800 font-bold">
                        ${selectedProductInfo.price}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => {
                            const offerAmount = prompt(
                              "Enter your offer amount:"
                            );
                            if (offerAmount && !isNaN(offerAmount)) {
                              handleSendOffer(selectedUserId, offerAmount);
                            }
                          }}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Make Offer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
