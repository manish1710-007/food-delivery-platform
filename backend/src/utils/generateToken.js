const jwt = require('jsonwebtoken');


// ENVIRONMENT VERIFICATION
const getSecret = (type) => {
  const secret = type === 'access' ? process.env.JWT_SECRET : process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error(`[SYS.FATAL] ${type.toUpperCase()} Secret is not defined in the environment variables.`);
  }
  return secret;
};


// TOKEN GENERATORS

const generateAccessToken = (id) => {
  const secret = getSecret('access');
  const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '15m'; // 🚨 FIX: Reduced from 30d to 15m
  return jwt.sign({ id }, secret, { expiresIn });
};

const generateRefreshToken = (id) => {
  const secret = getSecret('refresh');
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  return jwt.sign({ id }, secret, { expiresIn });
};


// TOKEN VERIFIERS

const verifyAccess = (token) => {
  return jwt.verify(token, getSecret('access'));
};

const verifyRefresh = (token) => {
  return jwt.verify(token, getSecret('refresh'));
};

// Legacy fallback just in case some old controllers still use the old import
const generateToken = generateAccessToken;

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccess,
  verifyRefresh,
  generateToken // Legacy support
};