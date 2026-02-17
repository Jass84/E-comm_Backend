# E-Commerce Backend API

## 🚀 Phase 1 - Project Setup & Authentication System

### Features Implemented
- ✅ Backend Node + Express setup
- ✅ MongoDB connection
- ✅ Complete folder structure
- ✅ User authentication system (Register, Login, Logout)
- ✅ JWT token authentication
- ✅ Role-based access control (User, Seller, Admin)
- ✅ Password hashing with bcrypt
- ✅ Protected routes middleware
- ✅ Seller approval system

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🛠️ Installation

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Update the values in `.env` file:
     - Set your `MONGO_URI` (local or MongoDB Atlas)
     - Set a strong `JWT_SECRET`
     - Configure other settings as needed

3. **Start MongoDB:**
   - If using local MongoDB: `mongod`
   - If using MongoDB Atlas: Ensure your connection string is correct

4. **Run the server:**
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## 📚 API Endpoints

### Authentication Routes

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"  // optional: "user" (default), "seller", "admin"
}
```

#### Register Seller
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Jane Seller",
  "email": "jane@example.com",
  "password": "password123",
  "role": "seller",
  "storeName": "Jane's Store",
  "storeDescription": "Quality products for everyone"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User (Protected)
```http
GET /api/auth/me
Authorization: Bearer <your_jwt_token>
```

#### Logout (Protected)
```http
POST /api/auth/logout
Authorization: Bearer <your_jwt_token>
```

#### Update Password (Protected)
```http
PUT /api/auth/updatepassword
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. After login/register, you'll receive a token that must be included in subsequent requests:

**Header:**
```
Authorization: Bearer <your_jwt_token>
```

Or the token is automatically stored in an HTTP-only cookie.

## 👥 User Roles

### User (default)
- Can browse products
- Can place orders
- Can manage their profile
- Can add items to cart and wishlist

### Seller
- Must be approved by admin
- Can add and manage products
- Can view orders for their products
- Can request withdrawals
- Has access to seller dashboard

### Admin
- Full access to all routes
- Can approve/reject sellers
- Can manage all users, products, and orders
- Can manage coupons and commissions
- Access to admin dashboard

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                 # Database connection
├── controllers/
│   └── authController.js     # Auth logic
├── middleware/
│   └── authMiddleware.js     # Auth & authorization middleware
├── models/
│   └── User.js               # User schema
├── routes/
│   ├── authRoutes.js         # Auth endpoints
│   ├── userRoutes.js         # User endpoints (placeholder)
│   ├── productRoutes.js      # Product endpoints (placeholder)
│   ├── orderRoutes.js        # Order endpoints (placeholder)
│   ├── couponRoutes.js       # Coupon endpoints (placeholder)
│   ├── adminRoutes.js        # Admin endpoints (placeholder)
│   └── sellerRoutes.js       # Seller endpoints (placeholder)
├── .env                      # Environment variables
├── .env.example              # Environment variables template
├── .gitignore
├── package.json
├── README.md
└── server.js                 # Entry point
```

## 🧪 Testing the API

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Get Profile:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman or Thunder Client

1. Import the endpoints
2. Register a new user
3. Login to get the token
4. Use the token in Authorization header for protected routes

## 🔄 Development Phases

### Completed Phases

- ✅ **Phase 1:** Project Setup & Authentication System
- ✅ **Phase 2:** Product System (CRUD, Categories, Image Upload)
- ✅ **Phase 3:** Order System (Cart, Checkout, Order Management)
- ✅ **Phase 4:** Payment Integration (Razorpay COD & Online)
- ✅ **Phase 5:** Admin Commission System (10% auto calculation)
- ✅ **Phase 6:** Coupon System (Percentage & Fixed Discounts)

### Upcoming Phases

- 🔜 **Phase 7:** Enhanced Admin & Seller Dashboards
- 🔜 **Phase 8:** Advanced Reporting & Analytics
- 🔜 **Phase 9:** Customer Reviews & Ratings

## 📚 Phase 6 Documentation

**Coupon System** - Complete discount management with validation:

- **Discount Types:** Percentage (10%, 20%) or Fixed (₹100, ₹250)
- **Controls:** Expiry, usage limits, minimum order, max discount
- **Validation:** Real-time checking at checkout
- **Integration:** Automatic discount application

**Example:** Use SAVE10 on ₹1000 order → Get ₹100 off → Pay ₹900

📖 See [PHASE6_DOCUMENTATION.md](PHASE6_DOCUMENTATION.md) for details
📝 See [PHASE6_SUMMARY.md](PHASE6_SUMMARY.md) for quick overview
🧪 See [test-phase6.http](test-phase6.http) for testing

## 📚 Phase 5 Documentation

**Admin Commission System** - Automatically calculates and stores commission for every order:

- **Admin Commission:** 10% of total order price
- **Seller Amount:** 90% of total order price
- **Formula:** `adminCommission = totalPrice × 10/100`

**Example:** ₹1000 order → Admin: ₹100, Seller: ₹900

📖 See [PHASE5_DOCUMENTATION.md](PHASE5_DOCUMENTATION.md) for details
📝 See [PHASE5_SUMMARY.md](PHASE5_SUMMARY.md) for quick overview
🧪 See [test-phase5.http](test-phase5.http) for testing

## 🐛 Error Handling

The API includes comprehensive error handling:
- Validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Server errors (500)

## 📝 Notes

- Sellers need admin approval before they can access seller features
- All passwords are hashed using bcrypt
- JWT tokens expire after 7 days (configurable in .env)
- CORS is enabled for frontend integration

## 🤝 Support

For issues or questions, please create an issue in the repository.

---

**Happy Coding! 🎉**
