# 🧪 PHASE 6 TESTING GUIDE

## Comprehensive Testing for Coupon System

---

## 🚀 Quick Test Checklist

- [ ] Admin can create percentage coupons
- [ ] Admin can create fixed coupons
- [ ] Users can view active coupons
- [ ] Users can validate coupons
- [ ] Coupons apply at checkout
- [ ] Discount calculates correctly
- [ ] Usage limits enforced
- [ ] Per-user limits enforced
- [ ] Expired coupons rejected
- [ ] Minimum order validated
- [ ] Maximum discount capped
- [ ] Commission on final amount
- [ ] Statistics tracked

---

## 🧪 Test Scenario 1: Create Percentage Coupon

### Test: 10% Off Coupon

**Request:**
```http
POST /api/coupons
Authorization: Bearer ADMIN_TOKEN

{
  "code": "TEST10",
  "description": "Test 10% off",
  "discountType": "percentage",
  "discountValue": 10,
  "minimumOrderAmount": 500,
  "expiryDate": "2026-12-31",
  "usageLimit": 10,
  "usageLimitPerUser": 1
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Coupon created successfully",
  "data": {
    "code": "TEST10",
    "discountType": "percentage",
    "discountValue": 10,
    "minimumOrderAmount": 500,
    "usageLimit": 10,
    "isActive": true
  }
}
```

**Verify:**
- ✅ Status 201
- ✅ Coupon code uppercase
- ✅ All fields saved correctly
- ✅ `isActive` is true

---

## 🧪 Test Scenario 2: Create Fixed Coupon

### Test: ₹100 Flat Discount

**Request:**
```http
POST /api/coupons

{
  "code": "FLAT100",
  "discountType": "fixed",
  "discountValue": 100,
  "minimumOrderAmount": 500,
  "expiryDate": "2026-12-31"
}
```

**Expected:**
- ✅ Coupon created
- ✅ No maximum discount needed for fixed
- ✅ Default `usageLimitPerUser` is 1

---

## 🧪 Test Scenario 3: Validation Tests

### Test 3.1: Valid Coupon
```http
POST /api/coupons/validate

{
  "code": "TEST10",
  "orderAmount": 1000
}

Expected:
{
  "discount": 100,
  "finalAmount": 900
}
✅ Pass
```

### Test 3.2: Insufficient Amount
```http
POST /api/coupons/validate

{
  "code": "TEST10",
  "orderAmount": 300
}

Expected:
"Minimum order amount of ₹500 required"
✅ Pass if error returned
```

### Test 3.3: Invalid Code
```http
POST /api/coupons/validate

{
  "code": "INVALID",
  "orderAmount": 1000
}

Expected:
"Invalid coupon code"
✅ Pass if 404 error
```

---

## 🧪 Test Scenario 4: Apply at Checkout

### Test 4.1: Order with Valid Coupon

**Request:**
```http
POST /api/orders

{
  "items": [...],
  "totalPrice": 1000,
  "couponCode": "TEST10"
}
```

**Expected Response:**
```json
{
  "data": {
    "totalPrice": 900,
    "discountAmount": 100,
    "adminCommission": 90,
    "sellerAmount": 810
  },
  "couponApplied": {
    "code": "TEST10",
    "discount": 100
  }
}
```

**Verify:**
- ✅ Total reduced by ₹100
- ✅ Discount amount recorded
- ✅ Commission on ₹900 (not ₹1000)
- ✅ Coupon usage incremented

### Test 4.2: Order with Invalid Coupon

**Request:**
```http
POST /api/orders

{
  "items": [...],
  "totalPrice": 1000,
  "couponCode": "INVALID"
}
```

**Expected:**
- ❌ Error: "Invalid coupon code"
- ❌ Order not created

---

## 🧪 Test Scenario 5: Usage Limits

### Test 5.1: Per-User Limit

**Setup:**
Coupon `TEST10` has `usageLimitPerUser: 1`

**Test:**
```
1. User creates order with TEST10 → ✅ Success
2. Same user tries TEST10 again → ❌ Error
```

**Expected Error:**
"You have already used this coupon 1 time(s)"

**Verify:**
- ✅ First use works
- ✅ Second use blocked

### Test 5.2: Total Usage Limit

**Setup:**
Coupon has `usageLimit: 10`

**Test:**
```
1. Create order #1 → usage: 1
2. Create order #2 → usage: 2
...
10. Create order #10 → usage: 10
11. Create order #11 → ❌ Error
```

**Expected Error:**
"This coupon has reached its usage limit"

---

## 🧪 Test Scenario 6: Expiry Date

### Test 6.1: Active Coupon

**Setup:**
```
expiryDate: "2026-12-31"
today: "2026-06-15"
```

**Result:** ✅ Coupon works

### Test 6.2: Expired Coupon

**Setup:**
```
expiryDate: "2024-12-31"
today: "2026-06-15"
```

**Test:**
```http
POST /api/coupons/validate

{
  "code": "EXPIRED",
  "orderAmount": 1000
}
```

**Expected Error:**
"This coupon has expired"

---

## 🧪 Test Scenario 7: Maximum Discount Cap

### Test: 20% with ₹500 cap

**Setup:**
```json
{
  "code": "SAVE20",
  "discountType": "percentage",
  "discountValue": 20,
  "maximumDiscount": 500
}
```

**Test Cases:**

| Order | Calculated | Applied | Pass? |
|-------|------------|---------|-------|
| ₹1000 | ₹200 | ₹200 | ✅ |
| ₹2000 | ₹400 | ₹400 | ✅ |
| ₹3000 | ₹600 | ₹500 | ✅ |
| ₹5000 | ₹1000 | ₹500 | ✅ |

**Verify:**
- When calculated < max → Use calculated
- When calculated > max → Use max

---

## 🧪 Test Scenario 8: Discount Calculations

### Test 8.1: Percentage Discount

```
Coupon: 10% off
Order: ₹1000

Calculation:
discount = (1000 × 10) / 100 = ₹100
final = 1000 - 100 = ₹900

✅ Verify: discount = 100, final = 900
```

### Test 8.2: Fixed Discount

```
Coupon: ₹100 off
Order: ₹1500

Calculation:
discount = ₹100
final = 1500 - 100 = ₹1400

✅ Verify: discount = 100, final = 1400
```

### Test 8.3: Fixed Exceeds Order

```
Coupon: ₹100 off
Order: ₹80

Calculation:
discount = min(100, 80) = ₹80
final = 80 - 80 = ₹0

✅ Prevent: Order can't be free
```

---

## 🧪 Test Scenario 9: Commission Accuracy

### Test: Commission on Discounted Amount

**Setup:**
```
Order: ₹1000
Coupon: 10% off = ₹100
Final: ₹900
```

**Expected:**
```
adminCommission = 900 × 10 / 100 = ₹90
sellerAmount = 900 - 90 = ₹810
```

**Verify:**
```json
{
  "totalPrice": 900,
  "discountAmount": 100,
  "adminCommission": 90,  // ← Not 100
  "sellerAmount": 810     // ← Not 900
}
```

**Critical:**
- ✅ Commission on ₹900, not ₹1000
- ✅ Seller gets amount after both discount and commission

---

## 🧪 Test Scenario 10: Admin Management

### Test 10.1: View All Coupons

```http
GET /api/coupons
Authorization: Bearer ADMIN_TOKEN

Expected:
- List of all coupons
- Pagination working
- Filters working
```

### Test 10.2: Update Coupon

```http
PUT /api/coupons/:id

{
  "discountValue": 15,
  "isActive": false
}

Verify:
- ✅ Values updated
- ✅ Inactive coupons don't work
```

### Test 10.3: Delete Coupon

**Unused Coupon:**
```
DELETE /api/coupons/:id
Expected: ✅ Deleted
```

**Used Coupon:**
```
DELETE /api/coupons/:id
Expected: ⚠️ Deactivated (not deleted)
```

---

## 🧪 Test Scenario 11: Statistics

### Test: Usage Statistics

```http
GET /api/coupons/:id/stats

Expected:
{
  "usageCount": 5,
  "usageLimit": 10,
  "remainingUses": 5,
  "totalRevenue": 5000,
  "averageOrderValue": 1000,
  "recentUsage": [...]
}
```

**Verify:**
- ✅ Counts accurate
- ✅ Revenue calculated
- ✅ Average correct
- ✅ Recent usage shown

---

## 🧪 Test Scenario 12: Edge Cases

### Test 12.1: Case Insensitive Code

```
Create: "save10"
Use: "SAVE10" → ✅ Works
Use: "Save10" → ✅ Works
Use: "SaVe10" → ✅ Works
```

### Test 12.2: Whitespace

```
Code with spaces: "SAVE 10"
Stored as: "SAVE10"
✅ Trimmed automatically
```

### Test 12.3: Zero Amount Order

```
Order: ₹0
Coupon: Any
Expected: ❌ Validation error
```

### Test 12.4: Future Start Date

```
Coupon:
  startDate: "2026-12-01"
  today: "2026-06-15"

Expected:
"This coupon is not yet active"
```

---

## 📊 Test Results Template

```
Date: __________
Tester: __________
Environment: __________

Test Results:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Scenario 1: Create Percentage Coupon
Status: [ ] Pass [ ] Fail
Notes: _______________________

Scenario 2: Create Fixed Coupon
Status: [ ] Pass [ ] Fail
Notes: _______________________

Scenario 3: Validation Tests
3.1 Valid Coupon: [ ] Pass [ ] Fail
3.2 Insufficient Amount: [ ] Pass [ ] Fail
3.3 Invalid Code: [ ] Pass [ ] Fail

Scenario 4: Apply at Checkout
4.1 Valid Coupon: [ ] Pass [ ] Fail
4.2 Invalid Coupon: [ ] Pass [ ] Fail

Scenario 5: Usage Limits
5.1 Per-User Limit: [ ] Pass [ ] Fail
5.2 Total Limit: [ ] Pass [ ] Fail

Scenario 6: Expiry Date
6.1 Active Coupon: [ ] Pass [ ] Fail
6.2 Expired Coupon: [ ] Pass [ ] Fail

Scenario 7: Maximum Discount
Status: [ ] Pass [ ] Fail

Scenario 8: Calculations
8.1 Percentage: [ ] Pass [ ] Fail
8.2 Fixed: [ ] Pass [ ] Fail

Scenario 9: Commission
Status: [ ] Pass [ ] Fail

Scenario 10: Admin Management
10.1 View All: [ ] Pass [ ] Fail
10.2 Update: [ ] Pass [ ] Fail
10.3 Delete: [ ] Pass [ ] Fail

Scenario 11: Statistics
Status: [ ] Pass [ ] Fail

Scenario 12: Edge Cases
12.1 Case Insensitive: [ ] Pass [ ] Fail
12.2 Whitespace: [ ] Pass [ ] Fail
12.3 Zero Amount: [ ] Pass [ ] Fail
12.4 Future Start: [ ] Pass [ ] Fail

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Overall: [ ] All Pass [ ] Some Fail

Issues Found:
_______________________
_______________________
```

---

## 🎯 Performance Tests

### Load Test: Multiple Users

```
Scenario:
- 100 users
- Each uses same coupon
- Usage limit: 50

Expected:
- First 50: ✅ Success
- Next 50: ❌ Limit reached
- No race conditions
```

### Concurrent Usage Test

```
Scenario:
- User A and B simultaneously
- Same coupon, limit 1

Expected:
- One succeeds
- One fails
- Database consistency
```

---

## 🔧 Troubleshooting Guide

### Issue: Discount Not Applied

**Check:**
1. Coupon code spelling
2. Order meets minimum
3. Coupon not expired
4. Usage limit not reached
5. User eligible

### Issue: Wrong Discount Amount

**Check:**
1. Percentage vs fixed type
2. Maximum discount cap
3. Calculation on itemsPrice
4. Rounding to 2 decimals

### Issue: Commission Incorrect

**Check:**
1. Calculated on final amount (after discount)
2. Not on original amount
3. 10% rate applied
4. Rounding correct

---

## ✅ Final Checklist

Before marking Phase 6 complete:

- [ ] All 12 test scenarios pass
- [ ] No errors in console
- [ ] Database records accurate
- [ ] API responses correct
- [ ] Commission calculated properly
- [ ] Usage tracking working
- [ ] Statistics accurate
- [ ] Edge cases handled
- [ ] Error messages clear
- [ ] Documentation reviewed

---

## 📞 Need Help?

Common Issues:
- **Validation fails** → Check all conditions
- **Discount wrong** → Verify calculation
- **Usage not tracked** → Check incrementUsage call
- **Stats incorrect** → Verify database queries

Refer to:
- [PHASE6_DOCUMENTATION.md](PHASE6_DOCUMENTATION.md)
- [PHASE6_EXAMPLES.md](PHASE6_EXAMPLES.md)
- [test-phase6.http](test-phase6.http)

---

**Happy Testing! 🧪**
