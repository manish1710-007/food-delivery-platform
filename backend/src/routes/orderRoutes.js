
const router = require('express').Router();
const { authMiddleware, permit } = require('../middlewares/authMiddleware');
const orderCtrl = require('../controllers/orderController');
const { addToCart, getCart, removeFromCart } = require('../controllers/cartController');

// Cart routes
router.get('/cart', authMiddleware, getCart);
router.post('/cart', authMiddleware, addToCart);
router.delete('/cart/:itemId', authMiddleware, removeFromCart);


console.log('orderRoutes loaded');


// User creates order & views own orders
router.post('/', authMiddleware, orderCtrl.createOrder);
router.get('/my', authMiddleware, orderCtrl.getMyOrders);

// View one order (user owns it, or admin/restaurant)
router.get('/:id', authMiddleware, orderCtrl.getOrderById);

// checkout endpoint to create order from cart
router.post('/checkout', authMiddleware, orderCtrl.checkoutFromCart);

// Admin/restaurant views all orders
router.get('/', authMiddleware, permit('admin', 'restaurant'), orderCtrl.listOrders);

// Update order status (admin/restaurant)
router.patch('/:id/status', authMiddleware, permit('admin', 'restaurant'), orderCtrl.updateOrderStatus);

// Mark order as paid (user or admin)
router.patch('/:id/mark-paid', authMiddleware, orderCtrl.markPaid);


module.exports = router;
