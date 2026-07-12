const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  // ✅ ADDED: Consistent with other models (Customer, RepairJob, Inventory, Invoice)
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // ✅ KEPT: This is the customer who owns the vehicle
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
    index: true
  },
  
  brand: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    uppercase: true
  },
  
  model: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    lowercase: true
  },
  
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 1
  },
  
  fuelType: {
    type: String,
    enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
    required: true
  },
  
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
    maxlength: 20
  },
  
  color: {
    type: String,
    trim: true,
    maxlength: 50
  },
  
  currentKilometerReading: {
    type: Number,
    default: 0,
    min: 0
  },
  
  notes: {
    type: String,
    trim: true,
    maxlength: 1000
  }
}, {
  timestamps: true
});

// ✅ ADDED: Compound indexes for common queries
vehicleSchema.index({ createdBy: 1, owner: 1 });


const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;