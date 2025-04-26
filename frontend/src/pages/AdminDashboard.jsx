// src/pages/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
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
        const response = await axios.get("/api/admin/auth/verify");
        setUser(response.data.user);
      } catch (err) {
        setError("Unauthorized. Please log in with admin credentials.");
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate("/admin/login");
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
