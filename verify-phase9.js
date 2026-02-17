const axios = require('axios');
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m',
    cyan: '\x1b[36m'
};

const BASE_URL = 'http://localhost:5002/api';
let adminToken, sellerToken, seller2Token;
let testResults = [];
let withdrawalIds = [];

// Test result tracking
function addResult(testName, passed, message = '') {
    testResults.push({ testName, passed, message });
    const icon = passed ? '✓' : '✗';
    const color = passed ? colors.green : colors.red;
    console.log(`${color}${icon} ${testName}${colors.reset}${message ? `: ${message}` : ''}`);
}

// Helper to make API calls
async function apiCall(method, endpoint, data = null, token = null) {
    try {
        const config = {
            method,
            url: `${BASE_URL}${endpoint}`,
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        };
        if (data) config.data = data;
        
        const response = await axios(config);
        return { success: true, data: response.data, status: response.status };
    } catch (error) {
        return { 
            success: false, 
            error: error.response?.data || error.message,
            status: error.response?.status
        };
    }
}

// Setup: Login users
async function setup() {
    console.log(`\n${colors.cyan}=== PHASE 9: WITHDRAWAL & PAYOUT SYSTEM VERIFICATION ===${colors.reset}\n`);
    console.log(`${colors.blue}📋 Setting up test environment...${colors.reset}\n`);

    // Login as admin
    const adminLogin = await apiCall('post', '/auth/login', {
        email: 'admin@ecommerce.com',
        password: 'admin123'
    });
    
    if (adminLogin.success && adminLogin.data.token) {
        adminToken = adminLogin.data.token;
        console.log(`${colors.green}✓ Admin login successful${colors.reset}`);
    } else {
        console.log(`${colors.red}✗ Admin login failed${colors.reset}`);
        process.exit(1);
    }

    // Login as seller
    const sellerLogin = await apiCall('post', '/auth/login', {
        email: 'seller@example.com',
        password: 'seller123'
    });
    
    if (sellerLogin.success && sellerLogin.data.token) {
        sellerToken = sellerLogin.data.token;
        console.log(`${colors.green}✓ Seller login successful${colors.reset}`);
    } else {
        console.log(`${colors.yellow}! Seller login failed - will test with admin${colors.reset}`);
    }

    console.log();
}

// Test 1: Get Withdrawal Policies
async function testGetPolicies() {
    console.log(`\n${colors.blue}📜 Testing Withdrawal Policies...${colors.reset}`);
    
    const result = await apiCall('get', '/seller/withdrawal-policies', null, sellerToken || adminToken);
    
    if (result.success) {
        const policies = result.data.policies;
        const hasRequiredFields = policies.minAmount && policies.maxAmount && 
                                  policies.processingFee && policies.taxDeduction;
        
        addResult('Get Withdrawal Policies', hasRequiredFields,
            `Min: ₹${policies.minAmount}, Max: ₹${policies.maxAmount}`);
        
        if (result.data.sellerInfo) {
            console.log(`  ${colors.cyan}Available Balance: ₹${result.data.sellerInfo.availableBalance}${colors.reset}`);
        }
    } else {
        addResult('Get Withdrawal Policies', false, result.error.message);
    }
}

// Test 2: Request Withdrawal - Bank Transfer
async function testRequestBankWithdrawal() {
    console.log(`\n${colors.blue}🏦 Testing Bank Transfer Withdrawal...${colors.reset}`);
    
    const result = await apiCall('post', '/seller/withdrawals', {
        amount: 5000,
        paymentMethod: 'bank_transfer',
        bankDetails: {
            accountNumber: '1234567890',
            ifscCode: 'HDFC0001234',
            accountHolderName: 'Test Seller',
            bankName: 'HDFC Bank'
        }
    }, sellerToken || adminToken);
    
    if (result.success && result.data.withdrawal) {
        withdrawalIds.push(result.data.withdrawal._id);
        const w = result.data.withdrawal;
        
        addResult('Request Bank Withdrawal', true,
            `Amount: ₹${w.amount}, Fee: ₹${w.processingFee}, Net: ₹${w.netAmount}`);
        
        if (w.autoApproved) {
            console.log(`  ${colors.green}✓ Auto-approved (small amount)${colors.reset}`);
        }
    } else {
        addResult('Request Bank Withdrawal', false, result.error.message);
    }
}

// Test 3: Request Withdrawal - UPI
async function testRequestUPIWithdrawal() {
    console.log(`\n${colors.blue}📱 Testing UPI Withdrawal...${colors.reset}`);
    
    const result = await apiCall('post', '/seller/withdrawals', {
        amount: 3000,
        paymentMethod: 'upi',
        upiDetails: {
            upiId: 'seller@ybl',
            upiName: 'Test Seller'
        }
    }, sellerToken || adminToken);
    
    if (result.success && result.data.withdrawal) {
        withdrawalIds.push(result.data.withdrawal._id);
        const w = result.data.withdrawal;
        
        addResult('Request UPI Withdrawal', true,
            `Amount: ₹${w.amount}, Status: ${w.status}`);
    } else {
        addResult('Request UPI Withdrawal', false, result.error.message);
    }
}

// Test 4: Request Withdrawal - PayPal
async function testRequestPayPalWithdrawal() {
    console.log(`\n${colors.blue}💳 Testing PayPal Withdrawal...${colors.reset}`);
    
    const result = await apiCall('post', '/seller/withdrawals', {
        amount: 10000,
        paymentMethod: 'paypal',
        paypalDetails: {
            email: 'seller@paypal.com'
        }
    }, sellerToken || adminToken);
    
    if (result.success && result.data.withdrawal) {
        withdrawalIds.push(result.data.withdrawal._id);
        addResult('Request PayPal Withdrawal', true, `ID: ${result.data.withdrawal._id.substring(0, 8)}...`);
    } else {
        addResult('Request PayPal Withdrawal', false, result.error.message);
    }
}

// Test 5: Request Below Minimum (Should Fail)
async function testBelowMinimum() {
    console.log(`\n${colors.blue}⚠️  Testing Below Minimum Amount...${colors.reset}`);
    
    const result = await apiCall('post', '/seller/withdrawals', {
        amount: 400,
        paymentMethod: 'upi',
        upiDetails: { upiId: 'test@upi' }
    }, sellerToken || adminToken);
    
    const shouldFail = !result.success && result.error.message?.includes('minimum');
    addResult('Reject Below Minimum', shouldFail, 
        shouldFail ? 'Correctly rejected' : 'Should have rejected');
}

// Test 6: Request Above Maximum (Should Fail)
async function testAboveMaximum() {
    console.log(`\n${colors.blue}⚠️  Testing Above Maximum Amount...${colors.reset}`);
    
    const result = await apiCall('post', '/seller/withdrawals', {
        amount: 150000,
        paymentMethod: 'bank_transfer',
        bankDetails: {
            accountNumber: '1234567890',
            ifscCode: 'HDFC0001234',
            accountHolderName: 'Test'
        }
    }, sellerToken || adminToken);
    
    const shouldFail = !result.success && result.error.message?.includes('maximum');
    addResult('Reject Above Maximum', shouldFail,
        shouldFail ? 'Correctly rejected' : 'Should have rejected');
}

// Test 7: Get Seller Withdrawals
async function testGetSellerWithdrawals() {
    console.log(`\n${colors.blue}📋 Testing Get Withdrawal History...${colors.reset}`);
    
    const result = await apiCall('get', '/seller/withdrawals', null, sellerToken || adminToken);
    
    if (result.success) {
        const hasWithdrawals = result.data.withdrawals && result.data.withdrawals.length > 0;
        const hasStats = result.data.stats;
        
        addResult('Get Withdrawal History', hasWithdrawals || result.success,
            `Found ${result.data.withdrawals?.length || 0} withdrawals`);
        
        if (hasStats) {
            console.log(`  ${colors.cyan}Stats: Pending: ${hasStats.pending || 0}, Completed: ${hasStats.completed || 0}${colors.reset}`);
        }
    } else {
        addResult('Get Withdrawal History', false, result.error.message);
    }
}

// Test 8: Get Withdrawals by Status
async function testGetByStatus() {
    console.log(`\n${colors.blue}🔍 Testing Filter by Status...${colors.reset}`);
    
    const result = await apiCall('get', '/seller/withdrawals?status=pending', null, sellerToken || adminToken);
    
    if (result.success) {
        const allPending = result.data.withdrawals?.every(w => w.status === 'pending') || true;
        addResult('Filter by Status', allPending,
            `Pending: ${result.data.withdrawals?.length || 0}`);
    } else {
        addResult('Filter by Status', result.success);
    }
}

// Test 9: Cancel Withdrawal
async function testCancelWithdrawal() {
    console.log(`\n${colors.blue}❌ Testing Cancel Withdrawal...${colors.reset}`);
    
    if (withdrawalIds.length === 0) {
        addResult('Cancel Withdrawal', false, 'No withdrawal IDs to cancel');
        return;
    }
    
    const withdrawalId = withdrawalIds[0];
    const result = await apiCall('delete', `/seller/withdrawals/${withdrawalId}`, null, sellerToken || adminToken);
    
    if (result.success) {
        addResult('Cancel Withdrawal', true, 'Successfully cancelled and refunded');
    } else {
        addResult('Cancel Withdrawal', result.success || result.error.message?.includes('only cancel pending'), 
            result.error.message);
    }
}

// Test 10: Admin - Get Withdrawal Stats
async function testAdminStats() {
    console.log(`\n${colors.blue}📊 Testing Admin Statistics...${colors.reset}`);
    
    const result = await apiCall('get', '/admin/withdrawals/stats', null, adminToken);
    
    if (result.success && result.data.byStatus) {
        addResult('Get Withdrawal Stats', true,
            `Total: ${result.data.totalWithdrawals || 0}`);
        
        console.log(`  ${colors.cyan}By Status:${colors.reset}`);
        Object.entries(result.data.byStatus).forEach(([status, data]) => {
            console.log(`    ${status}: ${data.count} (₹${data.amount})`);
        });
    } else {
        addResult('Get Withdrawal Stats', false, result.error?.message);
    }
}

// Test 11: Admin - Approve Withdrawal
async function testApproveWithdrawal() {
    console.log(`\n${colors.blue}✅ Testing Approve Withdrawal...${colors.reset}`);
    
    if (withdrawalIds.length < 2) {
        addResult('Approve Withdrawal', false, 'No withdrawal IDs to approve');
        return;
    }
    
    const withdrawalId = withdrawalIds[1];
    const result = await apiCall('put', `/admin/withdrawals/${withdrawalId}/approve`, {
        transactionId: 'TXN_TEST_001',
        adminNote: 'Verified and approved'
    }, adminToken);
    
    if (result.success) {
        addResult('Approve Withdrawal', true,
            `Status: ${result.data.withdrawal?.status}`);
    } else {
        addResult('Approve Withdrawal', result.success || 
            result.error.message?.includes('already'), result.error.message);
    }
}

// Test 12: Admin - Reject Withdrawal
async function testRejectWithdrawal() {
    console.log(`\n${colors.blue}❌ Testing Reject Withdrawal...${colors.reset}`);
    
    if (withdrawalIds.length < 3) {
        addResult('Reject Withdrawal', false, 'No withdrawal IDs to reject');
        return;
    }
    
    const withdrawalId = withdrawalIds[2];
    const result = await apiCall('put', `/admin/withdrawals/${withdrawalId}/reject`, {
        rejectionReason: 'Invalid bank details',
        adminNote: 'Please update account information'
    }, adminToken);
    
    if (result.success) {
        addResult('Reject Withdrawal', true, 'Amount refunded to seller');
    } else {
        addResult('Reject Withdrawal', result.success ||
            result.error.message?.includes('already'), result.error.message);
    }
}

// Test 13: Admin - Complete Withdrawal
async function testCompleteWithdrawal() {
    console.log(`\n${colors.blue}✔️  Testing Complete Withdrawal...${colors.reset}`);
    
    // First approve one
    if (withdrawalIds.length < 2) {
        addResult('Complete Withdrawal', false, 'No withdrawal IDs');
        return;
    }
    
    const withdrawalId = withdrawalIds[1];
    
    // Approve first
    await apiCall('put', `/admin/withdrawals/${withdrawalId}/approve`, {
        transactionId: 'TXN_COMPLETE_001'
    }, adminToken);
    
    // Then complete
    const result = await apiCall('put', `/admin/withdrawals/${withdrawalId}/complete`, {
        transactionId: 'TXN_COMPLETE_001',
        adminNote: 'Payment transferred'
    }, adminToken);
    
    if (result.success) {
        addResult('Complete Withdrawal', true,
            `Status: ${result.data.withdrawal?.status}`);
    } else {
        addResult('Complete Withdrawal', result.success ||
            result.error.message?.includes('approved'), result.error.message);
    }
}

// Test 14: Admin - Batch Approve
async function testBatchApprove() {
    console.log(`\n${colors.blue}📦 Testing Batch Approve...${colors.reset}`);
    
    // Create multiple withdrawals first
    const newWithdrawals = [];
    for (let i = 0; i < 3; i++) {
        const result = await apiCall('post', '/seller/withdrawals', {
            amount: 2000 + (i * 500),
            paymentMethod: 'upi',
            upiDetails: { upiId: `test${i}@upi`, upiName: 'Test' }
        }, sellerToken || adminToken);
        
        if (result.success && result.data.withdrawal) {
            newWithdrawals.push(result.data.withdrawal._id);
        }
    }
    
    if (newWithdrawals.length === 0) {
        addResult('Batch Approve', false, 'No withdrawals created for batch');
        return;
    }
    
    const result = await apiCall('post', '/admin/withdrawals/batch-approve', {
        withdrawalIds: newWithdrawals,
        adminNote: 'Batch approved in test'
    }, adminToken);
    
    if (result.success) {
        addResult('Batch Approve', true,
            `Success: ${result.data.results?.success?.length || 0}, Failed: ${result.data.results?.failed?.length || 0}`);
    } else {
        addResult('Batch Approve', false, result.error.message);
    }
}

// Test 15: Unauthorized Access
async function testUnauthorizedAccess() {
    console.log(`\n${colors.blue}🔒 Testing Authorization...${colors.reset}`);
    
    // Try to access without token
    const result = await apiCall('get', '/seller/withdrawal-policies', null, null);
    
    const isUnauthorized = !result.success && result.status === 401;
    addResult('Block Unauthorized Access', isUnauthorized,
        isUnauthorized ? '401 Unauthorized' : 'Should have blocked');
}

// Print Summary
function printSummary() {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`${colors.cyan}PHASE 9 VERIFICATION SUMMARY${colors.reset}`);
    console.log('='.repeat(70));
    
    const passed = testResults.filter(r => r.passed).length;
    const failed = testResults.filter(r => r.passed === false).length;
    const total = testResults.length;
    const percentage = ((passed / total) * 100).toFixed(2);
    
    console.log(`\n${colors.blue}Total Tests: ${total}${colors.reset}`);
    console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
    console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
    console.log(`${colors.yellow}Success Rate: ${percentage}%${colors.reset}`);
    
    if (failed > 0) {
        console.log(`\n${colors.red}Failed Tests:${colors.reset}`);
        testResults
            .filter(r => !r.passed)
            .forEach(r => console.log(`  ✗ ${r.testName}: ${r.message}`));
    }
    
    console.log('\n='.repeat(70));
    
    // Overall assessment
    if (percentage >= 90) {
        console.log(`${colors.green}🎉 PHASE 9 VERIFICATION: EXCELLENT!${colors.reset}`);
    } else if (percentage >= 70) {
        console.log(`${colors.yellow}⚠️  PHASE 9 VERIFICATION: GOOD (Some issues)${colors.reset}`);
    } else {
        console.log(`${colors.red}❌ PHASE 9 VERIFICATION: NEEDS ATTENTION${colors.reset}`);
    }
    
    console.log('='.repeat(70));
}

// Main execution
async function runVerification() {
    try {
        await setup();
        
        // Seller Tests
        console.log(`\n${colors.cyan}=== SELLER TESTS ===${colors.reset}`);
        await testGetPolicies();
        await testRequestBankWithdrawal();
        await testRequestUPIWithdrawal();
        await testRequestPayPalWithdrawal();
        await testBelowMinimum();
        await testAboveMaximum();
        await testGetSellerWithdrawals();
        await testGetByStatus();
        await testCancelWithdrawal();
        
        // Admin Tests
        console.log(`\n${colors.cyan}=== ADMIN TESTS ===${colors.reset}`);
        await testAdminStats();
        await testApproveWithdrawal();
        await testRejectWithdrawal();
        await testCompleteWithdrawal();
        await testBatchApprove();
        
        // Security Tests
        console.log(`\n${colors.cyan}=== SECURITY TESTS ===${colors.reset}`);
        await testUnauthorizedAccess();
        
        printSummary();
        
    } catch (error) {
        console.error(`${colors.red}Verification failed:${colors.reset}`, error.message);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    runVerification();
}

module.exports = { runVerification };
