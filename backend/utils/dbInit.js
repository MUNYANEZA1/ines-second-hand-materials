// utils/dbInit.js
const sequelize = require("../config/db");
const { User, Item, Message, Report } = require("../models");
const bcrypt = require("bcryptjs");

// Initialize database and create admin user
const initializeDatabase = async () => {
  try {
    // Sync all models with database
    await sequelize.sync({ force: true });
    console.log("Database & tables created!");

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    await User.create({
      firstName: "Admin",
      lastName: "User",
      email: "admin@ines.ac.rw",
      password: hashedPassword,
      role: "admin",
      phoneNumber: "123456789",
    });

    console.log("Admin user created");

    process.exit(0);
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
};

// Run if this file is executed directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;
