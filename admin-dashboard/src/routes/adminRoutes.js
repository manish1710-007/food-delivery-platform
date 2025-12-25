
// eslint-disable-next-line no-undef
const router = require('express').Router();
import { authMiddleware, permit } from '../middlewares/authMiddleware';
import { stats, listUsers, listrestaurant, listOrders } from '../controllers/adminController';

router.get('/stats', authMiddleware, permit('admin'), stats);
router.get('/users', authMiddleware, permit('admin'), listUsers);
router.get('/restaurant', authMiddleware, permit('admin'), listrestaurant);
router.get('/orders', authMiddleware, permit('admin'), listOrders);

export default router;
