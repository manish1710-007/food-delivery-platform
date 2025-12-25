const router = require('express').Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const cartCtrl = require('../controllers/cartController');

router.use(authMiddleware);

router.get('/', cartCtrl.getCart);
router.post('/', cartCtrl.addToCart);
router.delete('/:itemId', cartCtrl.removeFromCart);

module.exports = router;
