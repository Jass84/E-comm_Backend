const express = require('express');
const router = express.Router();
const { protect, authorize, checkSellerApproval } = require('../middleware/authMiddleware');
const {
  createOrder,
  getMyOrders,
  getOrder,
  cancelOrder,
  updateOrderStatus,
  getAllOrders,
  getSellerOrders
} = require('../controllers/orderController');

// User routes
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/cancel', protect, cancelOrder);

// Seller routes
router.get('/seller/orders', protect, authorize('seller'), checkSellerApproval, getSellerOrders);
router.put('/:id/status', protect, authorize('seller', 'admin'), updateOrderStatus);

// Admin routes
router.get('/', protect, authorize('admin'), getAllOrders);

module.exports = router;
