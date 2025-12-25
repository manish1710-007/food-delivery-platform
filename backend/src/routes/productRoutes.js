const router = require('express').Router();
const { authMiddleware, permit } = require('../middlewares/authMiddleware');
const prodCtrl = require('../controllers/productController');

console.log('prodCtrl:', prodCtrl);
console.log('authMiddleware:', typeof authMiddleware, 'permit:', typeof permit);
console.log('prodCtrl.create:', typeof prodCtrl.create);

console.log('Product routes loaded');

// Public routes
router.get('/', prodCtrl.list);

router.get('/:id', prodCtrl.getOne);

// Protected routes
router.post(
    '/',
    authMiddleware,
    permit('Restaurant','admin'),
    prodCtrl.create
);

router.patch(
    '/:id',
    authMiddleware,
    permit('Restaurant','admin'),
    prodCtrl.update 
);

router.delete(
    '/:id',
    authMiddleware,
    permit('Restaurant','admin'),
    prodCtrl.remove
);

module.exports = router;
