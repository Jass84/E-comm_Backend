# 🚀 PHASE 8: ADMIN DASHBOARD - Quick Start Guide

## ⚡ Quick Overview

Phase 8 provides a **comprehensive Admin Control Panel** for managing the entire e-commerce platform:
- 👥 User Management
- 🏪 Seller Approvals
- 📦 Order Management
- 🛍️ Product Management
- 💰 Withdrawal Processing
- 📊 Business Analytics

---

## 🎯 Setup (Already Complete!)

Phase 8 is already implemented in your project. Files modified:
- ✅ `controllers/adminController.js` - 23 admin functions
- ✅ `routes/adminRoutes.js` - 18 API endpoints
- ✅ `test-phase8.http` - 66 test scenarios

---

## 🔑 Get Admin Token

### 1. Login as Admin
```http
POST http://localhost:5002/api/auth/login
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "Admin@123"
}
```

### 2. Copy Token
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Use in Headers
```http
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 🎛️ Core Operations

### 1️⃣ View Dashboard (Start Here!)
```http
GET http://localhost:5002/api/admin/dashboard
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**What You Get**:
- Total users, sellers, products, orders
- Today's sales and revenue
- Last 7 days chart
- Recent orders
- Pending approvals
- Withdrawal requests

**Response Example**:
```json
{
  "users": { "total": 1500, "sellers": 250 },
  "revenue": { "total": 5000000, "today": 125000 },
  "orders": { "total": 12000, "today": 45 },
  "charts": { "last7Days": [...] }
}
```

---

### 2️⃣ Manage Users

#### List All Users
```http
GET http://localhost:5002/api/admin/users?page=1&limit=20
Authorization: Bearer YOUR_ADMIN_TOKEN
```

#### Filter Sellers
```http
GET http://localhost:5002/api/admin/users?role=seller&sellerApproved=true
```

#### Search Users
```http
GET http://localhost:5002/api/admin/users?search=john
```

#### View User Details
```http
GET http://localhost:5002/api/admin/users/{user_id}
```

#### Update User
```http
PUT http://localhost:5002/api/admin/users/{user_id}
Content-Type: application/json

{
  "name": "Updated Name",
  "role": "seller",
  "sellerApproved": true,
  "isBlocked": false
}
```

#### Delete User
```http
DELETE http://localhost:5002/api/admin/users/{user_id}
```

---

### 3️⃣ Approve Sellers

#### View Pending Approvals
```http
GET http://localhost:5002/api/admin/sellers/pending
Authorization: Bearer YOUR_ADMIN_TOKEN
```

#### Approve Seller
```http
PUT http://localhost:5002/api/admin/sellers/{seller_id}/approve
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_TOKEN

{
  "approved": true,
  "reason": "All documents verified"
}
```

#### Reject Seller
```http
PUT http://localhost:5002/api/admin/sellers/{seller_id}/approve
Content-Type: application/json

{
  "approved": false,
  "reason": "Invalid documents"
}
```

---

### 4️⃣ Manage Orders

#### View All Orders
```http
GET http://localhost:5002/api/admin/orders?page=1&limit=20
Authorization: Bearer YOUR_ADMIN_TOKEN
```

#### Today's Orders
```http
GET http://localhost:5002/api/admin/orders?today=true
```

#### Filter by Status
```http
GET http://localhost:5002/api/admin/orders?status=pending
```

#### Filter by Payment
```http
GET http://localhost:5002/api/admin/orders?paymentMethod=razorpay
```

#### View Order Details
```http
GET http://localhost:5002/api/admin/orders/{order_id}
```

#### Update Order Status
```http
PUT http://localhost:5002/api/admin/orders/{order_id}/status
Content-Type: application/json

{
  "status": "delivered",
  "note": "Delivered successfully"
}
```

**Order Status Flow**:
```
pending → processing → shipped → delivered
                                    ↓
                          (Auto-credit seller earnings)
```

---

### 5️⃣ Manage Products

#### View All Products
```http
GET http://localhost:5002/api/admin/products?page=1&limit=20
Authorization: Bearer YOUR_ADMIN_TOKEN
```

#### Out of Stock Products
```http
GET http://localhost:5002/api/admin/products?stock=out
```

#### Low Stock Products
```http
GET http://localhost:5002/api/admin/products?stock=low
```

#### Search Products
```http
GET http://localhost:5002/api/admin/products?search=iphone
```

#### Update Product
```http
PUT http://localhost:5002/api/admin/products/{product_id}
Content-Type: application/json

{
  "title": "Updated Title",
  "price": 79999,
  "stock": 100,
  "isActive": true,
  "featured": true
}
```

#### Deactivate Product
```http
PUT http://localhost:5002/api/admin/products/{product_id}
Content-Type: application/json

{
  "isActive": false
}
```

#### Delete Product
```http
DELETE http://localhost:5002/api/admin/products/{product_id}
```

---

### 6️⃣ Process Withdrawals

#### View All Requests
```http
GET http://localhost:5002/api/admin/withdrawals?page=1&limit=20
Authorization: Bearer YOUR_ADMIN_TOKEN
```

#### Filter Pending
```http
GET http://localhost:5002/api/admin/withdrawals?status=pending
```

#### Approve Withdrawal
```http
PUT http://localhost:5002/api/admin/withdrawals/{withdrawal_id}
Content-Type: application/json

{
  "status": "approved",
  "transactionId": "TXN123456"
}
```

#### Reject Withdrawal
```http
PUT http://localhost:5002/api/admin/withdrawals/{withdrawal_id}
Content-Type: application/json

{
  "status": "rejected",
  "reason": "Invalid bank details"
}
```

#### Mark as Completed
```http
PUT http://localhost:5002/api/admin/withdrawals/{withdrawal_id}
Content-Type: application/json

{
  "status": "completed",
  "transactionId": "TXN123456"
}
```

---

### 7️⃣ View Analytics

#### Revenue Trends (Last Week)
```http
GET http://localhost:5002/api/admin/analytics/revenue?period=week
Authorization: Bearer YOUR_ADMIN_TOKEN
```

#### Revenue Trends (Last Month)
```http
GET http://localhost:5002/api/admin/analytics/revenue?period=month
```

#### Revenue Trends (Last Year)
```http
GET http://localhost:5002/api/admin/analytics/revenue?period=year
```

#### Top Products
```http
GET http://localhost:5002/api/admin/analytics/top-products?limit=10
```

#### Top Sellers
```http
GET http://localhost:5002/api/admin/analytics/top-sellers?limit=10
```

---

## 📝 Common Workflows

### Daily Admin Tasks

#### Morning Routine (5 minutes)
```bash
1. Check dashboard
   GET /api/admin/dashboard

2. Approve pending sellers (if any)
   GET /api/admin/sellers/pending
   PUT /api/admin/sellers/:id/approve

3. Review today's orders
   GET /api/admin/orders?today=true
```

#### Order Processing (10 minutes)
```bash
1. Get pending orders
   GET /api/admin/orders?status=pending

2. Mark as processing (bulk)
   PUT /api/admin/orders/:id/status → "processing"

3. Update shipped orders
   GET /api/admin/orders?status=processing
   PUT /api/admin/orders/:id/status → "shipped"

4. Mark delivered
   GET /api/admin/orders?status=shipped
   PUT /api/admin/orders/:id/status → "delivered"
```

#### Withdrawal Processing (5 minutes)
```bash
1. Get pending withdrawals
   GET /api/admin/withdrawals?status=pending

2. Review each request
   GET /api/admin/withdrawals → Check bank details

3. Approve valid requests
   PUT /api/admin/withdrawals/:id → "approved"

4. Reject invalid ones
   PUT /api/admin/withdrawals/:id → "rejected"
```

#### Weekly Review (15 minutes)
```bash
1. Check revenue trends
   GET /api/admin/analytics/revenue?period=week

2. View top products
   GET /api/admin/analytics/top-products?limit=10

3. View top sellers
   GET /api/admin/analytics/top-sellers?limit=10

4. Review low stock
   GET /api/admin/products?stock=low
```

---

## 🎯 Testing Guide

### Using VS Code REST Client

1. **Open Test File**
   ```
   File: backend/test-phase8.http
   ```

2. **Add Your Token**
   ```http
   @adminToken = YOUR_ADMIN_TOKEN_HERE
   ```

3. **Run Tests**
   - Click "Send Request" above each test
   - Or use keyboard shortcut: `Ctrl+Alt+R`

### Test Categories

✅ **Dashboard Tests (1)** - Quick overview  
✅ **User Management (13)** - All user operations  
✅ **Seller Management (3)** - Approval workflow  
✅ **Order Management (15)** - Order lifecycle  
✅ **Product Management (12)** - Product CRUD  
✅ **Withdrawal Tests (8)** - Payment processing  
✅ **Analytics (7)** - Business intelligence  
✅ **Workflows (4)** - End-to-end flows  

**Total: 66 test scenarios**

---

## 🔍 Query Parameters Guide

### Pagination (All List Endpoints)
```http
?page=1              # Page number (default: 1)
&limit=20            # Items per page (default: 20, max: 100)
```

### User Filters
```http
?role=seller                    # Filter by role
&sellerApproved=true           # Filter by seller status
&search=john                    # Search name/email
```

### Order Filters
```http
?status=pending                 # Filter by status
&paymentMethod=razorpay        # Filter by payment
&today=true                     # Today's orders only
&dateFrom=2026-02-01           # Start date
&dateTo=2026-02-17             # End date
```

### Product Filters
```http
?isActive=true                  # Filter by active status
&stock=out                      # out OR low (<10)
&seller=seller_id              # Filter by seller
&search=iphone                  # Search by title
```

### Withdrawal Filters
```http
?status=pending                 # Filter by status
```

### Analytics Parameters
```http
?period=week                    # week, month, year
&limit=10                       # Number of results (top products/sellers)
```

---

## 💡 Tips & Best Practices

### 1. Dashboard First
Always check dashboard before doing other operations:
```http
GET /api/admin/dashboard
```
This gives you overview of pending tasks.

### 2. Use Filters
Don't load all data. Use filters:
```http
# Good
GET /api/admin/orders?status=pending&limit=50

# Bad
GET /api/admin/orders
```

### 3. Order Status Flow
Follow proper order lifecycle:
```
pending → processing → shipped → delivered
```
Don't skip statuses.

### 4. Seller Earnings
When order marked "delivered":
- ✅ Seller earnings auto-credited
- ✅ No manual adjustment needed

### 5. Withdrawal Safety
Always verify bank details before approval:
```http
GET /api/admin/withdrawals/{id}
# Check bankDetails carefully
PUT /api/admin/withdrawals/{id}
```

### 6. Product Management
Use soft delete (deactivate) instead of hard delete:
```http
# Preferred
PUT /api/admin/products/{id}
{ "isActive": false }

# Use only if necessary
DELETE /api/admin/products/{id}
```

### 7. Search Performance
Use specific searches:
```http
# Good - specific
GET /api/admin/users?search=john@example.com

# Slow - too broad
GET /api/admin/users?search=a
```

---

## 🚨 Common Issues & Solutions

### Issue 1: "Admin access required"
**Solution**: Ensure you're logged in as admin role
```http
# Check your token role
POST /api/auth/login
{ "email": "admin@test.com", "password": "Admin@123" }
```

### Issue 2: "User not found"
**Solution**: Check user ID is correct
```http
# Get valid user ID first
GET /api/admin/users
# Then use the _id from response
```

### Issue 3: Orders not updating
**Solution**: Check order exists and status is valid
```http
# Valid statuses: pending, processing, shipped, delivered, cancelled
PUT /api/admin/orders/{id}/status
{ "status": "delivered" }
```

### Issue 4: Withdrawal fails
**Solution**: Ensure correct status and required fields
```http
# For approval, transactionId required
PUT /api/admin/withdrawals/{id}
{
  "status": "approved",
  "transactionId": "TXN123"  // Required!
}
```

### Issue 5: Products not visible
**Solution**: Check isActive status
```http
# View inactive products
GET /api/admin/products?isActive=false

# Reactivate
PUT /api/admin/products/{id}
{ "isActive": true }
```

---

## 📊 Response Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Data retrieved |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | No/invalid token |
| 403 | Forbidden | Not admin |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Database error |

---

## 🎨 Sample Dashboard Data

```json
{
  "success": true,
  "data": {
    "users": {
      "total": 1500,
      "sellers": 250,
      "approvedSellers": 240,
      "pendingSellers": 10
    },
    "products": {
      "total": 5000,
      "active": 4750,
      "outOfStock": 250
    },
    "orders": {
      "total": 12000,
      "today": 45,
      "pending": 150,
      "processing": 80,
      "shipped": 120,
      "delivered": 11500
    },
    "revenue": {
      "total": 5000000,
      "today": 125000,
      "monthly": 850000,
      "commission": {
        "total": 500000,
        "monthly": 85000
      }
    },
    "todayOrders": {
      "count": 45,
      "revenue": 125000
    },
    "withdrawals": {
      "pending": 25,
      "totalPaid": 2000000
    },
    "charts": {
      "last7Days": [
        {
          "date": "2026-02-17",
          "revenue": 125000,
          "commission": 12500,
          "orders": 45
        }
      ]
    }
  }
}
```

---

## 🔗 Quick Links

### Documentation
- **Summary**: [PHASE8_SUMMARY.md](./PHASE8_SUMMARY.md)
- **Complete Docs**: [PHASE8_DOCUMENTATION.md](./PHASE8_DOCUMENTATION.md)
- **This Guide**: [PHASE8_QUICKSTART.md](./PHASE8_QUICKSTART.md)

### Test Files
- **HTTP Tests**: [test-phase8.http](./test-phase8.http)
- **All Phases Test**: [test-all-phases.http](./test-all-phases.http)

### Related Phases
- **Phase 7**: Seller Dashboard (earnings, withdrawals)
- **Phase 6**: Coupon System
- **Phase 5**: Commission System
- **Phase 3-4**: Orders & Payments

---

## 🚀 Next Steps

After mastering Phase 8, consider:

1. **Export Data** (Phase 9)
   - Excel/PDF reports
   - Custom exports
   - Scheduled reports

2. **Advanced Analytics** (Phase 9)
   - Customer insights
   - Predictive analytics
   - Custom dashboards

3. **Automation** (Phase 9)
   - Auto-approve sellers
   - Auto-process orders
   - Fraud detection

4. **Communication** (Phase 9)
   - Email campaigns
   - SMS notifications
   - Push alerts

---

## 📞 Support

### Need Help?
- Check [PHASE8_DOCUMENTATION.md](./PHASE8_DOCUMENTATION.md) for detailed info
- Review [test-phase8.http](./test-phase8.http) for examples
- Test each endpoint individually
- Check server logs for errors

### Common Commands
```bash
# Start server
node server.js

# Check logs
# Look at terminal output

# Reset database (careful!)
node seeder.js
```

---

**Phase 8 Ready!** ✅  
**Start with Dashboard → Process Orders → Approve Withdrawals** 🚀

---

**Quick Test Command**:
```bash
# Test dashboard (replace token)
curl -X GET http://localhost:5002/api/admin/dashboard \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Happy Managing!** 🎉
