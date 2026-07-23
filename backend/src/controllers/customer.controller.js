const Customer = require('../models/customer.model');

const createCustomer = async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;

    // ✅ FIXED: Use 'createdBy' instead of 'user'
    const customer = await Customer.create({
      name,
      phone,
      email,
      address,
      createdBy: req.user._id  // ← Changed from 'user' to 'createdBy'
    });

    res.status(201).json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

const getCustomers = async (req, res) => {
  try {
    // ✅ FIXED: Use 'createdBy' instead of 'user'
    const customers = await Customer.find({
      createdBy: req.user._id  // ← Changed from 'user' to 'createdBy'
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: customers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

const getCustomerById = async (req, res) => {
  try {
    // ✅ FIXED: Use 'createdBy' instead of 'user'
    const customer = await Customer.findOne({
      _id: req.params.id,
      createdBy: req.user._id  // ← Changed from 'user' to 'createdBy'
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;

    // ✅ FIXED: Use 'createdBy' instead of 'user'
    const customer = await Customer.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user._id  // ← Changed from 'user' to 'createdBy'
      },
      {
        name,
        phone,
        email,
        address
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    // ✅ FIXED: Use 'createdBy' instead of 'user'
    const customer = await Customer.findOne({
      _id: req.params.id,
      createdBy: req.user._id  // ← Changed from 'user' to 'createdBy'
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    await customer.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
};