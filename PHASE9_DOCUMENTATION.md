# 💰 Phase 9: Withdrawal & Payout System - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Withdrawal Policies](#withdrawal-policies)
3. [Payment Methods](#payment-methods)
4. [Seller Endpoints](#seller-endpoints)
5. [Admin Endpoints](#admin-endpoints)
6. [Data Models](#data-models)
7. [Fee Calculations](#fee-calculations)
8. [Workflow Examples](#workflow-examples)
9. [Error Handling](#error-handling)
10. [Best Practices](#best-practices)

---

## Overview

The Withdrawal & Payout System allows sellers to request withdrawals from their available earnings, with admin oversight and multiple payment methods. The system includes automated approval for small amounts, comprehensive fee calculations, and batch processing capabilities.

### Key Concepts

**Available Earnings**: Amount a seller can withdraw (totalEarnings - money already withdrawn/requested)

**Auto-Approval**: Withdrawals ≤₹5,000 are auto-approved if seller has totalEarnings >₹50,000

**Processing Fee**: 2% of withdrawal amount (deducted from payout)

**Tax Deduction (TDS)**: 1% of withdrawal amount (deducted from payout)

**Net Amount**: actualAmount = requestedAmount - processingFee - taxDeduction

---

## Withdrawal Policies

### Limits & Thresholds

```javascript
{
  minAmount: 500,              // Minimum ₹500
  maxAmount: 100000,           // Maximum ₹100,000
  processingFee: 2,            // 2% processing fee
  taxDeduction: 1,             // 1% TDS
  cooldownPeriod: 24,          // 24 hours between requests
  maxPendingRequests: 3,       // Max 3 pending at once
  autoApprovalThreshold: 5000, // Auto-approve ≤₹5,000
  autoApprovalMinEarnings: 50000 // If seller totalEarnings >₹50,000
}
```

### Priority Levels

| Amount Range | Priority |
|--------------|----------|
| ₹500 - ₹5,000 | low |
| ₹5,001 - ₹25,000 | medium |
| ₹25,001+ | high |

---

## Payment Methods

### 1. Bank Transfer

**Method**: `bank_transfer`

**Required Fields**:
```javascript
{
  "paymentMethod": "bank_transfer",
  "bankDetails": {
    "accountNumber": "1234567890",
    "ifscCode": "HDFC0001234",
    "accountHolderName": "Store Name",
    "bankName": "HDFC Bank"
  }
}
```

### 2. UPI

**Method**: `upi`

**Required Fields**:
```javascript
{
  "paymentMethod": "upi",
  "upiDetails": {
    "upiId": "seller@ybl",
    "upiName": "Store Name"
  }
}
```

### 3. PayPal

**Method**: `paypal`

**Required Fields**:
```javascript
{
  "paymentMethod": "paypal",
  "paypalDetails": {
    "email": "seller@paypal.com"
  }
}
```

### 4. Razorpay Payout

**Method**: `razorpay_payout`

**Required Fields**: Same as bank_transfer (uses Razorpay Payouts API)

---

## Seller Endpoints

### 1. Get Withdrawal Policies

Get withdrawal limits, fees, and seller balance information.

**Endpoint**: `GET /api/seller/withdrawal-policies`

**Authentication**: Required (seller)

**Response**:
```json
{
  "message": "Withdrawal policies retrieved successfully",
  "policies": {
    "minAmount": 500,
    "maxAmount": 100000,
    "processingFee": 2,
    "taxDeduction": 1,
    "cooldownPeriod": 24,
    "maxPendingRequests": 3,
    "autoApprovalThreshold": 5000,
    "autoApprovalMinEarnings": 50000
  },
  "examples": {
    "withdrawal1000": {
      "requested": 1000,
      "processingFee": 20,
      "taxDeduction": 10,
      "netAmount": 970
    },
    "withdrawal10000": {
      "requested": 10000,
      "processingFee": 200,
      "taxDeduction": 100,
      "netAmount": 9700
    }
  },
  "sellerInfo": {
    "totalEarnings": 50000,
    "availableBalance": 45000,
    "pendingWithdrawals": 1
  }
}
```

---

### 2. Request Withdrawal

Create a new withdrawal request.

**Endpoint**: `POST /api/seller/withdrawals`

**Authentication**: Required (seller)

**Request Body**:
```json
{
  "amount": 5000,
  "paymentMethod": "bank_transfer",
  "bankDetails": {
    "accountNumber": "1234567890",
    "ifscCode": "HDFC0001234",
    "accountHolderName": "Tech Store",
    "bankName": "HDFC Bank"
  }
}
```

**Validation**:
- ✅ Amount between min and max
- ✅ Sufficient available balance
- ✅ No cooldown violation (24 hours since last withdrawal)
- ✅ Not exceeding max pending requests (3)
- ✅ Valid payment method
- ✅ Required payment details provided

**Response** (Success):
```json
{
  "message": "Withdrawal request created successfully",
  "withdrawal": {
    "_id": "65d1234567890abcdef12345",
    "seller": "65d1234...",
    "amount": 5000,
    "processingFee": 100,
    "taxDeduction": 50,
    "netAmount": 4850,
    "status": "approved",
    "paymentMethod": "bank_transfer",
    "priority": "low",
    "autoApproved": true,
    "bankDetails": { /* ... */ },
    "createdAt": "2026-02-17T10:00:00Z"
  }
}
```

**Auto-Approval Logic**:
```javascript
if (amount <= 5000 && seller.totalEarnings >= 50000) {
  withdrawal.status = 'approved';
  withdrawal.autoApproved = true;
}
```

**Error Responses**:
```json
// Insufficient balance
{
  "message": "Insufficient available balance. Available: ₹2000"
}

// Below minimum
{
  "message": "Withdrawal amount must be at least ₹500"
}

// Cooldown violation
{
  "message": "You must wait 24 hours between withdrawal requests"
}

// Max pending limit
{
  "message": "You have reached the maximum of 3 pending withdrawal requests"
}
```

---

### 3. Get Withdrawal History

View all withdrawal requests with filtering and statistics.

**Endpoint**: `GET /api/seller/withdrawals`

**Authentication**: Required (seller)

**Query Parameters**:
- `status` (optional): Filter by status (pending, approved, completed, rejected, failed)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20)

**Examples**:
```
GET /api/seller/withdrawals
GET /api/seller/withdrawals?status=pending
GET /api/seller/withdrawals?page=2&limit=10
GET /api/seller/withdrawals?status=completed&page=1&limit=5
```

**Response**:
```json
{
  "message": "Withdrawals retrieved successfully",
  "withdrawals": [
    {
      "_id": "65d123...",
      "amount": 5000,
      "netAmount": 4850,
      "status": "completed",
      "paymentMethod": "bank_transfer",
      "priority": "low",
      "autoApproved": true,
      "transactionId": "TXN123456",
      "createdAt": "2026-02-17T10:00:00Z",
      "processedAt": "2026-02-17T11:30:00Z",
      "completedAt": "2026-02-17T14:00:00Z"
    }
  ],
  "stats": {
    "pending": { "count": 1, "amount": 3000 },
    "approved": { "count": 0, "amount": 0 },
    "completed": { "count": 5, "amount": 25000 },
    "rejected": { "count": 1, "amount": 2000 },
    "failed": { "count": 0, "amount": 0 }
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalWithdrawals": 25
  }
}
```

---

### 4. Cancel Withdrawal

Cancel a pending withdrawal request.

**Endpoint**: `DELETE /api/seller/withdrawals/:id`

**Authentication**: Required (seller)

**Restrictions**: Only pending withdrawals can be cancelled

**Response** (Success):
```json
{
  "message": "Withdrawal request cancelled successfully",
  "withdrawal": {
    "_id": "65d123...",
    "status": "cancelled",
    "amount": 5000,
    "refundedAmount": 5000
  },
  "refund": {
    "message": "Amount refunded to your available balance",
    "refundedAmount": 5000,
    "newAvailableBalance": 47000
  }
}
```

**Error Response**:
```json
{
  "message": "You can only cancel pending withdrawal requests"
}
```

---

## Admin Endpoints

### 1. Get Withdrawal Statistics

Get comprehensive withdrawal analytics.

**Endpoint**: `GET /api/admin/withdrawals/stats`

**Authentication**: Required (admin)

**Response**:
```json
{
  "message": "Withdrawal statistics retrieved successfully",
  "totalWithdrawals": 150,
  "byStatus": {
    "pending": { "count": 12, "amount": 45000 },
    "approved": { "count": 8, "amount": 62000 },
    "completed": { "count": 100, "amount": 850000 },
    "rejected": { "count": 20, "amount": 85000 },
    "failed": { "count": 10, "amount": 48000 }
  },
  "byPaymentMethod": {
    "bank_transfer": { "count": 80, "amount": 650000 },
    "upi": { "count": 45, "amount": 180000 },
    "paypal": { "count": 15, "amount": 120000 },
    "razorpay_payout": { "count": 10, "amount": 140000 }
  },
  "todayStats": {
    "requests": 8,
    "totalAmount": 42000,
    "pendingCount": 3
  },
  "avgProcessingTime": "2.5 hours",
  "pendingAmount": 45000
}
```

---

### 2. Approve Withdrawal

Approve a pending withdrawal request.

**Endpoint**: `PUT /api/admin/withdrawals/:id/approve`

**Authentication**: Required (admin)

**Request Body**:
```json
{
  "transactionId": "TXN123456",  // Optional
  "adminNote": "Verified and approved"  // Optional
}
```

**Response** (Success):
```json
{
  "message": "Withdrawal approved successfully",
  "withdrawal": {
    "_id": "65d123...",
    "status": "approved",
    "amount": 10000,
    "netAmount": 9700,
    "transactionId": "TXN123456",
    "processedBy": {
      "_id": "65d1...",
      "name": "Admin User",
      "email": "admin@ecommerce.com"
    },
    "processedAt": "2026-02-17T12:00:00Z",
    "adminNote": "Verified and approved"
  }
}
```

**Error Responses**:
```json
// Already processed
{
  "message": "Withdrawal has already been approved"
}

// Not pending
{
  "message": "Only pending withdrawals can be approved"
}
```

---

### 3. Reject Withdrawal

Reject a pending withdrawal with reason.

**Endpoint**: `PUT /api/admin/withdrawals/:id/reject`

**Authentication**: Required (admin)

**Request Body** (rejectionReason required):
```json
{
  "rejectionReason": "Invalid bank account details",
  "adminNote": "Please verify your bank account number"
}
```

**Response** (Success):
```json
{
  "message": "Withdrawal rejected successfully",
  "withdrawal": {
    "_id": "65d123...",
    "status": "rejected",
    "rejectionReason": "Invalid bank account details",
    "processedAt": "2026-02-17T12:00:00Z"
  },
  "refund": {
    "message": "Amount refunded to seller's available balance",
    "refundedAmount": 10000
  }
}
```

---

### 4. Complete Withdrawal

Mark an approved withdrawal as paid/completed.

**Endpoint**: `PUT /api/admin/withdrawals/:id/complete`

**Authentication**: Required (admin)

**Request Body**:
```json
{
  "transactionId": "TXN_COMPLETE_001",  // Optional (if not set during approval)
  "razorpayPayoutId": "pout_ABC123",    // Optional
  "adminNote": "Payment transferred successfully"
}
```

**Response** (Success):
```json
{
  "message": "Withdrawal marked as completed",
  "withdrawal": {
    "_id": "65d123...",
    "status": "completed",
    "amount": 10000,
    "netAmount": 9700,
    "transactionId": "TXN_COMPLETE_001",
    "razorpayPayoutId": "pout_ABC123",
    "completedAt": "2026-02-17T14:00:00Z",
    "processingTime": "2 hours 15 minutes"
  }
}
```

**Error Response**:
```json
{
  "message": "Only approved withdrawals can be marked as completed"
}
```

---

### 5. Mark Withdrawal as Failed

Mark an approved withdrawal as failed (payment unsuccessful).

**Endpoint**: `PUT /api/admin/withdrawals/:id/fail`

**Authentication**: Required (admin)

**Request Body** (failureReason required):
```json
{
  "failureReason": "Bank account closed",
  "adminNote": "Payment returned, funds refunded to seller"
}
```

**Response** (Success):
```json
{
  "message": "Withdrawal marked as failed successfully",
  "withdrawal": {
    "_id": "65d123...",
    "status": "failed",
    "failureReason": "Bank account closed",
    "retryCount": 1,
    "failedAt": "2026-02-17T15:00:00Z"
  },
  "refund": {
    "message": "Amount refunded to seller's available balance",
    "refundedAmount": 10000
  }
}
```

---

### 6. Batch Approve Withdrawals

Approve multiple withdrawals at once.

**Endpoint**: `POST /api/admin/withdrawals/batch-approve`

**Authentication**: Required (admin)

**Request Body**:
```json
{
  "withdrawalIds": [
    "65d1234567890abc...",
    "65d9876543210def...",
    "65dabcdef123456..."
  ],
  "adminNote": "Batch approved on 2026-02-17"
}
```

**Response** (Success):
```json
{
  "message": "Batch approval completed",
  "results": {
    "success": [
      {
        "id": "65d1234...",
        "amount": 5000,
        "status": "approved"
      },
      {
        "id": "65d9876...",
        "amount": 3000,
        "status": "approved"
      }
    ],
    "failed": [
      {
        "id": "65dabcd...",
        "error": "Withdrawal has already been approved"
      }
    ]
  },
  "summary": {
    "total": 3,
    "successful": 2,
    "failed": 1,
    "totalAmount": 8000
  }
}
```

---

## Data Models

### Withdrawal Model

```javascript
{
  seller: ObjectId,              // Reference to User (seller)
  amount: Number,                // Requested withdrawal amount
  processingFee: Number,         // 2% of amount
  taxDeduction: Number,          // 1% of amount
  netAmount: Number,             // amount - processingFee - taxDeduction
  status: String,                // pending, approved, completed, rejected, failed, cancelled
  paymentMethod: String,         // bank_transfer, upi, paypal, razorpay_payout
  
  // Payment Details (conditional based on paymentMethod)
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String,
    bankName: String
  },
  upiDetails: {
    upiId: String,
    upiName: String
  },
  paypalDetails: {
    email: String
  },
  
  // Transaction Info
  transactionId: String,         // Bank/payment transaction ID
  razorpayPayoutId: String,      // If using Razorpay Payouts
  
  // Processing Info
  priority: String,              // low, medium, high (based on amount)
  autoApproved: Boolean,         // True if auto-approved
  processedBy: ObjectId,         // Admin who processed
  processedAt: Date,
  completedAt: Date,
  failedAt: Date,
  
  // Rejection/Failure Info
  rejectionReason: String,
  failureReason: String,
  retryCount: Number,            // Incremented on failure
  
  // Notes
  adminNote: String,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

---

## Fee Calculations

### Processing Fee (2%)
```javascript
processingFee = amount * 0.02;
// Example: ₹10,000 * 0.02 = ₹200
```

### Tax Deduction / TDS (1%)
```javascript
taxDeduction = amount * 0.01;
// Example: ₹10,000 * 0.01 = ₹100
```

### Net Amount
```javascript
netAmount = amount - processingFee - taxDeduction;
// Example: ₹10,000 - ₹200 - ₹100 = ₹9,700
```

### Examples

| Requested Amount | Processing Fee (2%) | Tax (1%) | Net Amount |
|------------------|---------------------|----------|------------|
| ₹1,000 | ₹20 | ₹10 | ₹970 |
| ₹5,000 | ₹100 | ₹50 | ₹4,850 |
| ₹10,000 | ₹200 | ₹100 | ₹9,700 |
| ₹25,000 | ₹500 | ₹250 | ₹24,250 |
| ₹50,000 | ₹1,000 | ₹500 | ₹48,500 |
| ₹100,000 | ₹2,000 | ₹1,000 | ₹97,000 |

---

## Workflow Examples

### Example 1: Standard Withdrawal (Manual Approval)

```javascript
// Step 1: Seller checks policies
GET /api/seller/withdrawal-policies

// Step 2: Seller requests withdrawal
POST /api/seller/withdrawals
{
  "amount": 15000,
  "paymentMethod": "bank_transfer",
  "bankDetails": { /* ... */ }
}
// Response: status = "pending" (amount > ₹5,000)

// Step 3: Admin reviews and approves
PUT /api/admin/withdrawals/:id/approve
{
  "transactionId": "TXN123456",
  "adminNote": "Approved after verification"
}

// Step 4: Payment is transferred

// Step 5: Admin marks as completed
PUT /api/admin/withdrawals/:id/complete
{
  "adminNote": "Payment transferred successfully"
}

// Step 6: Seller verifies
GET /api/seller/withdrawals?status=completed
```

### Example 2: Auto-Approved Withdrawal

```javascript
// Seller requests small amount (eligible for auto-approval)
POST /api/seller/withdrawals
{
  "amount": 3000,
  "paymentMethod": "upi",
  "upiDetails": {
    "upiId": "seller@okhdfcbank",
    "upiName": "Tech Store"
  }
}

// Response: status = "approved", autoApproved = true
// Payment can be processed immediately

// Admin marks as completed
PUT /api/admin/withdrawals/:id/complete
{
  "transactionId": "UPI_123456",
  "adminNote": "UPI payment successful"
}
```

### Example 3: Batch Processing

```javascript
// Admin gets list of pending withdrawals
GET /api/admin/withdrawals/stats

// Admin batch approves multiple requests
POST /api/admin/withdrawals/batch-approve
{
  "withdrawalIds": ["id1", "id2", "id3", "id4", "id5"],
  "adminNote": "Batch approved - daily processing"
}

// Response shows success/failure for each
{
  "results": {
    "success": [/* 4 approved */],
    "failed": [/* 1 already processed */]
  },
  "summary": {
    "successful": 4,
    "failed": 1,
    "totalAmount": 42000
  }
}
```

### Example 4: Failed Payment Recovery

```javascript
// Admin attempts payment but fails
PUT /api/admin/withdrawals/:id/fail
{
  "failureReason": "Invalid account number",
  "adminNote": "Payment bounced, seller notified"
}

// System automatically refunds amount to seller
// Seller updates bank details

// Seller creates new withdrawal request
POST /api/seller/withdrawals
{
  "amount": 10000,
  "paymentMethod": "bank_transfer",
  "bankDetails": { /* corrected details */ }
}

// Admin approves and completes
PUT /api/admin/withdrawals/:id/approve
PUT /api/admin/withdrawals/:id/complete
```

---

## Error Handling

### Common Error Codes

| Status Code | Error | Description |
|-------------|-------|-------------|
| 400 | Bad Request | Invalid input or validation failure |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Insufficient permissions (not seller/admin) |
| 404 | Not Found | Withdrawal request not found |
| 409 | Conflict | State conflict (e.g., already processed) |
| 500 | Server Error | Internal server error |

### Error Response Format

```json
{
  "message": "Error description",
  "error": "Detailed error information",
  "field": "specificField"  // If validation error
}
```

---

## Best Practices

### For Sellers

1. **Check Policies First**: Always check withdrawal policies before requesting
2. **Verify Payment Details**: Double-check bank/UPI/PayPal details
3. **Monitor History**: Regularly check withdrawal status
4. **Plan Withdrawals**: Consider cooldown periods and pending limits
5. **Account for Fees**: Remember 3% total deduction (2% fee + 1% tax)

### For Admins

1. **Use Batch Processing**: Approve multiple withdrawals efficiently
2. **Verify Details**: Check payment details before approving
3. **Add Notes**: Document processing decisions
4. **Monitor Stats**: Review statistics regularly
5. **Handle Failures Properly**: Mark failed payments correctly to trigger refunds

### Security Recommendations

1. **Authentication**: Always use JWT tokens
2. **Validation**: Verify all input data
3. **Audit Trail**: Track who processes each withdrawal
4. **Rate Limiting**: Implement request rate limits
5. **Notifications**: Enable email/SMS alerts for status changes

---

## Testing

### Test File
Use `test-phase9.http` for manual testing (46 test cases)

### Verification Script
Run automated tests:
```bash
node verify-phase9.js
```

Expected coverage:
- ✅ Policy retrieval
- ✅ All payment methods
- ✅ Validation rules
- ✅ Approval workflow
- ✅ Batch operations
- ✅ Authorization checks

---

## Support & Troubleshooting

### Common Issues

**Issue**: "Insufficient available balance"
- **Solution**: Check that totalEarnings - (withdrawn + pending) ≥ requested amount

**Issue**: "Cooldown violation"
- **Solution**: Wait 24 hours since last successful withdrawal

**Issue**: "Max pending requests"
- **Solution**: Cancel or wait for processing of existing requests

**Issue**: "Only pending withdrawals can be approved"
- **Solution**: Check withdrawal status, may already be processed

---

**Documentation Version**: 1.0  
**Last Updated**: February 17, 2026  
**Phase**: 9 - Withdrawal & Payout System
