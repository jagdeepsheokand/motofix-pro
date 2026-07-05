const mongoose = require('mongoose');

const repairJobSchema = new mongoose.Schema({
  jobNumber: {
    type: String,
    unique: true
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  customerComplaint: {
    type: String,
    required: true,
    trim:true
  },
  diagnosticNotes: {
    type: String
  },
  status: {
    type: String,
    enum: ['PENDING', 'DIAGNOSIS', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
  },
  estimatedHours: {
    type: Number,
    min:0
  },
  arrivalDate: {
    type: Date,
    default: Date.now
  },
  estimatedDeliveryDate: {
    type: Date
  },
  completionDate: {
    type: Date
  },
  totalPartsCost: {
    type: Number,
    default: 0,
    min:0
  },
  totalLaborCost: {
    type: Number,
    default: 0,
    min:0
  },
  amountPaid: {
    type: Number,
    default: 0
  },
  isPaid: {
    type: Boolean,
    default: false
  }
}, {
timestamps:true,
toJSON:{virtuals:true},
toObject:{virtuals:true}
});

// Virtual for total cost
repairJobSchema.virtual('totalCost').get(function() {
  return (this.totalPartsCost || 0) + (this.totalLaborCost || 0);
});

const RepairJob = mongoose.model('RepairJob', repairJobSchema);

module.exports = RepairJob;