// src/components/admin/ManageItems.jsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, Edit, CheckCircle, XCircle, Filter } from 'lucide-react';
import { itemService } from '../../services/itemService';

const ManageItems = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, approved, rejected
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionType, setActionType] = useState(null); // 'delete', 'approve', 'reject'

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const data = await itemService.getAllItems();
        setItems(data);
        applyFilters(data, search, filter);
      } catch (error) {
        console.error("Error fetching items:", error);
        // Mock data for development
        const mockItems = Array.from({ length: 15 }, (_, i) => ({
          id: i + 1,
          title: `Item ${i + 1}`,
          description: `Description for item ${i + 1}`,
          price: Math.floor(Math.random() * 500) + 10,
          category: ["Books", "Electronics", "Furniture", "Clothing"][
            Math.floor(Math.random() * 4)
          ],
          condition: ["New", "Like New", "Good", "Fair", "Poor"][
            Math.floor(Math.random() * 5)
          ],
          photo: `/api/placeholder/200/200`,
          status: ["available", "sold"][Math.floor(Math.random() * 2)],
          approved: [true, false, null][Math.floor(Math.random() * 3)], // true=approved, false=rejected, null=pending
          userId: Math.floor(Math.random() * 10) + 1,
          userName: `User ${Math.floor(Math.random() * 10) + 1}`,
          createdAt: new Date(
            Date.now() - Math.random() * 10000000000
          ).toISOString(),
        }));
        setItems(mockItems);
        applyFilters(mockItems, search, filter);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const applyFilters = (itemsToFilter, searchTerm, filterType) => {
    let result = itemsToFilter;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterType !== "all") {
      if (filterType === "pending") {
        result = result.filter((item) => item.approved === null);
      } else if (filterType === "approved") {
        result = result.filter((item) => item.approved === true);
      } else if (filterType === "rejected") {
        result = result.filter((item) => item.approved === false);
      }
    }

    setFilteredItems(result);
  };

  useEffect(() => {
    applyFilters(items, search, filter);
  }, [search, filter, items]);

  const handleAction = (item, action) => {
    setSelectedItem(item);
    setActionType(action);
    setShowConfirmDialog(true);
  };

  const confirmAction = async () => {
    try {
      if (actionType === "delete") {
        await itemService.deleteItem(selectedItem.id);
        setItems(items.filter((i) => i.id !== selectedItem.id));
      } else if (actionType === "approve") {
        await itemService.updateItemStatus(selectedItem.id, true);
        setItems(
          items.map((i) =>
            i.id === selectedItem.id ? { ...i, approved: true } : i
          )
        );
      } else if (actionType === "reject") {
        await itemService.updateItemStatus(selectedItem.id, false);
        setItems(
          items.map((i) =>
            i.id === selectedItem.id ? { ...i, approved: false } : i
          )
        );
      }
    } catch (error) {
      console.error(`Error performing ${actionType} action:`, error);
      // For demo, update the UI anyway
      if (actionType === "delete") {
        setItems(items.filter((i) => i.id !== selectedItem.id));
      } else if (actionType === "approve") {
        setItems(
          items.map((i) =>
            i.id === selectedItem.id ? { ...i, approved: true } : i
          )
        );
      } else if (actionType === "reject") {
        setItems(
          items.map((i) =>
            i.id === selectedItem.id ? { ...i, approved: false } : i
          )
        );
      }
    } finally {
      setShowConfirmDialog(false);
      setSelectedItem(null);
    }
  };

  const getStatusBadge = (item) => {
    if (item.approved === true) {
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          Approved
        </span>
      );
    } else if (item.approved === false) {
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
          Rejected
        </span>
      );
    } else {
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
          Pending
        </span>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold">Manage Items</h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative">
            <button
              className="flex items-center px-4 py-2 border rounded-lg bg-white"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <Filter size={16} className="mr-2" />
              <span className="capitalize">{filter}</span>
            </button>

            {showFilterDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
              >
                <div className="py-1">
                  {["all", "pending", "approved", "rejected"].map((option) => (
                    <button
                      key={option}
                      className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${
                        filter === option ? "bg-gray-100" : ""
                      }`}
                      onClick={() => {
                        setFilter(option);
                        setShowFilterDropdown(false);
                      }}
                    >
                      <span className="capitalize">{option}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search items..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seller
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posted
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <AnimatePresence>
                {filteredItems.map((item) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center mr-3 overflow-hidden">
                          {item.photo && (
                            <img
                              src={item.photo}
                              alt={item.title}
                              className="h-10 w-10 object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {item.title}
                          </div>
                          <div className="text-gray-500 text-sm truncate max-w-xs">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${item.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(item)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2 justify-end">
                        {item.approved === null && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-green-600 hover:text-green-900"
                              title="Approve Item"
                              onClick={() => handleAction(item, "approve")}
                            >
                              <CheckCircle size={18} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-red-600 hover:text-red-900"
                              title="Reject Item"
                              onClick={() => handleAction(item, "reject")}
                            >
                              <XCircle size={18} />
                            </motion.button>
                          </>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit Item"
                        >
                          <Edit size={18} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Item"
                          onClick={() => handleAction(item, "delete")}
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filteredItems.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
          >
            <h3 className="text-lg font-medium mb-4">Confirm Action</h3>
            <p className="mb-6">
              {actionType === "delete" &&
                `Are you sure you want to delete "${selectedItem.title}"?`}
              {actionType === "approve" &&
                `Are you sure you want to approve "${selectedItem.title}"?`}
              {actionType === "reject" &&
                `Are you sure you want to reject "${selectedItem.title}"?`}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-md text-white ${
                  actionType === "delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : actionType === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-orange-600 hover:bg-orange-700"
                }`}
                onClick={confirmAction}
              >
                Confirm
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ManageItems;