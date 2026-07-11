const Invoice = require('../models/invoice.model');
const RepairJob = require('../models/repairJob.model'); // Assuming this exists
const Inventory = require('../models/inventory.model');
const mongoose = require('mongoose');

// @desc    Create new invoice
// @route   POST /api/invoices
const createInvoice = async (req, res) => {
  try {
    const {
      repairJob,
      parts = [],
      laborCharge = 0,
      tax = 0,
      discount = 0,
      notes,
      paymentStatus
    } = req.body;

    if (!repairJob) {
      return res.status(400).json({
        success: false,
        message: 'Repair job is required'
      });
    }

    // 1. Check if Repair Job exists and belongs to the user
    const repair = await RepairJob.findById(repairJob)
      .populate('customer')
      .populate('vehicle');

    if (!repair) {
      return res.status(404).json({
        success: false,
        message: 'Repair job not found'
      });
    }

    // Ownership check
    if (repair.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create invoice for this repair job'
      });
    }

    // 2. Check for existing invoice (One Repair Job → One Invoice)
    const existingInvoice = await Invoice.findOne({ repairJob });
    if (existingInvoice) {
      return res.status(400).json({
        success: false,
        message: 'An invoice already exists for this repair job',
        existingInvoiceId: existingInvoice._id
      });
    }

    const processedParts = [];

    for (const item of parts) {
      if (!item.partName || !item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: 'Each part must have partName and quantity' 
        });
      }
      const inventoryItem = await Inventory.findOne({
        partName: { $regex: new RegExp(`^${item.partName}$`, 'i') }, // case-insensitive exact match
        createdBy: req.user.id
      });
      if (!inventoryItem) {
        return res.status(404).json({
          success: false,
          message: `Part not found: ${item.partName}`
        });
      }
      processedParts.push({
        part: inventoryItem._id,
        partName: inventoryItem.partName,
        quantity: item.quantity,
        price: inventoryItem.sellingPrice   // ← Auto fetch price
      });
    }

    // 3. Create invoice using data from Repair Job
    const invoice = new Invoice({
      repairJob: repair._id,
      customer: repair.customer?._id,
      vehicle: repair.vehicle?._id,
      parts: processedParts,
      laborCharge,
      tax,
      discount,
      notes,
      paymentStatus: paymentStatus || 'Pending',
      createdBy: req.user.id
    });

    const savedInvoice = await invoice.save();

    // Populate response
    const populatedInvoice = await Invoice.findById(savedInvoice._id)
      .populate('repairJob')
      .populate('customer', 'name phone address')
      .populate('vehicle', 'registrationNumber make model')
      .populate('parts.part', 'partName sku sellingPrice')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: populatedInvoice
    });
  } catch (error) {
    console.error('Invoice creation error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create invoice'
    });
  }
};


// @desc    Get all invoices
// @route   GET /api/invoices
const getInvoices = async (req, res) => {
  try {
    const { page = 1, limit = 50, status } = req.query;
    
    const query = { createdBy: req.user.id };
    if (status) query.paymentStatus = status;

    const invoices = await Invoice.find(query)
      .populate('customer', 'name phone')
      .populate('vehicle', 'registrationNumber')
      .populate('repairJob', 'jobNumber status')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Invoice.countDocuments(query);

    res.json({
      success: true,
      count: invoices.length,
      total,
      pages: Math.ceil(total / limit),
      data: invoices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get single invoice
// @route   GET /api/invoices/:id
const getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    })
      .populate('repairJob')
      .populate('customer')
      .populate('vehicle')
      .populate('parts.part')
      .populate('createdBy', 'name email');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found or not authorized'
      });
    }

    res.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update invoice
// @route   PUT /api/invoices/:id
const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found or not authorized'
      });
    }

    const allowedUpdates = ['laborCharge', 'tax', 'discount', 'notes', 'paymentStatus', 'parts'];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        invoice[field] = req.body[field];
      }
    });

    const updatedInvoice = await invoice.save();

    const populated = await Invoice.findById(updatedInvoice._id)
      .populate('customer')
      .populate('vehicle')
      .populate('parts.part');

    res.json({
      success: true,
      data: populated
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found or not authorized'
      });
    }

    await invoice.deleteOne();
    
    res.json({
      success: true,
      message: 'Invoice deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoice,
  updateInvoice,
  deleteInvoice
};