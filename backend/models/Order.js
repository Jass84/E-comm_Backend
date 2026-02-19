const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  image: {
    type: String,
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  items: [orderItemSchema],
  shippingAddress: {
    fullName: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    addressLine1: {
      type: String,
      required: true
    },
    addressLine2: String,
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: 'India'
    }
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'Online', 'Card', 'UPI', 'Wallet'],
    default: 'COD'
  },
  paymentInfo: {
    transactionId: String,
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
      default: 'Pending'
    },
    paidAt: Date
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  discountAmount: {
    type: Number,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  couponCode: {
    type: String
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refund Initiated', 'Refunded'],
    default: 'Pending'
  },
  orderStatusHistory: [{
    status: {
      type: String,
      required: true
    },
    comment: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  deliveredAt: Date,
  cancelledAt: Date,
  cancellationReason: String,
  notes: String
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    this.orderNumber = `ORD${timestamp}${random}`;
  }
  next();
});

// Add status to history when order status changes
orderSchema.pre('save', function(next) {
  if (this.isModified('orderStatus')) {
    this.orderStatusHistory.push({
      status: this.orderStatus,
      timestamp: new Date()
    });
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
