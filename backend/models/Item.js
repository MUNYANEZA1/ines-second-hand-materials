// models/Item.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Item = sequelize.define('Item', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  condition: {
    type: DataTypes.STRING,
    allowNull: false
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('available', 'sold'),
    defaultValue: 'available'
  },
  approved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Item;
