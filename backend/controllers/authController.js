// controllers/authController.js
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { JWT_SECRET, JWT_EXPIRE } = require("../config/config");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

// Register user
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      profilePhoto: req.file ? req.file.path : null,
    });

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
