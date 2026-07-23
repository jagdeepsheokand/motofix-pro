const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN || '30d'
  });
};

// Set JWT as HTTP-only cookie
const setTokenCookie = (res, token) => {
  const cookieOptions = {
  httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  };

  res.cookie('jwt', token, cookieOptions);
};

module.exports = { generateToken, setTokenCookie };