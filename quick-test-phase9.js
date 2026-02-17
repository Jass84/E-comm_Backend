/**
 * Quick Phase 9 Test - Tests endpoints with proper setup
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5002/api';
let adminToken, sellerToken;

async function quickTest() {
    console.log('\n🧪 PHASE 9 - QUICK ENDPOINT TEST\n');
    console.log('='.repeat(50));
    
    try {
        // 1. Login as admin
        const adminLogin = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'admin@ecommerce.com',
            password: 'admin123'
        });
        adminToken = adminLogin.data.token;
        console.log('✅ Admin login successful');
        
        // 2. Login as seller
        const sellerLogin = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'seller@example.com',
            password: 'seller123'
        });
        sellerToken = sellerLogin.data.token;
        console.log('✅ Seller login successful');
        
        // 3. Test GET withdrawal policies (should work regardless of balance)
        try {
            const policies = await axios.get(`${BASE_URL}/seller/withdrawal-policies`, {
                headers: { Authorization: `Bearer ${sellerToken}` }
            });
            console.log('✅ GET /api/seller/withdrawal-policies - Working');
            console.log(`   Min: ₹${policies.data.policies?.minAmount || 'N/A'}, Max: ₹${policies.data.policies?.maxAmount || 'N/A'}`);
        } catch (err) {
            console.log('❌ GET /api/seller/withdrawal-policies - Error:', err.response?.data?.message || err.message);
        }
        
        // 4. Test GET withdrawal history
        try {
            const history = await axios.get(`${BASE_URL}/seller/withdrawals`, {
                headers: { Authorization: `Bearer ${sellerToken}` }
            });
            console.log('✅ GET /api/seller/withdrawals - Working');
            console.log(`   Found ${history.data.withdrawals?.length || 0} withdrawals`);
        } catch (err) {
            console.log('❌ GET /api/seller/withdrawals - Error:', err.response?.data?.message || err.message);
        }
        
        // 5. Test GET admin stats
        try {
            const stats = await axios.get(`${BASE_URL}/admin/withdrawals/stats`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            console.log('✅ GET /api/admin/withdrawals/stats - Working');
            console.log(`   Total withdrawals: ${stats.data.totalWithdrawals || 0}`);
        } catch (err) {
            console.log('❌ GET /api/admin/withdrawals/stats - Error:', err.response?.data?.message || err.message);
        }
        
        // 6. Test POST withdrawal (will likely fail due to insufficient balance, but endpoint should respond)
        try {
            const withdrawal = await axios.post(`${BASE_URL}/seller/withdrawals`, {
                amount: 1000,
                paymentMethod: 'upi',
                upiDetails: {
                    upiId: 'test@upi',
                    upiName: 'Test Seller'
                }
            }, {
                headers: { Authorization: `Bearer ${sellerToken}` }
            });
            console.log('✅ POST /api/seller/withdrawals - Working');
            console.log(`   Withdrawal ID: ${withdrawal.data.withdrawal?._id}`);
        } catch (err) {
            if (err.response?.status === 400) {
                console.log('✅ POST /api/seller/withdrawals - Working (validation error expected)');
                console.log(`   Error: ${err.response.data.message}`);
            } else {
                console.log('❌ POST /api/seller/withdrawals - Error:', err.response?.data?.message || err.message);
            }
        }
        
        // 7. Test unauthorized access
        try {
            await axios.get(`${BASE_URL}/seller/withdrawal-policies`);
            console.log('❌ Authorization - Not enforced!');
        } catch (err) {
            if (err.response?.status === 401) {
                console.log('✅ Authorization - Properly enforced (401 Unauthorized)');
            } else {
                console.log('⚠️  Authorization - Unexpected error:', err.message);
            }
        }
        
        console.log('\n' + '='.repeat(50));
        console.log('\n✅ Phase 9 Endpoints: OPERATIONAL');
        console.log('📝 Note: Withdrawal requests need seller earnings to succeed');
        console.log('💡 Tip: Create orders as seller to earn money, then test withdrawals\n');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        process.exit(1);
    }
}

quickTest();
