const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get user cart
// @route   GET /api/users/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'cart.product',
        select: 'title price images stock isActive seller',
        populate: {
          path: 'seller',
          select: 'name storeName'
        }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Filter out inactive products or products out of stock
    const activeCart = user.cart.filter(item => {
      if (!item.product || !item.product.isActive) return false;
      if (item.product.stock === 0) return false;
      return true;
    });

    // Update cart if items were removed
    if (activeCart.length !== user.cart.length) {
      user.cart = activeCart;
      await user.save();
    }

    // Calculate cart totals
    const itemsPrice = activeCart.reduce((acc, item) => {
      return acc + (item.product.price * item.quantity);
    }, 0);

    const shippingPrice = itemsPrice > 500 ? 0 : 50; // Free shipping above ₹500
    const taxPrice = itemsPrice * 0.18; // 18% GST
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    res.json({
      success: true,
      data: {
        cart: activeCart,
        summary: {
          itemsPrice: Math.round(itemsPrice),
          shippingPrice,
          taxPrice: Math.round(taxPrice),
          totalPrice: Math.round(totalPrice),
          itemCount: activeCart.reduce((acc, item) => acc + item.quantity, 0)
        }
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/users/cart
// @access  Private
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Check if product exists and has stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!product.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Product is not available'
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`
      });
    }

    const user = await User.findById(req.user._id);

    // Check if product already exists in cart
    const existingItemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = user.cart[existingItemIndex].quantity + quantity;
      
      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more items. Only ${product.stock} available in stock`
        });
      }

      user.cart[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item to cart
      user.cart.push({
        product: productId,
        quantity
      });
    }

    await user.save();

    // Populate cart for response
    const updatedUser = await User.findById(user._id)
      .populate({
        path: 'cart.product',
        select: 'title price images stock isActive'
      });

    res.json({
      success: true,
      message: 'Item added to cart',
      data: updatedUser.cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart',
      error: error.message
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/users/cart/:productId
// @access  Private
exports.updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    // Check product stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`
      });
    }

    const user = await User.findById(req.user._id);
    const cartItemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (cartItemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    user.cart[cartItemIndex].quantity = quantity;
    await user.save();

    // Populate cart for response
    const updatedUser = await User.findById(user._id)
      .populate({
        path: 'cart.product',
        select: 'title price images stock isActive'
      });

    res.json({
      success: true,
      message: 'Cart updated',
      data: updatedUser.cart
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating cart',
      error: error.message
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/users/cart/:productId
// @access  Private
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);
    
    const initialLength = user.cart.length;
    user.cart = user.cart.filter(
      item => item.product.toString() !== productId
    );

    if (user.cart.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    await user.save();

    res.json({
      success: true,
      message: 'Item removed from cart',
      data: user.cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message
    });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/users/cart
// @access  Private
exports.clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();

    res.json({
      success: true,
      message: 'Cart cleared',
      data: []
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
};
