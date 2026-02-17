# PHASE 7: SELLER DASHBOARD - Complete Documentation

## 📋 Overview

Phase 7 implements a comprehensive seller dashboard system that enables sellers to manage their online store, track orders, monitor earnings, and request withdrawals. This phase integrates with Phase 5 (Commission System) to automatically calculate and credit seller earnings.

## 🎯 Features Implemented

### 1. **Seller Profile Management**
- View complete seller profile
- Update store information (name, description)
- Manage bank details for withdrawals
- GST number management
- Contact information updates

### 2. **Store Dashboard**
- Real-time statistics
  - Total products count
  - Active/out-of-stock products
  - Total orders received
  - Pending/completed orders
- Earnings summary
  - Total earnings
  - Available balance (withdrawable)
  - Pending balance (undelivered orders)
  - Total withdrawn amount
- Recent orders overview

### 3. **Product Management**
- View all seller's products
- Pagination and filtering
- Search products by title/description
- Filter by stock status (in stock/out of stock)
- Product statistics

### 4. **Order Management**
- View all orders containing seller's products
- Filter orders by status
- Update order status (shipped/cancelled)
- View customer details
- Track order timeline
- Calculate seller's earnings per order

### 5. **Earnings System**
- Automatic earnings calculation (90% of order value)
- Real-time balance tracking
  - **Total Earnings**: All-time earnings
  - **Available Balance**: Ready to withdraw
  - **Pending Balance**: Orders not yet delivered
- Monthly earnings tracking
- 7-day earnings chart
- Integration with order delivery status

### 6. **Withdrawal Management**
- Request withdrawals from available balance
- Minimum withdrawal: ₹100
- Bank details validation
- Withdrawal history
- Status tracking (pending/approved/rejected/completed)
- One pending withdrawal at a time
- Admin approval workflow

### 7. **Admin Features**
- View all withdrawal requests
- Approve/reject withdrawals
- Mark withdrawals as completed
- Add admin notes
- Track transaction IDs
- Dashboard with platform statistics
- Seller approval management

## 📊 Database Schema

### User Model Updates
```javascript
{
  // Existing seller fields...
  storeName: String,
  storeDescription: String,
  sellerApproved: Boolean,
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String,
    bankName: String
  },
  gstNumber: String,
  
  // NEW: Earnings tracking fields
  totalEarnings: Number,      // All-time earnings
  availableBalance: Number,   // Can be withdrawn
  pendingBalance: Number,     // Orders not delivered
  totalWithdrawn: Number      // Lifetime withdrawals
}
```

### Withdrawal Model (New)
```javascript
{
  seller: ObjectId,           // Reference to User
  amount: Number,             // Withdrawal amount
  status: String,             // pending/approved/rejected/completed
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String,
    bankName: String
  },
  transactionId: String,      // Bank transaction ID
  adminNote: String,          // Admin comments
  requestedAt: Date,
  processedAt: Date,
  processedBy: ObjectId       // Admin who processed
}
```

## 🔄 Earnings Flow

### 1. Order Placement
```
Customer places order → Order created with totalPrice
```

### 2. Earnings Calculation
```
Order Item Total: ₹1000
Admin Commission (10%): ₹100
Seller Amount (90%): ₹900

sellerAmount = orderTotal × 0.9
```

### 3. Balance Update (When Order Delivered)
```javascript
// Automatic process in orderController
if (orderStatus === 'Delivered') {
  // Calculate seller earnings per item
  items.forEach(item => {
    itemTotal = item.price × item.quantity
    sellerEarnings = itemTotal × 0.9
    
    // Update seller's balance
    seller.totalEarnings += sellerEarnings
    seller.availableBalance += sellerEarnings
  })
}
```

### 4. Withdrawal Process
```
1. Seller requests withdrawal (amount ≤ availableBalance)
2. Amount deducted from availableBalance immediately
3. Admin reviews request
4. Admin approves → marks completed → enters transaction ID
5. OR Admin rejects → amount refunded to availableBalance
6. On completion: amount added to totalWithdrawn
```

## 🛣️ API Endpoints

### Seller Routes

#### Profile Management
```
GET    /api/seller/profile              - Get seller profile
PUT    /api/seller/profile              - Update profile & bank details
```

#### Dashboard
```
GET    /api/seller/dashboard            - Get dashboard statistics
```

#### Products
```
GET    /api/seller/products             - Get all seller's products
       ?page=1&limit=10                 - Pagination
       ?search=laptop                   - Search products
       ?stock=in                        - Filter by stock (in/out)
```

#### Orders
```
GET    /api/seller/orders               - Get seller's orders
       ?page=1&limit=10                 - Pagination
       ?status=pending                  - Filter by status
PUT    /api/seller/orders/:id/status    - Update order status
```

#### Earnings
```
GET    /api/seller/earnings             - Get earnings summary & chart
```

#### Withdrawals
```
POST   /api/seller/withdrawals          - Request new withdrawal
GET    /api/seller/withdrawals          - Get withdrawal history
       ?status=pending                  - Filter by status
```

### Admin Routes

#### Dashboard
```
GET    /api/admin/dashboard             - Get platform statistics
```

#### Withdrawals
```
GET    /api/admin/withdrawals           - Get all withdrawal requests
       ?status=pending                  - Filter by status
PUT    /api/admin/withdrawals/:id       - Process withdrawal
```

#### Sellers
```
GET    /api/admin/sellers/pending       - Get pending seller approvals
PUT    /api/admin/sellers/:id/approve   - Approve/reject seller
```

## 📝 Request/Response Examples

### Request Withdrawal
```http
POST /api/seller/withdrawals
Authorization: Bearer <seller_token>
Content-Type: application/json

{
  "amount": 1000
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Withdrawal request submitted successfully",
  "data": {
    "_id": "65f123...",
    "seller": "65e456...",
    "amount": 1000,
    "status": "pending",
    "bankDetails": {
      "accountNumber": "1234567890",
      "ifscCode": "SBIN0001234",
      "accountHolderName": "John Doe",
      "bankName": "State Bank of India"
    },
    "requestedAt": "2026-02-17T10:30:00.000Z"
  }
}
```

### Get Dashboard Stats
```http
GET /api/seller/dashboard
Authorization: Bearer <seller_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "products": {
      "total": 25,
      "active": 20,
      "outOfStock": 5
    },
    "orders": {
      "total": 150,
      "pending": 10,
      "completed": 135
    },
    "earnings": {
      "total": 125000,
      "available": 15000,
      "pending": 5000,
      "withdrawn": 100000
    },
    "recentOrders": [...]
  }
}
```

### Admin Process Withdrawal
```http
PUT /api/admin/withdrawals/65f123...
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "completed",
  "transactionId": "TXN20260217123456",
  "adminNote": "Payment transferred successfully via NEFT"
}
```

## 🔐 Authorization

### Seller Routes
- **Authentication**: Required (JWT token)
- **Role**: Must be 'seller'
- **Approval**: sellerApproved must be true

### Admin Routes
- **Authentication**: Required (JWT token)
- **Role**: Must be 'admin'

## ✅ Validation Rules

### Withdrawal Requests
1. ✅ Minimum amount: ₹100
2. ✅ Amount ≤ availableBalance
3. ✅ Bank details must exist
4. ✅ No pending withdrawal allowed
5. ✅ Only approved sellers can withdraw

### Order Status Updates (Sellers)
1. ✅ Can only update own orders
2. ✅ Allowed statuses: 'shipped', 'cancelled'
3. ✅ Cannot update completed/cancelled orders

### Profile Updates
1. ✅ Bank account number format
2. ✅ IFSC code format (11 characters)
3. ✅ GST number format (15 characters)

## 🧪 Testing Guide

### Setup Test Data
```javascript
// 1. Create seller account
POST /api/auth/register
{
  "name": "Test Seller",
  "email": "seller@test.com",
  "password": "password123",
  "role": "seller",
  "storeName": "Test Store"
}

// 2. Admin approves seller
PUT /api/admin/sellers/<seller_id>/approve
{ "approved": true }

// 3. Seller adds bank details
PUT /api/seller/profile
{
  "bankDetails": {
    "accountNumber": "1234567890",
    "ifscCode": "SBIN0001234",
    "accountHolderName": "Test Seller",
    "bankName": "SBI"
  }
}
```

### Test Complete Flow
```bash
# 1. Create order (as customer)
# 2. Seller marks as shipped
PUT /api/seller/orders/:id/status
{ "status": "shipped" }

# 3. Admin marks as delivered (earnings credited)
PUT /api/orders/:id/status
{ "status": "delivered" }

# 4. Check earnings
GET /api/seller/earnings

# 5. Request withdrawal
POST /api/seller/withdrawals
{ "amount": 500 }

# 6. Admin approves
PUT /api/admin/withdrawals/:id
{ "status": "approved" }

# 7. Admin completes
PUT /api/admin/withdrawals/:id
{
  "status": "completed",
  "transactionId": "TXN123"
}
```

## 🐛 Error Handling

### Common Errors

**Insufficient Balance**
```json
{
  "success": false,
  "message": "Insufficient balance. Available: ₹500"
}
```

**Pending Withdrawal Exists**
```json
{
  "success": false,
  "message": "You already have a pending withdrawal request"
}
```

**Bank Details Missing**
```json
{
  "success": false,
  "message": "Please add bank details to your profile before requesting withdrawal"
}
```

**Minimum Amount**
```json
{
  "success": false,
  "message": "Minimum withdrawal amount is ₹100"
}
```

## 💡 Best Practices

### For Sellers
1. ✅ Keep bank details updated
2. ✅ Maintain minimum ₹100 balance before withdrawal
3. ✅ Wait for order delivery before expecting earnings
4. ✅ Only one withdrawal request at a time
5. ✅ Check withdrawal history regularly

### For Admins
1. ✅ Verify bank details before approval
2. ✅ Add clear admin notes
3. ✅ Enter transaction ID on completion
4. ✅ Process withdrawals within 24-48 hours
5. ✅ Monitor for fraudulent requests

## 🔄 Integration with Other Phases

### Phase 5 Integration (Commission System)
- Automatic 10% commission calculation
- 90% credited to seller's availableBalance
- Commission stored in `adminCommission` field
- Seller amount stored in `sellerAmount` field

### Phase 6 Integration (Coupons)
- Commission calculated on discounted amount
- Example:
  ```
  Order: ₹1000
  Coupon: -₹100 (10% off)
  Final: ₹900
  Commission: ₹90 (10% of ₹900)
  Seller: ₹810 (90% of ₹900)
  ```

## 📈 Performance Considerations

### Database Indexes
```javascript
// Withdrawal model
{ seller: 1, status: 1 }           // Fast seller queries
{ status: 1, requestedAt: -1 }     // Fast admin queries

// Order queries
{ 'items.seller': 1, orderStatus: 1 }  // Seller orders
```

### Optimization Tips
1. Use pagination for large datasets
2. Cache dashboard stats (optional)
3. Index frequently queried fields
4. Batch process earnings updates

## 🚀 Future Enhancements

### Potential Features
1. 📊 Advanced analytics dashboard
2. 📧 Email notifications for withdrawals
3. 🔔 Real-time order notifications
4. 📱 Mobile app support
5. 💰 Multiple payment methods
6. 📊 Sales reports & graphs
7. 🎯 Performance metrics
8. 📦 Inventory alerts

## 🎯 Success Metrics

### Phase 7 Completion Checklist
- ✅ Seller profile management working
- ✅ Dashboard shows accurate statistics
- ✅ Product listing with filters working
- ✅ Order management functional
- ✅ Earnings calculation automatic
- ✅ Withdrawal system operational
- ✅ Admin approval workflow complete
- ✅ Bank details validation working
- ✅ All API endpoints tested
- ✅ Documentation complete

## 📚 Related Documentation
- [Phase 5: Commission System](./PHASE5_DOCUMENTATION.md)
- [Phase 6: Coupon System](./PHASE6_DOCUMENTATION.md)
- [Testing Guide](./TESTING_GUIDE.md)
- [API Documentation](./README.md)

---

**Phase 7 Status**: ✅ Complete
**Integration**: ✅ Phases 1-6
**Production Ready**: ✅ Yes
