// src/components/admin/Reports.jsx

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  AlertTriangle,
  Trash2,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { reportService } from "../../services/reportService";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [filter, setFilter] = useState("all"); // all, pending, resolved, dismissed

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await reportService.getAllReports();
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
        // Mock data for development
        const mockReports = Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          reporterId: Math.floor(Math.random() * 10) + 1,
          reporterName: `User ${Math.floor(Math.random() * 10) + 1}`,
          targetType: Math.random() > 0.5 ? "user" : "item",
          targetId: Math.floor(Math.random() * 20) + 1,
          targetName:
            Math.random() > 0.5
              ? `User ${Math.floor(Math.random() * 10) + 1}`
              : `Item ${Math.floor(Math.random() * 20) + 1}`,
          reason: [
            "Inappropriate content",
            "Scam attempt",
            "Fake item",
            "Offensive behavior",
            "Wrong information",
          ][Math.floor(Math.random() * 5)],
          description: `This is a detailed description about the report ${
            i + 1
          }.`,
          status: ["pending", "resolved", "dismissed"][
            Math.floor(Math.random() * 3)
          ],
          createdAt: new Date(
            Date.now() - Math.random() * 10000000000
          ).toISOString(),
          resolvedAt: null,
          adminNote: "",
        }));

        setReports(mockReports);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const filteredReports = reports.filter((report) => {
    if (filter === "all") return true;
    return report.status === filter;
  });

  const handleReportAction = (report, action) => {
    setSelectedReport(report);
    setSelectedAction(action);
    setShowConfirmDialog(true);
  };

  const confirmAction = async () => {
    try {
      let updatedStatus;

      if (selectedAction === "resolve") {
        updatedStatus = "resolved";
        await reportService.updateReportStatus(selectedReport.id, "resolved");
      } else if (selectedAction === "dismiss") {
        updatedStatus = "dismissed";
        await reportService.updateReportStatus(selectedReport.id, "dismissed");
      } else if (selectedAction === "delete") {
        await reportService.deleteReport(selectedReport.id);
        setReports(reports.filter((r) => r.id !== selectedReport.id));
        setShowConfirmDialog(false);
        setSelectedReport(null);
        return;
      }

      setReports(
        reports.map((r) =>
          r.id === selectedReport.id
            ? {
                ...r,
                status: updatedStatus,
                resolvedAt: new Date().toISOString(),
              }
            : r
        )
      );
    } catch (error) {
      console.error(`Error performing ${selectedAction} action:`, error);
      // For demo, update the UI anyway
      if (selectedAction === "delete") {
        setReports(reports.filter((r) => r.id !== selectedReport.id));
      } else {
        const updatedStatus =
          selectedAction === "resolve" ? "resolved" : "dismissed";
        setReports(
          reports.map((r) =>
            r.id === selectedReport.id
              ? {
                  ...r,
                  status: updatedStatus,
                  resolvedAt: new Date().toISOString(),
                }
              : r
          )
        );
      }
    } finally {
      setShowConfirmDialog(false);
      setSelectedReport(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case "resolved":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Resolved
          </span>
        );
      case "dismissed":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            Dismissed
          </span>
        );
      default:
        return null;
    }
  };

  const showReportDetails = (report) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Reports</h2>

        <div className="flex space-x-2">
          {["all", "pending", "resolved", "dismissed"].map((status) => (
            <motion.button
              key={status}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1 text-sm rounded-md ${
                filter === status
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              } capitalize`}
              onClick={() => setFilter(status)}
            >
              {status}
            </motion.button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reporter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reported On
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <AnimatePresence>
                {filteredReports.map((report) => (
                  <motion.tr
                    key={report.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => showReportDetails(report)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.reporterName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full mr-2 ${
                            report.targetType === "user"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {report.targetType}
                        </span>
                        <span className="text-sm text-gray-900">
                          {report.targetName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(report.status)}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex space-x-2 justify-end">
                        {report.status === "pending" && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-green-600 hover:text-green-900"
                              title="Resolve Report"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReportAction(report, "resolve");
                              }}
                            >
                              <CheckCircle size={18} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-orange-600 hover:text-orange-900"
                              title="Dismiss Report"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReportAction(report, "dismiss");
                              }}
                            >
                              <AlertTriangle size={18} />
                            </motion.button>
                          </>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Message Reporter"
                        >
                          <MessageSquare size={18} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Report"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReportAction(report, "delete");
                          }}
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filteredReports.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No reports found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
          >
            <h3 className="text-lg font-medium mb-4">Confirm Action</h3>
            <p className="mb-6">
              {selectedAction === "delete" &&
                `Are you sure you want to delete this report?`}
              {selectedAction === "resolve" &&
                `Are you sure you want to mark this report as resolved?`}
              {selectedAction === "dismiss" &&
                `Are you sure you want to dismiss this report?`}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-md text-white ${
                  selectedAction === "delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : selectedAction === "resolve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-orange-600 hover:bg-orange-700"
                }`}
                onClick={confirmAction}
              >
                Confirm
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Report Detail Modal */}
      {showDetailModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium">Report Details</h3>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowDetailModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Reporter</p>
                    <p className="font-medium">{selectedReport.reporterName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Report Date</p>
                    <p className="font-medium">
                      {new Date(selectedReport.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Target Type</p>
                    <p className="font-medium capitalize">
                      {selectedReport.targetType}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Target</p>
                    <p className="font-medium">{selectedReport.targetName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <div>{getStatusBadge(selectedReport.status)}</div>
                  </div>
                  {selectedReport.resolvedAt && (
                    <div>
                      <p className="text-sm text-gray-500">Resolved Date</p>
                      <p className="font-medium">
                        {new Date(selectedReport.resolvedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Reason</p>
                <p className="font-medium">{selectedReport.reason}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Description</p>
                <p className="bg-gray-50 p-3 rounded-lg">
                  {selectedReport.description}
                </p>
              </div>

              {selectedReport.adminNote && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Admin Note</p>
                  <p className="bg-gray-50 p-3 rounded-lg">
                    {selectedReport.adminNote}
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center text-blue-600"
                  onClick={() => {
                    // Navigate to target detail page
                    setShowDetailModal(false);
                  }}
                >
                  <ExternalLink size={16} className="mr-1" />
                  <span>View {selectedReport.targetType}</span>
                </motion.button>

                <div className="flex space-x-3">
                  {selectedReport.status === "pending" && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        onClick={() => {
                          setShowDetailModal(false);
                          handleReportAction(selectedReport, "resolve");
                        }}
                      >
                        Resolve
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                        onClick={() => {
                          setShowDetailModal(false);
                          handleReportAction(selectedReport, "dismiss");
                        }}
                      >
                        Dismiss
                      </motion.button>
                    </>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                    onClick={() => setShowDetailModal(false)}
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Reports;
