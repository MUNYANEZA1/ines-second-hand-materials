// src/pages/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import AdminOverview from "../components/AdminOverview";
import ItemsManagement from "../components/ItemsManagement";
import UsersManagement from "../components/UsersManagement";
import ReportsManagement from "../components/ReportsManagement";
import Settings from "../components/Settings";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);

        // Retrieve token from localStorage and set it to axios headers for all requests
        const token = localStorage.getItem("token");
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
          throw new Error("No token found, please login.");
        }

        // Try verifying authentication using /api/auth/verify or fallback to /api/auth/me
        let response;
        try {
          response = await axios.get("/api/auth/verify");
        } catch (err) {
          // Fallback to /me if /verify fails
          response = await axios.get("/api/auth/me");
        }

        // Check if user has admin privileges
        if (response.data && response.data.user) {
          if (response.data.user.role === "admin") {
            setUser(response.data.user);
          } else {
            throw new Error("Unauthorized. You need admin privileges.");
          }
        } else {
          throw new Error("Authentication failed. Please log in again.");
        }
      } catch (err) {
        console.error("Auth error:", err);

        // Display the error message if authentication fails
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Unauthorized. Please log in with admin credentials.";
        setError(errorMessage);

        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate("/admin/login");
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    // Set up an axios interceptor to handle global auth errors
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          setError("Your session has expired. Please log in again.");
          localStorage.removeItem("token"); // Remove invalid token
          setTimeout(() => navigate("/admin/login"), 2000);
        }
        return Promise.reject(error);
      }
    );

    // Call the checkAuth function on component mount
    checkAuth();

    // Cleanup interceptor on component unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  // Loading state (spinner)
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state (unauthorized)
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded">
          <p>{error}</p>
          <p className="text-sm mt-2">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  // Set profile photo URL if user has one
  const profilePhotoUrl = user?.profilePhoto
    ? `/${user.profilePhoto.replace("\\", "/")}`
    : "/default-avatar.png";

  // Ensure user is loaded before rendering dashboard
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded">
          <p>Error loading user data. Please try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-yellow-500 text-white px-4 py-2 rounded mt-2 hover:bg-yellow-600"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar user={user} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader user={user} />

        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="items/*" element={<ItemsManagement />} />
            <Route path="users/*" element={<UsersManagement />} />
            <Route path="reports/*" element={<ReportsManagement />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
