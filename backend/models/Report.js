// models/Report.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Report = sequelize.define(
  "Report",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    reporter_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    target_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Items",
        key: "id",
      },
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Report;
