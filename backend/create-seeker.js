// 구직자 계정 생성 스크립트
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    const passwordHash = await bcrypt.hash('Seeker123!@#$', 12);

    const seeker = await prisma.user.create({
      data: {
        tenantId: 'default-tenant',
        email: 'seeker_test@test.com',
        passwordHash,
        name: '구직자',
        nickname: '구직자1',
        phone: '01099998888',
        role: 'SEEKER',
        isActive: true,
        agreeTerms: true,
        agreePrivacy: true,
      },
    });

    console.log('✅ SEEKER 계정 생성 성공:');
    console.log(JSON.stringify({
      id: seeker.id,
      email: seeker.email,
      role: seeker.role,
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
