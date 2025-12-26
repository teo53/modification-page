// Test SEEKER unauthorized ad creation
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
    'Content-Length': loginData.length
  }
};

const loginReq = http.request(loginOptions, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('===========================================');
    console.log('[Test 4] SEEKER 로그인 및 광고 등록 시도');
    console.log('===========================================\n');

    const loginResponse = JSON.parse(data);

    if (!loginResponse.data || !loginResponse.data.accessToken) {
      console.error('❌ 로그인 실패:', loginResponse);
      return;
    }

    const token = loginResponse.data.accessToken;
    console.log('✅ SEEKER 로그인 성공');
    console.log('   Role:', loginResponse.data.user.role);
    console.log('   Token:', token.substring(0, 50) + '...\n');

    // Step 2: Try to create ad with SEEKER token (should get 403)
    const adData = JSON.stringify({
      businessName: '테스트 업소',
      title: '테스트 광고'
    });

    const adOptions = {
      hostname: 'localhost',
      port: 4000,
      path: '/api/v1/ads',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Length': adData.length
      }
    };

    const adReq = http.request(adOptions, (adRes) => {
      let adDataResponse = '';

      adRes.on('data', (chunk) => {
        adDataResponse += chunk;
      });

      adRes.on('end', () => {
        console.log('광고 등록 시도 결과:');
        console.log('Status Code:', adRes.statusCode);
        const response = JSON.parse(adDataResponse);
        console.log('Response:', JSON.stringify(response, null, 2));

        if (adRes.statusCode === 403) {
          console.log('\n✅ 테스트 성공: SEEKER 역할은 광고 등록이 거부됨 (403 Forbidden)');
        } else if (adRes.statusCode === 401) {
          console.log('\n⚠️ 401 Unauthorized - 인증 문제');
        } else {
          console.log('\n❌ 예상치 못한 응답 코드');
        }
      });
    });

    adReq.on('error', (e) => {
      console.error('❌ 광고 등록 요청 오류:', e.message);
    });

    adReq.write(adData);
    adReq.end();
  });
});

loginReq.on('error', (e) => {
  console.error('❌ 로그인 요청 오류:', e.message);
});

loginReq.write(loginData);
loginReq.end();
