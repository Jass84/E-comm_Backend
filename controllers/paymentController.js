const razorpayInstance = require('../config/razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
// @access  Private
exports.createRazorpayOrder = async (req, res) => {
  try {
    // Check if Razorpay is configured
    if (!razorpayInstance) {
      return res.status(503).json({
        success: false,
        message: 'Payment service not configured. Please contact administrator.'
      });
    }

    const { amount, orderId } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'Amount and order ID are required'
      });
    }

    // Verify order belongs to user
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Convert to paise (smallest currency unit)
      currency: 'INR',
      receipt: `receipt_${orderId}`,
      notes: {
        orderId: orderId,
        userId: req.user._id.toString()
      }
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    res.json({
      success: true,
      data: {
        id: razorpayOrder.id,
        currency: razorpayOrder.currency,
        amount: razorpayOrder.amount,
        orderId: orderId
      }
    });
  } catch (error) {
    console.error('Create Razorpay order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating Razorpay order',
      error: error.message
    });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payment/verify
// @access  Private
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification details'
      });
    }

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      // Payment verification failed
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Verify order exists and belongs to user
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Update order with payment information
    order.paymentInfo.transactionId = razorpay_payment_id;
    order.paymentInfo.paymentStatus = 'Completed';
    order.paymentInfo.paidAt = Date.now();
    order.paymentMethod = 'Online';
    order.orderStatus = 'Processing';

    await order.save();

    // Update product stock and sales after successful payment
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: -item.quantity,
          sales: item.quantity
        }
      });
    }

    // Clear user's cart after successful payment
    await User.findByIdAndUpdate(order.user, { cart: [] });

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        orderId: order._id,
        transactionId: razorpay_payment_id,
        paymentStatus: order.paymentInfo.paymentStatus
      }
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.message
    });
  }
};

// @desc    Get Razorpay key
// @route   GET /api/payment/razorpay-key
// @access  Private
exports.getRazorpayKey = (req, res) => {
  if (!razorpayInstance || !process.env.RAZORPAY_KEY_ID) {
    return res.status(503).json({
      success: false,
      message: 'Payment service not configured'
    });
  }

  res.json({
    success: true,
    key: process.env.RAZORPAY_KEY_ID
  });
};

// @desc    Handle payment failure
// @route   POST /api/payment/payment-failed
// @access  Private
exports.paymentFailed = async (req, res) => {
  try {
    const { orderId, error } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Update order payment status
    order.paymentInfo.paymentStatus = 'Failed';
    order.notes = `Payment failed: ${error?.description || 'Unknown error'}`;

    await order.save();

    res.json({
      success: true,
      message: 'Payment failure recorded'
    });
  } catch (error) {
    console.error('Payment failed handler error:', error);
    res.status(500).json({
      success: false,
      message: 'Error recording payment failure',
      error: error.message
    });
  }
};

// @desc    Fetch payment details
// @route   GET /api/payment/payment-details/:paymentId
// @access  Private
exports.getPaymentDetails = async (req, res) => {
  try {
    // Check if Razorpay is configured
    if (!razorpayInstance) {
      return res.status(503).json({
        success: false,
        message: 'Payment service not configured. Please contact administrator.'
      });
    }

    const { paymentId } = req.params;

    const payment = await razorpayInstance.payments.fetch(paymentId);

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Fetch payment details error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment details',
      error: error.message
    });
  }
};

// @desc    Initiate refund
// @route   POST /api/payment/refund
// @access  Private/Admin
exports.initiateRefund = async (req, res) => {
  try {
    // Check if Razorpay is configured
    if (!razorpayInstance) {
      return res.status(503).json({
        success: false,
        message: 'Payment service not configured. Please contact administrator.'
      });
    }

    const { paymentId, amount, orderId } = req.body;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment ID is required'
      });
    }

    // Verify order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Create refund
    const refund = await razorpayInstance.payments.refund(paymentId, {
      amount: amount ? Math.round(amount * 100) : undefined, // Partial refund if amount specified
      speed: 'normal',
      notes: {
        orderId: orderId,
        reason: req.body.reason || 'Refund initiated by admin'
      }
    });

    // Update order status
    order.paymentInfo.paymentStatus = 'Refunded';
    order.orderStatus = 'Refunded';
    await order.save();

    res.json({
      success: true,
      message: 'Refund initiated successfully',
      data: refund
    });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Error initiating refund',
      error: error.message
    });
  }
};

// @desc    Webhook handler for Razorpay events
// @route   POST /api/payment/webhook
// @access  Public (but secured with Razorpay signature)
exports.webhookHandler = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const body = JSON.stringify(req.body);

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook signature'
      });
    }

    const event = req.body.event;
    const payload = req.body.payload;

    // Handle different webhook events
    switch (event) {
      case 'payment.captured':
        // Payment successful
        console.log('Payment captured:', payload.payment.entity.id);
        break;

      case 'payment.failed':
        // Payment failed
        console.log('Payment failed:', payload.payment.entity.id);
        break;

      case 'refund.created':
        // Refund created
        console.log('Refund created:', payload.refund.entity.id);
        break;

      default:
        console.log('Unhandled webhook event:', event);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing error'
    });
  }
};
