// Test SEEKER unauthorized ad creation with English-only data
const http = require('http');

// Step 1: Login as SEEKER
const loginData = JSON.stringify({
  email: 'seeker_test@test.com',
  password: 'Seeker123!@#$'
});

const loginOptions = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/v1/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginData)
  }
};

const loginReq = http.request(loginOptions, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('===========================================');
    console.log('[Test 4] SEEKER Login and Ad Creation Test');
    console.log('===========================================\n');

    const loginResponse = JSON.parse(data);

    if (!loginResponse.data || !loginResponse.data.accessToken) {
      console.error('Login failed:', loginResponse);
      return;
    }

    const token = loginResponse.data.accessToken;
    console.log('SEEKER Login Success');
    console.log('   Role:', loginResponse.data.user.role);
    console.log('   Token:', token.substring(0, 50) + '...\n');

    // Step 2: Try to create ad with SEEKER token (should get 403)
    const adData = JSON.stringify({
      businessName: 'Test Business',
      title: 'Test Ad'
    });

    const adOptions = {
      hostname: 'localhost',
      port: 4000,
      path: '/api/v1/ads',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Length': Buffer.byteLength(adData)
      }
    };

    const adReq = http.request(adOptions, (adRes) => {
      let adDataResponse = '';

      adRes.on('data', (chunk) => {
        adDataResponse += chunk;
      });

      adRes.on('end', () => {
        console.log('Ad Creation Attempt Result:');
        console.log('Status Code:', adRes.statusCode);

        if (adDataResponse) {
          try {
            const response = JSON.parse(adDataResponse);
            console.log('Response:', JSON.stringify(response, null, 2));
          } catch (e) {
            console.log('Raw Response:', adDataResponse);
          }
        } else {
          console.log('Empty response');
        }

        if (adRes.statusCode === 403) {
          console.log('\n✅ TEST PASSED: SEEKER role blocked (403 Forbidden)');
        } else if (adRes.statusCode === 401) {
          console.log('\n⚠️ 401 Unauthorized - Auth issue');
        } else {
          console.log('\n❌ Unexpected status code');
        }
      });
    });

    adReq.on('error', (e) => {
      console.error('Ad request error:', e.message);
    });

    adReq.write(adData);
    adReq.end();
  });
});

loginReq.on('error', (e) => {
  console.error('Login request error:', e.message);
});

loginReq.write(loginData);
loginReq.end();
