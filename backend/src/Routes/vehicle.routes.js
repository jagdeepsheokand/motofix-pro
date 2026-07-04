const express = require('express');
const router = express.Router();
const{createVehicle, getVehicles, getVehicle, updateVehicle, deleteVehicle}= require('../Controllers/vehicle.controller');
const {protect}= require('../middlewares/auth.middleware');
router.use(protect);

router.route('/')
.post(createVehicle)
.get(getVehicles);

router.route('/:id')
.get(getVehicle)
.put(updateVehicle)
.delete(deleteVehicle);


module.exports= router;
