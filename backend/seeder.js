const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// Sample users data
const users = [
  {
    name: 'Admin User',
    email: 'admin@ecommerce.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'Test Seller',
    email: 'seller@example.com',
    password: 'seller123',
    role: 'seller',
    storeName: 'Test Store',
    storeDescription: 'A test store for development',
    sellerApproved: true // Pre-approved for testing
  },
  {
    name: 'Test User',
    email: 'user@example.com',
    password: 'user123',
    role: 'user'
  }
];

// Seed function
const seedDB = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // Insert sample users
    const createdUsers = await User.create(users);
    console.log('✅ Sample users created:');
    createdUsers.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    console.log('\n📝 Login Credentials:');
    console.log('   Admin: admin@ecommerce.com / admin123');
    console.log('   Seller: seller@example.com / seller123');
    console.log('   User: user@example.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder
seedDB();
