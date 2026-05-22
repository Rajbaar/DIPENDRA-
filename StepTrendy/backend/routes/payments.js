const router = require('express').Router();
const { createPayment, verifyPayment, uploadPaymentScreenshot, getPayments, getUpiConfigs, createUpiConfig, updateUpiConfig, deleteUpiConfig, getRevenueReport } = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', protect, createPayment);
router.post('/verify', protect, admin, verifyPayment);
router.post('/:id/screenshot', protect, upload.single('screenshot'), uploadPaymentScreenshot);
router.get('/', protect, admin, getPayments);
router.get('/revenue-report', protect, admin, getRevenueReport);
router.get('/upi-configs', protect, admin, getUpiConfigs);
router.post('/upi-configs', protect, admin, createUpiConfig);
router.put('/upi-configs/:id', protect, admin, updateUpiConfig);
router.delete('/upi-configs/:id', protect, admin, deleteUpiConfig);

module.exports = router;
