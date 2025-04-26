// src/components/AdminHeader.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

const AdminHeader = ({ user }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    { id: 1, text: "New user registration", time: "5 minutes ago" },
    { id: 2, text: "New item reported", time: "1 hour ago" },
    { id: 3, text: "System update completed", time: "2 hours ago" },
  ];

  return (
    <header className="bg-white border-b border-gray-200 flex items-center justify-between px-6 py-3">
      {/* Mobile sidebar toggle */}
      <button className="md:hidden p-2 rounded-md hover:bg-gray-100">
        <i className="bi bi-list text-xl"></i>
      </button>

      {/* Search bar */}
      <div className="hidden md:flex flex-1 ml-4">
        <div className="relative w-64">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <i className="bi bi-search text-gray-400"></i>
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Right-side buttons */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1 rounded-full hover:bg-gray-100 relative"
          >
            <i className="bi bi-bell text-lg"></i>
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
              <div className="py-2 px-4 bg-gray-100 border-b border-gray-200">
                <p className="text-sm font-medium">Notifications</p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="px-4 py-3 hover:bg-gray-100 border-b border-gray-100"
                  >
                    <p className="text-sm">{notification.text}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notification.time}
                    </p>
                  </div>
                ))}
              </div>
              <div className="py-2 px-4 bg-gray-100 text-center">
                <Link
                  to="/admin/notifications"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
              <span>{user?.name?.charAt(0)}</span>
            </div>
            <span className="hidden md:inline-block font-medium">
              {user?.name}
            </span>
            <i className="bi bi-chevron-down text-sm"></i>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20">
              <Link
                to="/admin/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </Link>
              <Link
                to="/admin/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Settings
              </Link>
              <div className="border-t border-gray-100"></div>
              <Link
                to="/logout"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
