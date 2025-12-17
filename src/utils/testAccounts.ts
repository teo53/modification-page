// 테스트 계정 시드 유틸리티
// 이 파일을 브라우저 콘솔에서 import하거나, 앱 초기화 시 실행

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

export const testAccounts: TestAccount[] = [
    // 일반 회원 테스트 계정
    {
        email: 'test@lunaalba.com',
        password: 'test1234',
        name: '테스트유저',
        nickname: '테스터',
        phone: '010-1234-5678',
        type: 'worker'
    },
    // 광고주 테스트 계정
    {
        email: 'advertiser@lunaalba.com',
        password: 'test1234',
        name: '광고주테스트',
        nickname: '광고테스터',
        phone: '010-9876-5432',
        type: 'advertiser',
        businessNumber: '123-45-67890',
        businessName: '테스트업소'
    },
    // 관리자 테스트 계정 (향후 관리자 기능 추가 시 사용)
    {
        email: 'admin@lunaalba.com',
        password: 'admin1234',
        name: '관리자',
        nickname: '어드민',
        phone: '010-0000-0000',
        type: 'advertiser',
        businessNumber: '000-00-00000',
        businessName: 'LunaAlba Admin'
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
