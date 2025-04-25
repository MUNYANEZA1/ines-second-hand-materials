// controllers/reportController.js
const { Report, User, Item } = require("../models");

// Create a report
exports.createReport = async (req, res) => {
  try {
    const { target_user_id, item_id, reason } = req.body;

    // Validate that either target_user_id or item_id is provided
    if (!target_user_id && !item_id) {
      return res
        .status(400)
        .json({ message: "Either target_user_id or item_id must be provided" });
    }

    // If target_user_id is provided, check if user exists
    if (target_user_id) {
      const targetUser = await User.findByPk(target_user_id);
      if (!targetUser) {
        return res.status(404).json({ message: "Target user not found" });
      }
    }

    // If item_id is provided, check if item exists
    if (item_id) {
      const item = await Item.findByPk(item_id);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
    }

    const report = await Report.create({
      reporter_id: req.user.id,
      target_user_id,
      item_id,
      reason,
    });

    res.status(201).json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all reports (admin only)
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      include: [
        {
          model: User,
          as: "Reporter",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: User,
          as: "TargetUser",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: Item,
          as: "ReportedItem",
          attributes: ["id", "title", "description"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get report by ID (admin only)
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "Reporter",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: User,
          as: "TargetUser",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: Item,
          as: "ReportedItem",
          attributes: ["id", "title", "description"],
        },
      ],
    });

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete report (admin only)
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    await Report.destroy({ where: { id: req.params.id } });

    res.json({ message: "Report removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
