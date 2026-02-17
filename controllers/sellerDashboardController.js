const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Withdrawal = require('../models/Withdrawal');

// @desc    Get seller dashboard stats
// @route   GET /api/seller/dashboard
// @access  Private/Seller
exports.getDashboardStats = async (req, res) => {
  try {
    const sellerId = req.user._id;

    // Get total products
    const totalProducts = await Product.countDocuments({ seller: sellerId });

    // Get active products
    const activeProducts = await Product.countDocuments({ 
      seller: sellerId, 
      stock: { $gt: 0 } 
    });

    // Get total orders containing seller's products
    const orders = await Order.find({
      'items.seller': sellerId,
      orderStatus: { $ne: 'cancelled' }
    });

    const totalOrders = orders.length;

    // Calculate pending orders
    const pendingOrders = await Order.countDocuments({
      'items.seller': sellerId,
      orderStatus: 'pending'
    });

    // Get seller info for earnings
    const seller = await User.findById(sellerId);

    // Get recent orders (last 5)
    const recentOrders = await Order.find({
      'items.seller': sellerId
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .select('orderNumber orderStatus totalPrice createdAt items');

    // Format recent orders to show only seller's items
    const formattedRecentOrders = recentOrders.map(order => {
      const sellerItems = order.items.filter(item => 
        item.seller.toString() === sellerId.toString()
      );
      const sellerTotal = sellerItems.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );
      
      return {
        _id: order._id,
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
        itemsCount: sellerItems.length,
        totalAmount: sellerTotal,
        createdAt: order.createdAt,
        customer: order.user
      };
    });

    res.status(200).json({
      success: true,
      data: {
        products: {
          total: totalProducts,
          active: activeProducts,
          outOfStock: totalProducts - activeProducts
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          completed: orders.filter(o => o.orderStatus === 'delivered').length
        },
        earnings: {
          total: seller.totalEarnings,
          available: seller.availableBalance,
          pending: seller.pendingBalance,
          withdrawn: seller.totalWithdrawn
        },
        recentOrders: formattedRecentOrders
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message
    });
  }
};

// @desc    Get seller profile/store
// @route   GET /api/seller/profile
// @access  Private/Seller
exports.getSellerProfile = async (req, res) => {
  try {
    const seller = await User.findById(req.user._id)
      .select('-password')
      .populate('wishlist');

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    res.status(200).json({
      success: true,
      data: seller
    });
  } catch (error) {
    console.error('Get seller profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch seller profile',
      error: error.message
    });
  }
};

// @desc    Update seller profile/store
// @route   PUT /api/seller/profile
// @access  Private/Seller
exports.updateSellerProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      storeName,
      storeDescription,
      bankDetails,
      gstNumber,
      avatar
    } = req.body;

    const seller = await User.findById(req.user._id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    // Update fields
    if (name) seller.name = name;
    if (phone) seller.phone = phone;
    if (storeName) seller.storeName = storeName;
    if (storeDescription) seller.storeDescription = storeDescription;
    if (gstNumber) seller.gstNumber = gstNumber;
    if (avatar) seller.avatar = avatar;
    
    if (bankDetails) {
      seller.bankDetails = {
        ...seller.bankDetails,
        ...bankDetails
      };
    }

    await seller.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: seller
    });
  } catch (error) {
    console.error('Update seller profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

// @desc    Get seller's products
// @route   GET /api/seller/products
// @access  Private/Seller
exports.getSellerProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { seller: req.user._id };

    // Add search filter
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Add stock filter
    if (req.query.stock === 'in') {
      filter.stock = { $gt: 0 };
    } else if (req.query.stock === 'out') {
      filter.stock = 0;
    }

    const products = await Product.find(filter)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: products
    });
  } catch (error) {
    console.error('Get seller products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

// @desc    Get seller's orders
// @route   GET /api/seller/orders
// @access  Private/Seller
exports.getSellerOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sellerId = req.user._id;
    const filter = {
      'items.seller': sellerId
    };

    // Add status filter
    if (req.query.status) {
      filter.orderStatus = req.query.status;
    }

    const orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Format orders to show only seller's items
    const formattedOrders = orders.map(order => {
      const sellerItems = order.items.filter(item => 
        item.seller.toString() === sellerId.toString()
      );
      
      const sellerTotal = sellerItems.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );

      const sellerAmount = order.sellerAmount || (sellerTotal * 0.9); // 90% after commission

      return {
        _id: order._id,
        orderNumber: order.orderNumber,
        customer: order.user,
        items: sellerItems,
        itemsCount: sellerItems.length,
        subtotal: sellerTotal,
        earnings: sellerAmount,
        orderStatus: order.orderStatus,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        shippingAddress: order.shippingAddress,
        createdAt: order.createdAt,
        deliveredAt: order.deliveredAt
      };
    });

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: formattedOrders.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: formattedOrders
    });
  } catch (error) {
    console.error('Get seller orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// @desc    Get earnings summary
// @route   GET /api/seller/earnings
// @access  Private/Seller
exports.getEarnings = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const seller = await User.findById(sellerId);

    // Get all orders with seller's products
    const orders = await Order.find({
      'items.seller': sellerId,
      orderStatus: { $ne: 'cancelled' }
    });

    // Calculate earnings by status
    let totalEarnings = 0;
    let pendingEarnings = 0;
    let completedEarnings = 0;

    orders.forEach(order => {
      const sellerItems = order.items.filter(item => 
        item.seller.toString() === sellerId.toString()
      );
      
      const itemsTotal = sellerItems.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );

      const earnings = itemsTotal * 0.9; // 90% after 10% commission

      totalEarnings += earnings;

      if (order.orderStatus === 'delivered') {
        completedEarnings += earnings;
      } else {
        pendingEarnings += earnings;
      }
    });

    // Get monthly earnings (current month)
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const monthlyOrders = await Order.find({
      'items.seller': sellerId,
      orderStatus: 'delivered',
      deliveredAt: { $gte: startOfMonth }
    });

    const monthlyEarnings = monthlyOrders.reduce((sum, order) => {
      const sellerItems = order.items.filter(item => 
        item.seller.toString() === sellerId.toString()
      );
      const itemsTotal = sellerItems.reduce((itemSum, item) => 
        itemSum + (item.price * item.quantity), 0
      );
      return sum + (itemsTotal * 0.9);
    }, 0);

    // Get earnings chart data (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayOrders = await Order.find({
        'items.seller': sellerId,
        orderStatus: 'delivered',
        deliveredAt: {
          $gte: date,
          $lt: nextDate
        }
      });

      const dayEarnings = dayOrders.reduce((sum, order) => {
        const sellerItems = order.items.filter(item => 
          item.seller.toString() === sellerId.toString()
        );
        const itemsTotal = sellerItems.reduce((itemSum, item) => 
          itemSum + (item.price * item.quantity), 0
        );
        return sum + (itemsTotal * 0.9);
      }, 0);

      last7Days.push({
        date: date.toISOString().split('T')[0],
        earnings: dayEarnings
      });
    }

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalEarnings: seller.totalEarnings,
          availableBalance: seller.availableBalance,
          pendingBalance: seller.pendingBalance,
          totalWithdrawn: seller.totalWithdrawn,
          monthlyEarnings
        },
        calculated: {
          totalEarnings,
          pendingEarnings,
          completedEarnings
        },
        chart: last7Days
      }
    });
  } catch (error) {
    console.error('Get earnings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch earnings',
      error: error.message
    });
  }
};

// @desc    Request withdrawal
// @route   POST /api/seller/withdrawals
// @access  Private/Seller
exports.requestWithdrawal = async (req, res) => {
  try {
    const { amount } = req.body;
    const sellerId = req.user._id;

    // Validate amount
    if (!amount || amount < 100) {
      return res.status(400).json({
        success: false,
        message: 'Minimum withdrawal amount is ₹100'
      });
    }

    const seller = await User.findById(sellerId);

    // Check available balance
    if (amount > seller.availableBalance) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. Available: ₹${seller.availableBalance}`
      });
    }

    // Check if bank details exist
    if (!seller.bankDetails || !seller.bankDetails.accountNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please add bank details to your profile before requesting withdrawal'
      });
    }

    // Check for pending withdrawals
    const pendingWithdrawal = await Withdrawal.findOne({
      seller: sellerId,
      status: 'pending'
    });

    if (pendingWithdrawal) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending withdrawal request'
      });
    }

    // Create withdrawal request
    const withdrawal = await Withdrawal.create({
      seller: sellerId,
      amount,
      bankDetails: seller.bankDetails
    });

    // Update seller balance
    seller.availableBalance -= amount;
    await seller.save();

    res.status(201).json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      data: withdrawal
    });
  } catch (error) {
    console.error('Request withdrawal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit withdrawal request',
      error: error.message
    });
  }
};

// @desc    Get withdrawal history
// @route   GET /api/seller/withdrawals
// @access  Private/Seller
exports.getWithdrawals = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { seller: req.user._id };

    // Add status filter
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const withdrawals = await Withdrawal.find(filter)
      .sort({ requestedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('processedBy', 'name email');

    const total = await Withdrawal.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: withdrawals.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: withdrawals
    });
  } catch (error) {
    console.error('Get withdrawals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch withdrawals',
      error: error.message
    });
  }
};

// @desc    Update order status (seller can mark as shipped)
// @route   PUT /api/seller/orders/:id/status
// @access  Private/Seller
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;
    const sellerId = req.user._id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order contains seller's products
    const hasSellerProducts = order.items.some(item => 
      item.seller.toString() === sellerId.toString()
    );

    if (!hasSellerProducts) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this order'
      });
    }

    // Seller can only update to 'shipped' or 'cancelled'
    const allowedStatuses = ['shipped', 'cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Seller can only mark order as shipped or cancelled'
      });
    }

    order.orderStatus = status;
    if (status === 'shipped') {
      order.shippedAt = Date.now();
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order marked as ${status}`,
      data: order
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
