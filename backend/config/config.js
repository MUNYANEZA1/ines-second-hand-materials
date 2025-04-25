// config/config.js
require("dotenv").config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || "ines_second_hand_jwt_secret",
  JWT_EXPIRE: process.env.JWT_EXPIRE || "1d",
};