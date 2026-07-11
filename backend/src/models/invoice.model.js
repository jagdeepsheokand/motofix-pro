const mongoose = require('mongoose');
const Counter = require('./counter.model');

const invoicePartSchema = new mongoose.Schema({
  part: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory',
  },
  partName: {                      // ← NEW: Allow sending name
    type: String,
    required: [true, 'Part name is required'],
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Part quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: [true, 'Part price is required'],
    min: [0, 'Price cannot be negative']
  }
});

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    trim: true,
    unique: true
  },
  repairJob: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RepairJob',
    required: [true, 'Repair job reference is required']
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer reference is required']
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: [true, 'Vehicle reference is required']
  },
  parts: [invoicePartSchema],
  laborCharge: {
    type: Number,
    default: 0,
    min: [0, 'Labor charge cannot be negative']
  },
  tax: {
    type: Number,
    default: 0,
    min: [0, 'Tax cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative']
  },
  subtotal: {
    type: Number,
    default: 0,
    min: [0, 'Subtotal cannot be negative']
  },
  total: {
    type: Number,
    default: 0,
    min: [0, 'Total cannot be negative']
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Partially Paid', 'Paid'],
    default: 'Pending',
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Created by user is required']
  }
}, { timestamps: true });

// Helper function to get next invoice number
const getNextInvoiceNumber = async () => {
  const counter = await Counter.findByIdAndUpdate(
    { _id: 'invoice' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  
  const seqNumber = counter.seq.toString().padStart(6, '0');
  return `INV-${seqNumber}`;
};

// Pre-save middleware - Modern async/await style
invoiceSchema.pre('save', async function() {
  // Auto-generate invoiceNumber if not provided
  if (!this.invoiceNumber) {
    this.invoiceNumber = await getNextInvoiceNumber();
  }

  // Calculate parts total
  const partsTotal = this.parts.reduce((sum, item) => {
    return sum + (item.quantity * item.price);
  }, 0);

  // Subtotal = Parts total + Labor
  this.subtotal = partsTotal + this.laborCharge;

  // Total = Subtotal + Tax - Discount
  let calculatedTotal = this.subtotal + this.tax - this.discount;

  // Prevent negative total
  if (calculatedTotal < 0) {
    this.total = 0;
    // Optional: Throw error for stricter validation
    // throw new Error('Discount cannot exceed subtotal + tax');
  } else {
    this.total = calculatedTotal;
  }
});

// Virtuals
invoiceSchema.virtual('isFullyPaid').get(function() {
  return this.paymentStatus === 'Paid';
});

// Indexes

invoiceSchema.index({ repairJob: 1 }, { unique: true }); // Enforce one invoice per repair job
invoiceSchema.index({ customer: 1 });
invoiceSchema.index({ vehicle: 1 });
invoiceSchema.index({ createdBy: 1 });

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
module.exports.getNextInvoiceNumber = getNextInvoiceNumber;