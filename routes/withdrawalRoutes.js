const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const withdrawalController = require('../controllers/withdrawalController');

// @route   GET /api/seller/withdrawal-policies
// @desc    Get withdrawal policies and limits
// @access  Private/Seller
router.get('/withdrawal-policies', protect, authorize('seller'), withdrawalController.getWithdrawalPolicies);

// @route   POST /api/seller/withdrawals
// @desc    Request withdrawal
// @access  Private/Seller
router.post('/withdrawals', protect, authorize('seller'), withdrawalController.requestWithdrawal);

// @route   GET /api/seller/withdrawals
// @desc    Get seller withdrawal history
// @access  Private/Seller
router.get('/withdrawals', protect, authorize('seller'), withdrawalController.getSellerWithdrawals);

// @route   DELETE /api/seller/withdrawals/:id
// @desc    Cancel withdrawal request
// @access  Private/Seller
router.delete('/withdrawals/:id', protect, authorize('seller'), withdrawalController.cancelWithdrawal);

module.exports = router;
