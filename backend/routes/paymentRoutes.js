const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  getPaymentConfig,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/config', getPaymentConfig);
router.post('/create-payment-intent', protect, createPaymentIntent);

module.exports = router;
