// =============================================================================
// 📁 prisma/seed.ts
// 🏷️  기본 데이터 시드 (테넌트, 광고 상품)
// =============================================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // 기본 테넌트 생성
    const tenant = await prisma.tenant.upsert({
        where: { id: 'default-tenant' },
        update: {},
        create: {
            id: 'default-tenant',
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
