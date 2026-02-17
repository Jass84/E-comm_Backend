# 💰 Phase 9: Withdrawal & Payout System - Quick Start Guide

## 🚀 Quick Start (5 Minutes)

Get started with the withdrawal system in just a few steps!

---

## Prerequisites

✅ Phase 7 completed (User earnings system)  
✅ Phase 8 completed (Admin dashboard)  
✅ Server running on port 5002  
✅ MongoDB connected  
✅ Seller and Admin accounts created  

---

## Step 1: Check Your Balance (Sellers)

Before requesting a withdrawal, check your available balance:

```bash
curl -X GET http://localhost:5002/api/seller/withdrawal-policies \
  -H "Authorization: Bearer YOUR_SELLER_TOKEN"
```

**Response shows**:
- Your available balance
- Withdrawal limits (₹500 - ₹100,000)
- Fees (2% processing + 1% tax)
- Examples of net amounts

---

## Step 2: Request a Withdrawal (Sellers)

Choose your preferred payment method:

### Option A: Bank Transfer

```bash
curl -X POST http://localhost:5002/api/seller/withdrawals \
  -H "Authorization: Bearer YOUR_SELLER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "paymentMethod": "bank_transfer",
    "bankDetails": {
      "accountNumber": "1234567890",
      "ifscCode": "HDFC0001234",
      "accountHolderName": "Your Store Name",
      "bankName": "HDFC Bank"
    }
  }'
```

### Option B: UPI (Fastest)

```bash
curl -X POST http://localhost:5002/api/seller/withdrawals \
  -H "Authorization: Bearer YOUR_SELLER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 3000,
    "paymentMethod": "upi",
    "upiDetails": {
      "upiId": "yourstore@ybl",
      "upiName": "Your Store Name"
    }
  }'
```

### Option C: PayPal

```bash
curl -X POST http://localhost:5002/api/seller/withdrawals \
  -H "Authorization: Bearer YOUR_SELLER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 10000,
    "paymentMethod": "paypal",
    "paypalDetails": {
      "email": "yourstore@paypal.com"
    }
  }'
```

**✅ Auto-Approval**: Amounts ≤₹5,000 are auto-approved if your total earnings >₹50,000!

---

## Step 3: Track Your Withdrawals (Sellers)

### View All Withdrawals

```bash
curl -X GET http://localhost:5002/api/seller/withdrawals \
  -H "Authorization: Bearer YOUR_SELLER_TOKEN"
```

### View Only Pending

```bash
curl -X GET http://localhost:5002/api/seller/withdrawals?status=pending \
  -H "Authorization: Bearer YOUR_SELLER_TOKEN"
```

### View Completed

```bash
curl -X GET http://localhost:5002/api/seller/withdrawals?status=completed \
  -H "Authorization: Bearer YOUR_SELLER_TOKEN"
```

---

## Step 4: Process Withdrawals (Admins)

### View Statistics Dashboard

```bash
curl -X GET http://localhost:5002/api/admin/withdrawals/stats \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**See at a glance**:
- Total pending withdrawals
- Amount requiring action
- Today's statistics
- Breakdown by status and payment method

### Approve a Single Withdrawal

```bash
curl -X PUT http://localhost:5002/api/admin/withdrawals/WITHDRAWAL_ID/approve \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "transactionId": "TXN123456",
    "adminNote": "Verified and approved"
  }'
```

### Batch Approve Multiple Withdrawals

```bash
curl -X POST http://localhost:5002/api/admin/withdrawals/batch-approve \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "withdrawalIds": [
      "WITHDRAWAL_ID_1",
      "WITHDRAWAL_ID_2",
      "WITHDRAWAL_ID_3"
    ],
    "adminNote": "Daily batch processing"
  }'
```

### Mark as Completed (After Payment)

```bash
curl -X PUT http://localhost:5002/api/admin/withdrawals/WITHDRAWAL_ID/complete \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "transactionId": "TXN123456",
    "adminNote": "Payment transferred successfully"
  }'
```

---

## 🎯 Common Scenarios

### Scenario 1: Instant Small Withdrawal

**Seller wants ₹2,000 quickly**

1. Request with UPI (fastest method)
2. Auto-approved immediately (if eligible)
3. Admin processes payment
4. Money received in minutes!

```bash
# Request
POST /api/seller/withdrawals
{
  "amount": 2000,
  "paymentMethod": "upi",
  "upiDetails": { "upiId": "store@paytm", "upiName": "Store" }
}

# Response: status = "approved", autoApproved = true
# Ready for immediate payment!
```

---

### Scenario 2: Large Withdrawal with Verification

**Seller wants ₹50,000**

1. Request via bank transfer
2. Status = "pending" (requires admin approval)
3. Admin verifies and approves
4. Admin processes payment
5. Admin marks as completed

```bash
# Step 1: Request
POST /api/seller/withdrawals
{ "amount": 50000, "paymentMethod": "bank_transfer", "bankDetails": {...} }

# Step 2: Admin approves
PUT /api/admin/withdrawals/:id/approve
{ "transactionId": "TXN789", "adminNote": "Large amount verified" }

# Step 3: Admin completes
PUT /api/admin/withdrawals/:id/complete
{ "adminNote": "NEFT transfer completed" }
```

---

### Scenario 3: Daily Batch Processing

**Admin processes 20 pending withdrawals**

```bash
# 1. View stats
GET /api/admin/withdrawals/stats
# Shows 20 pending requests

# 2. Batch approve all eligible
POST /api/admin/withdrawals/batch-approve
{
  "withdrawalIds": ["id1", "id2", ..., "id20"],
  "adminNote": "Daily processing - Feb 17"
}

# 3. Process payments in banking system

# 4. Mark all as completed (can be done individually or via script)
```

---

### Scenario 4: Failed Payment Recovery

**Bank payment bounced**

```bash
# Admin marks as failed
PUT /api/admin/withdrawals/:id/fail
{
  "failureReason": "Invalid account number",
  "adminNote": "Payment bounced, amount refunded"
}

# System automatically refunds seller
# Seller updates bank details and requests again
```

---

## 💡 Pro Tips

### For Sellers

✅ **Request small amounts for auto-approval**: Amounts ≤₹5,000 get instant approval  
✅ **Use UPI for speed**: Fastest payment method (minutes vs days)  
✅ **Check fees before requesting**: 3% total deduction (2% + 1%)  
✅ **Remember cooldown**: Wait 24 hours between withdrawals  
✅ **Limit pending requests**: Maximum 3 pending at once  

### For Admins

✅ **Use batch processing**: Save time with bulk approvals  
✅ **Add transaction IDs**: Makes tracking easier  
✅ **Document decisions**: Use adminNote for audit trail  
✅ **Check stats daily**: Monitor pending amounts  
✅ **Handle failures properly**: Always mark failed payments  

---

## 📊 Fee Calculator

Quick reference for net amounts:

| Requested | Fee (2%) | Tax (1%) | **Net Amount** |
|-----------|----------|----------|----------------|
| ₹1,000 | ₹20 | ₹10 | **₹970** |
| ₹2,500 | ₹50 | ₹25 | **₹2,425** |
| ₹5,000 | ₹100 | ₹50 | **₹4,850** |
| ₹10,000 | ₹200 | ₹100 | **₹9,700** |
| ₹25,000 | ₹500 | ₹250 | **₹24,250** |
| ₹50,000 | ₹1,000 | ₹500 | **₹48,500** |

**Formula**: Net = Amount - (Amount × 0.03)

---

## 🧪 Test It Out

### Quick Test (REST Client)

1. Open `test-phase9.http` in VS Code
2. Update tokens at the top
3. Run tests one by one or all at once

### Automated Verification

```bash
node verify-phase9.js
```

Runs 15 automated tests covering:
- Policy retrieval
- All payment methods
- Approval workflows
- Batch processing
- Security checks

---

## 🔍 Troubleshooting

### "Insufficient available balance"

**Problem**: Not enough funds to withdraw

**Solution**: 
```bash
# Check your balance
GET /api/seller/withdrawal-policies

# Shows: availableBalance vs requested amount
```

---

### "Cooldown violation"

**Problem**: Requested too soon after last withdrawal

**Solution**: Wait 24 hours from last successful withdrawal

---

### "Max pending requests"

**Problem**: Already have 3 pending withdrawals

**Solution**:
```bash
# Option 1: Cancel one
DELETE /api/seller/withdrawals/:id

# Option 2: Wait for admin to process
```

---

### "Only pending withdrawals can be approved"

**Problem**: Trying to modify already-processed withdrawal

**Solution**: Check withdrawal status first
```bash
GET /api/seller/withdrawals/:id
```

---

## 📱 Integration Examples

### React/Next.js Frontend

```jsx
// Request withdrawal
const handleWithdrawal = async (amount, method, details) => {
  const response = await fetch('http://localhost:5002/api/seller/withdrawals', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount,
      paymentMethod: method,
      [method === 'bank_transfer' ? 'bankDetails' : 
       method === 'upi' ? 'upiDetails' : 'paypalDetails']: details
    })
  });
  
  const data = await response.json();
  
  if (data.withdrawal.autoApproved) {
    alert('Withdrawal auto-approved! Payment will be processed shortly.');
  } else {
    alert('Withdrawal request submitted for admin review.');
  }
};
```

### Node.js Script (Admin Automation)

```javascript
// Daily batch processing script
const axios = require('axios');

async function dailyBatchProcess() {
  // Get all pending withdrawals
  const stats = await axios.get(
    'http://localhost:5002/api/admin/withdrawals/stats',
    { headers: { Authorization: `Bearer ${adminToken}` } }
  );
  
  const pendingCount = stats.data.byStatus.pending.count;
  
  if (pendingCount > 0) {
    // Fetch all pending IDs
    const withdrawals = await axios.get(
      'http://localhost:5002/api/admin/withdrawals?status=pending',
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    
    const ids = withdrawals.data.withdrawals.map(w => w._id);
    
    // Batch approve
    const result = await axios.post(
      'http://localhost:5002/api/admin/withdrawals/batch-approve',
      {
        withdrawalIds: ids,
        adminNote: `Auto batch: ${new Date().toLocaleDateString()}`
      },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    
    console.log(`Approved ${result.data.summary.successful} withdrawals`);
  }
}

// Run daily at 10 AM
setInterval(dailyBatchProcess, 24 * 60 * 60 * 1000);
```

---

## 🎬 Complete Workflow Example

### Real-World Scenario: Seller Withdrawal Journey

```bash
# === DAY 1 - 10:00 AM ===
# Seller checks available balance
curl -X GET http://localhost:5002/api/seller/withdrawal-policies \
  -H "Authorization: Bearer $SELLER_TOKEN"
# Response: availableBalance = ₹45,000

# === DAY 1 - 10:05 AM ===
# Seller requests ₹20,000 via bank transfer
curl -X POST http://localhost:5002/api/seller/withdrawals \
  -H "Authorization: Bearer $SELLER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 20000,
    "paymentMethod": "bank_transfer",
    "bankDetails": {
      "accountNumber": "1234567890",
      "ifscCode": "HDFC0001234",
      "accountHolderName": "Tech Store",
      "bankName": "HDFC Bank"
    }
  }'
# Response: status = "pending" (needs approval)
# Net amount: ₹19,400 (after 2% + 1% deduction)

# === DAY 1 - 2:00 PM ===
# Admin reviews and approves
curl -X PUT http://localhost:5002/api/admin/withdrawals/WITHDRAWAL_ID/approve \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "transactionId": "NEFT20240217001",
    "adminNote": "Verified identity and bank details"
  }'

# === DAY 1 - 4:00 PM ===
# Admin completes payment
curl -X PUT http://localhost:5002/api/admin/withdrawals/WITHDRAWAL_ID/complete \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "adminNote": "NEFT transferred successfully"
  }'

# === DAY 1 - 4:30 PM ===
# Seller checks status
curl -X GET http://localhost:5002/api/seller/withdrawals?status=completed \
  -H "Authorization: Bearer $SELLER_TOKEN"
# Response: Shows completed withdrawal with ₹19,400 transferred

# === DAY 2 - 10:00 AM ===
# Seller receives money in bank account ✅
```

---

## 📚 Next Steps

1. **Read Full Documentation**: Check `PHASE9_DOCUMENTATION.md` for complete API reference
2. **Run Tests**: Execute `test-phase9.http` or `verify-phase9.js`
3. **Integrate Frontend**: Build withdrawal UI using provided endpoints
4. **Setup Notifications**: Add email/SMS alerts for status changes
5. **Configure Payment Gateway**: Integrate Razorpay Payouts for automation

---

## 🆘 Need Help?

- **API Reference**: See `PHASE9_DOCUMENTATION.md`
- **Summary**: See `PHASE9_SUMMARY.md`
- **Test Examples**: See `test-phase9.http` (46 test cases)
- **Automated Tests**: Run `node verify-phase9.js`

---

**Happy withdrawing! 💰**

Built with ❤️ for Phase 9 - Withdrawal & Payout System
