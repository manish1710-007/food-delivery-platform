const router = require('express').Router();
const { authMiddleware, permit } = require('../middlewares/authMiddleware');
const prodCtrl = require('../controllers/productController');


// PUBLIC PRODUCT NODES

router.get('/', prodCtrl.list);

// Fetch specific product data by ID
router.get('/:id', prodCtrl.getOne);

// PROTECTED MANAGEMENT NODES

// Create new product (Only for verified Restaurant owners or Admins)
router.post(
    '/',
    authMiddleware,
    permit('restaurant', 'admin'), 
    prodCtrl.create
);

// Update product data
router.patch(
    '/:id',
    authMiddleware,
    permit('restaurant', 'admin'),
    prodCtrl.update 
);

// Purge product from the registry
router.delete(
    '/:id',
    authMiddleware,
    permit('restaurant', 'admin'),
    prodCtrl.remove
);

module.exports = router;