const express = require('express');
const router = express.Router();
const { protect, authorize, checkSellerApproval } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  addReview,
  getSellerStats
} = require('../controllers/productController');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes
router.post('/:id/reviews', protect, addReview);

//create-product
router.post("/", protect, authorize('seller', 'admin'), checkSellerApproval, upload.array('images', 5), createProduct);
// Seller routes
router.get('/seller/stats', protect, authorize('seller'), checkSellerApproval, getSellerStats);
router.post('/', protect, authorize('seller', 'admin'), checkSellerApproval, upload.array('images', 5), createProduct);
router.put('/:id', protect, authorize('seller', 'admin'), upload.array('images', 5), updateProduct);
router.delete('/:id', protect, authorize('seller', 'admin'), deleteProduct);
router.delete('/:id/images/:imageId', protect, authorize('seller', 'admin'), deleteProductImage);

module.exports = router;
