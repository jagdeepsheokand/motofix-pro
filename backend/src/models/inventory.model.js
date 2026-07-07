const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  partName: {
    type: String,
    required: [true, 'Part name is required'],
    trim: true
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    trim: true,
    uppercase: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 0
  },
  minimumStock: {
    type: Number,
    required: [true, 'Minimum stock level is required'],
    min: [0, 'Minimum stock cannot be negative'],
    default: 0
  },
  purchasePrice: {
    type: Number,
    required: [true, 'Purchase price is required'],
    min: [0, 'Purchase price cannot be negative']
  },
  sellingPrice: {
    type: Number,
    required: [true, 'Selling price is required'],
    min: [0, 'Selling price cannot be negative']
  },
  supplier: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  unit: {
    type: String,
    trim: true,
    default: 'pcs'
  },
  description: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Virtuals
inventorySchema.virtual('isLowStock').get(function() {
  return this.quantity <= this.minimumStock;
});

inventorySchema.virtual('isOutOfStock').get(function() {
  return this.quantity === 0;
});

// Price validation (async style - fixes "next is not a function")
inventorySchema.pre('save', async function() {
  if (this.sellingPrice < this.purchasePrice) {
    throw new Error('Selling price must be greater than or equal to purchase price');
  }
});

// Compound index
inventorySchema.index({ sku: 1, createdBy: 1 }, { unique: true });

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;