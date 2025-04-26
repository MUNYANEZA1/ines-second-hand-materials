const express = require("express");
const router = express.Router();

// Example: Get all categories
router.get("/", (req, res) => {
  res.json([
    { id: 1, name: "Books" },
    { id: 2, name: "Electronics" },
    { id: 3, name: "Furniture" },
    { id: 4, name: "Clothing" },
  ]);
});

module.exports = router;
