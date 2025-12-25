const express = require('express');
const router = express.Router();

const { register, login, getMe } = require('../controllers/authController');
// destructure authMiddleware function from module
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);

router.get('/me', authMiddleware, getMe);

module.exports = router;
