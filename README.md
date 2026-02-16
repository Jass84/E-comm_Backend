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

## 🔄 Next Steps (Upcoming Phases)

- Phase 2: Product System
- Phase 3: Order System
- Phase 4: Payment Integration (Razorpay)
- Phase 5: Admin & Seller Panels
- Phase 6: Coupon & Commission System

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
