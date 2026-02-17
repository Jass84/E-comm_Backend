const Coupon = require('../models/Coupon');
const Order = require('../models/Order');

// @desc    Create new coupon
// @route   POST /api/coupons
// @access  Private/Admin
exports.createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minimumOrderAmount,
      maximumDiscount,
      startDate,
      expiryDate,
      usageLimit,
      usageLimitPerUser
    } = req.body;

    // Validation
    if (!code || !discountType || !discountValue || !expiryDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide code, discount type, discount value, and expiry date'
      });
    }

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code already exists'
      });
    }

    // Validate discount type and value
    if (discountType === 'percentage' && discountValue > 100) {
      return res.status(400).json({
        success: false,
        message: 'Percentage discount cannot exceed 100%'
      });
    }

    // Validate expiry date
    if (new Date(expiryDate) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Expiry date must be in the future'
      });
    }

    // Create coupon
    const coupon = await Coupon.create({
      code,
      description,
      discountType,
      discountValue,
      minimumOrderAmount,
      maximumDiscount,
      startDate,
      expiryDate,
      usageLimit,
      usageLimitPerUser,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: coupon
    });
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating coupon',
      error: error.message
    });
  }
};

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
exports.getAllCoupons = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = {};

    // Filter by active status
    if (req.query.isActive !== undefined) {
      query.isActive = req.query.isActive === 'true';
    }

    // Filter by discount type
    if (req.query.discountType) {
      query.discountType = req.query.discountType;
    }

    // Search by code
    if (req.query.search) {
      query.code = { $regex: req.query.search, $options: 'i' };
    }

    const coupons = await Coupon.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Coupon.countDocuments(query);

    res.json({
      success: true,
      count: coupons.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: coupons
    });
  } catch (error) {
    console.error('Get coupons error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching coupons',
      error: error.message
    });
  }
};

// @desc    Get single coupon
// @route   GET /api/coupons/:id
// @access  Private/Admin
exports.getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('usedBy.user', 'name email');

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    res.json({
      success: true,
      data: coupon
    });
  } catch (error) {
    console.error('Get coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching coupon',
      error: error.message
    });
  }
};

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
exports.updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    const {
      description,
      discountType,
      discountValue,
      minimumOrderAmount,
      maximumDiscount,
      expiryDate,
      usageLimit,
      usageLimitPerUser,
      isActive
    } = req.body;

    // Update fields
    if (description !== undefined) coupon.description = description;
    if (discountType !== undefined) coupon.discountType = discountType;
    if (discountValue !== undefined) {
      if (discountType === 'percentage' && discountValue > 100) {
        return res.status(400).json({
          success: false,
          message: 'Percentage discount cannot exceed 100%'
        });
      }
      coupon.discountValue = discountValue;
    }
    if (minimumOrderAmount !== undefined) coupon.minimumOrderAmount = minimumOrderAmount;
    if (maximumDiscount !== undefined) coupon.maximumDiscount = maximumDiscount;
    if (expiryDate !== undefined) coupon.expiryDate = expiryDate;
    if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
    if (usageLimitPerUser !== undefined) coupon.usageLimitPerUser = usageLimitPerUser;
    if (isActive !== undefined) coupon.isActive = isActive;

    await coupon.save();

    res.json({
      success: true,
      message: 'Coupon updated successfully',
      data: coupon
    });
  } catch (error) {
    console.error('Update coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating coupon',
      error: error.message
    });
  }
};

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    // Check if coupon has been used
    if (coupon.usageCount > 0) {
      // Instead of deleting, deactivate it
      coupon.isActive = false;
      await coupon.save();

      return res.json({
        success: true,
        message: 'Coupon has been deactivated (cannot delete used coupons)'
      });
    }

    await coupon.deleteOne();

    res.json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting coupon',
      error: error.message
    });
  }
};

// @desc    Validate coupon
// @route   POST /api/coupons/validate
// @access  Private
exports.validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;

    if (!code || !orderAmount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide coupon code and order amount'
      });
    }

    // Find coupon
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code'
      });
    }

    // Check if coupon is active
    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This coupon is no longer active'
      });
    }

    // Check if coupon has started
    if (coupon.startDate > new Date()) {
      return res.status(400).json({
        success: false,
        message: 'This coupon is not yet active'
      });
    }

    // Check if coupon is expired
    if (coupon.expiryDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'This coupon has expired'
      });
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: 'This coupon has reached its usage limit'
      });
    }

    // Check if user can use this coupon
    if (!coupon.canUserUseCoupon(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: `You have already used this coupon ${coupon.usageLimitPerUser} time(s)`
      });
    }

    // Calculate discount
    const result = coupon.calculateDiscount(orderAmount);

    if (!result.isValid) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    res.json({
      success: true,
      message: 'Coupon is valid',
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discount: result.discount,
        originalAmount: orderAmount,
        finalAmount: result.finalAmount
      }
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Error validating coupon',
      error: error.message
    });
  }
};

// @desc    Get active coupons for users
// @route   GET /api/coupons/active
// @access  Private
exports.getActiveCoupons = async (req, res) => {
  try {
    const now = new Date();

    const coupons = await Coupon.find({
      isActive: true,
      startDate: { $lte: now },
      expiryDate: { $gte: now },
      $or: [
        { usageLimit: null },
        { $expr: { $lt: ['$usageCount', '$usageLimit'] } }
      ]
    })
      .select('code description discountType discountValue minimumOrderAmount maximumDiscount expiryDate')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      count: coupons.length,
      data: coupons
    });
  } catch (error) {
    console.error('Get active coupons error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching active coupons',
      error: error.message
    });
  }
};

// @desc    Get coupon usage statistics
// @route   GET /api/coupons/:id/stats
// @access  Private/Admin
exports.getCouponStats = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
      .populate('usedBy.user', 'name email');

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    // Calculate statistics
    const totalRevenue = coupon.usedBy.reduce((sum, usage) => sum + (usage.orderValue || 0), 0);
    const averageOrderValue = coupon.usageCount > 0 ? totalRevenue / coupon.usageCount : 0;

    const stats = {
      code: coupon.code,
      usageCount: coupon.usageCount,
      usageLimit: coupon.usageLimit,
      remainingUses: coupon.usageLimit ? coupon.usageLimit - coupon.usageCount : 'Unlimited',
      totalRevenue: totalRevenue,
      averageOrderValue: Math.round(averageOrderValue * 100) / 100,
      isActive: coupon.isActive,
      isExpired: coupon.isExpired,
      recentUsage: coupon.usedBy.slice(-10).reverse() // Last 10 uses
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get coupon stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching coupon statistics',
      error: error.message
    });
  }
};
