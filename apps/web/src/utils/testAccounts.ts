/**
 * 테스트 계정 시드 유틸리티
 *
 * ⚠️  경고: 이 파일은 로컬 개발 환경 전용입니다.
 * ⚠️  프로덕션 환경에서는 절대 사용하지 마세요.
 * ⚠️  실제 계정 정보를 이 파일에 저장하지 마세요.
 *
 * 사용 방법:
 * 1. 브라우저 콘솔에서 seedTestAccounts() 실행
 * 2. 또는 앱 초기화 시 import
 *
 * 보안 주의사항:
 * - 이 파일의 비밀번호는 더미 데이터입니다
 * - 실제 사용 시 환경 변수 또는 별도 설정 파일 사용 권장
 * - 이 파일은 .gitignore에 추가하는 것을 권장합니다
 */

export interface TestAccount {
    email: string;
    password: string;
    name: string;
    nickname: string;
    phone: string;
    type: 'worker' | 'advertiser';
    businessNumber?: string;
    businessName?: string;
}

// ⚠️ 개발 환경 전용 더미 데이터
// 프로덕션에서는 환경 변수를 통해 설정하세요
const DEV_ONLY_PASSWORD = import.meta.env.VITE_TEST_PASSWORD || 'DevTest123!';

export const testAccounts: TestAccount[] = [
    // ==============================
    // 1. 일반회원 테스트 계정
    // ==============================
    {
        email: import.meta.env.VITE_TEST_MEMBER_EMAIL || 'member@localhost.test',
        password: DEV_ONLY_PASSWORD,
        name: '테스트회원',
        nickname: '테스터',
        phone: '010-0000-0001',
        type: 'worker'
    },
    // ==============================
    // 2. 광고주 테스트 계정
    // ==============================
    {
        email: import.meta.env.VITE_TEST_ADVERTISER_EMAIL || 'advertiser@localhost.test',
        password: DEV_ONLY_PASSWORD,
        name: '테스트광고주',
        nickname: '광고테스터',
        phone: '010-0000-0002',
        type: 'advertiser',
        businessNumber: '000-00-00001',
        businessName: '테스트업소'
    },
    // ==============================
    // 3. 관리자 테스트 계정
    // ==============================
    {
        email: import.meta.env.VITE_TEST_ADMIN_EMAIL || 'admin@localhost.test',
        password: DEV_ONLY_PASSWORD,
        name: '테스트관리자',
        nickname: '어드민',
        phone: '010-0000-0000',
        type: 'advertiser',
        businessNumber: '000-00-00000',
        businessName: 'Admin'
    }
];

// Use shared hash function
import { hashSync } from './hash';
const hashPasswordSync = hashSync;

// 테스트 계정 시드 함수 - 해시된 비밀번호 사용
export const seedTestAccounts = () => {
    const USERS_KEY = 'lunaalba_users';
    const PASSWORDS_KEY = 'lunaalba_passwords_hashed';
    const OLD_PASSWORDS_KEY = 'lunaalba_passwords';

    // 기존 사용자 가져오기
    const existingUsers = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const existingPasswords = JSON.parse(localStorage.getItem(PASSWORDS_KEY) || '{}');

    // Remove old plain text passwords
    localStorage.removeItem(OLD_PASSWORDS_KEY);

    let addedCount = 0;
    let updatedCount = 0;

    testAccounts.forEach((account) => {
        // 이미 존재하는 이메일인지 확인
        const existingUser = existingUsers.find((u: { email: string }) => u.email === account.email);

        if (existingUser) {
            // 기존 계정 비밀번호 업데이트 (해시)
            existingPasswords[existingUser.id] = hashPasswordSync(account.password);
            updatedCount++;
            console.log(`[TestSeed] 비밀번호 업데이트: ${account.email}`);
            return;
        }

        const userId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const newUser = {
            id: userId,
            email: account.email,
            name: account.name,
            nickname: account.nickname,
            phone: account.phone,
            type: account.type,
            businessNumber: account.businessNumber,
            businessName: account.businessName,
            createdAt: new Date().toISOString()
        };

        existingUsers.push(newUser);
        existingPasswords[userId] = hashPasswordSync(account.password);
        addedCount++;

        console.log(`[TestSeed] 계정 추가: ${account.email} (${account.type})`);
    });

    // 저장
    localStorage.setItem(USERS_KEY, JSON.stringify(existingUsers));
    localStorage.setItem(PASSWORDS_KEY, JSON.stringify(existingPasswords));

    console.log(`[TestSeed] 완료! ${addedCount}개 추가, ${updatedCount}개 업데이트.`);

    return addedCount + updatedCount;
};

// 테스트 계정 정보 출력
export const printTestAccounts = () => {
    console.log('\n========== 테스트 계정 정보 ==========\n');
    testAccounts.forEach((account, index) => {
        console.log(`[${index + 1}] ${account.type === 'worker' ? '👤 일반회원' : '🏢 광고주'}`);
        console.log(`   이메일: ${account.email}`);
        console.log(`   비밀번호: ${account.password}`);
        console.log(`   이름: ${account.name}`);
        if (account.businessNumber) {
            console.log(`   사업자번호: ${account.businessNumber}`);
        }
        console.log('');
    });
    console.log('=====================================\n');
};

// 브라우저 콘솔에서 쉽게 사용할 수 있도록 window에 등록
if (typeof window !== 'undefined') {
    (window as Window & { seedTestAccounts?: typeof seedTestAccounts; printTestAccounts?: typeof printTestAccounts }).seedTestAccounts = seedTestAccounts;
    (window as Window & { printTestAccounts?: typeof printTestAccounts }).printTestAccounts = printTestAccounts;
}

export default {
    testAccounts,
    seedTestAccounts,
    printTestAccounts
};
