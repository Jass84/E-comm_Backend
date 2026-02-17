const express = require('express');
const router = express.Router();
const { protect, authorize, checkSellerApproval } = require('../middleware/authMiddleware');
const Product = require('../models/Product');
const {
  getDashboardStats,
  getSellerProfile,
  updateSellerProfile,
  getSellerProducts,
  getSellerOrders,
  getEarnings,
  requestWithdrawal,
  getWithdrawals,
  updateOrderStatus
} = require('../controllers/sellerDashboardController');

// All routes are protected and require seller role + approval
const sellerAuth = [protect, authorize('seller'), checkSellerApproval];

// Dashboard & Profile Routes
router.get('/dashboard', sellerAuth, getDashboardStats);
router.get('/profile', sellerAuth, getSellerProfile);
router.put('/profile', sellerAuth, updateSellerProfile);

// Products Management Routes
router.get('/products', sellerAuth, getSellerProducts);

// Orders Management Routes
router.get('/orders', sellerAuth, getSellerOrders);
router.put('/orders/:id/status', sellerAuth, updateOrderStatus);

// Earnings & Withdrawal Routes
router.get('/earnings', sellerAuth, getEarnings);
router.post('/withdrawals', sellerAuth, requestWithdrawal);
router.get('/withdrawals', sellerAuth, getWithdrawals);

module.exports = router;
