// routes/reports.js
const express = require("express");
const router = express.Router();
const {
  createReport,
  getReports,
  getReportById,
  deleteReport,
} = require("../controllers/reportController");
const { protect, authorize } = require("../middleware/auth");

// Create report
router.post("/", protect, createReport);

// Get all reports (admin only)
router.get("/", protect, authorize("admin"), getReports);

// Get report by ID (admin only)
router.get("/:id", protect, authorize("admin"), getReportById);

// Delete report (admin only)
router.delete("/:id", protect, authorize("admin"), deleteReport);

module.exports = router;
