const router = require('express').Router();
const { register, login, refresh, logout } = require('../controllers/authController');

// Basic register/login (legacy)
router.post('/register', register);
router.post('/login', login);

// Advanced auth endpoints (access + refresh tokens)
router.post('/advanced/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

module.exports = router;
