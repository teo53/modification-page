// 광고주 계정 생성 스크립트
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    const passwordHash = await bcrypt.hash('Employer123!@', 12);

    const employer = await prisma.user.create({
      data: {
        tenantId: 'default-tenant',
        email: 'employer1@test.com',
        passwordHash,
        name: '광고주1',
        nickname: '업주1',
        phone: '01011112222',
        role: 'EMPLOYER',
        businessName: '테스트 업소',
        businessNumber: '1234567890',
        isActive: true,
        agreeTerms: true,
        agreePrivacy: true,
      },
    });

    console.log('✅ 광고주 계정 생성 성공:');
    console.log(JSON.stringify({
      id: employer.id,
      email: employer.email,
      role: employer.role,
      businessName: employer.businessName,
    }, null, 2));
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️ 이미 존재하는 이메일입니다.');
    } else {
      console.error('❌ 오류:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
