// src/components/ItemListing.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ItemListing = ({ item, onEdit, onDelete, showActions = true }) => {
  const { currentUser } = useAuth();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const isOwner = currentUser && item.user_id === currentUser.id;
  const isAdmin = currentUser && currentUser.role === "admin";

  const handleDelete = () => {
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    onDelete(item.id);
    setShowConfirmDelete(false);
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-gray-200">
        {item.photo ? (
          <img
            src={item.photo}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
        {item.status === "sold" && (
          <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 m-2 rounded">
            SOLD
          </div>
        )}
        {!item.approved && (
          <div className="absolute top-0 left-0 bg-yellow-500 text-white px-2 py-1 m-2 rounded">
            Pending Approval
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <Link
            to={`/items/${item.id}`}
            className="text-lg font-semibold text-blue-800 hover:text-blue-600"
          >
            {item.title}
          </Link>
          <span className="font-bold text-green-600">
            ${parseFloat(item.price).toFixed(2)}
          </span>
        </div>

        <p className="text-gray-500 text-sm mt-1">
          {item.category} · {item.condition}
        </p>

        <p className="text-gray-600 mt-2 line-clamp-2">{item.description}</p>

        {showActions && (isOwner || isAdmin) && (
          <div className="mt-4 flex justify-end space-x-2">
            {isOwner && item.status === "available" && (
              <button
                onClick={() => onEdit(item.id)}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
              >
                Edit
              </button>
            )}
            {(isOwner || isAdmin) && (
              <>
                {showConfirmDelete ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={cancelDelete}
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
                    >
                      Confirm
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleDelete}
                    className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemListing;
