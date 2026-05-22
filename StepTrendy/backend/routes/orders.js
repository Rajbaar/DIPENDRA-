const router = require('express').Router();
const { createOrder, getOrders, getOrder, updateOrderStatus, requestReturn, getDashboardStats } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

router.get('/dashboard-stats', protect, admin, getDashboardStats);
router.post('/', protect, createOrder);
router.get('/', protect, getOrders);
router.get('/:orderNumber', protect, getOrder);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.post('/:id/return', protect, requestReturn);

module.exports = router;
