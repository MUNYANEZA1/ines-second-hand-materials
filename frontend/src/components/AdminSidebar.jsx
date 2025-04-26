// src/components/admin/AdminSidebar.jsx
import { NavLink } from "react-router-dom";

const AdminSidebar = ({ user }) => {
  const navItems = [
    { name: "Dashboard", path: "/admin", icon: "graph-up" },
    { name: "Items", path: "/admin/items", icon: "box" },
    { name: "Users", path: "/admin/users", icon: "people" },
    { name: "Reports", path: "/admin/reports", icon: "flag" },
    { name: "Settings", path: "/admin/settings", icon: "gear" },
  ];

  return (
    <aside className="bg-blue-900 text-white w-64 flex-shrink-0 hidden md:block">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>

      <div className="px-4 py-2">
        <div className="flex items-center p-4 bg-blue-800 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-3">
            <span className="font-bold">{user?.name?.charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium">{user?.name}</p>
            <p className="text-sm text-blue-300">
              {user?.role || "Administrator"}
            </p>
          </div>
        </div>
      </div>

      <nav className="mt-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="px-2 py-1">
              <NavLink
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-700 text-white"
                      : "text-blue-200 hover:bg-blue-800"
                  }`
                }
              >
                <i className={`bi bi-${item.icon} mr-3`}></i>
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto px-6 py-4 absolute bottom-0 w-full">
        <NavLink
          to="/logout"
          className="flex items-center text-blue-200 hover:text-white transition-colors"
        >
          <i className="bi bi-box-arrow-left mr-3"></i>
          <span>Logout</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default AdminSidebar;
