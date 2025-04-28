// src/components/items/ItemCard.jsx
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { markItemAsSold } from "../../services/itemService"; // Import the named export
import { useNotification } from "../../hooks/useNotification";

const ItemCard = ({ item, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const { addNotification } = useNotification();

  const isOwner = currentUser && currentUser.id === item.user_id;

  const handleMarkAsSold = async () => {
    setLoading(true);
    try {
      await markItemAsSold(item.id); // Use the named function directly
      addNotification("Item marked as sold successfully!", "success");
      if (onUpdate) onUpdate();
    } catch (error) {
      addNotification(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative pb-2/3">
        <img
          src={item.photo || "/placeholder-image.jpg"}
          alt={item.title}
          className="absolute h-48 w-full object-cover"
        />
        {item.status === "sold" && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
            SOLD
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 truncate">
          {item.title}
        </h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
          {item.description}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-lg font-bold text-blue-600">${item.price}</p>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {item.category}
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Condition: {item.condition}
        </p>
        <div className="mt-4 flex justify-between">
          <Link
            to={`/items/${item.id}`}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            View Details
          </Link>
          {isOwner && item.status !== "sold" && (
            <button
              onClick={handleMarkAsSold}
              disabled={loading}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none"
            >
              {loading ? "Loading..." : "Mark as Sold"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
