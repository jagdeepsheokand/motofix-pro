const Vehicle = require('../models/vehicle.model');
const Customer = require('../models/customer.model');

// ============================================
// CREATE Vehicle
// ============================================
const createVehicle = async (req, res) => {
  try {
    const { owner, ...vehicleData } = req.body;

    // ✅ Simple inline validation
    const customer = await Customer.findOne({
      _id: owner,
      createdBy: req.user.id
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found or not authorized'
      });
    }

    const vehicle = await Vehicle.create({
      owner,
      ...vehicleData,
      createdBy: req.user.id
    });

    res.status(201).json({ 
      success: true, 
      data: vehicle 
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'Vehicle with this registration number already exists'
      });
    }
    
    console.error('Create vehicle error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// ============================================
// GET All Vehicles
// ============================================
const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ 
      createdBy: req.user.id 
    })
    .populate('owner', 'name email phone')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });

  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// ============================================
// GET Single Vehicle
// ============================================
const getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    })
    .populate('owner', 'name email phone');

    if (!vehicle) {
      return res.status(404).json({ 
        success: false, 
        error: 'Vehicle not found or not authorized' 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: vehicle 
    });

  } catch (error) {
    console.error('Get vehicle error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// ============================================
// UPDATE Vehicle
// ============================================
const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user.id
      },
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
    .populate('owner', 'name email phone');

    if (!vehicle) {
      return res.status(404).json({ 
        success: false, 
        error: 'Vehicle not found or not authorized to update' 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: vehicle 
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'Vehicle with this registration number already exists'
      });
    }

    console.error('Update vehicle error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// ============================================
// DELETE Vehicle
// ============================================
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!vehicle) {
      return res.status(404).json({ 
        success: false, 
        error: 'Vehicle not found or not authorized to delete' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Vehicle deleted successfully',
      data: {} 
    });

  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

module.exports = {
  createVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle
};