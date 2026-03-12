const express = require('express');
const router = express.Router();

const { 
  register, 
  login, 
  refresh, 
  logout, 
  getMe 
} = require('../controllers/authController');

const { authMiddleware } = require('../middlewares/authMiddleware');


// PUBLIC AUTH ENDPOINTS
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);   

// PROTECTED AUTH ENDPOINTS
router.get('/me', authMiddleware, getMe);

module.exports = router;