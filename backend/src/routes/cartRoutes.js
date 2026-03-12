const router = require('express').Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const cartCtrl = require('../controllers/cartController');


// GLOBAL AUTH LOCK

router.use(authMiddleware);


// CART OPERATIONS

// GET
router.get('/', cartCtrl.getCart);

// POST
router.post('/', cartCtrl.addToCart);

// DELETE
router.delete('/:itemId', cartCtrl.removeFromCart);

module.exports = router;