// =============================================================================
// 📁 prisma/seed.ts
// 🏷️  기본 데이터 시드 (테넌트, 광고 상품)
// =============================================================================

import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // 기본 테넌트 생성
    const tenant = await prisma.tenant.upsert({
        where: { id: 'default' },
        update: {},
        create: {
            id: 'default',
            name: 'queenalba',
            displayName: 'QueenAlba',
            primaryColor: '#D4AF37',
            secondaryColor: '#1A1A2E',
            settings: {},
            features: {
                community: true,
                ads: true,
                payments: false, // 결제는 나중에 활성화
            },
        },
    });
    console.log(`✅ Tenant created: ${tenant.name}`);

    // 광고 상품 생성
    const products = [
        { code: 'diamond', name: '다이아몬드', price: 500000, durationDays: 30, sortPriority: 100 },
        { code: 'sapphire', name: '사파이어', price: 350000, durationDays: 30, sortPriority: 90 },
        { code: 'ruby', name: '루비', price: 250000, durationDays: 30, sortPriority: 80 },
        { code: 'gold', name: '골드', price: 180000, durationDays: 30, sortPriority: 70 },
        { code: 'premium', name: '프리미엄', price: 120000, durationDays: 30, sortPriority: 60 },
        { code: 'special', name: '스페셜', price: 80000, durationDays: 30, sortPriority: 50 },
        { code: 'highlight', name: '하이라이트', price: 50000, durationDays: 14, sortPriority: 40 },
        { code: 'general', name: '일반', price: 30000, durationDays: 7, sortPriority: 10 },
    ];

    for (const product of products) {
        await prisma.adProduct.upsert({
            where: {
                tenantId_code: {
                    tenantId: tenant.id,
                    code: product.code,
                },
            },
            update: {},
            create: {
                tenantId: tenant.id,
                ...product,
            },
        });
    }
    console.log(`✅ Ad products created: ${products.length} items`);

    // =============================================================================
    // 👤 테스트 유저 생성
    // =============================================================================
    const passwordHash = await bcrypt.hash('TestPass123!', 12);

    const testUsers = [
        {
            email: 'admin@dalbitalba.com',
            role: UserRole.ADMIN,
            name: '관리자',
            nickname: 'Admin',
            phone: '01011112222',
        },
        {
            email: 'test@dalbitalba.com',
            role: UserRole.EMPLOYER,
            name: '테스트광고주',
            nickname: 'TestBiz',
            phone: '01012345678',
            businessName: '테스트업소',
            businessNumber: '1234567890',
        },
        {
            email: 'user@dalbitalba.com',
            role: UserRole.SEEKER,
            name: '테스트구직자',
            nickname: 'User1',
            phone: '01098765432',
        }
    ];

    for (const u of testUsers) {
        await prisma.user.upsert({
            where: {
                tenantId_email: {
                    tenantId: tenant.id,
                    email: u.email,
                },
            },
            update: {
                passwordHash, // 비밀번호 업데이트
                role: u.role,
                isActive: true,
                isBanned: false,
                phoneVerified: true, // 테스트 계정은 인증 완료 처리
                businessVerified: u.role === UserRole.EMPLOYER, // 사업자 인증 완료 처리
            },
            create: {
                tenantId: tenant.id,
                email: u.email,
                passwordHash,
                role: u.role,
                name: u.name,
                nickname: u.nickname,
                phone: u.phone,
                businessName: u.businessName,
                businessNumber: u.businessNumber,
                agreeTerms: true,
                agreePrivacy: true,
                agreeMarketing: false,
                isActive: true, // 활성 상태
                phoneVerified: true, // 인증 완료
                businessVerified: u.role === UserRole.EMPLOYER,
            },
        });
        console.log(`👤 User synced: ${u.email} (${u.role})`);
    }

    console.log('🎉 Seeding completed!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
