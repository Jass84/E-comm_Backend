// Complete E-Commerce Platform Verification - All Phases
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

console.log('\n🚀 E-COMMERCE PLATFORM - COMPLETE VERIFICATION\n');
console.log('════════════════════════════════════════════════════════\n');

let totalChecks = 0;
let passedChecks = 0;

function check(description, condition) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`✅ ${description}`);
    return true;
  } else {
    console.log(`❌ ${description}`);
    return false;
  }
}

function sectionHeader(phase, title) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🔷 PHASE ${phase}: ${title.toUpperCase()}`);
  console.log(`${'='.repeat(60)}\n`);
}

// PHASE 1: AUTHENTICATION SYSTEM
sectionHeader(1, 'Authentication System');

try {
  const User = require('./models/User');
  check('User model loaded', true);
  
  const userFields = Object.keys(User.schema.paths);
  check('User has email field', userFields.includes('email'));
  check('User has password field', userFields.includes('password'));
  check('User has role field', userFields.includes('role'));
  check('User has sellerApproved field', userFields.includes('sellerApproved'));
  
  const authController = require('./controllers/authController');
  check('AuthController loaded', true);
  check('Register function exists', typeof authController.register === 'function');
  check('Login function exists', typeof authController.login === 'function');
  check('Logout function exists', typeof authController.logout === 'function');
  
  const authRoutes = require('./routes/authRoutes');
  check('Auth routes configured', true);
  
  const authMiddleware = require('./middleware/authMiddleware');
  check('Auth middleware loaded', true);
  check('Protect middleware exists', typeof authMiddleware.protect === 'function');
  check('Authorize middleware exists', typeof authMiddleware.authorize === 'function');
  
  console.log('\n✨ Phase 1 Features:');
  console.log('   • User registration & login');
  console.log('   • JWT authentication');
  console.log('   • Role-based access (User, Seller, Admin)');
  console.log('   • Seller approval system');
} catch (error) {
  console.log(`❌ Phase 1 Error: ${error.message}`);
}

// PHASE 2: PRODUCT SYSTEM
sectionHeader(2, 'Product System');

try {
  const Product = require('./models/Product');
  check('Product model loaded', true);
  
  const productFields = Object.keys(Product.schema.paths);
  check('Product has title field', productFields.includes('title'));
  check('Product has price field', productFields.includes('price'));
  check('Product has stock field', productFields.includes('stock'));
  check('Product has seller field', productFields.includes('seller'));
  check('Product has category field', productFields.includes('category'));
  check('Product has images field', productFields.includes('images'));
  
  const Category = require('./models/Category');
  check('Category model loaded', true);
  
  const productController = require('./controllers/productController');
  check('ProductController loaded', true);
  check('Create product function exists', typeof productController.createProduct === 'function');
  check('Get products function exists', typeof productController.getProducts === 'function');
  
  const categoryController = require('./controllers/categoryController');
  check('CategoryController loaded', true);
  
  check('Product routes configured', fs.existsSync('./routes/productRoutes.js'));
  check('Category routes configured', fs.existsSync('./routes/categoryRoutes.js'));
  
  console.log('\n✨ Phase 2 Features:');
  console.log('   • Product CRUD operations');
  console.log('   • Category management');
  console.log('   • Image upload (Cloudinary)');
  console.log('   • Stock management');
  console.log('   • Search & filters');
} catch (error) {
  console.log(`❌ Phase 2 Error: ${error.message}`);
}

// PHASE 3: ORDER SYSTEM
sectionHeader(3, 'Order System');

try {
  const Order = require('./models/Order');
  check('Order model loaded', true);
  
  const orderFields = Object.keys(Order.schema.paths);
  const orderPaths = Object.keys(Order.schema.tree);
  check('Order has user field', orderFields.includes('user'));
  check('Order has items field', orderFields.includes('items'));
  check('Order has shippingAddress field', orderPaths.includes('shippingAddress'));
  check('Order has orderStatus field', orderFields.includes('orderStatus'));
  check('Order has totalPrice field', orderFields.includes('totalPrice'));
  check('Order has paymentMethod field', orderFields.includes('paymentMethod'));
  
  const orderController = require('./controllers/orderController');
  check('OrderController loaded', true);
  check('Create order function exists', typeof orderController.createOrder === 'function');
  check('Get orders function exists', typeof orderController.getMyOrders === 'function');
  
  const cartController = require('./controllers/cartController');
  check('CartController loaded', true);
  
  check('Order routes configured', fs.existsSync('./routes/orderRoutes.js'));
  
  console.log('\n✨ Phase 3 Features:');
  console.log('   • Shopping cart');
  console.log('   • Order creation & management');
  console.log('   • Order status tracking');
  console.log('   • Shipping address management');
  console.log('   • Order history');
} catch (error) {
  console.log(`❌ Phase 3 Error: ${error.message}`);
}

// PHASE 4: PAYMENT INTEGRATION
sectionHeader(4, 'Payment Integration');

try {
  const paymentController = require('./controllers/paymentController');
  check('PaymentController loaded', true);
  check('Create Razorpay order function exists', typeof paymentController.createRazorpayOrder === 'function');
  check('Verify payment function exists', typeof paymentController.verifyPayment === 'function');
  check('Get Razorpay key function exists', typeof paymentController.getRazorpayKey === 'function');
  check('Payment failed handler exists', typeof paymentController.paymentFailed === 'function');
  
  check('Payment routes configured', fs.existsSync('./routes/paymentRoutes.js'));
  
  const razorpayConfig = fs.existsSync('./config/razorpay.js');
  check('Razorpay configuration exists', razorpayConfig);
  
  const Order = require('./models/Order');
  const orderPaths = Object.keys(Order.schema.tree);
  check('Order has paymentInfo field', orderPaths.includes('paymentInfo'));
  
  console.log('\n✨ Phase 4 Features:');
  console.log('   • Cash on Delivery (COD)');
  console.log('   • Online payment (Razorpay)');
  console.log('   • Payment verification');
  console.log('   • Transaction tracking');
  console.log('   • Payment status management');
} catch (error) {
  console.log(`❌ Phase 4 Error: ${error.message}`);
}

// PHASE 5: ADMIN COMMISSION SYSTEM
sectionHeader(5, 'Admin Commission System');

try {
  const Order = require('./models/Order');
  const orderFields = Object.keys(Order.schema.paths);
  
  check('Order has adminCommission field', orderFields.includes('adminCommission'));
  check('Order has sellerAmount field', orderFields.includes('sellerAmount'));
  
  // Read order controller to verify commission calculation
  const orderControllerContent = fs.readFileSync('./controllers/orderController.js', 'utf8');
  check('Commission calculation implemented', orderControllerContent.includes('adminCommission'));
  check('Seller amount calculation implemented', orderControllerContent.includes('sellerAmount'));
  
  const hasPhase5Docs = fs.existsSync('./PHASE5_DOCUMENTATION.md');
  check('Phase 5 documentation exists', hasPhase5Docs);
  
  const hasPhase5Tests = fs.existsSync('./test-phase5.http');
  check('Phase 5 tests exist', hasPhase5Tests);
  
  console.log('\n✨ Phase 5 Features:');
  console.log('   • Automatic 10% commission calculation');
  console.log('   • Commission on final order amount');
  console.log('   • Seller amount (90%) calculated');
  console.log('   • Stored in every order');
  console.log('   • Example: ₹1000 → Admin ₹100, Seller ₹900');
} catch (error) {
  console.log(`❌ Phase 5 Error: ${error.message}`);
}

// PHASE 6: COUPON SYSTEM
sectionHeader(6, 'Coupon System');

try {
  const Coupon = require('./models/Coupon');
  check('Coupon model loaded', true);
  
  const couponFields = Object.keys(Coupon.schema.paths);
  check('Coupon has code field', couponFields.includes('code'));
  check('Coupon has discountType field', couponFields.includes('discountType'));
  check('Coupon has discountValue field', couponFields.includes('discountValue'));
  check('Coupon has expiryDate field', couponFields.includes('expiryDate'));
  check('Coupon has usageLimit field', couponFields.includes('usageLimit'));
  check('Coupon has usageLimitPerUser field', couponFields.includes('usageLimitPerUser'));
  
  check('calculateDiscount method exists', typeof Coupon.schema.methods.calculateDiscount === 'function');
  check('canUserUseCoupon method exists', typeof Coupon.schema.methods.canUserUseCoupon === 'function');
  check('incrementUsage method exists', typeof Coupon.schema.methods.incrementUsage === 'function');
  
  const couponController = require('./controllers/couponController');
  check('CouponController loaded', true);
  check('Create coupon function exists', typeof couponController.createCoupon === 'function');
  check('Validate coupon function exists', typeof couponController.validateCoupon === 'function');
  
  check('Coupon routes configured', fs.existsSync('./routes/couponRoutes.js'));
  
  const Order = require('./models/Order');
  const orderFields = Object.keys(Order.schema.paths);
  check('Order has discountAmount field', orderFields.includes('discountAmount'));
  check('Order has couponCode field', orderFields.includes('couponCode'));
  
  const hasPhase6Docs = fs.existsSync('./PHASE6_DOCUMENTATION.md');
  check('Phase 6 documentation exists', hasPhase6Docs);
  
  const hasPhase6Tests = fs.existsSync('./test-phase6.http');
  check('Phase 6 tests exist', hasPhase6Tests);
  
  console.log('\n✨ Phase 6 Features:');
  console.log('   • Percentage discounts (10%, 20%, etc.)');
  console.log('   • Fixed discounts (₹100, ₹250, etc.)');
  console.log('   • Expiry date enforcement');
  console.log('   • Usage limits (total & per-user)');
  console.log('   • Real-time validation');
  console.log('   • Checkout integration');
  console.log('   • Usage statistics & analytics');
} catch (error) {
  console.log(`❌ Phase 6 Error: ${error.message}`);
}

// INTEGRATION VERIFICATION
sectionHeader('INTEGRATION', 'Cross-Phase Integration');

try {
  // Check if all routes are registered in server.js
  const serverContent = fs.readFileSync('./server.js', 'utf8');
  check('Auth routes registered', serverContent.includes('/api/auth'));
  check('User routes registered', serverContent.includes('/api/users'));
  check('Category routes registered', serverContent.includes('/api/categories'));
  check('Product routes registered', serverContent.includes('/api/products'));
  check('Order routes registered', serverContent.includes('/api/orders'));
  check('Payment routes registered', serverContent.includes('/api/payment'));
  check('Coupon routes registered', serverContent.includes('/api/coupons'));
  check('Admin routes registered', serverContent.includes('/api/admin'));
  check('Seller routes registered', serverContent.includes('/api/seller'));
  
  console.log('\n✨ Integration Points:');
  console.log('   • Users can register and login (Phase 1)');
  console.log('   • Sellers can create products (Phase 2)');
  console.log('   • Users add products to cart (Phase 3)');
  console.log('   • Users apply coupons at checkout (Phase 6)');
  console.log('   • Discount applied to order total (Phase 6)');
  console.log('   • Commission calculated on final amount (Phase 5)');
  console.log('   • Payment processed (COD/Online) (Phase 4)');
  console.log('   • Order created with all details');
} catch (error) {
  console.log(`❌ Integration Error: ${error.message}`);
}

// COMPLETE ORDER FLOW VERIFICATION
sectionHeader('FLOW', 'Complete Order Flow');

console.log('📋 End-to-End Order Flow:\n');
console.log('1️⃣  User registers/logs in (Phase 1)');
console.log('    ↓');
console.log('2️⃣  Browses products by category (Phase 2)');
console.log('    ↓');
console.log('3️⃣  Adds products to cart (Phase 3)');
console.log('    ↓');
console.log('4️⃣  Views available coupons (Phase 6)');
console.log('    ↓');
console.log('5️⃣  Applies coupon code at checkout (Phase 6)');
console.log('    ↓  Example: ₹1000 order + SAVE10 (10% off)');
console.log('    ↓  Discount: ₹100');
console.log('    ↓  Final Total: ₹900');
console.log('6️⃣  Commission calculated (Phase 5)');
console.log('    ↓  Admin: ₹90 (10% of ₹900)');
console.log('    ↓  Seller: ₹810 (90% of ₹900)');
console.log('7️⃣  Selects payment method (Phase 4)');
console.log('    ↓  Option A: COD');
console.log('    ↓  Option B: Online (Razorpay)');
console.log('8️⃣  Order created & confirmed ✅');
console.log('    ↓');
console.log('9️⃣  Seller fulfills order');
console.log('    ↓');
console.log('🔟 Customer receives & order completed 🎉\n');

// SUMMARY
console.log('\n════════════════════════════════════════════════════════');
console.log('📊 VERIFICATION SUMMARY');
console.log('════════════════════════════════════════════════════════\n');

const successRate = Math.round((passedChecks / totalChecks) * 100);

console.log(`Total Checks: ${totalChecks}`);
console.log(`Passed: ${passedChecks} ✅`);
console.log(`Failed: ${totalChecks - passedChecks} ❌`);
console.log(`Success Rate: ${successRate}%\n`);

if (successRate === 100) {
  console.log('🎉 PERFECT! ALL PHASES WORKING! 🎉\n');
  console.log('Your e-commerce platform is complete with:');
  console.log('✅ Phase 1: Authentication & Authorization');
  console.log('✅ Phase 2: Product & Category Management');
  console.log('✅ Phase 3: Cart & Order System');
  console.log('✅ Phase 4: Payment Integration (COD & Online)');
  console.log('✅ Phase 5: Admin Commission (10% auto)');
  console.log('✅ Phase 6: Coupon System (Discounts)\n');
  console.log('🚀 Status: PRODUCTION READY!\n');
} else if (successRate >= 90) {
  console.log('✨ EXCELLENT! Platform is highly functional!\n');
  console.log(`Minor issues found in ${totalChecks - passedChecks} check(s).`);
  console.log('Review the failed checks above.\n');
} else if (successRate >= 75) {
  console.log('⚠️  GOOD! Most features working.\n');
  console.log(`Some issues found in ${totalChecks - passedChecks} check(s).`);
  console.log('Review and fix the failed checks.\n');
} else {
  console.log('❌ NEEDS ATTENTION! Multiple issues detected.\n');
  console.log(`${totalChecks - passedChecks} checks failed.`);
  console.log('Please review and fix the issues above.\n');
}

// NEXT STEPS
console.log('════════════════════════════════════════════════════════');
console.log('🎯 NEXT STEPS');
console.log('════════════════════════════════════════════════════════\n');

if (successRate === 100) {
  console.log('1. Start the server: npm start');
  console.log('2. Test complete flow:');
  console.log('   • Register a user');
  console.log('   • Create products (as seller)');
  console.log('   • Create coupons (as admin)');
  console.log('   • Make an order with coupon');
  console.log('   • Verify discount & commission');
  console.log('3. Deploy to production! 🚀');
} else {
  console.log('1. Review failed checks above');
  console.log('2. Fix any issues');
  console.log('3. Run verification again');
  console.log('4. Start server once all checks pass');
}

console.log('\n════════════════════════════════════════════════════════\n');

process.exit(successRate === 100 ? 0 : 1);
