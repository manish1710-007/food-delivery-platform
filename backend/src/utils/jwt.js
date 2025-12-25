// src/utils/jwt.js
const jwt = require('jsonwebtoken');

const getEnv = (name) => process.env[name];

const signAccessToken = (payload) => {
  const secret = getEnv('JWT_ACCESS_SECRET') || getEnv('JWT_SECRET');
  if (!secret) {
    throw new Error('JWT_ACCESS_SECRET (or JWT_SECRET) is not defined in .env');
  }

  const expiresIn =
    getEnv('JWT_ACCESS_EXPIRES_IN') ||
    getEnv('JWT_ACCESS_EXPIRES') ||
    '1d';

  return jwt.sign(payload, secret, { expiresIn });
};

const signRefreshToken = (payload) => {
  const secret = getEnv('JWT_REFRESH_SECRET') || getEnv('JWT_SECRET');
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET (or JWT_SECRET) is not defined in .env');
  }

  const expiresIn =
    getEnv('JWT_REFRESH_EXPIRES_IN') ||
    getEnv('JWT_REFRESH_EXPIRES') ||
    '7d';

  return jwt.sign(payload, secret, { expiresIn });
};

const verifyAccess = (token) => {
  const secret = getEnv('JWT_ACCESS_SECRET') || getEnv('JWT_SECRET');
  if (!secret) {
    throw new Error('JWT_ACCESS_SECRET (or JWT_SECRET) is not defined in .env');
  }
  return jwt.verify(token, secret);
};

const verifyRefresh = (token) => {
  const secret = getEnv('JWT_REFRESH_SECRET') || getEnv('JWT_SECRET');
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET (or JWT_SECRET) is not defined in .env');
  }
  return jwt.verify(token, secret);
};

module.exports = { signAccessToken, signRefreshToken, verifyAccess, verifyRefresh };
