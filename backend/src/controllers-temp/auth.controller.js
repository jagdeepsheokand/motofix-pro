const { registerUser, loginUser } = require('../services/auth.service');
const { generateToken, setTokenCookie } = require('../utils/jwt');
const User = require('../models/user.model'); 

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    const token = generateToken(user.id);
    
    setTokenCookie(res, token);

    res.status(201).json({
      message: 'User registered successfully',
      user
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);
    
    const token = generateToken(user.id);
    setTokenCookie(res, token);

    res.status(200).json({
      message: 'Login successful',
      user
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
const logout= async(req, res) =>{
res.clearCookie("jwt");
  res.status(200).json({ 
    message: 'Logged out successfully' 
  });
}
const getUserProfile = async (req, res) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, logout, getUserProfile };