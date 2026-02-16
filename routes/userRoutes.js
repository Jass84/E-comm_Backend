const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');
const {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} = require('../controllers/addressController');

// Profile routes
router.get('/profile', protect, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        storeName: user.storeName,
        storeDescription: user.storeDescription,
        sellerApproved: user.sellerApproved
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
});

router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    const user = req.user;

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
});

// Cart routes
router.get('/cart', protect, getCart);
router.post('/cart', protect, addToCart);
router.put('/cart/:productId', protect, updateCartItem);
router.delete('/cart/:productId', protect, removeFromCart);
router.delete('/cart', protect, clearCart);

// Address routes
router.get('/addresses', protect, getAddresses);
router.post('/addresses', protect, addAddress);
router.put('/addresses/:addressId', protect, updateAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);
router.put('/addresses/:addressId/default', protect, setDefaultAddress);

// Wishlist routes (for future)
router.get('/wishlist', protect, (req, res) => {
  res.json({ message: 'Wishlist - To be implemented' });
});

module.exports = router;
