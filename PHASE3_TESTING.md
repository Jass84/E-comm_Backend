# 🧪 Phase 3 Testing Guide - Cart & Checkout

## ✅ Prerequisites

Make sure you have:
1. ✅ Server running (`npm run dev`)
2. ✅ MongoDB connected
3. ✅ User, Seller, and Admin accounts created
4. ✅ At least 2-3 products created (from Phase 2)
5. ✅ Valid authentication tokens

---

## 🚀 Quick Start Testing

### Step 1: Prepare Test Data

First, make sure you have products. If not, create some using Phase 2 APIs.

### Step 2: Get Your Tokens

Login and save your tokens:
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "user@test.com",
  "password": "user123"
}
```

Save the `token` from response!

---

## 🛒 Testing Cart Flow

### Test 1: Add Item to Cart

```http
POST http://localhost:5000/api/users/cart
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "productId": "YOUR_PRODUCT_ID",
  "quantity": 2
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Item added to cart",
  "data": [...]
}
```

### Test 2: Get Cart with Summary

```http
GET http://localhost:5000/api/users/cart
Authorization: Bearer YOUR_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "cart": [
      {
        "product": {
          "_id": "...",
          "title": "iPhone 15 Pro",
          "price": 99999,
          "images": [...],
          "stock": 50
        },
        "quantity": 2
      }
    ],
    "summary": {
      "itemsPrice": 199998,
      "shippingPrice": 0,
      "taxPrice": 35999,
      "totalPrice": 235997,
      "itemCount": 2
    }
  }
}
```

### Test 3: Update Quantity

```http
PUT http://localhost:5000/api/users/cart/PRODUCT_ID
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "quantity": 5
}
```

### Test 4: Add Same Item Again (Stock Validation)

Try adding more than available stock:
```http
POST http://localhost:5000/api/users/cart
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "productId": "YOUR_PRODUCT_ID",
  "quantity": 100
}
```

**Expected:** Error message about insufficient stock

### Test 5: Remove Item from Cart

```http
DELETE http://localhost:5000/api/users/cart/PRODUCT_ID
Authorization: Bearer YOUR_TOKEN
```

### Test 6: Clear Cart

```http
DELETE http://localhost:5000/api/users/cart
Authorization: Bearer YOUR_TOKEN
```

---

## 📬 Testing Address Management

### Test 1: Add First Address

```http
POST http://localhost:5000/api/users/addresses
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "fullName": "John Doe",
  "phone": "9876543210",
  "addressLine1": "123 Main Street",
  "addressLine2": "Near Central Park",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "country": "India"
}
```

**Note:** First address is automatically set as default!

### Test 2: Add More Addresses

Add 2-3 more addresses with different cities.

### Test 3: Get All Addresses

```http
GET http://localhost:5000/api/users/addresses
Authorization: Bearer YOUR_TOKEN
```

### Test 4: Set Default Address

```http
PUT http://localhost:5000/api/users/addresses/ADDRESS_ID/default
Authorization: Bearer YOUR_TOKEN
```

### Test 5: Update Address

```http
PUT http://localhost:5000/api/users/addresses/ADDRESS_ID
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "city": "Delhi",
  "state": "Delhi",
  "pincode": "110001"
}
```

### Test 6: Delete Address

```http
DELETE http://localhost:5000/api/users/addresses/ADDRESS_ID
Authorization: Bearer YOUR_TOKEN
```

**Note:** If you delete the default address, the first remaining address becomes default!

---

## 📦 Testing Complete Checkout Flow

### Full Checkout Test

**Step 1: Add items to cart**
```http
POST http://localhost:5000/api/users/cart
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "productId": "PRODUCT_ID_1",
  "quantity": 2
}
```

**Step 2: Add another item**
```http
POST http://localhost:5000/api/users/cart
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "productId": "PRODUCT_ID_2",
  "quantity": 1
}
```

**Step 3: Get cart summary**
```http
GET http://localhost:5000/api/users/cart
Authorization: Bearer YOUR_TOKEN
```

**Step 4: Add/Select address**
```http
POST http://localhost:5000/api/users/addresses
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "fullName": "John Doe",
  "phone": "9876543210",
  "addressLine1": "123 Main Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001"
}
```

**Step 5: Create Order (Checkout)**

Use the summary from Step 3 and address from Step 4:

```http
POST http://localhost:5000/api/orders
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "items": [
    {
      "product": "PRODUCT_ID_1",
      "quantity": 2
    },
    {
      "product": "PRODUCT_ID_2",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "9876543210",
    "addressLine1": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India"
  },
  "paymentMethod": "COD",
  "itemsPrice": 199998,
  "shippingPrice": 0,
  "taxPrice": 35999,
  "totalPrice": 235997
}
```

**Expected Result:**
- ✅ Order created
- ✅ Cart cleared automatically
- ✅ Product stock reduced
- ✅ Order number generated

**Step 6: Verify Order Created**
```http
GET http://localhost:5000/api/orders/my-orders
Authorization: Bearer YOUR_TOKEN
```

---

## 📊 Testing Order Management

### Test 1: Get All My Orders

```http
GET http://localhost:5000/api/orders/my-orders
Authorization: Bearer YOUR_TOKEN
```

### Test 2: Filter Orders by Status

```http
GET http://localhost:5000/api/orders/my-orders?status=Pending
Authorization: Bearer YOUR_TOKEN
```

### Test 3: Get Single Order Details

```http
GET http://localhost:5000/api/orders/ORDER_ID
Authorization: Bearer YOUR_TOKEN
```

### Test 4: Cancel Order

```http
PUT http://localhost:5000/api/orders/ORDER_ID/cancel
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "reason": "Changed my mind"
}
```

**Expected Result:**
- ✅ Order status changed to "Cancelled"
- ✅ Product stock restored
- ✅ Cancellation reason saved

### Test 5: Verify Stock Restored

After cancelling, check the product:
```http
GET http://localhost:5000/api/products/PRODUCT_ID
```

Stock should be increased back!

---

## 👨‍💼 Testing Seller Order Management

### Test 1: Get Seller's Orders

```http
GET http://localhost:5000/api/orders/seller/orders
Authorization: Bearer SELLER_TOKEN
```

**Note:** Shows only orders containing seller's products!

### Test 2: Update Order Status - Processing

```http
PUT http://localhost:5000/api/orders/ORDER_ID/status
Authorization: Bearer SELLER_TOKEN
Content-Type: application/json

{
  "status": "Processing",
  "comment": "Order is being prepared"
}
```

### Test 3: Update to Shipped

```http
PUT http://localhost:5000/api/orders/ORDER_ID/status
Authorization: Bearer SELLER_TOKEN
Content-Type: application/json

{
  "status": "Shipped",
  "comment": "Shipped via Blue Dart - Tracking: BD123456"
}
```

### Test 4: Update to Delivered

```http
PUT http://localhost:5000/api/orders/ORDER_ID/status
Authorization: Bearer SELLER_TOKEN
Content-Type: application/json

{
  "status": "Delivered",
  "comment": "Delivered successfully to customer"
}
```

**Expected Result:**
- ✅ Status updated
- ✅ History entry added
- ✅ `deliveredAt` timestamp set
- ✅ Payment status set to "Completed"

---

## 👑 Testing Admin Order Management

### Test 1: Get All Orders

```http
GET http://localhost:5000/api/orders
Authorization: Bearer ADMIN_TOKEN
```

**Response includes:**
- All orders
- Total revenue
- Average order value

### Test 2: Filter by Status

```http
GET http://localhost:5000/api/orders?status=Delivered
Authorization: Bearer ADMIN_TOKEN
```

### Test 3: Filter by Date Range

```http
GET http://localhost:5000/api/orders?startDate=2026-02-01&endDate=2026-02-28
Authorization: Bearer ADMIN_TOKEN
```

### Test 4: Admin Update Order Status

Admin can update any order:
```http
PUT http://localhost:5000/api/orders/ORDER_ID/status
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "status": "Cancelled",
  "comment": "Cancelled by admin due to policy violation"
}
```

---

## ✅ Complete Testing Checklist

### Cart Operations
- [ ] Add item to cart
- [ ] Add same item (quantity increase)
- [ ] Get cart with correct summary
- [ ] Update quantity
- [ ] Try exceeding stock (should fail)
- [ ] Remove item
- [ ] Clear cart
- [ ] Cart persists across requests

### Address Management
- [ ] Add first address (auto-default)
- [ ] Add multiple addresses
- [ ] Get all addresses
- [ ] Update address
- [ ] Set default address
- [ ] Delete address
- [ ] Delete default address (next becomes default)

### Order Creation
- [ ] Create order with multiple items
- [ ] Verify stock deduction
- [ ] Verify cart cleared
- [ ] Order number generated
- [ ] Shipping address saved
- [ ] Payment method set

### Order Management
- [ ] Get user's orders
- [ ] Filter by status
- [ ] Pagination works
- [ ] Get single order details
- [ ] Cancel order
- [ ] Stock restored on cancel
- [ ] Cannot cancel delivered order

### Seller Orders
- [ ] Get seller's orders only
- [ ] Update order status
- [ ] Status history maintained
- [ ] Cannot update other seller's orders

### Admin Orders
- [ ] Get all orders
- [ ] Revenue statistics shown
- [ ] Filter by status
- [ ] Filter by date
- [ ] Can update any order

---

## 🐛 Common Issues & Solutions

### Issue: "Product not found in cart"
**Solution:** Make sure you're using the correct product ID

### Issue: "Insufficient stock"
**Solution:** Check product stock before adding to cart

### Issue: "Not authorized"
**Solution:** Check your token is correct and user role matches

### Issue: "Cannot cancel delivered order"
**Solution:** This is expected - delivered orders can't be cancelled

### Issue: Cart is empty after order
**Solution:** This is expected - cart is cleared after successful order

---

## 📈 Cart Calculation Logic

```javascript
// Example calculation
Items Price: ₹49,999 (2 items × ₹24,999 + 1 item × ₹24,999)
Shipping:    ₹0       (Free shipping > ₹500)
Tax (18%):   ₹8,999
─────────────────────
Total:       ₹58,998
```

**Shipping Logic:**
- Order < ₹500: ₹50 shipping
- Order ≥ ₹500: Free shipping

**Tax:**
- Always 18% GST on items price

---

## 🎯 Success Criteria

Phase 3 is complete when:
- ✅ All cart operations work
- ✅ Address management works
- ✅ Orders can be created
- ✅ Stock management works correctly
- ✅ Order status updates work
- ✅ Cancellation restores stock
- ✅ Seller sees only their orders
- ✅ Admin can manage all orders

---

## 🚀 Next Steps

After backend testing:
1. **Frontend Development**
   - Set up Redux store
   - Create cart page
   - Create checkout flow
   - Create order pages
   - Create address management UI

2. **LocalStorage Integration**
   - Store cart in localStorage
   - Sync on login
   - Persist across sessions

3. **UI/UX Enhancement**
   - Cart animations
   - Loading states
   - Success messages
   - Error handling

---

**Phase 3 Backend: ✅ READY FOR TESTING!**

Use [test-phase3.http](test-phase3.http) file to test all endpoints!
