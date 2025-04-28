//src/components/admin/ManageUsers.jsx

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Trash2,
  Edit,
  MoreVertical,
  UserX,
  CheckCircle,
} from "lucide-react";
import { userService } from "../../services/userService";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionType, setActionType] = useState(null); // 'delete' or 'ban'

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await userService.getAllUsers();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        // Mock data for development
        const mockUsers = Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          firstName: `User${i + 1}`,
          lastName: `Last${i + 1}`,
          email: `user${i + 1}@ines.ac.rw`,
          role: i === 0 ? "admin" : "user",
          status: i === 9 ? "banned" : "active",
          createdAt: new Date(
            Date.now() - Math.random() * 10000000000
          ).toISOString(),
        }));
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search term
    const result = users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(search.toLowerCase()) ||
        user.lastName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(result);
  }, [search, users]);

  const handleAction = (user, action) => {
    setSelectedUser(user);
    setActionType(action);
    setShowConfirmDialog(true);
  };

  const confirmAction = async () => {
    try {
      if (actionType === "delete") {
        await userService.deleteUser(selectedUser.id);
        setUsers(users.filter((u) => u.id !== selectedUser.id));
      } else if (actionType === "ban") {
        await userService.updateUserStatus(selectedUser.id, "banned");
        setUsers(
          users.map((u) =>
            u.id === selectedUser.id ? { ...u, status: "banned" } : u
          )
        );
      } else if (actionType === "activate") {
        await userService.updateUserStatus(selectedUser.id, "active");
        setUsers(
          users.map((u) =>
            u.id === selectedUser.id ? { ...u, status: "active" } : u
          )
        );
      }
    } catch (error) {
      console.error(`Error performing ${actionType} action:`, error);
      // For demo, update the UI anyway
      if (actionType === "delete") {
        setUsers(users.filter((u) => u.id !== selectedUser.id));
      } else if (actionType === "ban") {
        setUsers(
          users.map((u) =>
            u.id === selectedUser.id ? { ...u, status: "banned" } : u
          )
        );
      } else if (actionType === "activate") {
        setUsers(
          users.map((u) =>
            u.id === selectedUser.id ? { ...u, status: "active" } : u
          )
        );
      }
    } finally {
      setShowConfirmDialog(false);
      setSelectedUser(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Users</h2>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <AnimatePresence>
                {filteredUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          {user.profilePhoto ? (
                            <img
                              src={user.profilePhoto}
                              alt={user.firstName}
                              className="h-10 w-10 rounded-full"
                            />
                          ) : (
                            <span className="text-gray-600">
                              {user.firstName[0]}
                              {user.lastName[0]}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2 justify-end">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit User"
                        >
                          <Edit size={18} />
                        </motion.button>
                        {user.status === "active" ? (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-orange-600 hover:text-orange-900"
                            title="Ban User"
                            onClick={() => handleAction(user, "ban")}
                          >
                            <UserX size={18} />
                          </motion.button>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-green-600 hover:text-green-900"
                            title="Activate User"
                            onClick={() => handleAction(user, "activate")}
                          >
                            <CheckCircle size={18} />
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-red-600 hover:text-red-900"
                          title="Delete User"
                          onClick={() => handleAction(user, "delete")}
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No users found
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
                `Are you sure you want to delete user ${selectedUser.firstName} ${selectedUser.lastName}?`}
              {actionType === "ban" &&
                `Are you sure you want to ban user ${selectedUser.firstName} ${selectedUser.lastName}?`}
              {actionType === "activate" &&
                `Are you sure you want to activate user ${selectedUser.firstName} ${selectedUser.lastName}?`}
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
                    : actionType === "ban"
                    ? "bg-orange-600 hover:bg-orange-700"
                    : "bg-green-600 hover:bg-green-700"
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

export default ManageUsers;
