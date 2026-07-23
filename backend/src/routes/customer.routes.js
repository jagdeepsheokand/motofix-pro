const express = require('express');
const router = express.Router();

const { createCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer } = require('../controllers/customer.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post("/", protect, createCustomer);
router.get('/', protect, getCustomers);
router.get('/:id', protect, getCustomerById);
router.put('/:id', protect, updateCustomer);
router.delete('/:id',protect, deleteCustomer);
module.exports = router;