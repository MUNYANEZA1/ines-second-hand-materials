// src/components/AdminOverview.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-3xl font-bold mt-2">{value}</h3>
      </div>
      <div
        className={`w-12 h-12 rounded-full bg-${color}-100 flex items-center justify-center`}
      >
        <i className={`bi bi-${icon} text-${color}-500 text-xl`}></i>
      </div>
    </div>
    <div className="mt-4">
      <Link
        to={`/admin/${title.toLowerCase()}`}
        className="text-sm text-blue-600 hover:text-blue-800"
      >
        View details
      </Link>
    </div>
  </div>
);

const AdminOverview = () => {
  const [stats, setStats] = useState({
    users: { total: 0, growth: 0 },
    items: { total: 0, growth: 0 },
    reports: { total: 0, growth: 0 },
    sales: { total: 0, growth: 0 },
  });
  const [recentItems, setRecentItems] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsResponse, itemsResponse, usersResponse] = await Promise.all(
          [
            axios.get("/api/admin/stats"),
            axios.get("/api/admin/items/recent"),
            axios.get("/api/admin/users/recent"),
          ]
        );

        setStats(statsResponse.data);
        setRecentItems(itemsResponse.data);
        setRecentUsers(usersResponse.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Users"
          value={stats.users.total}
          icon="people"
          color="blue"
        />
        <StatCard
          title="Items"
          value={stats.items.total}
          icon="box"
          color="green"
        />
        <StatCard
          title="Reports"
          value={stats.reports.total}
          icon="flag"
          color="red"
        />
        <StatCard
          title="Sales"
          value={`$${stats.sales.total}`}
          icon="graph-up"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Items */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="font-semibold">Recent Items</h2>
            <Link
              to="/admin/items"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View all
            </Link>
          </div>
          <div className="divide-y">
            {recentItems.map((item) => (
              <div key={item.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded bg-gray-200 mr-4">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover rounded"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <Link
                      to={`/admin/items/${item.id}`}
                      className="font-medium hover:text-blue-600"
                    >
                      {item.title}
                    </Link>
                    <p className="text-sm text-gray-500">
                      ${item.price} - {item.category}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="font-semibold">Recent Users</h2>
            <Link
              to="/admin/users"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View all
            </Link>
          </div>
          <div className="divide-y">
            {recentUsers.map((user) => (
              <div key={user.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 mr-4 flex items-center justify-center">
                    <span className="font-medium text-blue-600">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <Link
                      to={`/admin/users/${user.id}`}
                      className="font-medium hover:text-blue-600"
                    >
                      {user.name}
                    </Link>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
