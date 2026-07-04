const Vehicle = require('../models/vehicle.model');
const Customer= require('../models/customer.model');

const getUserCustomerIds = async (userId) => {
  const customers = await Customer.find({ user: userId }).select('_id');
  return customers.map(c => c._id);
};


const createVehicle = async(req,res)=>{
    try{
       const {owner, ...vehicleData}= req.body;

        const customer = await Customer.findById(owner);
        if(!customer){
            return res.status(404).json({success:false, error:"Customer not found"});
        }
        if(customer.user.toString() !== req.user.id ){
            return res.status(403).json({
                success:false,
                error:'Not authorized to add vehicle to this customer'
            });
        }
        const vehicle = await Vehicle.create({owner, ...vehicleData});
        res.status(201).json({ success: true, data: vehicle });
}  catch(error){
    if(error.code === 11000 ){
        return res.status(409).json({
           success:false,
           error:'Vehicle with this registration number already exists' 
        });
    }res.status(500).json({ success: false, error: error.message });
}
};
const getVehicles = async(req,res) =>{
    try{
        const customerIds = await getUserCustomerIds(req.user.id);
        const vehicles= await Vehicle.find({ owner: { $in: customerIds } })
        .populate('owner','name email phone')
        .sort({createdAt:-1});

        res.status(200).json({
            success:true,
            count:vehicles.length,
            data:vehicles
        });
    }
    catch(error){
        res.status(500).json({success:false, error:error.message});
    }
};
const getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate('owner', 'name email phone');
    
    if (!vehicle) {
      return res.status(404).json({ success: false, error: 'Vehicle not found' });
    }
    const customer = await Customer.findById(vehicle.owner);
    if (!customer || customer.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        error: 'Not authorized to access this vehicle' 
      });
    }
    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
const updateVehicle = async (req, res) => {
  try {
    let vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, error: 'Vehicle not found' });
    }

    const customer = await Customer.findById(vehicle.owner);
    if (customer && customer.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        error: 'Not authorized to update this vehicle' 
      });
    }

    vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, error: 'Vehicle not found' });
    }

    const customer = await Customer.findById(vehicle.owner);
    if (customer && customer.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        error: 'Not authorized to delete this vehicle' 
      });
    }

    await vehicle.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
module.exports={createVehicle, getVehicles, getVehicle, updateVehicle, deleteVehicle};