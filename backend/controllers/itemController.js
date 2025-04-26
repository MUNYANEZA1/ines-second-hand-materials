// controllers/itemController.js
const { Item, User } = require('../models');
const fs = require('fs');
const path = require('path');

// Create item
exports.createItem = async (req, res) => {
  try {
    const { title, description, price, category, condition } = req.body;
    
    const item = await Item.create({
      title,
      description,
      price,
      category,
      condition,
      photo: req.file ? req.file.path : null,
      user_id: req.user.id
    });

    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all items
exports.getItems = async (req, res) => {
  try {
    const { category, status, approved } = req.query;
    const whereClause = {};

    if (category) whereClause.category = category;
    if (status) whereClause.status = status;
    
    // If user is an admin, they can filter by approval status
    // Otherwise, non-admins only see approved items (unless viewing their own)
    if (req.user.role === 'admin' && approved !== undefined) {
      whereClause.approved = approved === 'true';
    } else if (req.user.role !== 'admin') {
      whereClause.approved = true;
    }

    const items = await Item.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email', 'profilePhoto']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get item by ID
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email', 'profilePhoto']
        }
      ]
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // If the item is not approved and the user is not an admin or the item owner, deny access
    if (!item.approved && req.user.role !== 'admin' && item.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update item
exports.updateItem = async (req, res) => {
  try {
    let item = await Item.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check ownership or admin status
    if (item.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    // Update fields
    const { title, description, price, category, condition, status, approved } = req.body;
    
    // Only admin can update approval status
    const updateData = {
      title: title || item.title,
      description: description || item.description,
      price: price || item.price,
      category: category || item.category,
      condition: condition || item.condition,
      status: status || item.status
    };

    if (req.user.role === 'admin' && approved !== undefined) {
      updateData.approved = approved === 'true';
    }

    // Handle photo update
    if (req.file) {
      // Remove old photo if exists
      if (item.photo) {
        const oldPhotoPath = path.join(__dirname, '..', item.photo);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
      updateData.photo = req.file.path;
    }

    await Item.update(updateData, {
      where: { id: req.params.id }
    });

    const updatedItem = await Item.findByPk(req.params.id);
    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete item
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check ownership or admin status
    if (item.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    // Delete photo if exists
    if (item.photo) {
      const photoPath = path.join(__dirname, '..', item.photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    await Item.destroy({
      where: { id: req.params.id }
    });

    res.json({ message: 'Item removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's items
exports.getUserItems = async (req, res) => {
  try {
    const items = await Item.findAll({
      where: { user_id: req.params.userId },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email', 'profilePhoto']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get featured items
exports.getFeaturedItems = async (req, res) => {
  try {
    const items = await Item.findAll({
      where: { status: 'available', approved: true },
      order: Sequelize.literal('RAND()'), // Get random items
      limit: 5,
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email', 'profilePhoto']
        }
      ]
    });

    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get recent items
exports.getRecentItems = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 4;

    const items = await Item.findAll({
      where: { status: 'available', approved: true },
      order: [['created_at', 'DESC']],
      limit,
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email', 'profilePhoto']
        }
      ]
    });

    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get featured items
exports.getFeaturedItems = async (req, res) => {
  try {
    const featuredItems = await Item.findAll({
      where: {
        approved: true,
        status: 'available'
      },
      limit: 10, // or whatever number of featured items you want
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email', 'profilePhoto']
        }
      ]
    });

    res.json(featuredItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
