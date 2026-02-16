const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  createRazorpayOrder,
  verifyPayment,
  getRazorpayKey,
  paymentFailed,
  getPaymentDetails,
  initiateRefund,
  webhookHandler
} = require('../controllers/paymentController');

// Public routes
router.post('/webhook', webhookHandler);

// Protected routes
router.get('/razorpay-key', protect, getRazorpayKey);
router.post('/create-order', protect, createRazorpayOrder);
router.post('/verify', protect, verifyPayment);
router.post('/payment-failed', protect, paymentFailed);
router.get('/payment-details/:paymentId', protect, getPaymentDetails);

// Admin routes
router.post('/refund', protect, authorize('admin'), initiateRefund);

module.exports = router;
