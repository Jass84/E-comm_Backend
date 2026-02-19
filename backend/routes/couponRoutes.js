const express = require('express');
const router = express.Router();

// Coupon routes will be implemented in later phases
// Placeholder for now

router.get('/', (req, res) => {
  res.json({ message: 'Coupons route - To be implemented' });
});

module.exports = router;
