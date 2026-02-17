# PHASE 6 - COUPON SYSTEM

## 📋 Overview
Complete coupon/discount system allowing admins to create and manage coupons, and customers to apply them at checkout for discounts.

**Timeline:** 2 days

## 🎯 Features Implemented

### 1. Coupon Types
- **Percentage Discount** - Get X% off (e.g., 10%, 20%, 50%)
- **Fixed Discount** - Get flat amount off (e.g., ₹100, ₹250, ₹500)

### 2. Coupon Controls
- ✅ **Expiry Date** - Auto-disable after date
- ✅ **Usage Limit** - Total times coupon can be used
- ✅ **Per-User Limit** - Times each user can use
- ✅ **Minimum Order** - Required order amount
- ✅ **Maximum Discount** - Cap for percentage coupons
- ✅ **Start Date** - Schedule future coupons
- ✅ **Active/Inactive** - Toggle availability

### 3. Validation System
- Real-time coupon validation
- Check expiry, usage limits, user eligibility
- Verify minimum order amount
- Apply maximum discount caps

### 4. Checkout Integration
- Apply coupon during order creation
- Automatic discount calculation
- Update order total
- Commission calculated on discounted amount

## 📊 Coupon Structure

### Coupon Fields
```javascript
{
  code: "SAVE10",                    // Unique coupon code (uppercase)
  description: "Get 10% off",        // User-friendly description
  discountType: "percentage",        // "percentage" or "fixed"
  discountValue: 10,                 // 10% or ₹10
  minimumOrderAmount: 500,           // Min ₹500 required
  maximumDiscount: 200,              // Max ₹200 off (for percentage)
  startDate: "2026-01-01",          // When coupon becomes active
  expiryDate: "2026-12-31",         // When coupon expires
  usageLimit: 100,                   // Total 100 uses (null = unlimited)
  usageLimitPerUser: 1,              // Each user can use 1 time
  usageCount: 0,                     // Current usage count
  isActive: true,                    // Active/Inactive toggle
  createdBy: "admin_id"              // Admin who created it
}
```

## 🔧 Implementation Details

### 1. Coupon Model
**File:** `models/Coupon.js`

**Key Features:**
- Unique coupon codes (auto-uppercase)
- Virtual fields: `isExpired`, `isValid`
- Methods: `canUserUseCoupon()`, `calculateDiscount()`, `incrementUsage()`
- Indexes for fast lookups

**Validation Rules:**
```javascript
// Percentage cannot exceed 100%
if (discountType === 'percentage' && discountValue > 100) {
  return error;
}

// Expiry date must be in future
if (expiryDate < new Date()) {
  return error;
}
```

### 2. Coupon Controller
**File:** `controllers/couponController.js`

**Admin Functions:**
- `createCoupon` - Create new coupon
- `getAllCoupons` - List all coupons (with filters)
- `getCouponById` - Get single coupon details
- `updateCoupon` - Update coupon settings
- `deleteCoupon` - Delete/deactivate coupon
- `getCouponStats` - Usage statistics

**User Functions:**
- `validateCoupon` - Check if coupon is valid
- `getActiveCoupons` - List available coupons

### 3. Order Integration
**File:** `controllers/orderController.js`

**Checkout Flow:**
```javascript
1. User provides coupon code in order
2. System validates coupon:
   ✓ Exists?
   ✓ Active?
   ✓ Not expired?
   ✓ Within usage limit?
   ✓ User eligible?
   ✓ Minimum order met?
3. Calculate discount
4. Apply to order total
5. Calculate commission on discounted amount
6. Increment coupon usage
7. Create order with discount
```

## 💰 Discount Calculation

### Percentage Discount
```javascript
// 10% off on ₹1000
discount = (1000 * 10) / 100 = ₹100
finalAmount = 1000 - 100 = ₹900

// With maximum cap
discount = (5000 * 20) / 100 = ₹1000
cappedDiscount = Math.min(1000, 500) = ₹500
finalAmount = 5000 - 500 = ₹4500
```

### Fixed Discount
```javascript
// Flat ₹100 off on ₹1000
discount = ₹100
finalAmount = 1000 - 100 = ₹900

// Cannot exceed order amount
discount = min(orderAmount, discountValue)
```

## 📈 Examples

### Example 1: Percentage Coupon

**Create Coupon:**
```json
{
  "code": "SAVE10",
  "description": "Get 10% off",
  "discountType": "percentage",
  "discountValue": 10,
  "minimumOrderAmount": 500,
  "maximumDiscount": 200,
  "expiryDate": "2026-12-31",
  "usageLimit": 100,
  "usageLimitPerUser": 1
}
```

**Apply on ₹1000 Order:**
```
Original Amount: ₹1000
Discount (10%): -₹100
Final Amount: ₹900
Admin Commission (10%): ₹90
Seller Amount: ₹810
```

### Example 2: Fixed Coupon

**Create Coupon:**
```json
{
  "code": "FLAT100",
  "description": "Flat ₹100 off",
  "discountType": "fixed",
  "discountValue": 100,
  "minimumOrderAmount": 500,
  "expiryDate": "2026-12-31",
  "usageLimit": 200
}
```

**Apply on ₹1500 Order:**
```
Original Amount: ₹1500
Discount: -₹100
Final Amount: ₹1400
Admin Commission (10%): ₹140
Seller Amount: ₹1260
```

### Example 3: Capped Percentage

**Create Coupon:**
```json
{
  "code": "SAVE20",
  "discountType": "percentage",
  "discountValue": 20,
  "maximumDiscount": 500
}
```

**Apply on ₹5000 Order:**
```
Original Amount: ₹5000
Calculated Discount (20%): ₹1000
Applied Discount (capped): ₹500
Final Amount: ₹4500
```

## 🚀 API Endpoints

### Admin Endpoints

```
POST   /api/coupons              Create coupon
GET    /api/coupons              Get all coupons
GET    /api/coupons/:id          Get single coupon
PUT    /api/coupons/:id          Update coupon
DELETE /api/coupons/:id          Delete coupon
GET    /api/coupons/:id/stats    Get usage stats
```

### User Endpoints

```
POST   /api/coupons/validate     Validate coupon
GET    /api/coupons/active       Get active coupons
```

### Order Endpoint (with coupon)

```
POST   /api/orders               Create order with coupon
Body: {
  ...orderDetails,
  "couponCode": "SAVE10"
}
```

## 🧪 Testing

### Test Scenarios

1. **Create Different Coupon Types**
   - Percentage discount
   - Fixed discount
   - With/without limits

2. **Validate Coupons**
   - Valid coupon
   - Expired coupon
   - Inactive coupon
   - Used up coupon
   - Insufficient order amount

3. **Apply at Checkout**
   - Order with valid coupon
   - Order with invalid coupon
   - Multiple orders with same coupon
   - Verify discount calculation
   - Check commission on discounted amount

4. **Admin Management**
   - Update coupon settings
   - Deactivate coupon
   - View usage statistics
   - Delete unused coupon

### Test File
Use `test-phase6.http` for comprehensive testing:
- 26 test cases
- All CRUD operations
- Validation scenarios
- Checkout integration
- Edge cases

## 📝 Order Response with Coupon

```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "orderNumber": "ORD1234567890",
    "totalPrice": 900,
    "discountAmount": 100,
    "adminCommission": 90,
    "sellerAmount": 810,
    "couponCode": "SAVE10",
    "orderStatus": "Pending",
    ...
  },
  "couponApplied": {
    "code": "SAVE10",
    "discountType": "percentage",
    "discountValue": 10,
    "discount": 100
  }
}
```

## 🔍 Validation Rules

### Coupon Validation Checklist
```
✓ Coupon exists
✓ Coupon is active
✓ Start date has passed
✓ Not expired
✓ Usage limit not reached
✓ User hasn't exceeded per-user limit
✓ Order meets minimum amount
✓ Discount calculation correct
```

### Error Messages
```javascript
"Invalid coupon code"
"This coupon is no longer active"
"This coupon is not yet active"
"This coupon has expired"
"This coupon has reached its usage limit"
"You have already used this coupon X time(s)"
"Minimum order amount of ₹X required"
```

## 💡 Business Logic

### Commission on Discounted Amount
```javascript
// Order: ₹1000
// Discount: ₹100
// Final: ₹900

// Commission calculated on ₹900, not ₹1000
adminCommission = 900 * 10 / 100 = ₹90
sellerAmount = 900 - 90 = ₹810
```

### Usage Tracking
- Total usage count incremented
- User ID and timestamp recorded
- Order value stored for analytics
- Cannot be decremented (audit trail)

### Coupon Deletion
- Unused coupons: Can be deleted
- Used coupons: Deactivated instead
- Maintains data integrity

## 📊 Coupon Statistics

**Available Stats:**
- Total usage count
- Remaining uses
- Total revenue generated
- Average order value
- Recent usage history
- User-wise breakdown

**Example:**
```json
{
  "code": "SAVE10",
  "usageCount": 45,
  "usageLimit": 100,
  "remainingUses": 55,
  "totalRevenue": 45000,
  "averageOrderValue": 1000,
  "recentUsage": [...]
}
```

## 🎓 Usage Scenarios

### Scenario 1: Welcome Discount
```
Code: WELCOME15
Type: 15% off
Minimum: ₹0
Max Discount: ₹300
Per User: 1
Use Case: First-time buyers
```

### Scenario 2: Seasonal Sale
```
Code: SUMMER25
Type: 25% off
Minimum: ₹1000
Max Discount: ₹1000
Usage Limit: 500
Use Case: Summer sale campaign
```

### Scenario 3: Loyalty Reward
```
Code: LOYAL100
Type: Flat ₹100
Minimum: ₹500
Per User: 5
Use Case: Reward repeat customers
```

## 🔒 Security Features

- ✅ Coupon codes auto-uppercase (consistency)
- ✅ Admin-only creation/modification
- ✅ Server-side validation only
- ✅ Usage tracking prevents abuse
- ✅ Per-user limits enforced
- ✅ Cannot manipulate discount amount

## 📈 Future Enhancements

### Category-Specific Coupons
```javascript
applicableCategories: ['Electronics', 'Fashion']
```

### User-Specific Coupons
```javascript
applicableUsers: [userId1, userId2]
```

### Auto-Apply Coupons
```javascript
autoApply: true  // Best coupon applied automatically
```

### Stackable Coupons
```javascript
stackable: true  // Multiple coupons can be combined
```

### Referral Coupons
```javascript
referralReward: 50  // Both parties get ₹50
```

## ✅ Success Criteria

- [x] Admin can create coupons
- [x] Both percentage and fixed types work
- [x] Expiry dates enforced
- [x] Usage limits tracked
- [x] Validation at checkout
- [x] Discount applied correctly
- [x] Order total updated
- [x] Commission on discounted amount
- [x] User limits enforced
- [x] Statistics available

## 📁 Files Created/Modified

### New Files
1. `models/Coupon.js` - Coupon data model
2. `controllers/couponController.js` - Coupon logic
3. `test-phase6.http` - Test cases

### Modified Files
1. `routes/couponRoutes.js` - Implemented routes
2. `controllers/orderController.js` - Coupon integration

## 🚀 Quick Start

### 1. Restart Server
```bash
cd backend
npm start
```

### 2. Create a Coupon (Admin)
```bash
POST /api/coupons
{
  "code": "SAVE10",
  "discountType": "percentage",
  "discountValue": 10,
  "expiryDate": "2026-12-31"
}
```

### 3. Apply at Checkout
```bash
POST /api/orders
{
  ...orderDetails,
  "totalPrice": 1000,
  "couponCode": "SAVE10"
}
```

### 4. Verify Discount
Check response for:
- `discountAmount: 100`
- `totalPrice: 900`
- `couponApplied: {...}`

## 🎉 Phase 6 Complete!

Coupon system is fully functional:
- ✅ Create and manage coupons
- ✅ Real-time validation
- ✅ Automatic discount application
- ✅ Usage tracking and limits
- ✅ Integration with orders
- ✅ Commission calculated correctly

---
**Status:** ✅ COMPLETED
**Next Phase:** Phase 7 (TBD)
