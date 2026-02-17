# 🎁 COUPON SYSTEM EXAMPLES

## Real-World Usage Scenarios

---

## 📊 Example 1: Welcome Discount (15% off)

### Admin Creates Coupon
```json
POST /api/coupons
{
  "code": "WELCOME15",
  "description": "Welcome! Get 15% off your first order",
  "discountType": "percentage",
  "discountValue": 15,
  "minimumOrderAmount": 0,
  "maximumDiscount": 300,
  "expiryDate": "2026-12-31",
  "usageLimit": 1000,
  "usageLimitPerUser": 1
}
```

### Customer Uses It
```
Order Details:
- Products: ₹1500
- Shipping: ₹100
- Tax: ₹100
- Total: ₹1700

Apply WELCOME15:
- Discount: 15% of ₹1700 = ₹255
- Final Amount: ₹1700 - ₹255 = ₹1445

After Commission:
- Admin (10%): ₹144.50
- Seller (90%): ₹1300.50
```

**Customer Saves:** ₹255 💰

---

## 📊 Example 2: Flash Sale (₹200 off)

### Admin Creates Limited Time Coupon
```json
POST /api/coupons
{
  "code": "FLASH200",
  "description": "24-Hour Flash Sale - ₹200 off!",
  "discountType": "fixed",
  "discountValue": 200,
  "minimumOrderAmount": 1000,
  "startDate": "2026-03-01T00:00:00Z",
  "expiryDate": "2026-03-02T00:00:00Z",
  "usageLimit": 500,
  "usageLimitPerUser": 1
}
```

### Customer Uses It
```
Order: ₹2500
Discount: ₹200 (flat)
Final: ₹2300

Commission:
- Admin: ₹230
- Seller: ₹2070
```

**Creates Urgency:** Only 24 hours! ⏰

---

## 📊 Example 3: Loyalty Reward (20% off)

### Admin Rewards Repeat Customers
```json
POST /api/coupons
{
  "code": "LOYAL20",
  "description": "Thank you! 20% off for loyal customers",
  "discountType": "percentage",
  "discountValue": 20,
  "minimumOrderAmount": 2000,
  "maximumDiscount": 1000,
  "expiryDate": "2026-12-31",
  "usageLimitPerUser": 5
}
```

### Usage Pattern
```
Order 1: ₹3000 → 20% = ₹600 off → Pay ₹2400 ✅
Order 2: ₹2500 → 20% = ₹500 off → Pay ₹2000 ✅
Order 3: ₹8000 → 20% = ₹1600 but capped at ₹1000 → Pay ₹7000 ✅
```

**Encourages:** Repeat purchases 🔄

---

## 📊 Example 4: Category-Specific Sale

### Admin Creates Electronics Sale
```json
POST /api/coupons
{
  "code": "TECH25",
  "description": "Electronics Sale - 25% off!",
  "discountType": "percentage",
  "discountValue": 25,
  "minimumOrderAmount": 5000,
  "maximumDiscount": 2000,
  "expiryDate": "2026-06-30",
  "usageLimit": 200
}
```

### High-Value Orders
```
Gaming Laptop Order:
- Product: ₹45,000
- Shipping: ₹500
- Tax: ₹2,500
- Total: ₹48,000

Apply TECH25:
- Calculated: 25% of ₹48,000 = ₹12,000
- Applied: ₹2,000 (capped)
- Final: ₹46,000

Savings: ₹2,000
Still Big Order: ₹46,000 commission to platform
```

---

## 📊 Example 5: Minimum Order Promotion

### Admin Encourages Larger Orders
```json
POST /api/coupons
{
  "code": "BIG500",
  "description": "Spend ₹5000+ and get ₹500 off",
  "discountType": "fixed",
  "discountValue": 500,
  "minimumOrderAmount": 5000,
  "expiryDate": "2026-12-31",
  "usageLimit": null
}
```

### Scenarios
```
❌ Order ₹4,500: Cannot use (below minimum)
✅ Order ₹5,000: Get ₹500 off → Pay ₹4,500
✅ Order ₹10,000: Get ₹500 off → Pay ₹9,500
```

**Result:** Higher average order value 📈

---

## 📊 Example 6: First-Time Buyer

### Admin Converts New Visitors
```json
POST /api/coupons
{
  "code": "FIRST100",
  "description": "First order? Get ₹100 off!",
  "discountType": "fixed",
  "discountValue": 100,
  "minimumOrderAmount": 500,
  "expiryDate": "2026-12-31",
  "usageLimitPerUser": 1
}
```

### New Customer Journey
```
1. Browse products
2. Add ₹750 worth to cart
3. Apply FIRST100
4. Pay ₹650 instead of ₹750
5. Happy customer returns! 😊
```

---

## 🎯 Strategic Examples

### Example 7: Abandoned Cart Recovery
```
Code: COMEBACK15
Type: 15% off
Min: None
Message: "We miss you! Come back for 15% off"
Per User: 1
Valid: 7 days
```

### Example 8: Birthday Special
```
Code: BDAY25
Type: 25% off up to ₹500
Min: ₹1000
Message: "Happy Birthday! 🎉"
Per User: 1 (in birthday month)
Valid: 30 days
```

### Example 9: Referral Bonus
```
Code: REFER50 (auto-generated per user)
Type: ₹50 off
Min: ₹500
Message: "Referred by a friend? Save ₹50!"
Per User: 1
Valid: 90 days
```

---

## 💡 Calculation Examples

### Percentage with Cap
```
Coupon: SAVE30 (30% off, max ₹1000)

Order ₹2000:
  30% = ₹600
  Applied: ₹600 ✅
  Pay: ₹1400

Order ₹5000:
  30% = ₹1500
  Applied: ₹1000 (capped) ✅
  Pay: ₹4000

Order ₹10,000:
  30% = ₹3000
  Applied: ₹1000 (capped) ✅
  Pay: ₹9000
```

### Fixed Amount Scaling
```
Coupon: FLAT250 (₹250 off, min ₹1000)

Order ₹800: ❌ Below minimum
Order ₹1000: ₹250 off → ₹750 ✅
Order ₹5000: ₹250 off → ₹4750 ✅
Order ₹250: Would exceed order (prevented) ❌
```

---

## 📱 User Experience Flow

### Step 1: Discovery
```
User browses site
Sees banner: "Use SAVE20 for 20% off!"
Adds items to cart
```

### Step 2: Validation
```
Cart Total: ₹1500
Enters: SAVE20
System checks:
  ✓ Code exists
  ✓ Active
  ✓ Not expired
  ✓ User eligible
  ✓ Minimum met
Shows: "₹300 discount applied! 🎉"
```

### Step 3: Checkout
```
Subtotal: ₹1500
Discount: -₹300
Shipping: ₹100
Tax: ₹100
Total: ₹1400
Savings: ₹300 💰
```

### Step 4: Confirmation
```
Order #12345
Paid: ₹1400
Saved: ₹300 with SAVE20
"Thank you! Come back soon for more deals!"
```

---

## 🎊 Seasonal Campaigns

### Diwali Sale
```
Code: DIWALI40
Type: 40% off up to ₹2000
Min: ₹3000
Valid: 5 days
Limit: 1000 uses
Result: Festival boost!
```

### New Year Sale
```
Code: NEWYEAR2026
Type: Flat ₹2026 off
Min: ₹10,000
Valid: January 1-7
Limit: 100 uses
Result: High-value orders
```

### Valentine's Day
```
Code: LOVE25
Type: 25% off
Category: Gifts
Min: ₹1000
Max: ₹500
Valid: Feb 10-14
```

---

## 📊 Analytics Dashboard View

### Coupon Performance
```
SAVE10 (Active)
─────────────────
Created: 2026-01-01
Expires: 2026-12-31
Type: 10% off
Minimum: ₹500

Usage:
├─ Used: 347 times
├─ Remaining: 653 uses
├─ Revenue: ₹347,000
├─ Avg Order: ₹1,000
└─ Top User: John Doe (3 orders)

Performance:
└─ Conversion Rate: 23% 📈
```

---

## 🎯 Success Stories

### Case 1: New User Acquisition
```
Before WELCOME15:
├─ Conversion: 2%
├─ Avg Order: ₹800
└─ New Users: 50/month

After WELCOME15:
├─ Conversion: 8% ↑ 300%
├─ Avg Order: ₹1200 ↑ 50%
└─ New Users: 200/month ↑ 300%
```

### Case 2: Cart Abandonment
```
Problem: 70% cart abandonment

Solution: COMEBACK15 via email
├─ 30% opened email
├─ 40% returned
└─ 50% completed purchase

Result: Recovered 5% of lost sales
```

---

## 🔄 Multi-Use Scenarios

### User: Regular Shopper
```
Jan: Use WELCOME15 (first order) → ₹200 saved
Feb: Use LOYAL20 (1/5) → ₹300 saved
Mar: Use LOYAL20 (2/5) → ₹400 saved
Apr: Use BDAY25 (birthday month) → ₹500 saved
May: Use LOYAL20 (3/5) → ₹300 saved

Total Saved: ₹1,700
Total Spent: ₹8,500
Happy Customer: ✅
```

---

## 💰 Revenue Impact

### Scenario: ₹10,000 Order Without Coupon
```
Customer Pays: ₹10,000
Admin Commission: ₹1,000
Seller Gets: ₹9,000
```

### Same Order With SAVE20 (20%, max ₹1000)
```
Original: ₹10,000
Discount: ₹1,000
Customer Pays: ₹9,000
Admin Commission: ₹900
Seller Gets: ₹8,100

Analysis:
├─ Platform: ₹100 less commission
├─ Seller: ₹900 less revenue
└─ Customer: ₹1,000 saved → More likely to buy!
```

**Result:** Lower per-order profit, but higher volume → More total revenue 📊

---

## ✅ Best Practices

### 1. New Users
- Higher discount (15-20%)
- Low/no minimum
- One-time use

### 2. Loyalty
- Moderate discount (10-15%)
- Multiple uses allowed
- Reward frequency

### 3. High-Value
- Big discount with high minimum
- Encourages larger carts
- Limited quantity

### 4. Seasonal
- Time-limited
- Theme-based
- Recurring annually

### 5. Recovery
- Targeted to specific users
- Personalized codes
- Expiry urgency

---

**Phase 6 Coupon System** 🎁
*Drive sales, reward loyalty, win customers!*
