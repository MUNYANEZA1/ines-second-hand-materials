// setup.js
const fs = require("fs");
const path = require("path");
const initializeDatabase = require("./utils/dbInit");

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Uploads directory created");
}

// Create necessary directories
const dirs = [
  "./config",
  "./controllers",
  "./middleware",
  "./models",
  "./routes",
  "./utils",
  "./uploads",
];

dirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`${dir} directory created`);
  }
});

// Initialize database
initializeDatabase()
  .then(() => console.log("Database initialized successfully"))
  .catch((err) => console.error("Database initialization failed:", err));

console.log("Setup completed!");
