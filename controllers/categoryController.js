const Category = require('../models/Category');
const Product = require('../models/Product');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('parent', 'name slug')
      .sort({ name: 1 });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
exports.getCategory = async (req, res) => {
  try {
    let category;

    // Check if param is MongoDB ObjectId or slug
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(req.params.id).populate('parent', 'name slug');
    } else {
      category = await Category.findOne({ slug: req.params.id }).populate('parent', 'name slug');
    }

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Get subcategories
    const subcategories = await Category.find({ parent: category._id, isActive: true });

    // Get product count
    const productCount = await Product.countDocuments({ category: category._id, isActive: true });

    res.json({
      success: true,
      data: {
        ...category.toObject(),
        subcategories,
        productCount
      }
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message
    });
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = async (req, res) => {
  try {
    const { name, description, parent, image } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ name: new RegExp(`^${name}$`, 'i') });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists'
      });
    }

    const category = await Category.create({
      name,
      description,
      parent: parent || null,
      image: image || undefined
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating category',
      error: error.message
    });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res) => {
  try {
    const { name, description, parent, image, isActive } = req.body;

    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if new name already exists (excluding current category)
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ 
        name: new RegExp(`^${name}$`, 'i'),
        _id: { $ne: req.params.id }
      });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Category name already exists'
        });
      }
    }

    // Update fields
    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (parent !== undefined) category.parent = parent || null;
    if (image) category.image = image;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating category',
      error: error.message
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category has products
    const productCount = await Product.countDocuments({ category: category._id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${productCount} products associated with it.`
      });
    }

    // Check if category has subcategories
    const subcategoryCount = await Category.countDocuments({ parent: category._id });
    if (subcategoryCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${subcategoryCount} subcategories.`
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting category',
      error: error.message
    });
  }
};

// @desc    Get category tree (hierarchical structure)
// @route   GET /api/categories/tree
// @access  Public
exports.getCategoryTree = async (req, res) => {
  try {
    // Get all parent categories
    const parentCategories = await Category.find({ parent: null, isActive: true }).sort({ name: 1 });

    // Build tree structure
    const tree = await Promise.all(
      parentCategories.map(async (parent) => {
        const subcategories = await Category.find({ parent: parent._id, isActive: true }).sort({ name: 1 });
        const productCount = await Product.countDocuments({ category: parent._id, isActive: true });
        
        return {
          ...parent.toObject(),
          subcategories: await Promise.all(
            subcategories.map(async (sub) => {
              const subProductCount = await Product.countDocuments({ category: sub._id, isActive: true });
              return {
                ...sub.toObject(),
                productCount: subProductCount
              };
            })
          ),
          productCount
        };
      })
    );

    res.json({
      success: true,
      data: tree
    });
  } catch (error) {
    console.error('Get category tree error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category tree',
      error: error.message
    });
  }
};
