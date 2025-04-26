// src/pages/AdminReportsPage.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminReportsPage = () => {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not admin
    if (currentUser && currentUser.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchReports = async () => {
      try {
        const response = await axios.get("/api/reports");
        setReports(response.data);
      } catch (err) {
        setError("Failed to load reports");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && currentUser.role === "admin") {
      fetchReports();
    }
  }, [currentUser, navigate]);

  const handleResolveReport = async (reportId) => {
    try {
      await axios.put(`/api/reports/${reportId}/resolve`);

      // Update the reports list
      setReports((prev) => prev.filter((report) => report.id !== reportId));
    } catch (err) {
      setError("Failed to resolve report");
      console.error(err);
    }
  };

  

  // Function to handle item removal
  const handleRemoveItem = async (itemId, reportId) => {
    try {
      await axios.delete(`/api/items/${itemId}`);
      await axios.put(`/api/reports/${reportId}/resolve`);

      // Remove the report from list
      setReports((prev) => prev.filter((report) => report.id !== reportId));
    } catch (err) {
      setError("Failed to remove item and resolve report");
      console.error(err);
    }
  };

  if (!currentUser || currentUser.role !== "admin") {
    return null;
  }

  return (
    <div className="container mx-auto my-8 p-4">
      <h1 className="text-2xl font-bold mb-6">User Reports</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p>Loading reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p>No reports to review.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reporter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reported Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{report.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.Reporter?.firstName} {report.Reporter?.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.item_id ? "Item" : "User"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.item_id ? (
                      <Link
                        to={`/items/${report.item_id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View Item
                      </Link>
                    ) : report.target_user_id ? (
                      <Link
                        to={`/users/${report.target_user_id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {report.TargetUser?.firstName}{" "}
                        {report.TargetUser?.lastName}
                      </Link>
                    ) : (
                      "Unknown"
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {report.reason}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(report.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      {report.item_id && (
                        <button
                          onClick={() =>
                            handleRemoveItem(report.item_id, report.id)
                          }
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove Item
                        </button>
                      )}
                      <button
                        onClick={() => handleResolveReport(report.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Resolve
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminReportsPage;
