const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Withdrawal = require('../models/Withdrawal');
const Coupon = require('../models/Coupon');

// @desc    Get comprehensive admin dashboard
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    // User statistics
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalSellers = await User.countDocuments({ role: 'seller' });
    const approvedSellers = await User.countDocuments({ role: 'seller', sellerApproved: true });
    const pendingSellers = await User.countDocuments({ role: 'seller', sellerApproved: false });
    
    // Product statistics
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const outOfStockProducts = await Product.countDocuments({ stock: 0 });
    
    // Order statistics
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
    const processingOrders = await Order.countDocuments({ orderStatus: 'processing' });
    const shippedOrders = await Order.countDocuments({ orderStatus: 'shipped' });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ orderStatus: 'cancelled' });

    // Today's orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todaysOrders = await Order.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    });

    const todaysRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: today, $lt: tomorrow },
          orderStatus: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' }
        }
      }
    ]);

    // Revenue statistics
    const completedOrders = await Order.find({ orderStatus: 'delivered' });
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    const totalCommission = completedOrders.reduce((sum, order) => sum + (order.adminCommission || 0), 0);

    // This month's revenue
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
          orderStatus: 'delivered'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' },
          commission: { $sum: '$adminCommission' }
        }
      }
    ]);

    // Last 7 days revenue chart
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayOrders = await Order.find({
        createdAt: { $gte: date, $lt: nextDate },
        orderStatus: { $ne: 'cancelled' }
      });

      const dayRevenue = dayOrders.reduce((sum, order) => sum + order.totalPrice, 0);
      const dayCommission = dayOrders.reduce((sum, order) => sum + (order.adminCommission || 0), 0);

      last7Days.push({
        date: date.toISOString().split('T')[0],
        revenue: dayRevenue,
        commission: dayCommission,
        orders: dayOrders.length
      });
    }

    // Withdrawal statistics
    const pendingWithdrawals = await Withdrawal.countDocuments({ status: 'pending' });
    const totalWithdrawalAmount = await Withdrawal.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Coupon statistics
    const totalCoupons = await Coupon.countDocuments();
    const activeCoupons = await Coupon.countDocuments({ isActive: true });

    // Recent orders (last 5)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .select('orderNumber totalPrice orderStatus createdAt');

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          sellers: totalSellers,
          approvedSellers,
          pendingSellers,
          growth: '+12%' // You can calculate actual growth
        },
        products: {
          total: totalProducts,
          active: activeProducts,
          outOfStock: outOfStockProducts
        },
        orders: {
          total: totalOrders,
          today: todaysOrders,
          pending: pendingOrders,
          processing: processingOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders,
          cancelled: cancelledOrders
        },
        revenue: {
          total: totalRevenue,
          today: todaysRevenue[0]?.total || 0,
          monthly: monthlyRevenue[0]?.total || 0,
          commission: {
            total: totalCommission,
            monthly: monthlyRevenue[0]?.commission || 0
          }
        },
        todayOrders: {
          count: todaysOrders,
          revenue: todaysRevenue[0]?.total || 0
        },
        withdrawals: {
          pending: pendingWithdrawals,
          totalPaid: totalWithdrawalAmount[0]?.total || 0
        },
        coupons: {
          total: totalCoupons,
          active: activeCoupons
        },
        charts: {
          last7Days
        },
        recentOrders
      }
    });
  } catch (error) {
    console.error('Get admin dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message
    });
  }
};

// @desc    Get all withdrawal requests
// @route   GET /api/admin/withdrawals
// @access  Private/Admin
exports.getAllWithdrawals = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    // Filter by status
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const withdrawals = await Withdrawal.find(filter)
      .populate('seller', 'name email storeName phone')
      .populate('processedBy', 'name email')
      .sort({ requestedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Withdrawal.countDocuments(filter);

    // Get summary stats
    const stats = {
      pending: await Withdrawal.countDocuments({ status: 'pending' }),
      approved: await Withdrawal.countDocuments({ status: 'approved' }),
      completed: await Withdrawal.countDocuments({ status: 'completed' }),
      rejected: await Withdrawal.countDocuments({ status: 'rejected' })
    };

    res.status(200).json({
      success: true,
      count: withdrawals.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      stats,
      data: withdrawals
    });
  } catch (error) {
    console.error('Get all withdrawals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch withdrawals',
      error: error.message
    });
  }
};

// @desc    Process withdrawal request (approve/reject)
// @route   PUT /api/admin/withdrawals/:id
// @access  Private/Admin
exports.processWithdrawal = async (req, res) => {
  try {
    const { status, adminNote, transactionId } = req.body;
    const withdrawalId = req.params.id;

    if (!['approved', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be approved, rejected, or completed'
      });
    }

    const withdrawal = await Withdrawal.findById(withdrawalId)
      .populate('seller', 'name email availableBalance');

    if (!withdrawal) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal request not found'
      });
    }

    if (withdrawal.status !== 'pending' && withdrawal.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: `Cannot process withdrawal with status: ${withdrawal.status}`
      });
    }

    const seller = await User.findById(withdrawal.seller._id);

    // Handle rejection
    if (status === 'rejected') {
      // Refund amount to seller's available balance
      seller.availableBalance += withdrawal.amount;
      await seller.save();

      withdrawal.status = 'rejected';
      withdrawal.adminNote = adminNote;
      withdrawal.processedBy = req.user._id;
      withdrawal.processedAt = Date.now();
      await withdrawal.save();

      return res.status(200).json({
        success: true,
        message: 'Withdrawal request rejected and amount refunded',
        data: withdrawal
      });
    }

    // Handle approval
    if (status === 'approved') {
      withdrawal.status = 'approved';
      withdrawal.adminNote = adminNote;
      withdrawal.processedBy = req.user._id;
      withdrawal.processedAt = Date.now();
      await withdrawal.save();

      return res.status(200).json({
        success: true,
        message: 'Withdrawal request approved. Mark as completed after transfer.',
        data: withdrawal
      });
    }

    // Handle completion
    if (status === 'completed') {
      if (!transactionId) {
        return res.status(400).json({
          success: false,
          message: 'Transaction ID is required for completion'
        });
      }

      withdrawal.status = 'completed';
      withdrawal.transactionId = transactionId;
      withdrawal.adminNote = adminNote;
      withdrawal.processedBy = req.user._id;
      withdrawal.processedAt = Date.now();
      await withdrawal.save();

      // Update seller's total withdrawn
      seller.totalWithdrawn += withdrawal.amount;
      await seller.save();

      return res.status(200).json({
        success: true,
        message: 'Withdrawal completed successfully',
        data: withdrawal
      });
    }
  } catch (error) {
    console.error('Process withdrawal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process withdrawal',
      error: error.message
    });
  }
};

// @desc    Get pending seller approvals
// @route   GET /api/admin/sellers/pending
// @access  Private/Admin
exports.getPendingSellers = async (req, res) => {
  try {
    const sellers = await User.find({
      role: 'seller',
      sellerApproved: false
    }).select('-password');

    res.status(200).json({
      success: true,
      count: sellers.length,
      data: sellers
    });
  } catch (error) {
    console.error('Get pending sellers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending sellers',
      error: error.message
    });
  }
};

// @desc    Approve/reject seller
// @route   PUT /api/admin/sellers/:id/approve
// @access  Private/Admin
exports.approveSeller = async (req, res) => {
  try {
    const { approved } = req.body;
    const sellerId = req.params.id;

    const seller = await User.findById(sellerId);

    if (!seller || seller.role !== 'seller') {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    seller.sellerApproved = approved;
    await seller.save();

    res.status(200).json({
      success: true,
      message: `Seller ${approved ? 'approved' : 'rejected'} successfully`,
      data: seller
    });
  } catch (error) {
    console.error('Approve seller error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process seller approval',
      error: error.message
    });
  }
};

// ============================================================
// USER MANAGEMENT
// ============================================================

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    // Filter by role
    if (req.query.role) {
      filter.role = req.query.role;
    }

    // Filter by seller approval status
    if (req.query.sellerApproved) {
      filter.sellerApproved = req.query.sellerApproved === 'true';
      filter.role = 'seller';
    }

    // Search by name or email
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    // Get role statistics
    const stats = {
      totalUsers: await User.countDocuments({ role: 'user' }),
      totalSellers: await User.countDocuments({ role: 'seller' }),
      totalAdmins: await User.countDocuments({ role: 'admin' }),
      approvedSellers: await User.countDocuments({ role: 'seller', sellerApproved: true }),
      pendingSellers: await User.countDocuments({ role: 'seller', sellerApproved: false })
    };

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      stats,
      data: users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// @desc    Get single user details
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('wishlist')
      .populate('cart.product');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's orders
    const orders = await Order.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get seller's products if seller
    let products = [];
    if (user.role === 'seller') {
      products = await Product.find({ seller: user._id })
        .sort({ createdAt: -1 })
        .limit(5);
    }

    res.status(200).json({
      success: true,
      data: {
        user,
        recentOrders: orders,
        recentProducts: products
      }
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user details',
      error: error.message
    });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, isActive, sellerApproved } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (typeof isActive !== 'undefined') user.isActive = isActive;
    if (typeof sellerApproved !== 'undefined' && user.role === 'seller') {
      user.sellerApproved = sellerApproved;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't allow deleting admin users
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete admin users'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

// ============================================================
// ORDER MANAGEMENT
// ============================================================

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    // Filter by status
    if (req.query.status) {
      filter.orderStatus = req.query.status;
    }

    // Filter by payment method
    if (req.query.paymentMethod) {
      filter.paymentMethod = req.query.paymentMethod;
    }

    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      filter.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }

    const orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .populate('items.product', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(filter);

    // Get order statistics
    const stats = {
      total: await Order.countDocuments(),
      pending: await Order.countDocuments({ orderStatus: 'pending' }),
      processing: await Order.countDocuments({ orderStatus: 'processing' }),
      shipped: await Order.countDocuments({ orderStatus: 'shipped' }),
      delivered: await Order.countDocuments({ orderStatus: 'delivered' }),
      cancelled: await Order.countDocuments({ orderStatus: 'cancelled' })
    };

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      stats,
      data: orders
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// @desc    Get single order details (Admin)
// @route   GET /api/admin/orders/:id
// @access  Private/Admin
exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'title price images')
      .populate('items.seller', 'name storeName email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order details',
      error: error.message
    });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
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

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status'
      });
    }

    order.orderStatus = status;

    if (status === 'delivered') {
      order.deliveredAt = Date.now();
      order.paymentInfo.paymentStatus = 'completed';

      // Update seller earnings (already implemented in orderController)
      const sellerEarnings = {};
      order.items.forEach(item => {
        const sellerId = item.seller.toString();
        const itemTotal = item.price * item.quantity;
        
        if (!sellerEarnings[sellerId]) {
          sellerEarnings[sellerId] = 0;
        }
        sellerEarnings[sellerId] += itemTotal;
      });

      for (const [sellerId, itemsTotal] of Object.entries(sellerEarnings)) {
        const sellerAmount = itemsTotal * 0.9;
        await User.findByIdAndUpdate(sellerId, {
          $inc: {
            totalEarnings: sellerAmount,
            availableBalance: sellerAmount
          }
        });
      }
    }

    if (comment) {
      order.orderStatusHistory.push({
        status,
        comment,
        updatedBy: req.user._id
      });
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('items.product', 'title');

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};

// ============================================================
// PRODUCT MANAGEMENT
// ============================================================

// @desc    Get all products (Admin)
// @route   GET /api/admin/products
// @access  Private/Admin
exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    // Filter by status
    if (req.query.isActive) {
      filter.isActive = req.query.isActive === 'true';
    }

    // Filter by stock
    if (req.query.stock === 'out') {
      filter.stock = 0;
    } else if (req.query.stock === 'low') {
      filter.stock = { $gt: 0, $lt: 10 };
    }

    // Search by title
    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: 'i' };
    }

    // Filter by seller
    if (req.query.seller) {
      filter.seller = req.query.seller;
    }

    const products = await Product.find(filter)
      .populate('seller', 'name storeName email')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(filter);

    // Get product statistics
    const stats = {
      total: await Product.countDocuments(),
      active: await Product.countDocuments({ isActive: true }),
      inactive: await Product.countDocuments({ isActive: false }),
      outOfStock: await Product.countDocuments({ stock: 0 }),
      lowStock: await Product.countDocuments({ stock: { $gt: 0, $lt: 10 } })
    };

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      stats,
      data: products
    });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

// @desc    Update product (Admin can update any product)
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update product fields
    const allowedUpdates = ['title', 'description', 'price', 'stock', 'isActive', 'category'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
};

// ============================================================
// ANALYTICS & REPORTS
// ============================================================

// @desc    Get revenue analytics
// @route   GET /api/admin/analytics/revenue
// @access  Private/Admin
exports.getRevenueAnalytics = async (req, res) => {
  try {
    const { period = 'week' } = req.query; // week, month, year

    const today = new Date();
    let startDate;
    let groupBy;

    if (period === 'week') {
      startDate = new Date(today.setDate(today.getDate() - 7));
      groupBy = { $dayOfYear: '$createdAt' };
    } else if (period === 'month') {
      startDate = new Date(today.setDate(today.getDate() - 30));
      groupBy = { $dayOfMonth: '$createdAt' };
    } else if (period === 'year') {
      startDate = new Date(today.setMonth(today.getMonth() - 12));
      groupBy = { $month: '$createdAt' };
    }

    const revenueData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          orderStatus: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: groupBy,
          totalRevenue: { $sum: '$totalPrice' },
          totalCommission: { $sum: '$adminCommission' },
          orderCount: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Calculate totals
    const totals = {
      revenue: revenueData.reduce((sum, item) => sum + item.totalRevenue, 0),
      commission: revenueData.reduce((sum, item) => sum + item.totalCommission, 0),
      orders: revenueData.reduce((sum, item) => sum + item.orderCount, 0)
    };

    res.status(200).json({
      success: true,
      period,
      data: revenueData,
      totals
    });
  } catch (error) {
    console.error('Get revenue analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch revenue analytics',
      error: error.message
    });
  }
};

// @desc    Get top selling products
// @route   GET /api/admin/analytics/top-products
// @access  Private/Admin
exports.getTopProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' }
    ]);

    res.status(200).json({
      success: true,
      count: topProducts.length,
      data: topProducts
    });
  } catch (error) {
    console.error('Get top products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top products',
      error: error.message
    });
  }
};

// @desc    Get top sellers
// @route   GET /api/admin/analytics/top-sellers
// @access  Private/Admin
exports.getTopSellers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const topSellers = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.seller',
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          totalOrders: { $sum: 1 },
          totalProducts: { $sum: '$items.quantity' }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'seller'
        }
      },
      { $unwind: '$seller' },
      {
        $project: {
          'seller.password': 0,
          'seller.resetPasswordToken': 0,
          'seller.resetPasswordExpire': 0
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: topSellers.length,
      data: topSellers
    });
  } catch (error) {
    console.error('Get top sellers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top sellers',
      error: error.message
    });
  }
};

