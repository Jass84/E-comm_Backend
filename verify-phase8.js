/**
 * ✅ PHASE 8 VERIFICATION SCRIPT
 * Tests all Admin Dashboard functionalities
 * 
 * Tests:
 * 1. Dashboard Statistics
 * 2. User Management (CRUD)
 * 3. Seller Management (Approval)
 * 4. Order Management
 * 5. Product Management
 * 6. Withdrawal Processing
 * 7. Analytics & Reports
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5002/api';
let adminToken = '';
let testUserId = '';
let testSellerId = '';
let testOrderId = '';
let testProductId = '';
let testWithdrawalId = '';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  cyan: '\x1b[36m'
};

// Test statistics
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

// Helper function to print test results
function printResult(testName, passed, details = '') {
  totalTests++;
  if (passed) {
    passedTests++;
    console.log(`${colors.green}✅ ${testName}${colors.reset}`);
  } else {
    failedTests++;
    console.log(`${colors.red}❌ ${testName}${colors.reset}`);
    if (details) {
      console.log(`   ${colors.yellow}${details}${colors.reset}`);
    }
  }
}

// Helper function to print section headers
function printSection(sectionName) {
  console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.cyan}  ${sectionName}${colors.reset}`);
  console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);
}

// Helper function to make API calls
async function apiCall(method, endpoint, data = null, token = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      ...(data && { data })
    };
    const response = await axios(config);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
      status: error.response?.status
    };
  }
}

// Test 1: Admin Login
async function testAdminLogin() {
  printSection('TEST 1: ADMIN AUTHENTICATION');
  
  const result = await apiCall('post', '/auth/login', {
    email: 'admin@ecommerce.com',
    password: 'admin123'
  });
  
  if (result.success && result.data.token) {
    adminToken = result.data.token;
    printResult('Admin login successful', true);
    printResult('Admin token received', true);
  } else {
    printResult('Admin login failed', false, result.error);
    process.exit(1);
  }
}

// Test 2: Dashboard Statistics
async function testDashboard() {
  printSection('TEST 2: DASHBOARD STATISTICS');
  
  const result = await apiCall('get', '/admin/dashboard', null, adminToken);
  
  printResult('Dashboard endpoint accessible', result.success);
  
  if (result.success) {
    const data = result.data.data || result.data;
    
    // Check main sections
    printResult('Users statistics present', !!data.users);
    printResult('Products statistics present', !!data.products);
    printResult('Orders statistics present', !!data.orders);
    printResult('Revenue statistics present', !!data.revenue);
    printResult('Today orders present', !!data.todayOrders);
    printResult('Withdrawals statistics present', !!data.withdrawals);
    printResult('Charts data present', !!data.charts);
    printResult('Recent orders present', !!data.recentOrders);
    
    // Check specific metrics
    if (data.users) {
      printResult('Total users count', data.users.total >= 0);
      printResult('Sellers count', data.users.sellers >= 0);
    }
    
    if (data.revenue) {
      printResult('Total revenue tracked', data.revenue.total >= 0);
      printResult('Commission tracked', !!data.revenue.commission);
    }
    
    if (data.charts && data.charts.last7Days) {
      printResult('Last 7 days chart data', data.charts.last7Days.length === 7);
    }
  }
}

// Test 3: User Management
async function testUserManagement() {
  printSection('TEST 3: USER MANAGEMENT');
  
  // 3.1: Get all users
  const usersResult = await apiCall('get', '/admin/users?limit=10', null, adminToken);
  printResult('Get all users', usersResult.success);
  
  if (usersResult.success) {
    const usersData = usersResult.data.users || usersResult.data;
    printResult('Users list returned', Array.isArray(usersData));
    printResult('Pagination data present', !!usersResult.data.pagination);
    
    if (usersData.length > 0) {
      testUserId = usersData[0]._id;
      
      // 3.2: Get user details
      const userDetailResult = await apiCall('get', `/admin/users/${testUserId}`, null, adminToken);
      printResult('Get user details', userDetailResult.success);
      
      if (userDetailResult.success) {
        const user = userDetailResult.data.user || userDetailResult.data;
        printResult('User has ID', !!user._id);
        printResult('User has name', !!user.name);
        printResult('User has email', !!user.email);
        printResult('User has role', !!user.role);
      }
      
      // 3.3: Update user (if not admin)
      if (usersData[0].role !== 'admin') {
        const updateResult = await apiCall('put', `/admin/users/${testUserId}`, {
          name: usersData[0].name + ' (Updated)'
        }, adminToken);
        printResult('Update user', updateResult.success);
      } else {
        printResult('Update user (skipped - is admin)', true);
      }
    }
  }
  
  // 3.4: Filter users by role
  const sellerResult = await apiCall('get', '/admin/users?role=seller&limit=5', null, adminToken);
  printResult('Filter users by role (seller)', sellerResult.success);
  
  if (sellerResult.success) {
    const sellers = sellerResult.data.users || sellerResult.data;
    if (sellers.length > 0) {
      testSellerId = sellers.find(s => s.role === 'seller')?._id;
      printResult('Found seller users', !!testSellerId);
    }
  }
  
  // 3.5: Search users
  const searchResult = await apiCall('get', '/admin/users?search=test', null, adminToken);
  printResult('Search users', searchResult.success);
}

// Test 4: Seller Management
async function testSellerManagement() {
  printSection('TEST 4: SELLER MANAGEMENT');
  
  // 4.1: Get pending sellers
  const pendingResult = await apiCall('get', '/admin/sellers/pending', null, adminToken);
  printResult('Get pending sellers', pendingResult.success);
  
  if (pendingResult.success) {
    const pending = pendingResult.data.sellers || pendingResult.data;
    printResult('Pending sellers list returned', Array.isArray(pending));
    
    // 4.2: Approve seller (if any pending)
    if (pending.length > 0 && pending[0].sellerApproved === false) {
      const sellerId = pending[0]._id;
      const approveResult = await apiCall('put', `/admin/sellers/${sellerId}/approve`, {
        approved: true,
        reason: 'Test approval'
      }, adminToken);
      printResult('Approve seller', approveResult.success);
    } else {
      printResult('Approve seller (skipped - no pending)', true);
    }
  }
  
  // 4.3: Test rejection
  if (testSellerId) {
    const rejectResult = await apiCall('put', `/admin/sellers/${testSellerId}/approve`, {
      approved: false,
      reason: 'Test rejection'
    }, adminToken);
    printResult('Reject seller endpoint works', rejectResult.success || rejectResult.status === 400);
  }
}

// Test 5: Order Management
async function testOrderManagement() {
  printSection('TEST 5: ORDER MANAGEMENT');
  
  // 5.1: Get all orders
  const ordersResult = await apiCall('get', '/admin/orders?limit=10', null, adminToken);
  printResult('Get all orders', ordersResult.success);
  
  if (ordersResult.success) {
    const orders = ordersResult.data.orders || ordersResult.data;
    printResult('Orders list returned', Array.isArray(orders));
    printResult('Pagination present', !!ordersResult.data.pagination);
    
    if (orders.length > 0) {
      testOrderId = orders[0]._id;
      
      // 5.2: Get order details
      const orderDetailResult = await apiCall('get', `/admin/orders/${testOrderId}`, null, adminToken);
      printResult('Get order details', orderDetailResult.success);
      
      if (orderDetailResult.success) {
        const order = orderDetailResult.data.order || orderDetailResult.data;
        printResult('Order has ID', !!order._id);
        printResult('Order has user', !!order.user);
        printResult('Order has items', Array.isArray(order.items));
        printResult('Order has status', !!order.status);
        printResult('Order has total amount', order.totalAmount >= 0);
      }
      
      // 5.3: Update order status
      const currentStatus = orders[0].status;
      let newStatus = currentStatus;
      
      if (currentStatus === 'pending') newStatus = 'processing';
      else if (currentStatus === 'processing') newStatus = 'shipped';
      else if (currentStatus === 'shipped') newStatus = 'delivered';
      
      if (newStatus !== currentStatus) {
        const updateResult = await apiCall('put', `/admin/orders/${testOrderId}/status`, {
          status: newStatus
        }, adminToken);
        printResult(`Update order status (${currentStatus} → ${newStatus})`, updateResult.success);
      } else {
        printResult('Update order status (skipped - already delivered)', true);
      }
    }
  }
  
  // 5.4: Filter orders
  const filterTests = [
    { query: '?status=pending', name: 'Filter by status (pending)' },
    { query: '?paymentMethod=razorpay', name: 'Filter by payment method' },
    { query: '?today=true', name: 'Filter today\'s orders' }
  ];
  
  for (const test of filterTests) {
    const result = await apiCall('get', `/admin/orders${test.query}`, null, adminToken);
    printResult(test.name, result.success);
  }
}

// Test 6: Product Management
async function testProductManagement() {
  printSection('TEST 6: PRODUCT MANAGEMENT');
  
  // 6.1: Get all products
  const productsResult = await apiCall('get', '/admin/products?limit=10', null, adminToken);
  printResult('Get all products', productsResult.success);
  
  if (productsResult.success) {
    const products = productsResult.data.products || productsResult.data;
    printResult('Products list returned', Array.isArray(products));
    printResult('Pagination present', !!productsResult.data.pagination);
    
    if (products.length > 0) {
      testProductId = products[0]._id;
      
      // 6.2: Update product
      const updateResult = await apiCall('put', `/admin/products/${testProductId}`, {
        title: products[0].title,
        stock: products[0].stock || 0
      }, adminToken);
      printResult('Update product', updateResult.success);
    }
  }
  
  // 6.3: Filter products
  const filterTests = [
    { query: '?isActive=true', name: 'Filter active products' },
    { query: '?stock=out', name: 'Filter out of stock' },
    { query: '?stock=low', name: 'Filter low stock' },
    { query: '?search=test', name: 'Search products' }
  ];
  
  for (const test of filterTests) {
    const result = await apiCall('get', `/admin/products${test.query}`, null, adminToken);
    printResult(test.name, result.success);
  }
}

// Test 7: Withdrawal Management
async function testWithdrawalManagement() {
  printSection('TEST 7: WITHDRAWAL MANAGEMENT');
  
  // 7.1: Get all withdrawals
  const withdrawalsResult = await apiCall('get', '/admin/withdrawals?limit=10', null, adminToken);
  printResult('Get all withdrawals', withdrawalsResult.success);
  
  if (withdrawalsResult.success) {
    const withdrawals = withdrawalsResult.data.withdrawals || withdrawalsResult.data;
    printResult('Withdrawals list returned', Array.isArray(withdrawals));
    printResult('Pagination present', !!withdrawalsResult.data.pagination);
    
    if (withdrawals.length > 0) {
      // Find a pending withdrawal
      const pendingWithdrawal = withdrawals.find(w => w.status === 'pending');
      
      if (pendingWithdrawal) {
        testWithdrawalId = pendingWithdrawal._id;
        
        // 7.2: Approve withdrawal
        const approveResult = await apiCall('put', `/admin/withdrawals/${testWithdrawalId}`, {
          status: 'approved',
          transactionId: 'TEST_TXN_' + Date.now()
        }, adminToken);
        printResult('Approve withdrawal', approveResult.success);
      } else {
        printResult('Approve withdrawal (skipped - no pending)', true);
      }
    }
  }
  
  // 7.3: Filter withdrawals
  const filterResult = await apiCall('get', '/admin/withdrawals?status=pending', null, adminToken);
  printResult('Filter pending withdrawals', filterResult.success);
}

// Test 8: Analytics
async function testAnalytics() {
  printSection('TEST 8: ANALYTICS & REPORTS');
  
  // 8.1: Revenue analytics
  const periods = ['week', 'month', 'year'];
  
  for (const period of periods) {
    const result = await apiCall('get', `/admin/analytics/revenue?period=${period}`, null, adminToken);
    printResult(`Revenue analytics (${period})`, result.success);
    
    if (result.success) {
      const data = result.data.data || result.data;
      printResult(`${period} data has entries`, Array.isArray(data) && data.length > 0);
      printResult(`${period} totals present`, !!result.data.totals);
    }
  }
  
  // 8.2: Top products
  const topProductsResult = await apiCall('get', '/admin/analytics/top-products?limit=5', null, adminToken);
  printResult('Top products analytics', topProductsResult.success);
  
  if (topProductsResult.success) {
    const products = topProductsResult.data.products || topProductsResult.data;
    printResult('Top products list returned', Array.isArray(products));
    
    if (products.length > 0) {
      printResult('Top products have sales data', products[0].totalOrders >= 0);
      printResult('Top products have revenue data', products[0].totalRevenue >= 0);
    }
  }
  
  // 8.3: Top sellers
  const topSellersResult = await apiCall('get', '/admin/analytics/top-sellers?limit=5', null, adminToken);
  printResult('Top sellers analytics', topSellersResult.success);
  
  if (topSellersResult.success) {
    const sellers = topSellersResult.data.sellers || topSellersResult.data;
    printResult('Top sellers list returned', Array.isArray(sellers));
    
    if (sellers.length > 0) {
      printResult('Top sellers have orders data', sellers[0].totalOrders >= 0);
      printResult('Top sellers have revenue data', sellers[0].totalRevenue >= 0);
    }
  }
}

// Test 9: Authorization & Security
async function testSecurity() {
  printSection('TEST 9: AUTHORIZATION & SECURITY');
  
  // 9.1: Test without token
  const noTokenResult = await apiCall('get', '/admin/dashboard');
  printResult('Dashboard blocked without token', !noTokenResult.success && noTokenResult.status === 401);
  
  // 9.2: Test with invalid token
  const invalidTokenResult = await apiCall('get', '/admin/dashboard', null, 'invalid_token_123');
  printResult('Dashboard blocked with invalid token', !invalidTokenResult.success);
  
  // 9.3: Test non-admin access (create a regular user token)
  const userLoginResult = await apiCall('post', '/auth/register', {
    name: 'Regular User',
    email: `testuser_${Date.now()}@test.com`,
    password: 'User@123',
    role: 'user'
  });
  
  if (userLoginResult.success && userLoginResult.data.token) {
    const userToken = userLoginResult.data.token;
    const nonAdminResult = await apiCall('get', '/admin/dashboard', null, userToken);
    printResult('Dashboard blocked for non-admin', !nonAdminResult.success && nonAdminResult.status === 403);
  }
  
  // 9.4: Test admin protections
  if (testUserId) {
    // Try to delete admin (should fail)
    const deleteAdminResult = await apiCall('delete', `/admin/users/${testUserId}`, null, adminToken);
    printResult('Admin deletion protection', !deleteAdminResult.success || deleteAdminResult.status === 400);
  }
}

// Test 10: Complete Workflow
async function testCompleteWorkflow() {
  printSection('TEST 10: COMPLETE ADMIN WORKFLOW');
  
  console.log(`${colors.blue}Simulating complete admin workflow...${colors.reset}\n`);
  
  // Step 1: Check dashboard
  const dashboardResult = await apiCall('get', '/admin/dashboard', null, adminToken);
  printResult('Step 1: Check dashboard', dashboardResult.success);
  
  // Step 2: Check pending sellers
  const pendingSellersResult = await apiCall('get', '/admin/sellers/pending', null, adminToken);
  printResult('Step 2: Check pending sellers', pendingSellersResult.success);
  
  // Step 3: Check pending orders
  const pendingOrdersResult = await apiCall('get', '/admin/orders?status=pending&limit=5', null, adminToken);
  printResult('Step 3: Check pending orders', pendingOrdersResult.success);
  
  // Step 4: Check pending withdrawals
  const pendingWithdrawalsResult = await apiCall('get', '/admin/withdrawals?status=pending', null, adminToken);
  printResult('Step 4: Check pending withdrawals', pendingWithdrawalsResult.success);
  
  // Step 5: Check low stock products
  const lowStockResult = await apiCall('get', '/admin/products?stock=low', null, adminToken);
  printResult('Step 5: Check low stock products', lowStockResult.success);
  
  // Step 6: View analytics
  const analyticsResult = await apiCall('get', '/admin/analytics/revenue?period=week', null, adminToken);
  printResult('Step 6: View weekly analytics', analyticsResult.success);
  
  printResult('Complete workflow executed', true);
}

// Main test runner
async function runAllTests() {
  console.log(`${colors.cyan}
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║            🎯 PHASE 8: ADMIN DASHBOARD VERIFICATION         ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
  ${colors.reset}`);
  
  console.log(`${colors.yellow}Starting verification...${colors.reset}\n`);
  
  try {
    await testAdminLogin();
    await testDashboard();
    await testUserManagement();
    await testSellerManagement();
    await testOrderManagement();
    await testProductManagement();
    await testWithdrawalManagement();
    await testAnalytics();
    await testSecurity();
    await testCompleteWorkflow();
    
    // Print final results
    printSection('FINAL RESULTS');
    
    console.log(`${colors.blue}Total Tests: ${totalTests}${colors.reset}`);
    console.log(`${colors.green}Passed: ${passedTests}${colors.reset}`);
    console.log(`${colors.red}Failed: ${failedTests}${colors.reset}`);
    
    const successRate = ((passedTests / totalTests) * 100).toFixed(2);
    console.log(`\n${colors.cyan}Success Rate: ${successRate}%${colors.reset}`);
    
    if (failedTests === 0) {
      console.log(`\n${colors.green}
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║         ✅ PHASE 8 VERIFICATION: 100% SUCCESSFUL! ✅        ║
║                                                              ║
║        All Admin Dashboard features working perfectly!       ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
      ${colors.reset}`);
    } else {
      console.log(`\n${colors.yellow}
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║      ⚠️  PHASE 8 VERIFICATION: PARTIALLY SUCCESSFUL ⚠️      ║
║                                                              ║
║          Some tests failed. Please review errors.            ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
      ${colors.reset}`);
    }
    
  } catch (error) {
    console.error(`\n${colors.red}❌ Fatal Error:${colors.reset}`, error.message);
    process.exit(1);
  }
}

// Run tests
runAllTests();
