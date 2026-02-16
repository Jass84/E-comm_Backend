const express = require('express');
const router = express.Router();
const { protect, authorize, checkSellerApproval } = require('../middleware/authMiddleware');
const Product = require('../models/Product');

// Get seller dashboard stats
router.get('/dashboard', protect, authorize('seller'), checkSellerApproval, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id });

    const stats = {
      totalProducts: products.length,
      activeProducts: products.filter(p => p.isActive).length,
      totalViews: products.reduce((acc, p) => acc + p.views, 0),
      totalSales: products.reduce((acc, p) => acc + p.sales, 0),
      averageRating: products.length > 0 
        ? (products.reduce((acc, p) => acc + p.rating, 0) / products.length).toFixed(1)
        : 0,
      lowStockProducts: products.filter(p => p.stock < 10 && p.stock > 0).length,
      outOfStock: products.filter(p => p.stock === 0).length
    };

    res.json({
      success: true,
      data: {
        seller: {
          name: req.user.name,
          storeName: req.user.storeName,
          email: req.user.email,
          approved: req.user.sellerApproved
        },
        stats
      }
    });
  } catch (error) {
    console.error('Seller dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
});

// Get seller's products
router.get('/products', protect, authorize('seller'), checkSellerApproval, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = { seller: req.user._id };

    // Filter by status
    if (req.query.status === 'active') {
      query.isActive = true;
    } else if (req.query.status === 'inactive') {
      query.isActive = false;
    }

    // Filter by stock
    if (req.query.stock === 'low') {
      query.stock = { $lt: 10, $gt: 0 };
    } else if (req.query.stock === 'out') {
      query.stock = 0;
    }

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get seller products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// Get single product details (seller's own product)
router.get('/products/:id', protect, authorize('seller'), checkSellerApproval, async (req, res) => {
  try {
    const product = await Product.findOne({ 
      _id: req.params.id, 
      seller: req.user._id 
    }).populate('category', 'name slug description');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
});

module.exports = router;
