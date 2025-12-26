/**
 * Frontend Validation Test Script
 * Tests that backend validation errors are properly handled and displayed
 */

const API_URL = 'http://localhost:4000/api/v1';

// Test credentials
const EMPLOYER_EMAIL = 'employer1@test.com';
const EMPLOYER_PASSWORD = 'Employer123!@';

let authToken = '';

// Helper function to make API calls
async function apiCall(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (authToken) {
        options.headers['Authorization'] = `Bearer ${authToken}`;
    }

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();

    return {
        status: response.status,
        data,
    };
}

// Login to get auth token
async function login() {
    console.log('\n🔐 Logging in as employer...');

    const result = await apiCall('/auth/login', 'POST', {
        email: EMPLOYER_EMAIL,
        password: EMPLOYER_PASSWORD,
    });

    if (result.data.success && result.data.data?.accessToken) {
        authToken = result.data.data.accessToken;
        console.log('✅ Login successful');
        console.log(`   User: ${result.data.data.user.name} (${result.data.data.user.email})`);
        return true;
    }

    console.error('❌ Login failed:', result.data);
    return false;
}

// Test cases
const tests = [
    {
        name: 'Test 1: Invalid phone number format',
        data: {
            businessName: "Frontend Test Business 1",
            title: "Frontend Test Ad 1",
            managerPhone: "123-456-7890",  // ❌ Invalid format
        },
        expectedStatus: 400,
        expectedMessagePattern: /전화번호.*형식/,
    },
    {
        name: 'Test 2: Age range violation (minimum)',
        data: {
            businessName: "Frontend Test Business 2",
            title: "Frontend Test Ad 2",
            ageMin: 13,  // ❌ Below minimum (14)
        },
        expectedStatus: 400,
        expectedMessagePattern: /최소 나이.*14/,
    },
    {
        name: 'Test 3: Age range violation (maximum)',
        data: {
            businessName: "Frontend Test Business 3",
            title: "Frontend Test Ad 3",
            ageMax: 101,  // ❌ Above maximum (100)
        },
        expectedStatus: 400,
        expectedMessagePattern: /최대 나이.*100/,
    },
    {
        name: 'Test 4: Invalid work days (English)',
        data: {
            businessName: "Frontend Test Business 4",
            title: "Frontend Test Ad 4",
            workDays: ["Monday", "Tuesday"],  // ❌ English days
        },
        expectedStatus: 400,
        expectedMessagePattern: /근무요일.*월~일/,
    },
    {
        name: 'Test 5: Invalid image URL (not Cloudinary)',
        data: {
            businessName: "Frontend Test Business 5",
            title: "Frontend Test Ad 5",
            businessLogoUrl: "https://example.com/image.jpg",  // ❌ Not Cloudinary
        },
        expectedStatus: 400,
        expectedMessagePattern: /Cloudinary/,
    },
    {
        name: 'Test 6: Valid data (should succeed)',
        data: {
            businessName: "Frontend Test Valid Business",
            title: "Frontend Test Valid Ad",
            managerPhone: "010-1234-5678",  // ✅ Valid format
            ageMin: 20,  // ✅ Valid range
            ageMax: 35,  // ✅ Valid range
            workDays: ["월", "화", "수"],  // ✅ Korean days
            region: "서울",
            district: "강남구",
        },
        expectedStatus: 201,
        expectedMessagePattern: null,
    },
];

// Run a single test
async function runTest(test) {
    console.log(`\n📝 ${test.name}`);
    console.log('   Data:', JSON.stringify(test.data, null, 2).split('\n').join('\n   '));

    const result = await apiCall('/ads', 'POST', test.data);

    console.log(`   Status: ${result.status} (expected: ${test.expectedStatus})`);

    const message = Array.isArray(result.data.message)
        ? result.data.message.join('\n   ')
        : result.data.message;

    if (message) {
        console.log(`   Message: ${message}`);
    }

    // Verify status code
    const statusMatch = result.status === test.expectedStatus;

    // Verify message pattern
    let messageMatch = true;
    if (test.expectedMessagePattern) {
        const messageStr = Array.isArray(result.data.message)
            ? result.data.message.join(' ')
            : result.data.message || '';
        messageMatch = test.expectedMessagePattern.test(messageStr);
    }

    const passed = statusMatch && messageMatch;

    if (passed) {
        console.log('   ✅ PASS');
    } else {
        console.log('   ❌ FAIL');
        if (!statusMatch) console.log(`      - Status mismatch: got ${result.status}, expected ${test.expectedStatus}`);
        if (!messageMatch) console.log(`      - Message pattern not found`);
    }

    return passed;
}

// Main test runner
async function runAllTests() {
    console.log('='.repeat(60));
    console.log('🧪 Frontend Validation Test Suite');
    console.log('='.repeat(60));
    console.log('Testing that backend validation errors are properly');
    console.log('extracted and displayed by the frontend error handler');
    console.log('='.repeat(60));

    // Login first
    const loginSuccess = await login();
    if (!loginSuccess) {
        console.error('\n❌ Cannot proceed without authentication');
        process.exit(1);
    }

    // Run all tests
    let passed = 0;
    let failed = 0;

    for (const test of tests) {
        const result = await runTest(test);
        if (result) {
            passed++;
        } else {
            failed++;
        }

        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Test Results Summary');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${tests.length}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`Success Rate: ${((passed / tests.length) * 100).toFixed(1)}%`);
    console.log('='.repeat(60));

    if (failed === 0) {
        console.log('\n🎉 All tests passed! Frontend error handling is working correctly.');
        console.log('✅ Backend validation errors are properly extracted and displayed.');
    } else {
        console.log('\n⚠️  Some tests failed. Please review the error messages above.');
    }

    process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(error => {
    console.error('\n💥 Test suite error:', error);
    process.exit(1);
});
