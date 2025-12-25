
const router = require('express').Router();
const { authMiddleware, permit } = require('../middlewares/authMiddleware');
const restCtrl = require('../controllers/restaurantsController');

console.log('restaurantRoutes loaded')

// log every request to this router
router.use((req, res, next) => {
    console.log('Restaurant route hit:', req.method, req.originalUrl);
    next();
});

// public list & details
router.get('/', restCtrl.list);
router.get('/:id', restCtrl.getOne);

// protected (restaurant owners, admin)
router.post('/', authMiddleware, restCtrl.create);
router.patch('/:id', authMiddleware, permit('Restaurant','admin'), restCtrl.update);
router.delete('/:id', authMiddleware, permit('Restaurant','admin'), restCtrl.remove);

module.exports = router;
