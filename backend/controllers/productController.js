const Product = require('../models/Product');
const { deleteImage } = require('../config/cloudinary');

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query
    let query = { isActive: true };

    // Category filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Seller filter
    if (req.query.seller) {
      query.seller = req.query.seller;
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }

    // Brand filter
    if (req.query.brand) {
      query.brand = new RegExp(req.query.brand, 'i');
    }

    // Tag filter
    if (req.query.tag) {
      query.tags = req.query.tag;
    }

    // Featured filter
    if (req.query.featured === 'true') {
      query.isFeatured = true;
    }

    // Search query
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Sort options
    let sortOption = {};
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price_asc':
          sortOption = { price: 1 };
          break;
        case 'price_desc':
          sortOption = { price: -1 };
          break;
        case 'rating':
          sortOption = { rating: -1 };
          break;
        case 'newest':
          sortOption = { createdAt: -1 };
          break;
        case 'popular':
          sortOption = { sales: -1, views: -1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
    } else {
      sortOption = { createdAt: -1 };
    }

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .populate('seller', 'name storeName')
      .sort(sortOption)
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
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// @desc    Get single product by ID or slug
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    let product;

    // Check if param is MongoDB ObjectId or slug
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(req.params.id)
        .populate('category', 'name slug description')
        .populate('seller', 'name storeName email')
        .populate('reviews.user', 'name avatar');
    } else {
      product = await Product.findOne({ slug: req.params.id })
        .populate('category', 'name slug description')
        .populate('seller', 'name storeName email')
        .populate('reviews.user', 'name avatar');
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Increment views
    product.views += 1;
    await product.save();

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
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Seller
exports.createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      comparePrice,
      category,
      brand,
      stock,
      sku,
      tags,
      specifications
    } = req.body;

    // Handle image uploads
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => ({
        url: file.path,
        public_id: file.filename
      }));
    }

    const product = await Product.create({
      title,
      description,
      price,
      comparePrice,
      category,
      brand,
      stock,
      sku,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
      specifications: specifications || [],
      images,
      seller: req.user._id
    });

    const populatedProduct = await Product.findById(product._id)
      .populate('category', 'name slug')
      .populate('seller', 'name storeName');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: populatedProduct
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Seller
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user is the product owner or admin
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }

    const {
      title,
      description,
      price,
      comparePrice,
      category,
      brand,
      stock,
      sku,
      tags,
      specifications,
      isActive,
      isFeatured
    } = req.body;

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: file.path,
        public_id: file.filename
      }));
      product.images = [...product.images, ...newImages];
    }

    // Update fields
    if (title) product.title = title;
    if (description) product.description = description;
    if (price !== undefined) product.price = price;
    if (comparePrice !== undefined) product.comparePrice = comparePrice;
    if (category) product.category = category;
    if (brand) product.brand = brand;
    if (stock !== undefined) product.stock = stock;
    if (sku) product.sku = sku;
    if (tags) product.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
    if (specifications) product.specifications = specifications;
    if (isActive !== undefined && req.user.role === 'admin') product.isActive = isActive;
    if (isFeatured !== undefined && req.user.role === 'admin') product.isFeatured = isFeatured;

    await product.save();

    const updatedProduct = await Product.findById(product._id)
      .populate('category', 'name slug')
      .populate('seller', 'name storeName');

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

// @desc    Delete product image
// @route   DELETE /api/products/:id/images/:imageId
// @access  Private/Seller
exports.deleteProductImage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check authorization
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this image'
      });
    }

    const imageIndex = product.images.findIndex(
      img => img._id.toString() === req.params.imageId
    );

    if (imageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    // Delete from cloudinary
    await deleteImage(product.images[imageIndex].public_id);

    // Remove from product
    product.images.splice(imageIndex, 1);
    await product.save();

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting image',
      error: error.message
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Seller
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check authorization
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }

    // Delete all images from cloudinary
    for (const image of product.images) {
      await deleteImage(image.public_id);
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.addReview = async (req, res) => {
  try {
    const { rating, comment, images } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'Product already reviewed'
      });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
      images: images || []
    };

    product.reviews.push(review);
    product.calculateRating();

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully'
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(400).json({
      success: false,
      message: 'Error adding review',
      error: error.message
    });
  }
};

// @desc    Get product stats (for seller dashboard)
// @route   GET /api/products/seller/stats
// @access  Private/Seller
exports.getSellerStats = async (req, res) => {
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
      data: stats
    });
  } catch (error) {
    console.error('Get seller stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching seller stats',
      error: error.message
    });
  }
};
