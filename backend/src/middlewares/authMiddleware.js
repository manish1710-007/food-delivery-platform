
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyAccess } = require('../utils/jwt');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;

    // Try access token first
    try {
      decoded = verifyAccess(token);                // uses JWT_ACCESS_SECRET
    } catch (e) {
      // Fallback: basic token signed with JWT_SECRET
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
    }

    // decoded may have { id } or { id, role, email }
    const userId = decoded.id || decoded._id;
    if (!userId) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    console.error('authMiddleware error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const permit = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};

module.exports = { authMiddleware, permit };
