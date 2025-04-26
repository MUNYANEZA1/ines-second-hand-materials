// src/components/admin/UsersManagement.jsx
import { useState, useEffect } from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [filter, currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/admin/users", {
        params: {
          page: currentPage,
          filter,
          search: searchTerm || undefined,
        },
      });
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError("Failed to load users. Please try again.");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers();
  };

  const handleUserSelection = (userId) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user.id));
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) return;

    try {
      await axios.post(`/api/admin/users/${action}`, {
        userIds: selectedUsers,
      });
      fetchUsers();
      setSelectedUsers([]);
    } catch (err) {
      console.error(`Error performing ${action} operation:`, err);
    }
  };

  const handleUserStatusChange = async (userId, newStatus) => {
    try {
      await axios.patch(`/api/admin/users/${userId}/status`, {
        status: newStatus,
      });
      fetchUsers();
    } catch (err) {
      console.error("Error updating user status:", err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    )
      return;

    try {
      await axios.delete(`/api/admin/users/${userId}`);
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Link
          to="/admin/users/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Add New User
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-wrap gap-4 justify-between">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex w-full md:w-auto">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r"
              >
                Search
              </button>
            </form>

            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="all">All Users</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="admin">Admins</option>
                <option value="regular">Regular Users</option>
              </select>

              {selectedUsers.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkAction("activate")}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => handleBulkAction("suspend")}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Suspend
                  </button>
                  <button
                    onClick={() => handleBulkAction("delete")}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">{error}</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-8 px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectedUsers.length === users.length &&
                          users.length > 0
                        }
                        onChange={handleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleUserSelection(user.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-200 mr-3">
                            {user.avatarUrl && (
                              <img
                                src={user.avatarUrl}
                                alt={user.name}
                                className="w-full h-full object-cover rounded-full"
                              />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {user.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
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
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status === "active"
                              ? "bg-green-100 text-green-800"
                              : user.status === "suspended"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        <div className="flex space-x-2">
                          <Link
                            to={`/admin/users/${user.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </Link>
                          <Link
                            to={`/admin/users/${user.id}/edit`}
                            className="text-green-600 hover:text-green-900"
                          >
                            Edit
                          </Link>
                          {user.status === "active" ? (
                            <button
                              onClick={() =>
                                handleUserStatusChange(user.id, "suspended")
                              }
                              className="text-yellow-600 hover:text-yellow-900"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleUserStatusChange(user.id, "active")
                              }
                              className="text-green-600 hover:text-green-900"
                            >
                              Activate
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing page{" "}
                      <span className="font-medium">{currentPage}</span> of{" "}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        <span className="sr-only">Previous</span>
                        <i className="bi bi-chevron-left"></i>
                      </button>

                      {[...Array(totalPages).keys()].map((number) => {
                        const page = number + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border ${
                              currentPage === page
                                ? "bg-blue-50 border-blue-500 text-blue-600"
                                : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                            } text-sm font-medium`}
                          >
                            {page}
                          </button>
                        );
                      })}

                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        <span className="sr-only">Next</span>
                        <i className="bi bi-chevron-right"></i>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Routes>
        <Route path="/new" element={<UserForm />} />
        <Route path="/:id" element={<UserDetails />} />
        <Route path="/:id/edit" element={<UserForm />} />
      </Routes>
    </div>
  );
};

// Placeholder components for routes
const UserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    status: "active",
  });

  useEffect(() => {
    if (isEditing) {
      // Fetch user data if editing
      const fetchUser = async () => {
        try {
          const response = await axios.get(`/api/admin/users/${id}`);
          setFormData(response.data);
        } catch (err) {
          console.error("Error fetching user:", err);
        }
      };

      fetchUser();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await axios.put(`/api/admin/users/${id}`, formData);
      } else {
        await axios.post("/api/admin/users", formData);
      }
      navigate("/admin/users");
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">
        {isEditing ? "Edit User" : "Add New User"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {!isEditing && (
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleChange}
              required={!isEditing}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isEditing ? "Update User" : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
};

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/admin/users/${id}`);
        setUser(response.data);
      } catch (err) {
        setError("Failed to load user details.");
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-red-600">{error || "User not found"}</p>
        <button
          onClick={() => navigate("/admin/users")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">User Details</h2>
        <div className="flex space-x-2">
          <Link
            to={`/admin/users/${id}/edit`}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Edit
          </Link>
          <button
            onClick={() => navigate("/admin/users")}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            Back
          </button>
        </div>
      </div>

      <div className="flex items-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gray-200 mr-4">
          {user.avatarUrl && (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-full h-full object-cover rounded-full"
            />
          )}
        </div>
        <div>
          <h3 className="text-xl font-medium">{user.name}</h3>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <h4 className="font-medium text-gray-700">User ID</h4>
          <p>{user.id}</p>
        </div>
        <div>
          <h4 className="font-medium text-gray-700">Role</h4>
          <p>{user.role}</p>
        </div>
        <div>
          <h4 className="font-medium text-gray-700">Status</h4>
          <p>{user.status}</p>
        </div>
        <div>
          <h4 className="font-medium text-gray-700">Joined</h4>
          <p>{new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
        <div>
          <h4 className="font-medium text-gray-700">Last Login</h4>
          <p>
            {user.lastLogin
              ? new Date(user.lastLogin).toLocaleString()
              : "Never"}
          </p>
        </div>
      </div>

      {/* Activity Log (simplified) */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
        {user.activity && user.activity.length > 0 ? (
          <div className="border rounded-md divide-y">
            {user.activity.map((activity, index) => (
              <div key={index} className="p-3">
                <div className="flex justify-between">
                  <p>{activity.action}</p>
                  <span className="text-sm text-gray-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No recent activity</p>
        )}
      </div>
    </div>
  );
};

export default UsersManagement;
export { UserForm, UserDetails };