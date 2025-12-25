// src/utils/generateToken.js
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // this will give a clear message if env is wrong
    throw new Error('JWT_SECRET is not defined in .env');
  }

  const expiresIn =
    process.env.JWT_SECRET_EXPIRES_IN ||
    process.env.JWT_SECRET_EXPIRES ||
    '30d';

  return jwt.sign({ id }, secret, { expiresIn });
};

module.exports = generateToken;
