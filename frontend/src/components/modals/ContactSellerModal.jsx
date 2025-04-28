// src/components/modals/ContactSellerModal.jsx
import { useState } from "react";
import { messageService } from "../../services/messageService";
import { useAuth } from "../../hooks/useAuth";
import { useNotification } from "../../hooks/useNotification";
import LoadingSpinner from "../common/LoadingSpinner";

const ContactSellerModal = ({ item, onClose }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const { addNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      addNotification("Please enter a message", "error");
      return;
    }

    setLoading(true);
    try {
      await messageService.sendMessage({
        item_id: item.id,
        receiver_id: item.user_id,
        content: message,
      });

      addNotification("Message sent successfully!", "success");
      onClose();
    } catch (error) {
      addNotification(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Contact Seller about "{item.title}"
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {!currentUser ? (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">
              You need to be logged in to contact the seller.
            </p>
            <a
              href="/login"
              className="inline-block px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              Log In
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Your Message
              </label>
              <textarea
                id="message"
                rows="5"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi, I'm interested in this item. Is it still available?"
                className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              ></textarea>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                {loading ? <LoadingSpinner size="sm" /> : "Send Message"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactSellerModal;