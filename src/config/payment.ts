// =============================================================================
// 📁 src/config/payment.ts
// 🏷️  결제 설정 (사업자 계좌 정보)
// =============================================================================

export const PAYMENT_CONFIG = {
    // 사업자 계좌 정보 (실제 정보로 변경 필요)
    bankName: '국민은행',
    accountNumber: '123-456-789012',
    accountHolder: '(주)달빛알바',

    // 입금 안내 메시지
    depositGuide: [
        '입금자명에 업소명 또는 연락처 끝 4자리를 입력해주세요.',
        '입금 확인 후 영업시간 내 1~2시간 내에 광고가 게시됩니다.',
        '주말/공휴일에는 다음 영업일에 처리됩니다.',
    ],

    // 영업시간
    businessHours: {
        weekday: '09:00 ~ 18:00',
        weekend: '휴무',
    },

    // 문의처
    contact: {
        phone: '02-1234-5678',
        kakao: 'dalbitalba',
        email: 'contact@dalbitalba.com',
    },

    // 환불 정책
    refundPolicy: [
        '광고 게시 전: 100% 환불',
        '광고 게시 후 7일 이내: 잔여 기간 비율 환불',
        '광고 게시 후 7일 이후: 환불 불가',
    ],
};

export default PAYMENT_CONFIG;
