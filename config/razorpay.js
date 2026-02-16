const Razorpay = require('razorpay');

let razorpayInstance = null;

// Initialize Razorpay instance only if credentials are provided
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
  console.log('✅ Razorpay initialized successfully');
} else {
  console.warn('⚠️  Razorpay credentials not found in .env file');
  console.warn('⚠️  Payment features will not work until you add:');
  console.warn('   RAZORPAY_KEY_ID=your_key_id');
  console.warn('   RAZORPAY_KEY_SECRET=your_key_secret');
  console.warn('   Get them from: https://dashboard.razorpay.com');
}

module.exports = razorpayInstance;
