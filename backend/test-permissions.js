// Test ad modification and deletion permissions
const http = require('http');

// Helper function to make HTTP requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body: responseData });
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

//Login helper
async function login(email, password) {
  const loginData = JSON.stringify({ email, password });
  const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/api/v1/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginData)
    }
  };
  const result = await makeRequest(options, loginData);
  const response = JSON.parse(result.body);
  return response.data.accessToken;
}

// Main test
async function runTests() {
  console.log('===========================================');
  console.log('광고 수정/삭제 권한 테스트');
  console.log('===========================================\n');

  // Get tokens
  const employerToken = await login('employer1@test.com', 'Employer123!@');
  console.log('✅ Employer1 logged in');

  // We need admin token - let's check if we have one
  let adminToken;
  try {
    adminToken = await login('admin@test.com', 'Admin123!@#$');
    console.log('✅ Admin logged in\n');
  } catch (e) {
    console.log('⚠️ No admin account, skipping admin tests\n');
  }

  // Test 1: Owner modifies own ad
  console.log('[Test 1] Owner modifies own ad (Expected: 200)');
  const updateData1 = JSON.stringify({ title: 'Updated Title by Owner' });
  const updateOptions1 = {
    hostname: 'localhost',
    port: 4000,
    path: '/api/v1/ads/88c84e67-f653-4194-9577-d3ee215cfb69',  // Ad ID from earlier test
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${employerToken}`,
      'Content-Length': Buffer.byteLength(updateData1)
    }
  };
  const result1 = await makeRequest(updateOptions1, updateData1);
  console.log('   Status:', result1.statusCode);
  if (result1.statusCode === 200) {
    console.log('   ✅ Success: Owner can modify own ad\n');
  } else {
    console.log('   Response:', result1.body.substring(0, 200), '\n');
  }

  // Test 2: Non-owner tries to modify ad (SEEKER)
  console.log('[Test 2] Non-owner (SEEKER) tries to modify ad (Expected: 403)');
  const seekerToken = await login('seeker_test@test.com', 'Seeker123!@#$');
  console.log('   SEEKER logged in');

  const updateData2 = JSON.stringify({ title: 'Hacked Title' });
  const updateOptions2 = {
    hostname: 'localhost',
    port: 4000,
    path: '/api/v1/ads/88c84e67-f653-4194-9577-d3ee215cfb69',
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${seekerToken}`,
      'Content-Length': Buffer.byteLength(updateData2)
    }
  };
  const result2 = await makeRequest(updateOptions2, updateData2);
  console.log('   Status:', result2.statusCode);
  if (result2.statusCode === 403) {
    console.log('   ✅ Success: Non-owner blocked\n');
  } else {
    console.log('   Response:', result2.body.substring(0, 200), '\n');
  }

  // Test 3: Admin modifies any ad (if admin exists)
  if (adminToken) {
    console.log('[Test 3] Admin modifies any ad (Expected: 200)');
    const updateData3 = JSON.stringify({ title: 'Updated by Admin' });
    const updateOptions3 = {
      hostname: 'localhost',
      port: 4000,
      path: '/api/v1/ads/88c84e67-f653-4194-9577-d3ee215cfb69',
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
        'Content-Length': Buffer.byteLength(updateData3)
      }
    };
    const result3 = await makeRequest(updateOptions3, updateData3);
    console.log('   Status:', result3.statusCode);
    if (result3.statusCode === 200) {
      console.log('   ✅ Success: Admin can modify any ad\n');
    } else {
      console.log('   Response:', result3.body.substring(0, 200), '\n');
    }
  }

  // Test 4: Non-owner tries to delete ad
  console.log('[Test 4] Non-owner tries to delete ad (Expected: 403)');
  const deleteOptions1 = {
    hostname: 'localhost',
    port: 4000,
    path: '/api/v1/ads/88c84e67-f653-4194-9577-d3ee215cfb69',
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${seekerToken}`
    }
  };
  const result4 = await makeRequest(deleteOptions1);
  console.log('   Status:', result4.statusCode);
  if (result4.statusCode === 403) {
    console.log('   ✅ Success: Non-owner cannot delete\n');
  } else {
    console.log('   Response:', result4.body.substring(0, 200), '\n');
  }

  console.log('===========================================');
  console.log('테스트 완료');
  console.log('===========================================');
}

runTests().catch(console.error);
