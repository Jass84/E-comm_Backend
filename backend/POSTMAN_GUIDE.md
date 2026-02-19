# 📮 Postman Setup Guide for E-Commerce API

## 🚀 Quick Start

### Method 1: Import Collection (Recommended)

1. **Open Postman**
2. **Click "Import"** (top left)
3. **Drag and drop** `Postman_Collection.json` file
4. **Done!** All endpoints are ready to test

### Method 2: Manual Setup

Follow the endpoints listed below.

---

## 🔑 Setup Environment Variables in Postman

1. Click **Environments** (left sidebar)
2. Create **New Environment** named "E-Commerce Dev"
3. Add these variables:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `BASE_URL` | `http://localhost:5000` | `http://localhost:5000` |
| `TOKEN` | (leave empty) | (auto-filled after login) |
| `USER_ID` | (leave empty) | (auto-filled after login) |

4. **Save** and **select** this environment

---

## 📋 Testing Flow

### Step 1: Test Server Connection
```
GET {{BASE_URL}}/
```
**Expected Response:**
```json
{
  "message": "E-commerce API is running",
  "version": "1.0.0",
  "status": "active"
}
```

---

### Step 2: Register a User

**Endpoint:** `POST {{BASE_URL}}/api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**✏️ Copy the `token` value - you'll need it!**

---

### Step 3: Register a Seller

**Endpoint:** `POST {{BASE_URL}}/api/auth/register`

**Body (raw JSON):**
```json
{
  "name": "Jane Seller",
  "email": "jane.seller@example.com",
  "password": "password123",
  "role": "seller",
  "storeName": "Jane's Store",
  "storeDescription": "Quality products at great prices"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Seller registered successfully. Waiting for admin approval.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65abc456...",
    "name": "Jane Seller",
    "email": "jane.seller@example.com",
    "role": "seller",
    "sellerApproved": false,
    "storeName": "Jane's Store"
  }
}
```

---

### Step 4: Login

**Endpoint:** `POST {{BASE_URL}}/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": "https://via.placeholder.com/150"
  }
}
```

**🔥 Important:** 
- Copy the `token` from response
- Use it in next requests

**⚡ Auto-save Token (Optional):**
In Postman, go to **Tests** tab of Login request and add:
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("TOKEN", jsonData.token);
    pm.environment.set("USER_ID", jsonData.user.id);
}
```

---

### Step 5: Get Current User (Protected Route)

**Endpoint:** `GET {{BASE_URL}}/api/auth/me`

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "_id": "65abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": "https://via.placeholder.com/150",
    "phone": "",
    "addresses": [],
    "wishlist": [],
    "cart": [],
    "isActive": true,
    "createdAt": "2026-02-13T10:30:00.000Z",
    "updatedAt": "2026-02-13T10:30:00.000Z"
  }
}
```

---

### Step 6: Update Password (Protected Route)

**Endpoint:** `PUT {{BASE_URL}}/api/auth/updatepassword`

**Headers:**
```
Authorization: Bearer {{TOKEN}}
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Password updated successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Step 7: Logout

**Endpoint:** `POST {{BASE_URL}}/api/auth/logout`

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 🛡️ Testing Protected Routes

### Admin Dashboard (Admin Only)

**Endpoint:** `GET {{BASE_URL}}/api/admin/dashboard`

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Note:** Only works if logged in as admin

---

### Seller Dashboard (Seller Only)

**Endpoint:** `GET {{BASE_URL}}/api/seller/dashboard`

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Note:** Only works if:
- Logged in as seller
- Seller is approved by admin

---

## ❌ Common Errors & Solutions

### 1. "Not authorized to access this route"
**Cause:** Missing or invalid token  
**Solution:** 
- Login again to get a new token
- Make sure Authorization header is set correctly
- Format: `Bearer YOUR_TOKEN_HERE` (space after Bearer)

### 2. "User role 'user' is not authorized"
**Cause:** Trying to access admin/seller route with user account  
**Solution:** Register and login with appropriate role

### 3. "Your seller account is pending admin approval"
**Cause:** Seller not approved yet  
**Solution:** 
- Login as admin
- Approve the seller (feature coming in next phase)
- Or manually set `sellerApproved: true` in database

### 4. "Invalid email or password"
**Cause:** Wrong credentials  
**Solution:** Check email and password

### 5. "User already exists with this email"
**Cause:** Email already registered  
**Solution:** Use a different email or login with existing account

---

## 🎯 Testing Checklist

- [ ] Server is running (GET /)
- [ ] Register User works
- [ ] Register Seller works
- [ ] Login works and returns token
- [ ] Get Current User works with token
- [ ] Update Password works
- [ ] Logout works
- [ ] Protected routes reject requests without token
- [ ] Admin route rejects non-admin users
- [ ] Seller route rejects non-seller users

---

## 💡 Pro Tips

### 1. **Use Collection Variables**
Set `{{BASE_URL}}` and `{{TOKEN}}` as variables so you don't have to update each request

### 2. **Auto-Save Token**
Add this script to Login request's **Tests** tab:
```javascript
if (pm.response.code === 200) {
    pm.environment.set("TOKEN", pm.response.json().token);
}
```

### 3. **Pre-request Script for Auth**
Add to any protected request's **Pre-request Script** tab:
```javascript
if (!pm.environment.get("TOKEN")) {
    throw new Error("Please login first to get a token");
}
```

### 4. **Test Multiple Roles**
Create 3 different users:
- User: `user@test.com`
- Seller: `seller@test.com`
- Admin: `admin@test.com`

Save their tokens in different environment variables:
- `USER_TOKEN`
- `SELLER_TOKEN`
- `ADMIN_TOKEN`

---

## 📊 Sample Test Data

### Users
```json
// Regular User
{
  "name": "Alice User",
  "email": "alice@test.com",
  "password": "password123"
}

// Seller
{
  "name": "Bob Seller",
  "email": "bob@test.com",
  "password": "password123",
  "role": "seller",
  "storeName": "Bob's Electronics",
  "storeDescription": "Quality electronics at best prices"
}

// Admin
{
  "name": "Admin",
  "email": "admin@test.com",
  "password": "admin123",
  "role": "admin"
}
```

---

## 🔍 Debugging

If something doesn't work:

1. **Check Server Logs** - Look at terminal output
2. **Check Response** - Read error messages
3. **Verify Token** - Make sure it's valid and not expired
4. **Check MongoDB** - Ensure database is connected
5. **Check .env** - Verify all settings are correct

---

## 📁 Files Created

- `Postman_Collection.json` - Import this into Postman
- `POSTMAN_GUIDE.md` - This guide

---

## 🎉 You're Ready!

Your backend is running and ready to test. Start with Step 1 and work your way through!

**Happy Testing! 🚀**
