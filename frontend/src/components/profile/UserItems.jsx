// src/components/profile/UserItems.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import itemService from "../../services/itemService"; // ✅ now correctly matches the default export
import LoadingSpinner from "../common/LoadingSpinner";
import { motion } from "framer-motion";

const UserItems = ({ userId }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserItems = async () => {
      try {
        setLoading(true);
        const data = await itemService.getUserItems(userId);
        setItems(data);
        setError("");
      } catch (err) {
        setError("Failed to load items");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserItems();
  }, [userId]);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return <div className="p-4 bg-red-50 text-red-700 rounded-md">{error}</div>;
  }

  if (items.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
        No items posted yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
        >
          <Link to={`/items/${item.id}`}>
            <div className="h-48 bg-gray-200 overflow-hidden">
              {item.photo ? (
                <img
                  src={item.photo}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {item.title}
                </h3>
                <span className="text-blue-600 font-bold">${item.price}</span>
              </div>

              <p className="text-gray-500 text-sm mb-2 line-clamp-2">
                {item.description}
              </p>

              <div className="flex items-center justify-between mt-4">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    item.status === "available"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.status === "available" ? "Available" : "Sold"}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default UserItems;
