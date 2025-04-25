// controllers/userController.js
const { User, Item } = require('../models');
const fs = require('fs');
const path = require('path');

// Get all users (admin only)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if it's the user themselves or an admin
    if (user.id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this user' });
    }

    const { firstName, lastName, phoneNumber, role } = req.body;
    
    const updateData = {
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      phoneNumber: phoneNumber || user.phoneNumber
    };

    // Only admin can update role
    if (req.user.role === 'admin' && role) {
      updateData.role = role;
    }

    // Handle profile photo update
    if (req.file) {
      // Remove old photo if exists
      if (user.profilePhoto) {
        const oldPhotoPath = path.join(__dirname, '..', user.profilePhoto);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
      updateData.profilePhoto = req.file.path;
    }

    await User.update(updateData, {
      where: { id: req.params.id }
    });

    const updatedUser = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if it's an admin or the user themselves
    if (user.id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this user' });
    }

    // Delete profile photo if exists
    if (user.profilePhoto) {
      const photoPath = path.join(__dirname, '..', user.profilePhoto);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }
    
    // Delete all user items and their photos
    const userItems = await Item.findAll({
      where: { user_id: req.params.id }
    });
    
    for (const item of userItems) {
      if (item.photo) {
        const itemPhotoPath = path.join(__dirname, '..', item.photo);
        if (fs.existsSync(itemPhotoPath)) {
          fs.unlinkSync(itemPhotoPath);
        }
      }
    }

    await User.destroy({
      where: { id: req.params.id }
    });

    res.json({ message: 'User removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
