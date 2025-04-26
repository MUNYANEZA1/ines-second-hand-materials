// src/pages/AdminItemsPage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { format } from "date-fns";
format(new Date(item.created_at), "MMM d, yyyy");


const AdminItemsPage = () => {
  const { currentUser } = useAuth();
  const [pendingItems, setPendingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPendingItems = async () => {
      try {
        const response = await axios.get("/api/admin/items/pending");
        setPendingItems(response.data);
      } catch (err) {
        setError("Failed to load pending items");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && currentUser.role === "admin") {
      fetchPendingItems();
    }
  }, [currentUser]);

  const handleApprove = async (itemId) => {
    try {
      await axios.put(`/api/admin/items/${itemId}/approve`);
      setPendingItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      setError("Failed to approve item");
      console.error(err);
    }
  };

  const handleReject = async (itemId) => {
    if (!window.confirm("Are you sure you want to reject this item?")) return;
    try {
      await axios.put(`/api/admin/items/${itemId}/reject`);
      setPendingItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      setError("Failed to reject item");
      console.error(err);
    }
  };
  // Check if the user is an admin

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="container mx-auto my-8 p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Unauthorized Access</h1>
        <p>You do not have permission to view this page.</p>
        <Link
          to="/"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-8 p-4">
      <h1 className="text-2xl font-bold mb-6">Item Approval Dashboard</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p>Loading items...</p>
        </div>
      ) : pendingItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p>No items pending approval.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posted By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{item.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-12 w-12 rounded overflow-hidden bg-gray-100">
                      {item.photo ? (
                        <img
                          src={item.photo}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full">
                          <span className="text-xs text-gray-400">
                            No image
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <Link
                      to={`/items/${item.id}`}
                      className="hover:text-blue-600 hover:underline"
                    >
                      {item.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${parseFloat(item.price).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.User?.firstName} {item.User?.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="text-green-600 hover:text-green-900"
                        aria-label="Approve item"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(item.id)}
                        className="text-red-600 hover:text-red-900"
                        aria-label="Reject item"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminItemsPage;
