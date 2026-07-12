const express = require('express');
const { getDashboardStats } = require('../controllers/dashboard.controller');

const router = express.Router();


const { protect } = require('../middlewares/auth.middleware'); 

// GET /api/dashboard - Get dashboard statistics
router.get('/', protect, getDashboardStats);

module.exports = router;