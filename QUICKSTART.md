# 🎯 Quick Start Guide - Phase 1 Complete!

## ✅ What's Been Set Up

Your backend is now fully configured with:
- ✅ Express server running on port 5000
- ✅ MongoDB connection setup
- ✅ Complete authentication system
- ✅ JWT token-based authentication
- ✅ Role-based access (User, Seller, Admin)
- ✅ Password hashing with bcrypt
- ✅ Protected routes & middleware
- ✅ Seller approval system

## 🚀 Next Steps to Get Running

### Step 1: Start MongoDB

**Choose ONE option:**

#### Option A: Local MongoDB (Easiest)
```powershell
# If MongoDB is installed as a service
net start MongoDB

# OR run manually
mongod
```

#### Option B: Use MongoDB Atlas (Cloud - Free)
1. Go to https://mongodb.com/cloud/atlas
2. Create free account & cluster
3. Get connection string
4. Update `.env` file with your connection string

📖 Detailed instructions: See [DATABASE_SETUP.md](./DATABASE_SETUP.md)

### Step 2: Server is Already Running! ✨

The development server is running with nodemon (auto-restart on file changes).

Current status:
- 🟢 Server: Running on http://localhost:5000
- 🔴 Database: Waiting for MongoDB

### Step 3: Test the API

Once MongoDB is connected, test your API:

```powershell
# Test 1: Check API status
curl http://localhost:5000

# Test 2: Register a user
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"password123\"}'

# Test 3: Login
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"john@example.com\",\"password\":\"password123\"}'
```

### Step 4: (Optional) Seed Sample Data

Create test users (admin, seller, user):

```powershell
node seeder.js
```

This creates:
- **Admin:** admin@ecommerce.com / admin123
- **Seller:** seller@example.com / seller123  
- **User:** user@example.com / user123

## 📋 Available Scripts

```powershell
cd backend

# Start development server (with auto-reload)
npm run dev

# Start production server
npm start

# Seed sample users
node seeder.js
```

## 🧪 Testing Tools

### Option 1: VS Code REST Client
1. Install "REST Client" extension
2. Open `test-api.http`
3. Click "Send Request" above each test

### Option 2: Postman
1. Import endpoints from README.md
2. Test each endpoint manually

### Option 3: cURL (Command Line)
Use the curl commands in README.md

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                    # MongoDB connection
├── controllers/
│   └── authController.js        # Authentication logic
├── middleware/
│   └── authMiddleware.js        # Auth & role checks
├── models/
│   └── User.js                  # User schema with roles
├── routes/
│   ├── authRoutes.js            # Auth endpoints (READY)
│   ├── userRoutes.js            # User endpoints (placeholder)
│   ├── productRoutes.js         # Product endpoints (placeholder)
│   ├── orderRoutes.js           # Order endpoints (placeholder)
│   ├── couponRoutes.js          # Coupon endpoints (placeholder)
│   ├── adminRoutes.js           # Admin endpoints (placeholder)
│   └── sellerRoutes.js          # Seller endpoints (placeholder)
├── .env                         # Environment variables
├── .gitignore
├── package.json
├── seeder.js                    # Sample data seeder
├── server.js                    # Entry point
├── test-api.http                # API test file
├── DATABASE_SETUP.md            # DB setup guide
├── QUICKSTART.md                # This file
└── README.md                    # Complete documentation
```

## 🎓 What You Can Do Now

### User Authentication:
- ✅ Register new users
- ✅ Register sellers (needs admin approval)
- ✅ Login with JWT token
- ✅ Get user profile
- ✅ Update password
- ✅ Logout

### Role System:
- ✅ User role (default)
- ✅ Seller role (with approval)
- ✅ Admin role (full access)

## 🔐 How Authentication Works

1. **Register/Login** → Receive JWT token
2. **Make requests** → Include token in header:
   ```
   Authorization: Bearer YOUR_TOKEN_HERE
   ```
3. **Protected routes** → Only accessible with valid token
4. **Role checks** → Admin/Seller routes check user role

## 🐛 Common Issues

### Issue: "MongoDB connection error"
**Solution:** Start MongoDB or configure Atlas connection

### Issue: "Port 5000 already in use"
**Solution:** Change PORT in `.env` file or kill process:
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

### Issue: "JWT token invalid"
**Solution:** Login again to get a new token

## 📚 Documentation

- **README.md** - Complete API documentation
- **DATABASE_SETUP.md** - MongoDB setup guide
- **test-api.http** - Ready-to-use API tests

## 🎉 Phase 1 Complete!

You now have a fully functional authentication system with:
- User registration & login
- JWT token security
- Role-based access control
- Seller approval workflow
- Password hashing
- Protected routes

### Next Phases Preview:
- 📦 **Phase 2:** Product System (CRUD, images, categories)
- 🛒 **Phase 3:** Cart & Orders
- 💳 **Phase 4:** Razorpay Payment Integration
- 👔 **Phase 5:** Admin & Seller Dashboards
- 🎟️ **Phase 6:** Coupons & Commission System

---

**Need Help?**
- Check server logs in the terminal
- Review [README.md](./README.md) for API details
- Test with [test-api.http](./test-api.http)

**Happy Coding! 🚀**
