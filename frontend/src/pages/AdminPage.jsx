// src/pages/AdminPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AdminDashboard from "../components/admin/AdminDashboard";
import ManageUsers from "../components/admin/ManageUsers";
import ManageItems from "../components/admin/ManageItems";
import Reports from "../components/admin/Reports";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import { useAuth } from "../hooks/useAuth";

const AdminPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verify user is admin
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "admin") {
      setError("You do not have permission to access this page");
      setTimeout(() => navigate("/"), 3000);
      return;
    }

    setLoading(false);
  }, [user, navigate]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboard />;
      case "users":
        return <ManageUsers />;
      case "items":
        return <ManageItems />;
      case "reports":
        return <Reports />;
      default:
        return <AdminDashboard />;
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <motion.h1
        className="text-3xl font-bold mb-6"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Admin Dashboard
      </motion.h1>

      <div className="mb-6">
        <motion.div
          className="flex border-b"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {["dashboard", "users", "items", "reports"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 font-medium capitalize ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </motion.div>
      </div>

      <motion.div
        key={activeTab}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {renderTabContent()}
      </motion.div>
    </motion.div>
  );
};

export default AdminPage;
