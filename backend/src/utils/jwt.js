const jwt = require('jsonwebtoken');

const getEnv = (name) => process.env[name];

// ACCESS TOKEN (Short-Lived)
const signAccessToken = (payload) => {
  const secret = getEnv('JWT_ACCESS_SECRET') || getEnv('JWT_SECRET');
  if (!secret) {
    throw new Error('[SYS.FATAL] JWT_ACCESS_SECRET is missing from the environment variables.');
  }

  const expiresIn = getEnv('JWT_ACCESS_EXPIRES_IN') || '15m';

  return jwt.sign(payload, secret, { expiresIn });
};

// REFRESH TOKEN (Long-Lived)

const signRefreshToken = (payload) => {
  const secret = getEnv('JWT_REFRESH_SECRET') || getEnv('JWT_SECRET');
  if (!secret) {
    throw new Error('[SYS.FATAL] JWT_REFRESH_SECRET is missing from the environment variables.');
  }

  const expiresIn = getEnv('JWT_REFRESH_EXPIRES_IN') || '7d';

  return jwt.sign(payload, secret, { expiresIn });
};

// VERIFICATION PROTOCOLS
const verifyAccess = (token) => {
  const secret = getEnv('JWT_ACCESS_SECRET') || getEnv('JWT_SECRET');
  if (!secret) throw new Error('[SYS.FATAL] JWT_ACCESS_SECRET is not defined.');
  
  return jwt.verify(token, secret);
};

const verifyRefresh = (token) => {
  const secret = getEnv('JWT_REFRESH_SECRET') || getEnv('JWT_SECRET');
  if (!secret) throw new Error('[SYS.FATAL] JWT_REFRESH_SECRET is not defined.');
  
  return jwt.verify(token, secret);
};

module.exports = { signAccessToken, signRefreshToken, verifyAccess, verifyRefresh };