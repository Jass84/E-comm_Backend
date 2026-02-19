const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      couponCode
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items in order'
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required'
      });
    }

    // Validate each item and check stock
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.product} not found`
        });
      }

      if (!product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product ${product.title} is not available`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.title}. Only ${product.stock} available`
        });
      }

      orderItems.push({
        product: product._id,
        title: product.title,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0]?.url || '',
        seller: product.seller
      });
    }

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      couponCode
    });

    // If COD, set payment status to pending (will be marked completed on delivery)
    // If Online payment, order will remain with Pending status until payment is verified
    if (paymentMethod === 'COD') {
      order.paymentInfo.paymentStatus = 'Pending'; // Completed on delivery
    }

    // Only update stock and clear cart for COD orders
    // For online payments, this will happen after payment verification
    if (paymentMethod === 'COD') {
      // Update product stock and sales
      for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: {
            stock: -item.quantity,
            sales: item.quantity
          }
        });
      }

      // Clear user's cart
      await User.findByIdAndUpdate(req.user._id, { cart: [] });
    }

    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email phone')
      .populate('items.product', 'title images')
      .populate('items.seller', 'name storeName email');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: populatedOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { user: req.user._id };

    // Filter by status
    if (req.query.status) {
      query.orderStatus = req.query.status;
    }

    const orders = await Order.find(query)
      .populate('items.product', 'title images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'title images slug')
      .populate('items.seller', 'name storeName email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns the order or is admin/seller
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin' &&
      !order.items.some(item => item.seller._id.toString() === req.user._id.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns the order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Check if order can be cancelled
    if (order.orderStatus === 'Delivered' || order.orderStatus === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.orderStatus}`
      });
    }

    order.orderStatus = 'Cancelled';
    order.cancelledAt = Date.now();
    order.cancellationReason = reason || 'Cancelled by user';

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: item.quantity,
          sales: -item.quantity
        }
      });
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling order',
      error: error.message
    });
  }
};

// @desc    Update order status (Admin/Seller)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin/Seller
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, comment } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    if (req.user.role !== 'admin') {
      // Check if seller owns any items in this order
      const isSeller = order.items.some(
        item => item.seller.toString() === req.user._id.toString()
      );

      if (!isSeller) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this order'
        });
      }
    }

    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status'
      });
    }

    order.orderStatus = status;

    if (status === 'Delivered') {
      order.deliveredAt = Date.now();
      order.paymentInfo.paymentStatus = 'Completed';
    }

    order.orderStatusHistory.push({
      status,
      comment,
      updatedBy: req.user._id
    });

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('items.product', 'title')
      .populate('orderStatusHistory.updatedBy', 'name');

    res.json({
      success: true,
      message: 'Order status updated',
      data: updatedOrder
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {};

    // Filter by status
    if (req.query.status) {
      query.orderStatus = req.query.status;
    }

    // Filter by date range
    if (req.query.startDate || req.query.endDate) {
      query.createdAt = {};
      if (req.query.startDate) {
        query.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        query.createdAt.$lte = new Date(req.query.endDate);
      }
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.product', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

    // Calculate statistics
    const stats = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
          averageOrderValue: { $avg: '$totalPrice' }
        }
      }
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: stats[0] || { totalRevenue: 0, averageOrderValue: 0 }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// @desc    Get seller orders
// @route   GET /api/orders/seller/orders
// @access  Private/Seller
exports.getSellerOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Find orders containing seller's products
    const orders = await Order.find({
      'items.seller': req.user._id
    })
      .populate('user', 'name email phone')
      .populate('items.product', 'title images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({
      'items.seller': req.user._id
    });

    // Filter items to show only seller's items
    const filteredOrders = orders.map(order => {
      const sellerItems = order.items.filter(
        item => item.seller.toString() === req.user._id.toString()
      );
      return {
        ...order.toObject(),
        items: sellerItems
      };
    });

    res.json({
      success: true,
      data: filteredOrders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get seller orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching seller orders',
      error: error.message
    });
  }
};
