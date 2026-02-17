# 🚀 PHASE 7: SELLER DASHBOARD - Quick Start Guide

## 🎯 What is Phase 7?

Phase 7 adds a complete **Seller Dashboard System** that allows sellers to:
- Manage their online store
- Track orders and products
- Monitor earnings automatically
- Request and receive payments

## ⚡ Quick Features Overview

### For Sellers:
✅ Dashboard with real-time stats  
✅ Product management  
✅ Order tracking  
✅ Automatic earnings (90% of sales)  
✅ Withdrawal requests  
✅ Bank account management  

### For Admins:
✅ Platform statistics  
✅ Withdrawal approvals  
✅ Seller management  
✅ Commission tracking  

---

## 🏃 Quick Test (5 Minutes)

### Step 1: Start Server
```bash
cd backend
node server.js
```

### Step 2: Register as Seller
```http
POST http://localhost:5002/api/auth/register
Content-Type: application/json

{
  "name": "Tech Store",
  "email": "seller@test.com",
  "password": "password123",
  "role": "seller",
  "storeName": "Tech Gadgets"
}
```

### Step 3: Login and Get Token
```http
POST http://localhost:5002/api/auth/login
Content-Type: application/json

{
  "email": "seller@test.com",
  "password": "password123"
}
```
**Save the token!**

### Step 4: Admin Approves Seller
```http
PUT http://localhost:5002/api/admin/sellers/<SELLER_ID>/approve
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "approved": true
}
```

### Step 5: View Dashboard
```http
GET http://localhost:5002/api/seller/dashboard
Authorization: Bearer <SELLER_TOKEN>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "products": { "total": 0, "active": 0, "outOfStock": 0 },
    "orders": { "total": 0, "pending": 0, "completed": 0 },
    "earnings": {
      "total": 0,
      "available": 0,
      "pending": 0,
      "withdrawn": 0
    }
  }
}
```

---

## 💰 How Earnings Work

### Automatic Calculation
```
When an order is delivered:
Order Total: ₹1000
├─ Admin Commission (10%): ₹100
└─ Seller Earnings (90%): ₹900 → Added to availableBalance
```

### Balance Types
- **Total Earnings**: Lifetime earnings
- **Available Balance**: Can withdraw now
- **Pending Balance**: Orders not yet delivered
- **Total Withdrawn**: Already paid out

---

## 💸 Withdrawal Flow

### 1. Add Bank Details
```http
PUT http://localhost:5002/api/seller/profile
Authorization: Bearer <SELLER_TOKEN>
Content-Type: application/json

{
  "bankDetails": {
    "accountNumber": "9876543210",
    "ifscCode": "HDFC0001234",
    "accountHolderName": "Seller Name",
    "bankName": "HDFC Bank"
  }
}
```

### 2. Check Available Balance
```http
GET http://localhost:5002/api/seller/earnings
Authorization: Bearer <SELLER_TOKEN>
```

### 3. Request Withdrawal
```http
POST http://localhost:5002/api/seller/withdrawals
Authorization: Bearer <SELLER_TOKEN>
Content-Type: application/json

{
  "amount": 500
}
```
**Note**: Minimum ₹100, maximum = available balance

### 4. Admin Approves
```http
PUT http://localhost:5002/api/admin/withdrawals/<WITHDRAWAL_ID>
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "status": "approved",
  "adminNote": "Approved for processing"
}
```

### 5. Admin Marks Completed
```http
PUT http://localhost:5002/api/admin/withdrawals/<WITHDRAWAL_ID>
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "status": "completed",
  "transactionId": "TXN123456789",
  "adminNote": "Payment transferred successfully"
}
```

### 6. Check History
```http
GET http://localhost:5002/api/seller/withdrawals
Authorization: Bearer <SELLER_TOKEN>
```

---

## 📊 Key Endpoints

### Seller Endpoints
```
Dashboard:      GET    /api/seller/dashboard
Profile:        GET    /api/seller/profile
                PUT    /api/seller/profile
Products:       GET    /api/seller/products
Orders:         GET    /api/seller/orders
                PUT    /api/seller/orders/:id/status
Earnings:       GET    /api/seller/earnings
Withdrawals:    POST   /api/seller/withdrawals
                GET    /api/seller/withdrawals
```

### Admin Endpoints
```
Dashboard:      GET    /api/admin/dashboard
Withdrawals:    GET    /api/admin/withdrawals
                PUT    /api/admin/withdrawals/:id
Sellers:        GET    /api/admin/sellers/pending
                PUT    /api/admin/sellers/:id/approve
```

---

## 🔄 Complete Workflow Example

### Scenario: Seller earns ₹900 and withdraws ₹500

```bash
# 1. Customer places ₹1000 order with seller's product
POST /api/orders
{ items: [...], totalPrice: 1000 }

# 2. Seller marks order as shipped
PUT /api/seller/orders/:id/status
{ "status": "shipped" }

# 3. Admin marks as delivered
PUT /api/orders/:id/status
{ "status": "delivered" }
# → Seller automatically gets ₹900 (90% of ₹1000)

# 4. Seller checks earnings
GET /api/seller/earnings
# Response: { availableBalance: 900 }

# 5. Seller requests ₹500 withdrawal
POST /api/seller/withdrawals
{ "amount": 500 }
# → Balance: 900 - 500 = ₹400 remaining

# 6. Admin approves
PUT /api/admin/withdrawals/:id
{ "status": "approved" }

# 7. Admin completes with transaction ID
PUT /api/admin/withdrawals/:id
{
  "status": "completed",
  "transactionId": "TXN123"
}
# → totalWithdrawn: ₹500

# 8. Final balance check
GET /api/seller/earnings
# Response:
# {
#   totalEarnings: 900,
#   availableBalance: 400,
#   totalWithdrawn: 500
# }
```

---

## ⚠️ Important Rules

### Withdrawal Rules:
1. ✅ Minimum amount: **₹100**
2. ✅ Must have bank details added
3. ✅ Only one pending withdrawal at a time
4. ✅ Amount must be ≤ available balance
5. ✅ Seller must be approved

### Order Status Rules:
- Sellers can mark: `shipped`, `cancelled`
- Only admins can mark: `delivered`
- Earnings credited only on `delivered` status

### Admin Actions:
- Approve/reject sellers
- Approve/reject/complete withdrawals
- View all platform statistics

---

## 🧪 Testing Checklist

Use [test-phase7.http](./test-phase7.http) for complete testing.

### Quick Test List:
- [ ] Register seller
- [ ] Admin approves seller
- [ ] Seller adds bank details
- [ ] View dashboard
- [ ] Create order (as customer)
- [ ] Mark order delivered (as admin)
- [ ] Check earnings credited
- [ ] Request withdrawal
- [ ] Admin approves withdrawal
- [ ] Check withdrawal history

---

## 🐛 Common Issues & Solutions

### Issue: "Seller not approved"
**Solution**: Admin must approve seller first
```http
PUT /api/admin/sellers/:id/approve
{ "approved": true }
```

### Issue: "Bank details missing"
**Solution**: Add bank details to profile
```http
PUT /api/seller/profile
{ "bankDetails": {...} }
```

### Issue: "Insufficient balance"
**Solution**: 
1. Check available balance
2. Wait for orders to be delivered
3. Request amount ≤ available

### Issue: "Pending withdrawal exists"
**Solution**: Wait for admin to process current withdrawal

---

## 📈 Advanced Features

### Filter Products
```http
GET /api/seller/products?stock=out    # Out of stock
GET /api/seller/products?search=laptop  # Search
```

### Filter Orders
```http
GET /api/seller/orders?status=pending
GET /api/seller/orders?status=delivered
```

### Filter Withdrawals
```http
GET /api/seller/withdrawals?status=pending
GET /api/seller/withdrawals?status=completed
```

---

## 💡 Pro Tips

### For Sellers:
1. 💰 Keep minimum ₹100 balance for withdrawals
2. 📦 Mark orders as shipped promptly
3. 🏦 Keep bank details updated
4. 📊 Check earnings dashboard regularly
5. 📝 Review withdrawal history

### For Admins:
1. ⚡ Process withdrawals within 24-48 hours
2. ✅ Verify bank details before approval
3. 📝 Add clear admin notes
4. 🔢 Always enter transaction ID on completion
5. 🔍 Monitor seller approval queue

---

## 🎯 Success Metrics

After Phase 7, you have:
- ✅ Complete seller dashboard
- ✅ Automatic earnings tracking
- ✅ Professional withdrawal system
- ✅ Admin management panel
- ✅ Full order lifecycle
- ✅ 7 phases integrated seamlessly

---

## 📚 Documentation Files

- **Full Documentation**: [PHASE7_DOCUMENTATION.md](./PHASE7_DOCUMENTATION.md)
- **Summary**: [PHASE7_SUMMARY.md](./PHASE7_SUMMARY.md)
- **Test Cases**: [test-phase7.http](./test-phase7.http)
- **Verification**: Run `node verify-phase7.js`

---

## 🚀 Next Steps

1. **Test Complete Flow**: Use test-phase7.http
2. **Create Demo Data**: Add sellers, products, orders
3. **Test Withdrawals**: Complete withdrawal cycle
4. **Review Dashboard**: Check all statistics
5. **Ready for Production**: Deploy when satisfied

---

## 🆘 Need Help?

### Quick Verification:
```bash
node verify-phase7.js
```

### Check Server Status:
```bash
node server.js
# Should show: ✅ MongoDB Connected
```

### View All Routes:
Check [server.js](./server.js) for registered routes

---

**Phase 7 Complete!** ✅  
**Seller Dashboard Operational** 🎯  
**Start Testing Now!** 🚀
