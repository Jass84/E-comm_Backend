const express = require('express');
const router = express.Router();
const {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  getActiveCoupons,
  getCouponStats
} = require('../controllers/couponController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public/User routes
router.post('/validate', protect, validateCoupon);
router.get('/active', protect, getActiveCoupons);

// Admin routes
router.post('/', protect, authorize('admin'), createCoupon);
router.get('/', protect, authorize('admin'), getAllCoupons);
router.get('/:id', protect, authorize('admin'), getCouponById);
router.put('/:id', protect, authorize('admin'), updateCoupon);
router.delete('/:id', protect, authorize('admin'), deleteCoupon);
router.get('/:id/stats', protect, authorize('admin'), getCouponStats);

module.exports = router;
