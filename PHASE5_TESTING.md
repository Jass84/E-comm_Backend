# 🧪 PHASE 5 TESTING GUIDE

## Quick Start Testing

### Prerequisites
- Backend server running on `http://localhost:5000`
- MongoDB connected
- Valid authentication tokens

## 🚀 Quick Test Steps

### Step 1: Get Authentication Token

```bash
# Login as a user
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "your-email@example.com",
  "password": "your-password"
}
```

Copy the `token` from response.

### Step 2: Create an Order

```bash
POST http://localhost:5000/api/orders
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "items": [
    {
      "product": "PRODUCT_ID_HERE",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "fullName": "Test User",
    "phone": "9876543210",
    "addressLine1": "123 Test Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India"
  },
  "paymentMethod": "COD",
  "itemsPrice": 900,
  "shippingPrice": 50,
  "taxPrice": 50,
  "totalPrice": 1000
}
```

### Step 3: Verify Commission in Response

Expected response should include:

```json
{
  "success": true,
  "data": {
    "orderNumber": "ORD...",
    "totalPrice": 1000,
    "adminCommission": 100,    // ← 10% of 1000
    "sellerAmount": 900,       // ← 90% of 1000
    "orderStatus": "Pending",
    ...
  }
}
```

## ✅ Validation Checklist

Check these in the response:

- [ ] `adminCommission` field exists
- [ ] `sellerAmount` field exists
- [ ] `adminCommission = totalPrice × 0.10`
- [ ] `sellerAmount = totalPrice - adminCommission`
- [ ] `adminCommission + sellerAmount = totalPrice`

## 🧮 Test Calculations

### Test Case 1: ₹1000 Order
```
Input: totalPrice = 1000
Expected:
  adminCommission = 100
  sellerAmount = 900
Verification: 100 + 900 = 1000 ✅
```

### Test Case 2: ₹2500 Order
```
Input: totalPrice = 2500
Expected:
  adminCommission = 250
  sellerAmount = 2250
Verification: 250 + 2250 = 2500 ✅
```

### Test Case 3: ₹500 Order
```
Input: totalPrice = 500
Expected:
  adminCommission = 50
  sellerAmount = 450
Verification: 50 + 450 = 500 ✅
```

## 📝 Using Test File

### Option 1: VS Code REST Client

1. Open `test-phase5.http` in VS Code
2. Install "REST Client" extension if not installed
3. Update tokens and product IDs
4. Click "Send Request" above each test

### Option 2: Postman

1. Import endpoints from documentation
2. Set up environment variables:
   - `baseUrl`: http://localhost:5000/api
   - `userToken`: Your auth token
3. Run tests one by one

### Option 3: cURL

```bash
# Create order with ₹1000 total
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{
      "product": "PRODUCT_ID",
      "quantity": 1
    }],
    "shippingAddress": {
      "fullName": "Test User",
      "phone": "9876543210",
      "addressLine1": "123 Test Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001"
    },
    "paymentMethod": "COD",
    "itemsPrice": 900,
    "shippingPrice": 50,
    "taxPrice": 50,
    "totalPrice": 1000
  }'
```

## 🔍 Verification Methods

### Method 1: API Response
Check the order creation response for commission fields.

### Method 2: Database Query
```javascript
// MongoDB Shell
db.orders.findOne({ orderNumber: "ORD123456" })

// Check fields
{
  totalPrice: 1000,
  adminCommission: 100,
  sellerAmount: 900
}
```

### Method 3: Get Order Endpoint
```bash
GET http://localhost:5000/api/orders/ORDER_ID
Authorization: Bearer YOUR_TOKEN
```

## 🎯 Common Test Scenarios

### Scenario 1: Small Order (₹100)
```json
{
  "totalPrice": 100,
  "adminCommission": 10,
  "sellerAmount": 90
}
```

### Scenario 2: Medium Order (₹1000)
```json
{
  "totalPrice": 1000,
  "adminCommission": 100,
  "sellerAmount": 900
}
```

### Scenario 3: Large Order (₹10000)
```json
{
  "totalPrice": 10000,
  "adminCommission": 1000,
  "sellerAmount": 9000
}
```

## ❌ Troubleshooting

### Issue: Commission fields missing in response

**Solution:**
1. Ensure server is restarted after code changes
2. Check Order model has new fields
3. Verify orderController.js has calculation logic

### Issue: Commission calculation incorrect

**Solution:**
1. Check formula: `adminCommission = totalPrice * 10 / 100`
2. Verify totalPrice in request
3. Check for rounding issues

### Issue: Old orders don't have commission fields

**Expected Behavior:**
- Old orders created before Phase 5 won't have commission
- New orders will automatically include commission
- Commission only applies to orders created after implementation

## 📊 Test Results Template

```
Test Date: __________
Environment: __________

Test Case 1: ₹1000 Order
- Order Created: [ ] Yes  [ ] No
- adminCommission: ______
- sellerAmount: ______
- Calculation Correct: [ ] Yes  [ ] No

Test Case 2: ₹2500 Order
- Order Created: [ ] Yes  [ ] No
- adminCommission: ______
- sellerAmount: ______
- Calculation Correct: [ ] Yes  [ ] No

Test Case 3: ₹500 Order
- Order Created: [ ] Yes  [ ] No
- adminCommission: ______
- sellerAmount: ______
- Calculation Correct: [ ] Yes  [ ] No

Overall Result: [ ] PASS  [ ] FAIL
Notes: _________________________
```

## 🎓 Manual Calculation

To verify commission manually:

```javascript
// Given totalPrice
const totalPrice = 1000;

// Calculate commission (10%)
const adminCommission = (totalPrice * 10) / 100;
// Result: 100

// Calculate seller amount (90%)
const sellerAmount = totalPrice - adminCommission;
// Result: 900

// Verify
console.log(adminCommission + sellerAmount === totalPrice);
// Should be: true
```

## 📱 Test All Payment Methods

### COD Orders
```json
{
  "paymentMethod": "COD",
  "totalPrice": 1000
}
// Expected: commission = 100
```

### Online Payment
```json
{
  "paymentMethod": "Online",
  "totalPrice": 1000
}
// Expected: commission = 100
```

### All payment methods should calculate commission identically

## ✅ Success Criteria

Your Phase 5 implementation is successful if:

- [x] All new orders have `adminCommission` field
- [x] All new orders have `sellerAmount` field
- [x] Commission is always 10% of totalPrice
- [x] Seller amount is always 90% of totalPrice
- [x] `adminCommission + sellerAmount = totalPrice`
- [x] Commission works for all payment methods
- [x] Commission visible in API responses
- [x] Commission stored in database

## 🚀 Ready for Production

After successful testing:
1. ✅ All test cases pass
2. ✅ Commission calculations verified
3. ✅ Database storing values correctly
4. ✅ API responses include commission
5. ✅ Documentation reviewed

## 📞 Need Help?

Common Issues:
- Fields missing → Restart server
- Wrong calculation → Check formula
- Old orders → Expected behavior

Refer to:
- [PHASE5_DOCUMENTATION.md](PHASE5_DOCUMENTATION.md)
- [PHASE5_SUMMARY.md](PHASE5_SUMMARY.md)

---

**Happy Testing! 🧪**
