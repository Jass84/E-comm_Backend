# 🚀 PHASE 6 - QUICK START GUIDE

## ⚡ Get Started in 5 Minutes

### Prerequisites
- Backend server running
- Admin account for coupon creation
- User account for testing

---

## Step 1: Create a Coupon (Admin)

### Percentage Coupon (10% off)
```http
POST http://localhost:5000/api/coupons
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "code": "SAVE10",
  "description": "Get 10% off",
  "discountType": "percentage",
  "discountValue": 10,
  "minimumOrderAmount": 500,
  "expiryDate": "2026-12-31",
  "usageLimit": 100,
  "usageLimitPerUser": 1
}
```

### Fixed Coupon (₹100 off)
```http
POST http://localhost:5000/api/coupons
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "code": "FLAT100",
  "description": "Flat ₹100 off",
  "discountType": "fixed",
  "discountValue": 100,
  "minimumOrderAmount": 500,
  "expiryDate": "2026-12-31"
}
```

---

## Step 2: View Available Coupons (User)

```http
GET http://localhost:5000/api/coupons/active
Authorization: Bearer USER_TOKEN
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "code": "SAVE10",
      "description": "Get 10% off",
      "discountType": "percentage",
      "discountValue": 10,
      "minimumOrderAmount": 500
    },
    {
      "code": "FLAT100",
      "description": "Flat ₹100 off",
      "discountType": "fixed",
      "discountValue": 100
    }
  ]
}
```

---

## Step 3: Validate Coupon (Optional)

```http
POST http://localhost:5000/api/coupons/validate
Authorization: Bearer USER_TOKEN
Content-Type: application/json

{
  "code": "SAVE10",
  "orderAmount": 1000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Coupon is valid",
  "data": {
    "code": "SAVE10",
    "discount": 100,
    "originalAmount": 1000,
    "finalAmount": 900
  }
}
```

---

## Step 4: Apply Coupon at Checkout

```http
POST http://localhost:5000/api/orders
Authorization: Bearer USER_TOKEN
Content-Type: application/json

{
  "items": [
    {
      "product": "PRODUCT_ID",
      "quantity": 1
    }
  ],
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
  "totalPrice": 1000,
  "couponCode": "SAVE10"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "orderNumber": "ORD...",
    "totalPrice": 900,
    "discountAmount": 100,
    "adminCommission": 90,
    "sellerAmount": 810,
    "couponCode": "SAVE10"
  },
  "couponApplied": {
    "code": "SAVE10",
    "discountType": "percentage",
    "discountValue": 10,
    "discount": 100
  }
}
```

---

## Step 5: Check Statistics (Admin)

```http
GET http://localhost:5000/api/coupons/COUPON_ID/stats
Authorization: Bearer ADMIN_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "code": "SAVE10",
    "usageCount": 1,
    "usageLimit": 100,
    "remainingUses": 99,
    "totalRevenue": 900,
    "averageOrderValue": 900
  }
}
```

---

## 🎯 Quick Examples

### Example 1: SAVE10 on ₹1000
```
Original: ₹1000
Discount: ₹100 (10%)
Final: ₹900
Commission: ₹90
Seller: ₹810
```

### Example 2: FLAT100 on ₹1500
```
Original: ₹1500
Discount: ₹100 (flat)
Final: ₹1400
Commission: ₹140
Seller: ₹1260
```

### Example 3: SAVE20 with Cap
```
Code: SAVE20 (20% off, max ₹500)
Original: ₹5000
Calculated: ₹1000
Capped: ₹500
Final: ₹4500
```

---

## ✅ What to Check

1. **Discount Applied**
   - Check `discountAmount` in order
   - Verify `totalPrice` reduced

2. **Coupon Info**
   - Check `couponApplied` object
   - Verify coupon details

3. **Commission Correct**
   - Commission on final amount (after discount)
   - Not on original amount

4. **Usage Tracked**
   - Check `usageCount` incremented
   - User recorded in `usedBy`

---

## 🐛 Common Issues

### Issue: "Invalid coupon code"
**Solution:** Check code spelling (case-insensitive)

### Issue: "Minimum order amount required"
**Solution:** Order must meet `minimumOrderAmount`

### Issue: "Already used this coupon"
**Solution:** Check `usageLimitPerUser`

### Issue: "Coupon has expired"
**Solution:** Check `expiryDate`

---

## 📚 Full Documentation

- 📖 Complete Guide: [PHASE6_DOCUMENTATION.md](PHASE6_DOCUMENTATION.md)
- 📝 Summary: [PHASE6_SUMMARY.md](PHASE6_SUMMARY.md)
- 🧪 All Tests: [test-phase6.http](test-phase6.http)

---

## 🎓 Discount Types

### Percentage Discount
```javascript
discount = (orderAmount × percentage) / 100
// With cap: min(calculated, maximumDiscount)
```

### Fixed Discount
```javascript
discount = discountValue
// Cannot exceed: min(discount, orderAmount)
```

---

## 🎉 You're Ready!

Phase 6 is complete and ready to use!

**Try it now:**
1. Create SAVE10 coupon
2. Make an order with coupon
3. See ₹100 discount applied!

---

**Happy Discounting! 🎁**
