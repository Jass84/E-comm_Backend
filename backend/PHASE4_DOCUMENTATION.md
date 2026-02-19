# 💳 Phase 4 - Razorpay Payment Integration

## ✅ Completed Features

### Backend Implementation

#### 1. **Razorpay Configuration** (`config/razorpay.js`)
- Razorpay instance initialization
- Key ID and Secret configuration
- Ready for production and test modes

#### 2. **Payment Controller** (`controllers/paymentController.js`)
- ✅ Create Razorpay order
- ✅ Verify payment signature
- ✅ Handle payment success
- ✅ Handle payment failure
- ✅ Get Razorpay key (frontend)
- ✅ Fetch payment details
- ✅ Initiate refunds (admin)
- ✅ Webhook handler for Razorpay events

#### 3. **Updated Order Controller**
- ✅ Support both COD and Online payments
- ✅ Stock deduction logic based on payment method
- ✅ Cart clearing based on payment status

#### 4. **Payment Routes** (`routes/paymentRoutes.js`)
- All payment-related endpoints configured
- Proper authorization and protection

---

## 🎯 Payment Flow

### Online Payment Flow (Razorpay)

```
1. User adds items to cart
   ↓
2. User proceeds to checkout
   ↓
3. User selects "Online Payment"
   ↓
4. Backend creates order (paymentMethod: "Online")
   [Order Status: Pending, Payment Status: Pending]
   ↓
5. Backend creates Razorpay order
   [Returns: razorpay_order_id]
   ↓
6. Frontend opens Razorpay checkout
   [User pays via UPI/Card/Netbanking/Wallet]
   ↓
7. Razorpay returns payment details
   [razorpay_payment_id, razorpay_signature]
   ↓
8. Frontend sends to backend for verification
   ↓
9. Backend verifies signature
   ✅ If valid:
      - Update order: Payment Status = Completed
      - Update order: Order Status = Processing
      - Deduct stock from products
      - Clear user's cart
      - Send success response
   ❌ If invalid:
      - Send error response
      - Order remains in Pending state
```

### COD Payment Flow

```
1. User adds items to cart
   ↓
2. User proceeds to checkout
   ↓
3. User selects "COD"
   ↓
4. Backend creates order immediately
   - Deduct stock
   - Clear cart
   - Payment Status: Pending
   - Order Status: Pending
   ↓
5. Order confirmed!
   ↓
6. On delivery, mark Payment Status = Completed
```

---

## 📊 API Endpoints

### Payment APIs

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/payment/razorpay-key` | Private | Get Razorpay key for frontend |
| POST | `/api/payment/create-order` | Private | Create Razorpay order |
| POST | `/api/payment/verify` | Private | Verify payment |
| POST | `/api/payment/payment-failed` | Private | Handle payment failure |
| GET | `/api/payment/payment-details/:id` | Private | Get payment details |
| POST | `/api/payment/refund` | Admin | Initiate refund |
| POST | `/api/payment/webhook` | Public | Razorpay webhook handler |

---

## 🔐 Payment Security

### Signature Verification

Razorpay uses HMAC SHA256 signature for security:

```javascript
// Backend verification
const sign = razorpay_order_id + '|' + razorpay_payment_id;
const expectedSign = crypto
  .createHmac('sha256', RAZORPAY_KEY_SECRET)
  .update(sign.toString())
  .digest('hex');

// Compare signatures
if (razorpay_signature === expectedSign) {
  // Payment is valid ✅
} else {
  // Payment is invalid ❌
}
```

### Webhook Security

Webhooks from Razorpay are verified using `x-razorpay-signature` header.

---

## 💰 Supported Payment Methods

Razorpay supports:

1. **UPI** - PhonePe, Google Pay, Paytm, etc.
2. **Cards** - Credit/Debit cards
3. **Net Banking** - All major banks
4. **Wallets** - Paytm, Mobikwik, Freecharge, etc.
5. **EMI** - No-cost EMI options
6. **Cash on Delivery (COD)** - Traditional method

---

## 🧪 Testing

### Test Credentials

For testing, use Razorpay Test Mode credentials:
- Get them from: https://dashboard.razorpay.com/app/keys

### Test Cards

| Card Number | Type | 
|------------|------|
| 4111 1111 1111 1111 | Success |
| 4012 8888 8888 1881 | Success |
| 5555 5555 5555 4444 | Success |

- CVV: Any 3 digits
- Expiry: Any future date

### Test UPI

Use any UPI ID with `@paytm` or `@ybl` suffix

---

## 🔄 Order Status Updates

### Payment Status Flow

```
Pending → Completed (after successful payment)
Pending → Failed (if payment fails)
Completed → Refunded (if refund is initiated)
```

### Order Status Flow with Payment

```
For Online Payment:
Pending (order created)
  ↓
Processing (payment verified)
  ↓
Shipped → Delivered

For COD:
Pending (order created)
  ↓
Processing
  ↓
Shipped → Delivered (Payment Status = Completed)
```

---

## 📝 Environment Variables

Add to your `.env` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret (optional)
```

---

## 🎨 Frontend Integration

### Step 1: Install Razorpay

```bash
npm install react-razorpay
```

### Step 2: Load Razorpay Script

```html
<!-- In public/index.html -->
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### Step 3: Frontend Payment Component

```javascript
// PaymentComponent.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

const PaymentComponent = ({ orderId, amount }) => {
  const [razorpayKey, setRazorpayKey] = useState('');

  useEffect(() => {
    // Get Razorpay key
    const fetchKey = async () => {
      const { data } = await axios.get('/api/payment/razorpay-key');
      setRazorpayKey(data.key);
    };
    fetchKey();
  }, []);

  const handlePayment = async () => {
    try {
      // Step 1: Create Razorpay order
      const { data } = await axios.post('/api/payment/create-order', {
        amount,
        orderId
      });

      // Step 2: Open Razorpay checkout
      const options = {
        key: razorpayKey,
        amount: data.data.amount,
        currency: data.data.currency,
        name: 'Your Store Name',
        description: 'Order Payment',
        order_id: data.data.id,
        handler: async (response) => {
          // Step 3: Verify payment
          try {
            const verifyData = await axios.post('/api/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderId
            });
            
            // Payment successful ✅
            alert('Payment Successful!');
            // Redirect to success page
            window.location.href = '/order-success';
          } catch (error) {
            alert('Payment verification failed!');
          }
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#3399cc'
        }
      };

      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', async (response) => {
        // Handle payment failure
        await axios.post('/api/payment/payment-failed', {
          orderId,
          error: response.error
        });
        alert('Payment Failed!');
      });

      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  return (
    <button onClick={handlePayment}>
      Pay ₹{amount}
    </button>
  );
};

export default PaymentComponent;
```

---

## 🔍 Payment Verification Process

### Backend Verification Steps

1. **Receive payment details** from frontend
2. **Construct signature string**: `order_id|payment_id`
3. **Generate HMAC SHA256** with secret key
4. **Compare** with received signature
5. **If match**: Update order, deduct stock, clear cart
6. **If mismatch**: Return error, keep order pending

This ensures payments cannot be faked!

---

## 💸 Refund Process

### Initiate Refund (Admin)

```javascript
POST /api/payment/refund

{
  "paymentId": "pay_xxxxx",
  "orderId": "order_id",
  "amount": 50000,  // Optional: partial refund
  "reason": "Product damaged"
}
```

### Refund API Response

```json
{
  "success": true,
  "message": "Refund initiated successfully",
  "data": {
    "id": "rfnd_xxxxx",
    "amount": 5000000,
    "currency": "INR",
    "payment_id": "pay_xxxxx",
    "status": "processed"
  }
}
```

---

## 📊 Webhook Events

Razorpay sends webhooks for various events:

- `payment.captured` - Payment successful
- `payment.failed` - Payment failed
- `refund.created` - Refund initiated
- `refund.processed` - Refund completed

Configure webhook URL in Razorpay dashboard:
`https://yourdomain.com/api/payment/webhook`

---

## ✅ Testing Checklist

### Backend Testing
- [ ] Get Razorpay key
- [ ] Create Razorpay order
- [ ] Verify payment signature
- [ ] Handle payment success
- [ ] Handle payment failure
- [ ] Fetch payment details
- [ ] Initiate refund (admin)
- [ ] Webhook handler

### Integration Testing
- [ ] COD order creation
- [ ] Online payment order creation
- [ ] Payment verification flow
- [ ] Stock deduction after payment
- [ ] Cart clearing after payment
- [ ] Refund processing

### Payment Method Testing
- [ ] UPI payment
- [ ] Card payment
- [ ] Net banking
- [ ] Wallet payment
- [ ] COD order

---

## 🐛 Common Issues & Solutions

### Issue: "Invalid API key"
**Solution:** Check RAZORPAY_KEY_ID in .env file

### Issue: "Signature mismatch"
**Solution:** Ensure RAZORPAY_KEY_SECRET is correct

### Issue: "Order not found"
**Solution:** Create order first before payment

### Issue: "Stock not deducting"
**Solution:** Check payment verification is successful

---

## 📈 Payment Statistics

Track these metrics:
- Total transactions
- Success rate
- Failed payments
- Refund rate
- Average order value
- Payment method breakdown

---

## 🎯 Phase 4 Status: ✅ COMPLETE

All payment features implemented:
- ✅ Razorpay integration
- ✅ Payment verification
- ✅ COD support
- ✅ Refund system
- ✅ Webhook handler
- ✅ Security measures

**Next**: Frontend payment integration!

---

## 📚 Additional Resources

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay Test Cards](https://razorpay.com/docs/payments/payments/test-card-details/)
- [Webhook Documentation](https://razorpay.com/docs/webhooks/)
- [React Integration](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/react/)

---

**🎊 Phase 4: Payment System Ready!** 💳
