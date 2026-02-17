const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const withdrawalController = require('../controllers/withdrawalController');

// @route   GET /api/admin/withdrawals/stats
// @desc    Get withdrawal statistics
// @access  Private/Admin
router.get('/withdrawals/stats', protect, authorize('admin'), withdrawalController.getWithdrawalStats);

// @route   POST /api/admin/withdrawals/batch-approve
// @desc    Batch approve withdrawals
// @access  Private/Admin
router.post('/withdrawals/batch-approve', protect, authorize('admin'), withdrawalController.batchApproveWithdrawals);

// @route   PUT /api/admin/withdrawals/:id/approve
// @desc    Approve withdrawal
// @access  Private/Admin
router.put('/withdrawals/:id/approve', protect, authorize('admin'), withdrawalController.approveWithdrawal);

// @route   PUT /api/admin/withdrawals/:id/reject
// @desc    Reject withdrawal
// @access  Private/Admin
router.put('/withdrawals/:id/reject', protect, authorize('admin'), withdrawalController.rejectWithdrawal);

// @route   PUT /api/admin/withdrawals/:id/complete
// @desc    Mark withdrawal as completed
// @access  Private/Admin
router.put('/withdrawals/:id/complete', protect, authorize('admin'), withdrawalController.completeWithdrawal);

// @route   PUT /api/admin/withdrawals/:id/fail
// @desc    Mark withdrawal as failed
// @access  Private/Admin
router.put('/withdrawals/:id/fail', protect, authorize('admin'), withdrawalController.failWithdrawal);

module.exports = router;
