/**
 * 🌱 COMPREHENSIVE DATABASE SEEDER
 * Creates complete test data for all 8 phases
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Category = require('./models/Category');
const Withdrawal = require('./models/Withdrawal');
const Coupon = require('./models/Coupon');
require('dotenv').config();

const COMMISSION_RATE = 0.10; // 10% platform commission

// Helper function to create image object
const createImage = (url) => ({
  url,
  public_id: url.split('text=')[1]?.toLowerCase().replace(/\+/g, '_') || `img_${Date.now()}`
});

// Helper function to create slug
const createSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Connect to database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// Sample data
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@ecommerce.com',
    password: 'admin123',
    role: 'admin',
    phone: '+91 9876543210'
  },
  {
    name: 'Tech Store',
    email: 'seller@example.com',
    password: 'seller123',
    role: 'seller',
    sellerApproved: true,
    phone: '+91 9876543211',
    earnings: 50000,
    totalEarnings: 150000
  },
  {
    name: 'Fashion Hub',
    email: 'seller2@example.com',
    password: 'seller123',
    role: 'seller',
    sellerApproved: true,
    phone: '+91 9876543212',
    earnings: 30000,
    totalEarnings: 80000
  },
  {
    name: 'Pending Seller',
    email: 'pending@example.com',
    password: 'seller123',
    role: 'seller',
    sellerApproved: false,
    phone: '+91 9876543213'
  },
  {
    name: 'John Doe',
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
    phone: '+91 9876543220',
    addresses: [
      {
        fullName: 'John Doe',
        phone: '+91 9876543220',
        addressLine1: '123 Main St',
        addressLine2: 'Apt 4B',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India',
        isDefault: true
      }
    ]
  },
  {
    name: 'Jane Smith',
    email: 'user2@example.com',
    password: 'user123',
    role: 'user',
    phone: '+91 9876543221'
  }
];

const sampleCategories = [
  { name: 'Electronics', slug: 'electronics', description: 'Electronic devices and gadgets' },
  { name: 'Fashion', slug: 'fashion', description: 'Clothing and accessories' },
  { name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Home appliances and kitchenware' },
  { name: 'Books', slug: 'books', description: 'Books and stationery' },
  { name: 'Sports', slug: 'sports', description: 'Sports equipment and fitness' }
];

// Seed function
async function seedDatabase() {
  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Category.deleteMany({});
    await Withdrawal.deleteMany({});
    await Coupon.deleteMany({});
    console.log('✅ Data cleared\n');

    // Create users
    console.log('👥 Creating users...');
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      })
    );
    const users = await User.insertMany(hashedUsers);
    console.log(`✅ Created ${users.length} users`);

    // Get users by role
    const admin = users.find(u => u.role === 'admin');
    const sellers = users.filter(u => u.role === 'seller' && u.sellerApproved);
    const regularUsers = users.filter(u => u.role === 'user');
    
    // Create categories
    console.log('\n📁 Creating categories...');
    const categories = await Category.insertMany(sampleCategories);
    console.log(`✅ Created ${categories.length} categories`);

    // Create products
    console.log('\n📦 Creating products...');
    const sampleProducts = [
      // Tech Store Products
      {
        title: 'iPhone 15 Pro',
        slug: createSlug('iPhone 15 Pro'),
        description: 'Latest iPhone with amazing features',
        price: 129999,
        discountPrice: 119999,
        stock: 50,
        category: categories[0]._id,
        seller: sellers[0]._id,
        images: [createImage('https://via.placeholder.com/500x500?text=iPhone+15+Pro')],
        specifications: {
          brand: 'Apple',
          model: 'iPhone 15 Pro',
          color: 'Titanium Blue',
          storage: '256GB'
        },
        isActive: true,
        featured: true
      },
      {
        title: 'MacBook Pro M3',
        slug: createSlug('MacBook Pro M3'),
        description: 'Powerful laptop for professionals',
        price: 199999,
        discountPrice: 189999,
        stock: 30,
        category: categories[0]._id,
        seller: sellers[0]._id,
        images: [createImage('https://via.placeholder.com/500x500?text=MacBook+Pro')],
        specifications: {
          brand: 'Apple',
          processor: 'M3 Pro',
          ram: '16GB',
          storage: '512GB SSD'
        },
        isActive: true
      },
      {
        title: 'iPad Air',
        slug: createSlug('iPad Air'),
        description: 'Lightweight and powerful tablet',
        price: 59999,
        discountPrice: 54999,
        stock: 40,
        category: categories[0]._id,
        seller: sellers[0]._id,
        images: [createImage('https://via.placeholder.com/500x500?text=iPad+Air')],
        isActive: true
      },
      {
        title: 'AirPods Pro',
        slug: createSlug('AirPods Pro'),
        description: 'Premium wireless earbuds',
        price: 24999,
        discountPrice: 22999,
        stock: 0, // Out of stock
        category: categories[0]._id,
        seller: sellers[0]._id,
        images: [createImage('https://via.placeholder.com/500x500?text=AirPods+Pro')],
        isActive: true
      },
      {
        title: 'Apple Watch Series 9',
        slug: createSlug('Apple Watch Series 9'),
        description: 'Advanced smartwatch',
        price: 44999,
        discountPrice: 41999,
        stock: 5, // Low stock
        category: categories[0]._id,
        seller: sellers[0]._id,
        images: [createImage('https://via.placeholder.com/500x500?text=Apple+Watch')],
        isActive: true
      },
      
      // Fashion Hub Products
      {
        title: 'Designer Leather Jacket',
        slug: createSlug('Designer Leather Jacket'),
        description: 'Premium leather jacket for style',
        price: 8999,
        discountPrice: 7499,
        stock: 25,
        category: categories[1]._id,
        seller: sellers[1]._id,
        images: [createImage('https://via.placeholder.com/500x500?text=Leather+Jacket')],
        specifications: {
          material: 'Genuine Leather',
          size: 'M, L, XL'
        },
        isActive: true,
        featured: true
      },
      {
        title: 'Formal Shirt',
        slug: createSlug('Formal Shirt'),
        description: 'Professional formal shirt',
        price: 1999,
        discountPrice: 1499,
        stock: 100,
        category: categories[1]._id,
        seller: sellers[1]._id,
        images: [createImage('https://via.placeholder.com/500x500?text=Formal+Shirt')],
        isActive: true
      },
      {
        title: 'Denim Jeans',
        slug: createSlug('Denim Jeans'),
        description: 'Comfortable denim jeans',
        price: 2499,
        discountPrice: 1999,
        stock: 80,
        category: categories[1]._id,
        seller: sellers[1]._id,
        images: [createImage('https://via.placeholder.com/500x500?text=Denim+Jeans')],
        isActive: true
      },
      {
        title: 'Sneakers',
        slug: createSlug('Sneakers'),
        description: 'Casual sports sneakers',
        price: 3999,
        discountPrice: 2999,
        stock: 60,
        category: categories[1]._id,
        seller: sellers[1]._id,
        images: [createImage('https://via.placeholder.com/500x500?text=Sneakers')],
        isActive: true
      },
      {
        title: 'Backpack',
        slug: createSlug('Backpack'),
        description: 'Spacious travel backpack',
        price: 1999,
        discountPrice: 1499,
        stock: 0, // Out of stock
        category: categories[1]._id,
        seller: sellers[1]._id,
        images: [createImage('https://via.placeholder.com/500x500?text=Backpack')],
        isActive: false
      }
    ];

    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ Created ${products.length} products`);

    // Create orders
    console.log('\n📝 Creating orders...');
    const now = new Date();
    const sampleOrders = [
      // Delivered orders
      {
        user: regularUsers[0]._id,
        orderNumber: `ORD-${Date.now()}-1`,
        items: [
          {
            product: products[0]._id,
            quantity: 1,
            price: products[0].discountPrice || products[0].price,
            total: products[0].discountPrice || products[0].price
          }
        ],
        subtotal: products[0].discountPrice || products[0].price,
        discount: 0,
        deliveryFee: 0,
        totalPrice: products[0].discountPrice || products[0].price,
        shippingAddress: regularUsers[0].addresses[0],
        paymentMethod: 'razorpay',
        paymentStatus: 'completed',
        razorpayOrderId: 'order_test_001',
        razorpayPaymentId: 'pay_test_001',
        orderStatus: 'delivered',
        deliveredAt: new Date(now - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        createdAt: new Date(now - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      {
        user: regularUsers[0]._id,
        orderNumber: `ORD-${Date.now()}-2`,
        items: [
          {
            product: products[5]._id,
            quantity: 2,
            price: products[5].discountPrice || products[5].price,
            total: (products[5].discountPrice || products[5].price) * 2
          }
        ],
        subtotal: (products[5].discountPrice || products[5].price) * 2,
        discount: 0,
        deliveryFee: 0,
        totalPrice: (products[5].discountPrice || products[5].price) * 2,
        shippingAddress: regularUsers[0].addresses[0],
        paymentMethod: 'razorpay',
        paymentStatus: 'completed',
        razorpayOrderId: 'order_test_002',
        razorpayPaymentId: 'pay_test_002',
        orderStatus: 'delivered',
        deliveredAt: new Date(now - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        createdAt: new Date(now - 4 * 24 * 60 * 60 * 1000) // 4 days ago
      },
      // Shipped order
      {
        user: regularUsers[1]._id,
        orderNumber: `ORD-${Date.now()}-3`,
        items: [
          {
            product: products[1]._id,
            quantity: 1,
            price: products[1].discountPrice || products[1].price,
            total: products[1].discountPrice || products[1].price
          }
        ],
        subtotal: products[1].discountPrice || products[1].price,
        discount: 0,
        deliveryFee: 0,
        totalPrice: products[1].discountPrice || products[1].price,
        shippingAddress: {
          fullName: regularUsers[1].name,
          phone: regularUsers[1].phone,
          addressLine1: '456 Oak Ave',
          addressLine2: '',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001',
          country: 'India'
        },
        paymentMethod: 'razorpay',
        paymentStatus: 'completed',
        razorpayOrderId: 'order_test_003',
        razorpayPaymentId: 'pay_test_003',
        orderStatus: 'shipped',
        createdAt: new Date(now - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      // Processing order
      {
        user: regularUsers[0]._id,
        orderNumber: `ORD-${Date.now()}-4`,
        items: [
          {
            product: products[6]._id,
            quantity: 3,
            price: products[6].discountPrice || products[6].price,
            total: (products[6].discountPrice || products[6].price) * 3
          }
        ],
        subtotal: (products[6].discountPrice || products[6].price) * 3,
        discount: 0,
        deliveryFee: 0,
        totalPrice: (products[6].discountPrice || products[6].price) * 3,
        shippingAddress: regularUsers[0].addresses[0],
        paymentMethod: 'razorpay',
        paymentStatus: 'completed',
        razorpayOrderId: 'order_test_004',
        razorpayPaymentId: 'pay_test_004',
        orderStatus: 'processing',
        createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      // Pending order
      {
        user: regularUsers[1]._id,
        orderNumber: `ORD-${Date.now()}-5`,
        items: [
          {
            product: products[7]._id,
            quantity: 1,
            price: products[7].discountPrice || products[7].price,
            total: products[7].discountPrice || products[7].price
          }
        ],
        subtotal: products[7].discountPrice || products[7].price,
        discount: 0,
        deliveryFee: 0,
        totalPrice: products[7].discountPrice || products[7].price,
        shippingAddress: {
          fullName: regularUsers[1].name,
          phone: regularUsers[1].phone,
          addressLine1: '456 Oak Ave',
          addressLine2: '',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001',
          country: 'India'
        },
        paymentMethod: 'COD',
        paymentStatus: 'pending',
        orderStatus: 'pending',
        createdAt: new Date() // Today
      },
      // Another pending order (today)
      {
        user: regularUsers[0]._id,
        orderNumber: `ORD-${Date.now()}-6`,
        items: [
          {
            product: products[2]._id,
            quantity: 1,
            price: products[2].discountPrice || products[2].price,
            total: products[2].discountPrice || products[2].price
          }
        ],
        subtotal: products[2].discountPrice || products[2].price,
        discount: 0,
        deliveryFee: 0,
        totalPrice: products[2].discountPrice || products[2].price,
        shippingAddress: regularUsers[0].addresses[0],
        paymentMethod: 'razorpay',
        paymentStatus: 'completed',
        razorpayOrderId: 'order_test_006',
        razorpayPaymentId: 'pay_test_006',
        orderStatus: 'pending',
        createdAt: new Date() // Today
      }
    ];

    const orders = await Order.insertMany(sampleOrders);
    console.log(`✅ Created ${orders.length} orders`);

    // Create withdrawals
    console.log('\n💰 Creating withdrawal requests...');
    const sampleWithdrawals = [
      {
        seller: sellers[0]._id,
        amount: 30000,
        bankDetails: {
          accountNumber: '1234567890',
          ifscCode: 'HDFC0001234',
          accountHolderName: 'Tech Store',
          bankName: 'HDFC Bank'
        },
        status: 'pending'
      },
      {
        seller: sellers[1]._id,
        amount: 20000,
        bankDetails: {
          accountNumber: '9876543210',
          ifscCode: 'ICIC0001234',
          accountHolderName: 'Fashion Hub',
          bankName: 'ICICI Bank'
        },
        status: 'pending'
      },
      {
        seller: sellers[0]._id,
        amount: 50000,
        bankDetails: {
          accountNumber: '1234567890',
          ifscCode: 'HDFC0001234',
          accountHolderName: 'Tech Store',
          bankName: 'HDFC Bank'
        },
        status: 'completed',
        transactionId: 'TXN_COMPLETED_001',
        processedAt: new Date(now - 10 * 24 * 60 * 60 * 1000)
      }
    ];

    const withdrawals = await Withdrawal.insertMany(sampleWithdrawals);
    console.log(`✅ Created ${withdrawals.length} withdrawal requests`);

    // Create coupons
    console.log('\n🎟️  Creating coupons...');
    const sampleCoupons = [
      {
        code: 'WELCOME10',
        discountType: 'percentage',
        discountValue: 10,
        minOrderAmount: 1000,
        maxDiscount: 500,
        expiryDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        usageLimit: 100,
        usedCount: 15,
        isActive: true
      },
      {
        code: 'FLAT500',
        discountType: 'fixed',
        discountValue: 500,
        minOrderAmount: 5000,
        expiryDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        usageLimit: 50,
        usedCount: 5,
        isActive: true
      },
      {
        code: 'EXPIRED',
        discountType: 'percentage',
        discountValue: 20,
        minOrderAmount: 2000,
        expiryDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        usageLimit: 100,
        usedCount: 50,
        isActive: false
      }
    ];

    const coupons = await Coupon.insertMany(sampleCoupons);
    console.log(`✅ Created ${coupons.length} coupons`);

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('✅ DATABASE SEEDED SUCCESSFULLY!');
    console.log('='.repeat(60));
    
    console.log('\n📊 SUMMARY:');
    console.log(`   Users: ${users.length} (${sellers.length} sellers, ${regularUsers.length} customers)`);
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Products: ${products.length}`);
    console.log(`   Orders: ${orders.length}`);
    console.log(`   Withdrawals: ${withdrawals.length}`);
    console.log(`   Coupons: ${coupons.length}`);

    console.log('\n🔑 LOGIN CREDENTIALS:');
    console.log('   Admin: admin@ecommerce.com / admin123');
    console.log('   Seller 1: seller@example.com / seller123');
    console.log('   Seller 2: seller2@example.com / seller123');
    console.log('   User 1: user@example.com / user123');
    console.log('   User 2: user2@example.com / user123');
    console.log('   Pending Seller: pending@example.com / seller123');

    console.log('\n🎯 NEXT STEPS:');
    console.log('   1. Start server: node server.js');
    console.log('   2. Run verification: node verify-phase8.js');
    console.log('   3. Test endpoints: Use test-phase8.http');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
}

// Run seeder
seedDatabase();
