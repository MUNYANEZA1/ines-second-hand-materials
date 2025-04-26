// src/components/admin/ReportsManagement.jsx
import { useState, useEffect } from "react";
import { Link, Routes, Route, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ReportsManagement = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedReports, setSelectedReports] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, [filter, currentPage]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/admin/reports", {
        params: {
          page: currentPage,
          filter,
          search: searchTerm || undefined,
        },
      });
      setReports(response.data.reports);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError("Failed to load reports. Please try again.");
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchReports();
  };

  const handleReportSelection = (reportId) => {
    setSelectedReports((prev) => {
      if (prev.includes(reportId)) {
        return prev.filter((id) => id !== reportId);
      } else {
        return [...prev, reportId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedReports.length === reports.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(reports.map((report) => report.id));
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedReports.length === 0) return;

    try {
      await axios.post(`/api/admin/reports/${action}`, {
        reportIds: selectedReports,
      });
      fetchReports();
      setSelectedReports([]);
    } catch (err) {
      console.error(`Error performing ${action} operation:`, err);
    }
  };

  const handleReportStatus = async (reportId, status) => {
    try {
      await axios.patch(`/api/admin/reports/${reportId}/status`, { status });
      fetchReports();
    } catch (err) {
      console.error("Error updating report status:", err);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "investigating":
        return "bg-blue-100 text-blue-800";
      case "rejected":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Report Management</h1>
        <div className="flex gap-2">
          <span className="bg-yellow-50 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
            Pending: {reports.filter((r) => r.status === "pending").length}
          </span>
          <span className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            Investigating:{" "}
            {reports.filter((r) => r.status === "investigating").length}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-wrap gap-4 justify-between">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex w-full md:w-auto">
              <input
                type="text"
                placeholder="Search reports..."
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
                <option value="all">All Reports</option>
                <option value="pending">Pending</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
                <option value="high">High Priority</option>
              </select>

              {selectedReports.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkAction("resolve")}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Resolve
                  </button>
                  <button
                    onClick={() => handleBulkAction("investigate")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Investigate
                  </button>
                  <button
                    onClick={() => handleBulkAction("reject")}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Reject
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
                          selectedReports.length === reports.length &&
                          reports.length > 0
                        }
                        onChange={handleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reporter
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
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
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedReports.includes(report.id)}
                          onChange={() => handleReportSelection(report.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {report.title || `Report #${report.id}`}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {report.description?.substring(0, 60)}...
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {report.type}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {report.reporter?.name || "Anonymous"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityBadgeClass(
                            report.priority
                          )}`}
                        >
                          {report.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                            report.status
                          )}`}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        <div className="flex space-x-2">
                          <Link
                            to={`/admin/reports/${report.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </Link>
                          {report.status === "pending" && (
                            <>
                              <button
                                onClick={() =>
                                  handleReportStatus(report.id, "investigating")
                                }
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Investigate
                              </button>
                              <button
                                onClick={() =>
                                  handleReportStatus(report.id, "rejected")
                                }
                                className="text-gray-600 hover:text-gray-900"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {report.status === "investigating" && (
                            <button
                              onClick={() =>
                                handleReportStatus(report.id, "resolved")
                              }
                              className="text-green-600 hover:text-green-900"
                            >
                              Resolve
                            </button>
                          )}
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
        <Route path="/:id" element={<ReportDetails />} />
      </Routes>
    </div>
  );
};

const ReportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/admin/reports/${id}`);
        setReport(response.data);
      } catch (err) {
        setError("Failed to load report details.");
        console.error("Error fetching report:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const handleStatusChange = async (status) => {
    try {
      await axios.patch(`/api/admin/reports/${id}/status`, { status });
      setReport((prev) => ({ ...prev, status }));
    } catch (err) {
      console.error("Error updating report status:", err);
    }
  };

  const handleAddNote = async () => {
    if (!notes.trim()) return;

    try {
      const response = await axios.post(`/api/admin/reports/${id}/notes`, {
        content: notes,
      });

      // Update the report with the new note
      setReport((prev) => ({
        ...prev,
        notes: [...(prev.notes || []), response.data],
      }));

      // Clear the notes input
      setNotes("");
    } catch (err) {
      console.error("Error adding note:", err);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "investigating":
        return "bg-blue-100 text-blue-800";
      case "rejected":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-red-600">{error || "Report not found"}</p>
        <button
          onClick={() => navigate("/admin/reports")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Reports
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Report Details</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate("/admin/reports")}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            Back
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <h3 className="text-lg font-medium">
            {report.title || `Report #${report.id}`}
          </h3>
          <div className="flex space-x-2">
            <span
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityBadgeClass(
                report.priority
              )}`}
            >
              {report.priority} Priority
            </span>
            <span
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                report.status
              )}`}
            >
              {report.status}
            </span>
          </div>
        </div>

        <div className="text-gray-600 mb-4">
          Reported on {new Date(report.createdAt).toLocaleString()}
          {report.reporter?.name && ` by ${report.reporter.name}`}
        </div>

        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <h4 className="font-medium mb-2">Description</h4>
          <p className="whitespace-pre-line">{report.description}</p>
        </div>

        {report.relatedItemId && (
          <div className="mb-4">
            <h4 className="font-medium mb-2">Related Item</h4>
            <Link
              to={`/admin/items/${report.relatedItemId}`}
              className="text-blue-600 hover:underline"
            >
              View Related Item #{report.relatedItemId}
            </Link>
          </div>
        )}

        {report.relatedUserId && (
          <div className="mb-4">
            <h4 className="font-medium mb-2">Related User</h4>
            <Link
              to={`/admin/users/${report.relatedUserId}`}
              className="text-blue-600 hover:underline"
            >
              View User Profile
            </Link>
          </div>
        )}

        {report.attachments && report.attachments.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium mb-2">Attachments</h4>
            <div className="flex flex-wrap gap-3">
              {report.attachments.map((attachment, index) => (
                <a
                  key={index}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-gray-300 rounded p-2 hover:bg-gray-50"
                >
                  {attachment.name || `Attachment ${index + 1}`}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Status Action Buttons */}
      <div className="flex gap-2 mb-6">
        {report.status !== "investigating" && (
          <button
            onClick={() => handleStatusChange("investigating")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Mark as Investigating
          </button>
        )}

        {report.status !== "resolved" && (
          <button
            onClick={() => handleStatusChange("resolved")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Mark as Resolved
          </button>
        )}

        {report.status !== "rejected" && (
          <button
            onClick={() => handleStatusChange("rejected")}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Reject Report
          </button>
        )}
      </div>

      {/* Admin Notes */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Admin Notes</h3>

        <div className="mb-4">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add a note about this report..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            rows={3}
          ></textarea>
          <div className="mt-2 flex justify-end">
            <button
              onClick={handleAddNote}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Add Note
            </button>
          </div>
        </div>

        {report.notes && report.notes.length > 0 ? (
          <div className="border rounded-md divide-y">
            {report.notes.map((note, index) => (
              <div key={index} className="p-4">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{note.addedBy}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(note.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-700">{note.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No notes added yet</p>
        )}
      </div>
    </div>
  );
};

export default ReportsManagement;
