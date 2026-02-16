# 🧪 Testing Phase 2 - Product & Category System

## ✅ Setup Complete!

Your Phase 2 backend is fully configured with:
- ✅ Cloudinary credentials added to `.env`
- ✅ multer-storage-cloudinary installed
- ✅ Server ready to run
- ✅ All models, controllers, and routes created

---

## 🚀 Quick Start Testing

### 1. Start the Server
```bash
cd backend
npm run dev
```

Server should show:
```
🚀 Server running in development mode on port 5000
MongoDB Connected
```

---

## 📝 Testing Flow

### Step 1: Create Admin & Seller Accounts
First, you need authenticated users. If you haven't already:

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "admin123",
  "role": "admin"
}
```

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Seller User",
  "email": "seller@test.com",
  "password": "seller123",
  "role": "seller",
  "storeName": "My Store"
}
```

### Step 2: Login and Get Tokens
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "admin123"
}
```

Save the `token` from response!

### Step 3: Approve Seller (Admin Action)
If your seller needs approval, use admin token:
```http
PUT http://localhost:5000/api/admin/approve-seller/SELLER_USER_ID
Authorization: Bearer ADMIN_TOKEN_HERE
```

---

## 🎯 Testing Categories

### Create Categories (Use Postman/Thunder Client)

1. **Create Parent Category**
```
POST http://localhost:5000/api/categories
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Electronic devices and gadgets"
}
```

2. **Create More Categories**
- Fashion
- Home & Kitchen
- Books
- Sports

3. **Get All Categories**
```
GET http://localhost:5000/api/categories
```

4. **Get Category Tree**
```
GET http://localhost:5000/api/categories/tree
```

---

## 📦 Testing Products with Image Upload

### ⚠️ Important: Use Postman for Image Uploads

**Why?** REST Client (.http files) don't support file uploads well.

### Postman Setup for Product Creation:

1. **Open Postman**
2. **Create New Request**
3. **Set Method:** POST
4. **URL:** `http://localhost:5000/api/products`
5. **Headers Tab:**
   - Authorization: `Bearer YOUR_SELLER_TOKEN`
6. **Body Tab:**
   - Select `form-data`
   - Add fields:

| Key | Type | Value |
|-----|------|-------|
| title | Text | iPhone 15 Pro |
| description | Text | Latest iPhone with advanced features |
| price | Text | 99999 |
| comparePrice | Text | 109999 |
| category | Text | CATEGORY_ID_HERE |
| brand | Text | Apple |
| stock | Text | 50 |
| tags | Text | smartphone,apple,iphone |
| images | File | (Select image files - up to 5) |
| images | File | (Select another image) |

7. **Click Send**

### Expected Response:
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "...",
    "title": "iPhone 15 Pro",
    "images": [
      {
        "url": "https://res.cloudinary.com/dapxblwry/...",
        "public_id": "ecommerce/..."
      }
    ],
    ...
  }
}
```

---

## 🔍 Testing Search & Filters

### 1. Search by Keyword
```
GET http://localhost:5000/api/products?search=iphone
```

### 2. Filter by Category
```
GET http://localhost:5000/api/products?category=CATEGORY_ID
```

### 3. Price Range Filter
```
GET http://localhost:5000/api/products?minPrice=10000&maxPrice=50000
```

### 4. Sort Options
```
# Price Low to High
GET http://localhost:5000/api/products?sort=price_asc

# Price High to Low
GET http://localhost:5000/api/products?sort=price_desc

# Highest Rated
GET http://localhost:5000/api/products?sort=rating

# Newest First
GET http://localhost:5000/api/products?sort=newest

# Most Popular
GET http://localhost:5000/api/products?sort=popular
```

### 5. Combined Filters
```
GET http://localhost:5000/api/products?category=ID&minPrice=20000&maxPrice=100000&sort=price_asc&page=1&limit=12
```

---

## 🛠️ Testing Product Management

### Update Product (Postman - form-data)
```
PUT http://localhost:5000/api/products/PRODUCT_ID
Authorization: Bearer SELLER_TOKEN

Form-data:
- title: Updated Product Name
- price: 89999
- stock: 40
- images: (new image files)
```

### Delete Product Image
```
DELETE http://localhost:5000/api/products/PRODUCT_ID/images/IMAGE_ID
Authorization: Bearer SELLER_TOKEN
```

### Delete Product
```
DELETE http://localhost:5000/api/products/PRODUCT_ID
Authorization: Bearer SELLER_TOKEN
```

---

## ⭐ Testing Reviews

### Add Review (Any authenticated user)
```
POST http://localhost:5000/api/products/PRODUCT_ID/reviews
Authorization: Bearer USER_TOKEN
Content-Type: application/json

{
  "rating": 5,
  "comment": "Excellent product! Highly recommended."
}
```

---

## 📊 Testing Seller Dashboard

### Get Dashboard Stats
```
GET http://localhost:5000/api/seller/dashboard
Authorization: Bearer SELLER_TOKEN
```

### Get Seller's Products
```
GET http://localhost:5000/api/seller/products
Authorization: Bearer SELLER_TOKEN
```

### Filter Seller's Products
```
# Active products only
GET http://localhost:5000/api/seller/products?status=active

# Low stock products
GET http://localhost:5000/api/seller/products?stock=low

# Out of stock
GET http://localhost:5000/api/seller/products?stock=out
```

---

## ✅ Complete Testing Checklist

- [ ] Server starts without errors
- [ ] Categories API
  - [ ] Create category (admin)
  - [ ] Get all categories
  - [ ] Get category tree
  - [ ] Update category (admin)
  - [ ] Delete category (admin)
- [ ] Products API
  - [ ] Create product with images (seller)
  - [ ] Get all products
  - [ ] Get single product
  - [ ] Search products
  - [ ] Filter by category
  - [ ] Filter by price range
  - [ ] Sort products
  - [ ] Update product (seller)
  - [ ] Delete product image
  - [ ] Delete product
- [ ] Reviews
  - [ ] Add review (user)
- [ ] Seller Dashboard
  - [ ] Get dashboard stats
  - [ ] Get seller's products
  - [ ] Filter products

---

## 🎨 Image Upload Testing Tips

1. **Use Small Test Images** (< 5MB each)
2. **Supported Formats:** JPG, JPEG, PNG, WEBP, GIF
3. **Max Images per Product:** 5
4. **Images are Auto-Optimized:** to 1000x1000
5. **Stored in Cloudinary:** folder `ecommerce/`

---

## 🐛 Common Issues & Solutions

### Issue: "Not authorized to access this route"
**Solution:** Make sure you included the Bearer token in Authorization header

### Issue: "Seller account pending approval"
**Solution:** Admin needs to approve the seller first

### Issue: "Image upload failed"
**Solution:** Check your Cloudinary credentials in .env file

### Issue: "Category not found"
**Solution:** Create categories first before adding products

---

## 📸 Sample Test Images

Use these or your own images:
- Phone: https://images.unsplash.com/photo-1511707171634-5f897ff02aa9
- Laptop: https://images.unsplash.com/photo-1496181133206-80ce9b88a853
- Headphones: https://images.unsplash.com/photo-1505740420928-5e560c06d30e

---

## 🎯 Next Steps After Testing

Once all tests pass:
1. ✅ Phase 2 Backend Complete
2. 🎨 Move to Frontend Development
3. 🏠 Build Home Page
4. 📋 Build Product Listing Page
5. 📄 Build Product Details Page
6. 🛍️ Build Seller Dashboard UI

---

## 📞 Need Help?

If you encounter any issues:
1. Check server logs in terminal
2. Verify MongoDB connection
3. Confirm Cloudinary credentials
4. Check user roles and permissions
5. Verify tokens are valid

---

**Phase 2 Status: ✅ READY FOR TESTING!**
