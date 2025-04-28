//src/components/admin/AdminDashboard.jsx

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Users,
  ShoppingBag,
  Flag,
  BarChart2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ManageUsers from "./ManageUsers";
import ManageItems from "./ManageItems";
import Reports from "./Reports";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalItems: 0,
    pendingApprovals: 0,
    totalReports: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        // Replace with actual API call
        const response = await fetch("/api/admin/stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching admin stats:", error);
        // Mock data for development
        setStats({
          totalUsers: 245,
          totalItems: 367,
          pendingApprovals: 12,
          totalReports: 5,
        });
      }
    };

    fetchStats();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <ManageUsers />;
      case "items":
        return <ManageItems />;
      case "reports":
        return <Reports />;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Total Users",
                value: stats.totalUsers,
                icon: <Users className="text-blue-500" />,
                color: "blue",
                path: "/admin/users",
              },
              {
                title: "Listed Items",
                value: stats.totalItems,
                icon: <ShoppingBag className="text-green-500" />,
                color: "green",
                path: "/admin/items",
              },
              {
                title: "Pending Approvals",
                value: stats.pendingApprovals,
                icon: <BarChart2 className="text-amber-500" />,
                color: "amber",
                path: "/admin/items?filter=pending",
              },
              {
                title: "Reports",
                value: stats.totalReports,
                icon: <Flag className="text-red-500" />,
                color: "red",
                path: "/admin/reports",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white p-6 rounded-lg shadow-md border-l-4 border-${stat.color}-500 hover:shadow-lg transition-shadow cursor-pointer`}
                onClick={() => navigate(stat.path)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600 text-sm">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-full">
                    {stat.icon}
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm text-blue-600">
                  <span>View details</span>
                  <ChevronRight size={16} className="ml-1" />
                </div>
              </motion.div>
            ))}
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-6"
    >
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex flex-wrap mb-6 bg-white rounded-lg shadow p-1">
        {["overview", "users", "items", "reports"].map((tab) => (
          <motion.button
            key={tab}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-4 py-2 rounded-md ${
              activeTab === tab
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            } capitalize transition-colors duration-200`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </motion.button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderContent()}
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;
