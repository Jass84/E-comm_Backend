# Database Setup Instructions

## Option 1: Local MongoDB (Recommended for Development)

### Windows:
1. **Download MongoDB:**
   - Go to https://www.mongodb.com/try/download/community
   - Download MongoDB Community Server for Windows
   - Install it (keep default settings)

2. **Start MongoDB:**
   ```powershell
   # Method 1: Start as a service (if installed as service)
   net start MongoDB
   
   # Method 2: Run manually
   "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
   ```

3. **Create data directory (if doesn't exist):**
   ```powershell
   mkdir C:\data\db
   ```

## Option 2: MongoDB Atlas (Cloud - Free Tier Available)

1. **Create Account:**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up for free

2. **Create Cluster:**
   - Click "Build a Database"
   - Choose "Free" (M0 Sandbox)
   - Select your region
   - Click "Create Cluster"

3. **Setup Database Access:**
   - Go to "Database Access" in left menu
   - Click "Add New Database User"
   - Create username and password
   - Give "Read and write to any database" permission

4. **Setup Network Access:**
   - Go to "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add your specific IP address

5. **Get Connection String:**
   - Go to "Database" in left menu
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

6. **Update .env file:**
   ```
   MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```

## Verify Connection

Once MongoDB is running (either locally or Atlas):

1. Check server logs - you should see:
   ```
   ✅ MongoDB Connected: localhost (or your Atlas host)
   🚀 Server running in development mode on port 5000
   ```

2. Test the API:
   ```bash
   curl http://localhost:5000
   ```

   You should get:
   ```json
   {
     "message": "E-commerce API is running",
     "version": "1.0.0",
     "status": "active"
   }
   ```
