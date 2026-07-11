const Inventory = require('../models/inventory.model');

// Add Part
const addPart = async (req, res) => {
  try {
    const partData = { ...req.body, createdBy: req.user.id };
    
    const existingPart = await Inventory.findOne({ 
      sku: partData.sku, 
      createdBy: req.user.id 
    });
    
    if (existingPart) {
      return res.status(400).json({ message: 'SKU already exists for this garage' });
    }

    const part = await Inventory.create(partData);
    res.status(201).json({
      success: true,
      data: part
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Parts (with search, filter, pagination, sorting)
const getAllParts = async (req, res) => {
  try {
    const { 
      search, 
      category, 
      supplier, 
      lowStock, 
      page = 1, 
      limit = 10,
      sort = 'createdAt'
    } = req.query;

    const query = { createdBy: req.user.id };

    // Search
    if (search) {
      query.$or = [
        { partName: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filters
    if (category) query.category = category;
    if (supplier) query.supplier = supplier;
    if (lowStock === 'true') {
      query.$expr = { $lte: ['$quantity', '$minimumStock'] };
    }

    // Pagination
    const skip = (page - 1) * parseInt(limit);

    // Sorting
    let sortOption = {};
    switch (sort) {
      case 'price':
        sortOption = { sellingPrice: 1 };
        break;
      case 'quantity':
        sortOption = { quantity: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const parts = await Inventory.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Inventory.countDocuments(query);

    res.status(200).json({
      success: true,
      count: parts.length,
      total,
      pages: Math.ceil(total / limit),
      data: parts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Single Part
const getSinglePart = async (req, res) => {
  try {
    const part = await Inventory.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!part) {
      return res.status(404).json({ message: 'Part not found' });
    }

    res.status(200).json({
      success: true,
      data: part
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update Part
const updatePart = async (req, res) => {
  try {
    const part = await Inventory.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!part) {
      return res.status(404).json({ message: 'Part not found' });
    }

    // Check for duplicate SKU if changed
    if (req.body.sku && req.body.sku !== part.sku) {
      const existing = await Inventory.findOne({
        sku: req.body.sku,
        createdBy: req.user.id,
        _id: { $ne: req.params.id }
      });
      if (existing) {
        return res.status(400).json({ message: 'SKU already exists' });
      }
    }

    // Update fields manually to trigger pre-save middleware
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        part[key] = req.body[key];
      }
    });

    const updatedPart = await part.save();

    res.status(200).json({
      success: true,
      data: updatedPart
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete Part
const deletePart = async (req, res) => {
  try {
    const part = await Inventory.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!part) {
      return res.status(404).json({ message: 'Part not found' });
    }

    await part.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Part deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Stock Management
const increaseStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be positive' });
    }

    const part = await Inventory.findOneAndUpdate(
      { _id: id, createdBy: req.user.id },
      { $inc: { quantity } },
      { returnDocument: 'after', runValidators: true }
    );

    if (!part) {
      return res.status(404).json({ message: 'Part not found' });
    }

    res.status(200).json({
      success: true,
      data: part
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const decreaseStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be positive' });
    }

    const part = await Inventory.findOne({
      _id: id,
      createdBy: req.user.id
    });

    if (!part) {
      return res.status(404).json({ message: 'Part not found' });
    }

    if (part.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    part.quantity -= quantity;
    await part.save();

    res.status(200).json({
      success: true,
      data: part
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getLowStockAlerts = async (req, res) => {
  try {
    const lowStockParts = await Inventory.find({
      createdBy: req.user.id,
      $expr: { $lte: ['$quantity', '$minimumStock'] }
    });

    res.status(200).json({
      success: true,
      count: lowStockParts.length,
      data: lowStockParts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  addPart,
  getAllParts,
  getSinglePart,
  updatePart,
  deletePart,
  increaseStock,
  decreaseStock,
  getLowStockAlerts
};