// Test new validation improvements
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

// Login helper
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

// Test ad creation helper
async function testAdCreation(token, adData, testName, expectedStatus) {
  const data = JSON.stringify(adData);
  const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/api/v1/ads',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Content-Length': Buffer.byteLength(data)
    }
  };

  const result = await makeRequest(options, data);
  const response = JSON.parse(result.body);

  console.log(`\n[${testName}]`);
  console.log(`Expected: ${expectedStatus} | Got: ${result.statusCode}`);

  if (result.statusCode === expectedStatus) {
    console.log('✅ PASS');
  } else {
    console.log('❌ FAIL');
  }

  if (result.statusCode >= 400) {
    console.log('Error:', response.message);
  } else if (response.data && response.data.id) {
    console.log('Created Ad ID:', response.data.id);
  }

  return result;
}

// Main test
async function runTests() {
  console.log('===========================================');
  console.log('신규 검증 규칙 테스트');
  console.log('===========================================');

  // Login
  const employerToken = await login('employer1@test.com', 'Employer123!@');
  console.log('✅ Employer logged in\n');

  const baseAd = {
    businessName: 'Validation Test Business',
    title: 'Validation Test Ad',
  };

  // ============================================
  // Test 1: Phone Number Validation
  // ============================================
  console.log('\n========== 1. 전화번호 형식 검증 ==========');

  // 1.1 Valid phone number (with hyphens)
  await testAdCreation(employerToken, {
    ...baseAd,
    title: 'Test 1.1 - Valid Phone',
    managerPhone: '010-1234-5678'
  }, 'Test 1.1: Valid phone with hyphens', 200);

  // 1.2 Valid phone number (without hyphens)
  await testAdCreation(employerToken, {
    ...baseAd,
    title: 'Test 1.2 - Valid Phone No Hyphen',
    managerPhone: '01012345678'
  }, 'Test 1.2: Valid phone without hyphens', 200);

  // 1.3 Invalid phone number (wrong format)
  await testAdCreation(employerToken, {
    ...baseAd,
    title: 'Test 1.3 - Invalid Phone',
    managerPhone: '123-456-7890'
  }, 'Test 1.3: Invalid phone format', 400);

  // 1.4 Invalid phone number (letters)
  await testAdCreation(employerToken, {
    ...baseAd,
    title: 'Test 1.4 - Phone with Letters',
    managerPhone: '010-abcd-5678'
  }, 'Test 1.4: Phone with letters', 400);

  // ============================================
  // Test 2: Age Range Validation
  // ============================================
  console.log('\n========== 2. 나이 범위 검증 ==========');

  // 2.1 Valid age range
  await testAdCreation(employerToken, {
    ...baseAd,
    title: 'Test 2.1 - Valid Age',
    ageMin: 20,
    ageMax: 35
  }, 'Test 2.1: Valid age range (20-35)', 200);

  // 2.2 Age below minimum (13)
  await testAdCreation(employerToken, {
    ...baseAd,
    title: 'Test 2.2 - Age Too Low',
    ageMin: 13
  }, 'Test 2.2: Age below minimum (13)', 400);

  // 2.3 Age above maximum (101)
  await testAdCreation(employerToken, {
    ...baseAd,
    title: 'Test 2.3 - Age Too High',
    ageMax: 101
  }, 'Test 2.3: Age above maximum (101)', 400);

  // 2.4 Non-integer age (float)
  await testAdCreation(employerToken, {
    ...baseAd,
    title: 'Test 2.4 - Float Age',
    ageMin: 20.5
  }, 'Test 2.4: Non-integer age (20.5)', 400);

  // 2.5 Boundary test: minimum age (14)
  await testAdCreation(employerToken, {
    ...baseAd,
    title: 'Test 2.5 - Minimum Age',
    ageMin: 14,
    ageMax: 18
  }, 'Test 2.5: Boundary - minimum age (14)', 200);

  // 2.6 Boundary test: maximum age (100)
  await testAdCreation(employerToken, {
    ...baseAd,
    title: 'Test 2.6 - Maximum Age',
    ageMin: 50,
    ageMax: 100
  }, 'Test 2.6: Boundary - maximum age (100)', 200);

  // ============================================
  // Test 3: Work Days Validation
  // ============================================
  console.log('\n========== 3. 근무요일 검증 ==========');

  // 3.1 Valid work days
  await testAdCreation(employerToken, {
    ...baseAd,
    title: 'Test 3.1 - Valid Work Days',
    workDays: ['월', '화', '수', '목', '금']
  }, 'Test 3.1: Valid work days', 200);

  // 3.2 Invalid work days (English)
  await testAdCreation(employerToken, {
    ...baseAd,
    title: 'Test 3.2 - Invalid Work Days',
    workDays: ['Monday', 'Tuesday']
  }, 'Test 3.2: Invalid work days (English)', 400);

  // 3.3 Invalid work days (random text)
  await testAdCreation(employerToken, {
    ...baseAd,
    title: 'Test 3.3 - Random Work Days',
    workDays: ['월', 'invalid', '수']
  }, 'Test 3.3: Invalid work days (random)', 400);

  // ============================================
  // Test 4: Image URL Validation
  // ============================================
  console.log('\n========== 4. 이미지 URL 검증 ==========');

  // 4.1 Valid Cloudinary URL
  await testAdCreation(employerToken, {
    ...baseAd,
    title: 'Test 4.1 - Valid Image URL',
    businessLogoUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg'
  }, 'Test 4.1: Valid Cloudinary URL', 200);

  // 4.2 Invalid URL (different domain)
  await testAdCreation(employerToken, {
    ...baseAd,
    title: 'Test 4.2 - Invalid Domain',
    businessLogoUrl: 'https://example.com/image.jpg'
  }, 'Test 4.2: Invalid domain (not Cloudinary)', 400);

  // 4.3 Invalid URL (HTTP instead of HTTPS)
  await testAdCreation(employerToken, {
    ...baseAd,
    title: 'Test 4.3 - HTTP URL',
    businessLogoUrl: 'http://res.cloudinary.com/demo/image/upload/sample.jpg'
  }, 'Test 4.3: HTTP instead of HTTPS', 400);

  // 4.4 Invalid URL (not a URL)
  await testAdCreation(employerToken, {
    ...baseAd,
    title: 'Test 4.4 - Not a URL',
    thumbnail: 'not-a-url'
  }, 'Test 4.4: Not a URL format', 400);

  // 4.5 Valid images array
  await testAdCreation(employerToken, {
    ...baseAd,
    title: 'Test 4.5 - Valid Images Array',
    images: [
      'https://res.cloudinary.com/demo/image/upload/sample1.jpg',
      'https://res.cloudinary.com/demo/image/upload/sample2.jpg'
    ]
  }, 'Test 4.5: Valid images array', 200);

  // 4.6 Invalid images array (mixed domains)
  await testAdCreation(employerToken, {
    ...baseAd,
    title: 'Test 4.6 - Mixed Domains',
    images: [
      'https://res.cloudinary.com/demo/image/upload/sample1.jpg',
      'https://example.com/image2.jpg'
    ]
  }, 'Test 4.6: Invalid - mixed domains', 400);

  // ============================================
  // Test 5: Duplicate Ad Prevention
  // ============================================
  console.log('\n========== 5. 중복 광고 방지 ==========');

  // 5.1 Create first ad
  const duplicateAd = {
    businessName: 'Duplicate Test Business',
    title: 'Duplicate Test Title'
  };

  const result1 = await testAdCreation(employerToken, duplicateAd,
    'Test 5.1: Create first ad', 200);

  // 5.2 Try to create duplicate (should fail)
  await testAdCreation(employerToken, duplicateAd,
    'Test 5.2: Create duplicate ad (should fail)', 409);

  // 5.3 Same business name but different title (should succeed)
  await testAdCreation(employerToken, {
    businessName: 'Duplicate Test Business',
    title: 'Different Title'
  }, 'Test 5.3: Same business, different title', 200);

  // 5.4 Different business name but same title (should succeed)
  await testAdCreation(employerToken, {
    businessName: 'Different Business',
    title: 'Duplicate Test Title'
  }, 'Test 5.4: Different business, same title', 200);

  // ============================================
  // Summary
  // ============================================
  console.log('\n===========================================');
  console.log('테스트 완료!');
  console.log('===========================================');
  console.log('\n위 결과를 확인하여 모든 검증이 예상대로 작동하는지 확인하세요.');
  console.log('✅ PASS = 예상된 동작');
  console.log('❌ FAIL = 예상과 다른 동작\n');
}

runTests().catch(console.error);
