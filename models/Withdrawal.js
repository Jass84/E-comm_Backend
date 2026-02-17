const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please provide withdrawal amount'],
    min: [100, 'Minimum withdrawal amount is ₹100']
  },
  processingFee: {
    type: Number,
    default: 0
  },
  taxDeduction: {
    type: Number,
    default: 0
  },
  netAmount: {
    type: Number, // Amount after fees and taxes
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'upi', 'paypal', 'razorpay_payout'],
    required: true,
    default: 'bank_transfer'
  },
  bankDetails: {
    accountNumber: {
      type: String,
      required: function() {
        return this.paymentMethod === 'bank_transfer';
      }
    },
    ifscCode: {
      type: String,
      required: function() {
        return this.paymentMethod === 'bank_transfer';
      }
    },
    accountHolderName: {
      type: String,
      required: function() {
        return this.paymentMethod === 'bank_transfer';
      }
    },
    bankName: {
      type: String
    }
  },
  upiDetails: {
    upiId: {
      type: String,
      required: function() {
        return this.paymentMethod === 'upi';
      }
    },
    upiName: {
      type: String
    }
  },
  paypalDetails: {
    email: {
      type: String,
      required: function() {
        return this.paymentMethod === 'paypal';
      }
    }
  },
  transactionId: {
    type: String
  },
  razorpayPayoutId: {
    type: String
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  autoApproved: {
    type: Boolean,
    default: false
  },
  adminNote: {
    type: String
  },
  rejectionReason: {
    type: String
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  processedAt: {
    type: Date
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  failureReason: {
    type: String
  },
  retryCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
withdrawalSchema.index({ seller: 1, status: 1 });
withdrawalSchema.index({ status: 1, requestedAt: -1 });

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
