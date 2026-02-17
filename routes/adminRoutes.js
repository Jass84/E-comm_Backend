const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getDashboardStats,
  getAllWithdrawals,
  processWithdrawal,
  getPendingSellers,
  approveSeller,
  getAllUsers,
  getUserDetails,
  updateUser,
  deleteUser,
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getRevenueAnalytics,
  getTopProducts,
  getTopSellers
} = require('../controllers/adminController');

// Admin middleware
const adminAuth = [protect, authorize('admin')];

// ============================================================
// DASHBOARD
// ============================================================
router.get('/dashboard', adminAuth, getDashboardStats);

// ============================================================
// USER MANAGEMENT
// ============================================================
router.get('/users', adminAuth, getAllUsers);
router.get('/users/:id', adminAuth, getUserDetails);
router.put('/users/:id', adminAuth, updateUser);
router.delete('/users/:id', adminAuth, deleteUser);

// ============================================================
// SELLER MANAGEMENT
// ============================================================
router.get('/sellers/pending', adminAuth, getPendingSellers);
router.put('/sellers/:id/approve', adminAuth, approveSeller);

// ============================================================
// ORDER MANAGEMENT
// ============================================================
router.get('/orders', adminAuth, getAllOrders);
router.get('/orders/:id', adminAuth, getOrderDetails);
router.put('/orders/:id/status', adminAuth, updateOrderStatus);

// ============================================================
// PRODUCT MANAGEMENT
// ============================================================
router.get('/products', adminAuth, getAllProducts);
router.put('/products/:id', adminAuth, updateProduct);
router.delete('/products/:id', adminAuth, deleteProduct);

// ============================================================
// WITHDRAWAL MANAGEMENT
// ============================================================
router.get('/withdrawals', adminAuth, getAllWithdrawals);
router.put('/withdrawals/:id', adminAuth, processWithdrawal);

// ============================================================
// ANALYTICS & REPORTS
// ============================================================
router.get('/analytics/revenue', adminAuth, getRevenueAnalytics);
router.get('/analytics/top-products', adminAuth, getTopProducts);
router.get('/analytics/top-sellers', adminAuth, getTopSellers);

module.exports = router;
