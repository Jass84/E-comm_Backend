const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    minlength: [3, 'Coupon code must be at least 3 characters'],
    maxlength: [20, 'Coupon code must not exceed 20 characters']
  },
  description: {
    type: String,
    trim: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: [true, 'Discount type is required']
  },
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: [0, 'Discount value cannot be negative']
  },
  minimumOrderAmount: {
    type: Number,
    default: 0,
    min: [0, 'Minimum order amount cannot be negative']
  },
  maximumDiscount: {
    type: Number,
    default: null,
    comment: 'Maximum discount for percentage coupons'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required']
  },
  usageLimit: {
    type: Number,
    default: null,
    min: [1, 'Usage limit must be at least 1'],
    comment: 'Total times this coupon can be used (null = unlimited)'
  },
  usageLimitPerUser: {
    type: Number,
    default: 1,
    min: [1, 'Usage limit per user must be at least 1']
  },
  usageCount: {
    type: Number,
    default: 0,
    min: [0, 'Usage count cannot be negative']
  },
  usedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    usedAt: {
      type: Date,
      default: Date.now
    },
    orderValue: Number
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for faster lookups (code index is automatic via unique: true)
couponSchema.index({ expiryDate: 1, isActive: 1 });

// Virtual for checking if coupon is expired
couponSchema.virtual('isExpired').get(function() {
  return this.expiryDate < new Date();
});

// Virtual for checking if coupon is valid
couponSchema.virtual('isValid').get(function() {
  if (!this.isActive) return false;
  if (this.isExpired) return false;
  if (this.startDate > new Date()) return false;
  if (this.usageLimit && this.usageCount >= this.usageLimit) return false;
  return true;
});

// Method to check if user can use this coupon
couponSchema.methods.canUserUseCoupon = function(userId) {
  const userUsageCount = this.usedBy.filter(
    usage => usage.user.toString() === userId.toString()
  ).length;
  return userUsageCount < this.usageLimitPerUser;
};

// Method to calculate discount
couponSchema.methods.calculateDiscount = function(orderAmount) {
  if (orderAmount < this.minimumOrderAmount) {
    return {
      isValid: false,
      message: `Minimum order amount of ₹${this.minimumOrderAmount} required`
    };
  }

  let discount = 0;
  
  if (this.discountType === 'percentage') {
    discount = (orderAmount * this.discountValue) / 100;
    
    // Apply maximum discount cap if set
    if (this.maximumDiscount && discount > this.maximumDiscount) {
      discount = this.maximumDiscount;
    }
  } else if (this.discountType === 'fixed') {
    discount = this.discountValue;
    
    // Discount cannot exceed order amount
    if (discount > orderAmount) {
      discount = orderAmount;
    }
  }

  return {
    isValid: true,
    discount: Math.round(discount * 100) / 100, // Round to 2 decimal places
    finalAmount: orderAmount - discount
  };
};

// Increment usage count
couponSchema.methods.incrementUsage = async function(userId, orderValue) {
  this.usageCount += 1;
  this.usedBy.push({
    user: userId,
    usedAt: new Date(),
    orderValue: orderValue
  });
  await this.save();
};

// Convert to uppercase before saving
couponSchema.pre('save', function(next) {
  if (this.code) {
    this.code = this.code.toUpperCase();
  }
  next();
});

// Ensure virtuals are included in JSON
couponSchema.set('toJSON', { virtuals: true });
couponSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Coupon', couponSchema);
