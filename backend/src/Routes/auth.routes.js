const express = require('express');
const { register, login, logout, getUserProfile } = require('../controllers/auth.controller');
const {protect} = require('../middlewares/auth.middleware');
const router = express.Router();

// POST /api/auth/register
router.post('/register', register);
router.post('/login',login);
router.post('/logout', logout);
router.get('/profile',protect, getUserProfile);
module.exports = router;