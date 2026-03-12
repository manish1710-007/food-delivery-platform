const router = require('express').Router();
const { authMiddleware, permit } = require('../middlewares/authMiddleware');
const restCtrl = require('../controllers/restaurantsController');

// PUBLIC RESTAURANT NODES

router.get('/', restCtrl.list);

// View specific restaurant profile and its menu
router.get('/:id', restCtrl.getOne);


// PROTECTED MANAGEMENT NODES

router.post('/', authMiddleware, restCtrl.create);

router.patch('/:id', authMiddleware, permit('restaurant', 'admin'), restCtrl.update);

router.delete('/:id', authMiddleware, permit('restaurant', 'admin'), restCtrl.remove);

module.exports = router;