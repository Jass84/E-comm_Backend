/**
 * 💰 PHASE 9: ENHANCED WITHDRAWAL & PAYOUT CONTROLLER
 * Advanced withdrawal management with policies, limits, and automation
 */

const User = require('../models/User');
const Withdrawal = require('../models/Withdrawal');
const Order = require('../models/Order');

// Withdrawal policies
const WITHDRAWAL_POLICIES = {
  MIN_AMOUNT: 500,
  MAX_AMOUNT: 100000,
  PROCESSING_FEE_PERCENTAGE: 2, // 2%
  MIN_PROCESSING_FEE: 10,
  MAX_PROCESSING_FEE: 500,
  TAX_DEDUCTION_PERCENTAGE: 1, // 1% TDS
  MIN_BALANCE_REQUIRED: 100, // Minimum balance to keep
  AUTO_APPROVE_THRESHOLD: 5000, // Auto-approve below this amount
  MAX_PENDING_REQUESTS: 3, // Max pending requests per seller
  COOLDOWN_PERIOD_HOURS: 24 // Hours between requests
};

// Calculate processing fee
const calculateProcessingFee = (amount) => {
  const fee = amount * (WITHDRAWAL_POLICIES.PROCESSING_FEE_PERCENTAGE / 100);
  return Math.min(
    Math.max(fee, WITHDRAWAL_POLICIES.MIN_PROCESSING_FEE),
    WITHDRAWAL_POLICIES.MAX_PROCESSING_FEE
  );
};

// Calculate tax deduction
const calculateTaxDeduction = (amount) => {
  return amount * (WITHDRAWAL_POLICIES.TAX_DEDUCTION_PERCENTAGE / 100);
};

// @desc    Request withdrawal (Seller)
// @route   POST /api/seller/withdrawals
// @access  Private/Seller
exports.requestWithdrawal = async (req, res) => {
  try {
    const { amount, paymentMethod, bankDetails, upiDetails, paypalDetails } = req.body;

    // Validate seller
    const seller = await User.findById(req.user._id);
    if (!seller || seller.role !== 'seller' || !seller.sellerApproved) {
      return res.status(403).json({
        success: false,
        message: 'Only approved sellers can request withdrawals'
      });
    }

    // Validation: Minimum amount
    if (amount < WITHDRAWAL_POLICIES.MIN_AMOUNT) {
      return res.status(400).json({
        success: false,
        message: `Minimum withdrawal amount is ₹${WITHDRAWAL_POLICIES.MIN_AMOUNT}`
      });
    }

    // Validation: Maximum amount
    if (amount > WITHDRAWAL_POLICIES.MAX_AMOUNT) {
      return res.status(400).json({
        success: false,
        message: `Maximum withdrawal amount is ₹${WITHDRAWAL_POLICIES.MAX_AMOUNT}`
      });
    }

    // Validation: Available balance
    const availableBalance = seller.earnings - WITHDRAWAL_POLICIES.MIN_BALANCE_REQUIRED;
    if (amount > availableBalance) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. Available: ₹${availableBalance}`,
        availableBalance
      });
    }

    // Validation: Check pending requests
    const pendingCount = await Withdrawal.countDocuments({
      seller: seller._id,
      status: 'pending'
    });

    if (pendingCount >= WITHDRAWAL_POLICIES.MAX_PENDING_REQUESTS) {
      return res.status(400).json({
        success: false,
        message: `You have ${pendingCount} pending requests. Please wait for them to be processed.`
      });
    }

    // Validation: Cooldown period
    const lastWithdrawal = await Withdrawal.findOne({
      seller: seller._id,
      status: { $ne: 'rejected' }
    }).sort({ requestedAt: -1 });

    if (lastWithdrawal) {
      const hoursSinceLastRequest = (Date.now() - lastWithdrawal.requestedAt.getTime()) / (1000 * 60 * 60);
      if (hoursSinceLastRequest < WITHDRAWAL_POLICIES.COOLDOWN_PERIOD_HOURS) {
        const hoursRemaining = Math.ceil(WITHDRAWAL_POLICIES.COOLDOWN_PERIOD_HOURS - hoursSinceLastRequest);
        return res.status(400).json({
          success: false,
          message: `Please wait ${hoursRemaining} more hours before requesting another withdrawal`
        });
      }
    }

    // Calculate fees and net amount
    const processingFee = calculateProcessingFee(amount);
    const taxDeduction = calculateTaxDeduction(amount);
    const netAmount = amount - processingFee - taxDeduction;

    // Validate payment method details
    if (!paymentMethod || !['bank_transfer', 'upi', 'paypal', 'razorpay_payout'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method'
      });
    }

    // Auto-approval logic
    const autoApproved = amount <= WITHDRAWAL_POLICIES.AUTO_APPROVE_THRESHOLD && seller.totalEarnings > 50000;
    const priority = amount > 50000 ? 'high' : amount > 10000 ? 'medium' : 'low';

    // Create withdrawal request
    const withdrawal = await Withdrawal.create({
      seller: seller._id,
      amount,
      processingFee,
      taxDeduction,
      netAmount,
      paymentMethod,
      bankDetails: paymentMethod === 'bank_transfer' ? bankDetails : undefined,
      upiDetails: paymentMethod === 'upi' ? upiDetails : undefined,
      paypalDetails: paymentMethod === 'paypal' ? paypalDetails : undefined,
      status: autoApproved ? 'approved' : 'pending',
      autoApproved,
      priority
    });

    // Deduct from seller earnings
    seller.earnings -= amount;
    await seller.save();

    // Populate seller details
    await withdrawal.populate('seller', 'name email phone');

    res.status(201).json({
      success: true,
      message: autoApproved ? 'Withdrawal request auto-approved!' : 'Withdrawal request submitted successfully',
      withdrawal,
      breakdown: {
        requestedAmount: amount,
        processingFee,
        taxDeduction,
        netAmount,
        remainingBalance: seller.earnings
      }
    });

  } catch (error) {
    console.error('Request withdrawal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to request withdrawal',
      error: error.message
    });
  }
};

// @desc    Get withdrawal policies
// @route   GET /api/seller/withdrawal-policies
// @access  Private/Seller
exports.getWithdrawalPolicies = async (req, res) => {
  try {
    const seller = await User.findById(req.user._id);
    
    const processingFeeExample = calculateProcessingFee(10000);
    const taxExample = calculateTaxDeduction(10000);
    
    res.status(200).json({
      success: true,
      policies: {
        ...WITHDRAWAL_POLICIES,
        processingFeeExample: {
          amount: 10000,
          fee: processingFeeExample,
          percentage: WITHDRAWAL_POLICIES.PROCESSING_FEE_PERCENTAGE
        },
        taxExample: {
          amount: 10000,
          deduction: taxExample,
          percentage: WITHDRAWAL_POLICIES.TAX_DEDUCTION_PERCENTAGE
        }
      },
      sellerInfo: {
        availableBalance: seller ? seller.earnings - WITHDRAWAL_POLICIES.MIN_BALANCE_REQUIRED : 0,
        currentEarnings: seller ? seller.earnings : 0,
        totalEarnings: seller ? seller.totalEarnings : 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch policies',
      error: error.message
    });
  }
};

// @desc    Get seller withdrawal history
// @route   GET /api/seller/withdrawals
// @access  Private/Seller
exports.getSellerWithdrawals = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = { seller: req.user._id };
    if (status) query.status = status;

    const withdrawals = await Withdrawal.find(query)
      .sort({ requestedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('processedBy', 'name email');

    const total = await Withdrawal.countDocuments(query);

    // Calculate stats
    const stats = await Withdrawal.aggregate([
      { $match: { seller: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          totalNetAmount: { $sum: '$netAmount' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      withdrawals,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      },
      stats: stats.reduce((acc, stat) => {
        acc[stat._id] = {
          count: stat.count,
          totalAmount: stat.totalAmount,
          totalNetAmount: stat.totalNetAmount
        };
        return acc;
      }, {})
    });
  } catch (error) {
    console.error('Get seller withdrawals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch withdrawals',
      error: error.message
    });
  }
};

// @desc    Cancel withdrawal request (Seller)
// @route   DELETE /api/seller/withdrawals/:id
// @access  Private/Seller
exports.cancelWithdrawal = async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);

    if (!withdrawal) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal request not found'
      });
    }

    // Check ownership
    if (withdrawal.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this withdrawal'
      });
    }

    // Can only cancel pending requests
    if (withdrawal.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel ${withdrawal.status} withdrawal`
      });
    }

    // Refund amount to seller
    const seller = await User.findById(withdrawal.seller);
    seller.earnings += withdrawal.amount;
    await seller.save();

    // Delete the withdrawal request
    await withdrawal.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Withdrawal request cancelled successfully',
      refundedAmount: withdrawal.amount
    });
  } catch (error) {
    console.error('Cancel withdrawal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel withdrawal',
      error: error.message
    });
  }
};

// @desc    Approve withdrawal (Admin)
// @route   PUT /api/admin/withdrawals/:id/approve
// @access  Private/Admin
exports.approveWithdrawal = async (req, res) => {
  try {
    const { adminNote, transactionId } = req.body;

    const withdrawal = await Withdrawal.findById(req.params.id)
      .populate('seller', 'name email phone');

    if (!withdrawal) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal request not found'
      });
    }

    if (withdrawal.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot approve ${withdrawal.status} withdrawal`
      });
    }

    // Update withdrawal
    withdrawal.status = 'approved';
    withdrawal.adminNote = adminNote;
    withdrawal.transactionId = transactionId;
    withdrawal.processedAt = Date.now();
    withdrawal.processedBy = req.user._id;

    await withdrawal.save();

    // TODO: Send email notification to seller

    res.status(200).json({
      success: true,
      message: 'Withdrawal approved successfully',
      withdrawal
    });
  } catch (error) {
    console.error('Approve withdrawal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve withdrawal',
      error: error.message
    });
  }
};

// @desc    Reject withdrawal (Admin)
// @route   PUT /api/admin/withdrawals/:id/reject
// @access  Private/Admin
exports.rejectWithdrawal = async (req, res) => {
  try {
    const { rejectionReason, adminNote } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const withdrawal = await Withdrawal.findById(req.params.id)
      .populate('seller', 'name email phone');

    if (!withdrawal) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal request not found'
      });
    }

    if (withdrawal.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot reject ${withdrawal.status} withdrawal`
      });
    }

    // Refund amount to seller
    const seller = await User.findById(withdrawal.seller);
    seller.earnings += withdrawal.amount;
    await seller.save();

    // Update withdrawal
    withdrawal.status = 'rejected';
    withdrawal.rejectionReason = rejectionReason;
    withdrawal.adminNote = adminNote;
    withdrawal.processedAt = Date.now();
    withdrawal.processedBy = req.user._id;

    await withdrawal.save();

    // TODO: Send email notification to seller

    res.status(200).json({
      success: true,
      message: 'Withdrawal rejected successfully',
      withdrawal
    });
  } catch (error) {
    console.error('Reject withdrawal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject withdrawal',
      error: error.message
    });
  }
};

// @desc    Mark withdrawal as completed (Admin)
// @route   PUT /api/admin/withdrawals/:id/complete
// @access  Private/Admin
exports.completeWithdrawal = async (req, res) => {
  try {
    const { transactionId, razorpayPayoutId, adminNote } = req.body;

    const withdrawal = await Withdrawal.findById(req.params.id)
      .populate('seller', 'name email phone');

    if (!withdrawal) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal request not found'
      });
    }

    if (withdrawal.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Can only complete approved withdrawals'
      });
    }

    if (!transactionId && !razorpayPayoutId) {
      return res.status(400).json({
        success: false,
        message: 'Transaction ID or Razorpay Payout ID is required'
      });
    }

    // Update withdrawal
    withdrawal.status = 'completed';
    withdrawal.transactionId = transactionId || withdrawal.transactionId;
    withdrawal.razorpayPayoutId = razorpayPayoutId;
    withdrawal.adminNote = adminNote;
    withdrawal.processedAt = Date.now();
    withdrawal.processedBy = req.user._id;

    await withdrawal.save();

    // TODO: Send email notification to seller

    res.status(200).json({
      success: true,
      message: 'Withdrawal marked as completed',
      withdrawal
    });
  } catch (error) {
    console.error('Complete withdrawal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete withdrawal',
      error: error.message
    });
  }
};

// @desc    Mark withdrawal as failed (Admin)
// @route   PUT /api/admin/withdrawals/:id/fail
// @access  Private/Admin
exports.failWithdrawal = async (req, res) => {
  try {
    const { failureReason, adminNote } = req.body;

    if (!failureReason) {
      return res.status(400).json({
        success: false,
        message: 'Failure reason is required'
      });
    }

    const withdrawal = await Withdrawal.findById(req.params.id)
      .populate('seller', 'name email phone');

    if (!withdrawal) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal request not found'
      });
    }

    if (withdrawal.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Can only mark approved withdrawals as failed'
      });
    }

    // Refund amount to seller
    const seller = await User.findById(withdrawal.seller);
    seller.earnings += withdrawal.amount;
    await seller.save();

    // Update withdrawal
    withdrawal.status = 'failed';
    withdrawal.failureReason = failureReason;
    withdrawal.adminNote = adminNote;
    withdrawal.retryCount += 1;
    withdrawal.processedAt = Date.now();
    withdrawal.processedBy = req.user._id;

    await withdrawal.save();

    // TODO: Send email notification to seller

    res.status(200).json({
      success: true,
      message: 'Withdrawal marked as failed',
      withdrawal,
      refundedAmount: withdrawal.amount
    });
  } catch (error) {
    console.error('Fail withdrawal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process withdrawal failure',
      error: error.message
    });
  }
};

// @desc    Batch approve withdrawals (Admin)
// @route   POST /api/admin/withdrawals/batch-approve
// @access  Private/Admin
exports.batchApproveWithdrawals = async (req, res) => {
  try {
    const { withdrawalIds, adminNote } = req.body;

    if (!withdrawalIds || !Array.isArray(withdrawalIds) || withdrawalIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide withdrawal IDs'
      });
    }

    const results = {
      approved: [],
      failed: []
    };

    for (const id of withdrawalIds) {
      try {
        const withdrawal = await Withdrawal.findById(id);
        
        if (!withdrawal) {
          results.failed.push({ id, reason: 'Not found' });
          continue;
        }

        if (withdrawal.status !== 'pending') {
          results.failed.push({ id, reason: `Already ${withdrawal.status}` });
          continue;
        }

        withdrawal.status = 'approved';
        withdrawal.adminNote = adminNote;
        withdrawal.processedAt = Date.now();
        withdrawal.processedBy = req.user._id;
        await withdrawal.save();

        results.approved.push(id);
      } catch (error) {
        results.failed.push({ id, reason: error.message });
      }
    }

    res.status(200).json({
      success: true,
      message: `Batch approval completed: ${results.approved.length} approved, ${results.failed.length} failed`,
      results
    });
  } catch (error) {
    console.error('Batch approve error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to batch approve withdrawals',
      error: error.message
    });
  }
};

// @desc    Get withdrawal statistics (Admin)
// @route   GET /api/admin/withdrawals/stats
// @access  Private/Admin
exports.getWithdrawalStats = async (req, res) => {
  try {
    // Overall stats
    const stats = await Withdrawal.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          totalNetAmount: { $sum: '$netAmount' },
          totalFees: { $sum: '$processingFee' },
          totalTax: { $sum: '$taxDeduction' }
        }
      }
    ]);

    // Today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayStats = await Withdrawal.aggregate([
      {
        $match: {
          requestedAt: { $gte: today }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    // By payment method
    const methodStats = await Withdrawal.aggregate([
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    // Average processing time
    const avgProcessingTime = await Withdrawal.aggregate([
      {
        $match: {
          status: { $in: ['completed', 'rejected'] },
          processedAt: { $exists: true }
        }
      },
      {
        $project: {
          processingTime: {
            $subtract: ['$processedAt', '$requestedAt']
          }
        }
      },
      {
        $group: {
          _id: null,
          avgTime: { $avg: '$processingTime' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        overall: stats.reduce((acc, stat) => {
          acc[stat._id] = {
            count: stat.count,
            totalAmount: stat.totalAmount,
            totalNetAmount: stat.totalNetAmount,
            totalFees: stat.totalFees,
            totalTax: stat.totalTax
          };
          return acc;
        }, {}),
        today: todayStats.reduce((acc, stat) => {
          acc[stat._id] = {
            count: stat.count,
            totalAmount: stat.totalAmount
          };
          return acc;
        }, {}),
        byPaymentMethod: methodStats.reduce((acc, stat) => {
          acc[stat._id] = {
            count: stat.count,
            totalAmount: stat.totalAmount
          };
          return acc;
        }, {}),
        avgProcessingTimeHours: avgProcessingTime[0] ? (avgProcessingTime[0].avgTime / (1000 * 60 * 60)).toFixed(2) : 0
      }
    });
  } catch (error) {
    console.error('Get withdrawal stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch withdrawal stats',
      error: error.message
    });
  }
};
