const express = require('express');
const router= express.Router();
const{createRepairJob, getAllRepairJobs, getRepairJobById, updateRepairJob, deleteRepairJob}= require('../controllers/repairJob.controller');
const {protect}= require('../middlewares/auth.middleware');
router.use(protect);

router.post('/',createRepairJob);
router.get('/', getAllRepairJobs);
router.get('/:id',getRepairJobById);
router.put('/:id', updateRepairJob);
router.delete('/:id',deleteRepairJob);

module.exports = router;

