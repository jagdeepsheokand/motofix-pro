const RepairJob = require('../models/repairJob.model');
const Vehicle = require('../models/vehicle.model');

// Helper function to check if vehicle belongs to user's customers
// (You can move this to a service/util if it exists in your project)
const verifyVehicleOwnership = async (vehicleId, userId) => {
  if (!vehicleId) return { valid: false, message: 'Vehicle ID is required' };

  const vehicle = await Vehicle.findById(vehicleId).populate('owner');
  
  if (!vehicle) {
    return { valid: false, message: 'Vehicle not found' };
  }

  if (!vehicle.owner) {
    return { valid: false, message: 'Vehicle has no associated customer' };
  }

  // Check if the customer belongs to the logged-in user
  if (vehicle.owner.createdBy?.toString() !== userId) {
    return { valid: false, message: 'You are not authorized for this vehicle' };
  }

  return { valid: true, vehicle };
};

const createRepairJob = async (req, res) => {
  try {
    const { 
      vehicle, 
      customerComplaint, 
      customer,
      arrivalDate, 
      estimatedHours, 
      status,
      diagnosticNotes, 
      assignedTo,
      jobNumber 
    } = req.body;

    // 1. Required fields
if (!vehicle || !customer || !customerComplaint) {
  return res.status(400).json({
    success: false,
    message: 'Vehicle, customer, and customerComplaint are required'
  });
}

    // 2. Verify vehicle ownership (single query)
    const ownershipCheck = await verifyVehicleOwnership(vehicle, req.user.id);
    if (!ownershipCheck.valid) {
      return res.status(403).json({
        success: false,
        message: ownershipCheck.message
      });
    }

    // 3. Check duplicate jobNumber
    if (jobNumber) {
      const existingJob = await RepairJob.findOne({ jobNumber });
      if (existingJob) {
        return res.status(409).json({
          success: false,
          message: `Job number ${jobNumber} already exists`
        });
      }
    }

    // 4. Whitelist allowed fields (prevent mass assignment)
    const jobData = {
      vehicle,
      customer, 
      customerComplaint,
      arrivalDate: arrivalDate || new Date(),
      estimatedHours: estimatedHours || 0,
      diagnosticNotes: diagnosticNotes || '',
      assignedTo: assignedTo || null,
      createdBy: req.user.id,
      jobNumber: jobNumber || `MF-${Date.now().toString().slice(-8)}`,
      status: status,           // Force initial status
      totalPartsCost: 0,
      totalLaborCost: 0,
      amountPaid: 0,
      isPaid: false
    };

    const job = new RepairJob(jobData);
    await job.save();

    // Populate for response
    await job.populate([
      { path: 'vehicle', populate: { path: 'owner' } },
      { path: 'createdBy', select: 'name email' },
      { path: 'assignedTo', select: 'name' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Repair job created successfully',
      data: job
    });

  } catch (error) {
    console.error('Create Repair Job Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating repair job'
    });
  }
};
const getAllRepairJobs = async (req, res) => {
  try {
    const { status } = req.query;
    const userId = req.user.id;

    // Build filter - Only jobs belonging to the logged-in user
    const filter = { createdBy: userId };

    // Optional status filter
    if (status) {
      filter.status = status.toUpperCase();
    }

    const jobs = await RepairJob.find(filter)
      .populate({
        path: 'vehicle',
        populate: {
          path: 'owner',
          select: 'name phone email address'
        }
      })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });

  } catch (error) {
    console.error('Get All Repair Jobs Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching repair jobs'
    });
  }
};
const getRepairJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    const job = await RepairJob.findOne({
      _id: jobId,
      createdBy: userId  // Security: Only allow access to own jobs
    })
    .populate({
      path: 'vehicle',
      populate: { 
        path: 'owner', 
        select: 'name phone email address' 
      }
    })
    .populate('createdBy', 'name email')
    .populate('assignedTo', 'name email');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Repair job not found or you do not have access to it'
      });
    }

    res.status(200).json({
      success: true,
      data: job
    });

  } catch (error) {
    console.error('Get Repair Job By ID Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching repair job'
    });
  }
};
const updateRepairJob= async (req,res) =>{
try{
    const jobId= req.params.id;
    const userId= req.user.id;
  
    let job= await RepairJob.findOne({
        _id:jobId,
        createdBy:userId
    })
    if(!job){
        return res.status(404).json({
        success: false,
        message: 'Repair job not found or you do not have permission to update it'
      });
    }
    const allowedUpdates = [
      'customerComplaint',
      'diagnosticNotes',
      'estimatedHours',
      'status',
      'assignedTo',
      'estimatedDeliveryDate',
      'completionDate',
      'totalPartsCost',
      'totalLaborCost',
      'amountPaid',
      'isPaid'
    ];

    const updateData = {};

    Object.keys(req.body).forEach(key=>{
        if(allowedUpdates.includes(key)){
            updateData[key]= req.body[key];
        }
    });

    if (updateData.status === 'COMPLETED' && !updateData.completionDate) {
      updateData.completionDate = new Date();
    }
    if (updateData.amountPaid !== undefined) {
  const totalCost = (updateData.totalPartsCost || job.totalPartsCost || 0) +
                   (updateData.totalLaborCost || job.totalLaborCost || 0);
  
  updateData.isPaid = updateData.amountPaid >= totalCost;
}
if (req.body.vehicle || req.body.createdBy || req.body.jobNumber) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update vehicle, createdBy, or jobNumber'
      });
    }


 
   
    const updatedJob = await RepairJob.findByIdAndUpdate(
      jobId,
      updateData,
      { new: true, runValidators: true }
    ).populate({
      path: 'vehicle',
      populate: { path: 'owner', select: 'name phone email address' }
    })
    .populate('createdBy', 'name email')
    .populate('assignedTo', 'name email');
res.status(200).json({
      success: true,
      message: 'Repair job updated successfully',
      data: updatedJob
    });
}
catch (error) {
    console.error('Update Repair Job Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating repair job'
    });
  }
}
const deleteRepairJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    // Security: Only delete own jobs
    const job = await RepairJob.findOne({
      _id: jobId,
      createdBy: userId
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Repair job not found or you do not have permission to delete it'
      });
    }

    await RepairJob.findByIdAndDelete(jobId);

    res.status(200).json({
      success: true,
      message: `Repair job ${job.jobNumber} deleted successfully`
    });

  } catch (error) {
    console.error('Delete Repair Job Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting repair job'
    });
  }
};

module.exports = {
  createRepairJob,
  getAllRepairJobs,
  getRepairJobById,
  updateRepairJob,
  deleteRepairJob
};

