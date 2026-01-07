// =============================================================================
// 📁 src/utils/advertiserGrade.ts
// 🏷️  광고주 등급 시스템 유틸리티
// =============================================================================

// 등급 타입
export type AdvertiserGradeLevel = 1 | 2 | 3 | 4 | 5 | 6;

// 등급 정보 인터페이스
export interface AdvertiserGrade {
    level: AdvertiserGradeLevel;
    name: string;
    nameKo: string;
    icon: string;
    color: string;
    bgColor: string;
    textColor: string;
    minSpent: number;     // 최소 결제 금액 (원)
    minDays: number;      // 최소 활동일
}

// 등급 정의
export const ADVERTISER_GRADES: Record<AdvertiserGradeLevel, AdvertiserGrade> = {
    1: {
        level: 1,
        name: 'SEED',
        nameKo: '새싹',
        icon: '🌱',
        color: 'green',
        bgColor: 'bg-green-500/20',
        textColor: 'text-green-400',
        minSpent: 0,
        minDays: 0,
    },
    2: {
        level: 2,
        name: 'REGULAR',
        nameKo: '일반',
        icon: '🌿',
        color: 'teal',
        bgColor: 'bg-teal-500/20',
        textColor: 'text-teal-400',
        minSpent: 500_000,        // 50만원
        minDays: 30,
    },
    3: {
        level: 3,
        name: 'EXCELLENT',
        nameKo: '우수',
        icon: '⭐',
        color: 'yellow',
        bgColor: 'bg-yellow-500/20',
        textColor: 'text-yellow-400',
        minSpent: 2_000_000,      // 200만원
        minDays: 90,
    },
    4: {
        level: 4,
        name: 'VIP',
        nameKo: 'VIP',
        icon: '💫',
        color: 'orange',
        bgColor: 'bg-orange-500/20',
        textColor: 'text-orange-400',
        minSpent: 5_000_000,      // 500만원
        minDays: 180,
    },
    5: {
        level: 5,
        name: 'VVIP',
        nameKo: 'VVIP',
        icon: '👑',
        color: 'purple',
        bgColor: 'bg-purple-500/20',
        textColor: 'text-purple-400',
        minSpent: 10_000_000,     // 1000만원
        minDays: 365,
    },
    6: {
        level: 6,
        name: 'DIAMOND',
        nameKo: '다이아',
        icon: '💎',
        color: 'cyan',
        bgColor: 'bg-cyan-500/20',
        textColor: 'text-cyan-400',
        minSpent: 30_000_000,     // 3000만원
        minDays: 730,
    },
};

/**
 * 결제 금액과 활동일을 기반으로 광고주 등급 계산
 * 두 조건 모두 충족해야 해당 등급 부여
 */
export function calculateAdvertiserGrade(
    totalSpent: number,
    activeDays: number
): AdvertiserGrade {
    // 높은 등급부터 확인
    for (let level = 6; level >= 1; level--) {
        const grade = ADVERTISER_GRADES[level as AdvertiserGradeLevel];
        if (totalSpent >= grade.minSpent && activeDays >= grade.minDays) {
            return grade;
        }
    }

    // 기본값: 새싹
    return ADVERTISER_GRADES[1];
}

/**
 * 샘플 데이터용: 활동일만으로 대략적인 등급 추정
 * (실제로는 결제 금액도 필요하지만, 샘플에서는 활동일 기준으로 시뮬레이션)
 */
export function estimateGradeFromDays(activeDays: number): AdvertiserGrade {
    // 활동일 기준으로 가상의 결제금액 추정 (일당 평균 5만원 지출 가정)
    const estimatedSpent = activeDays * 50_000;
    return calculateAdvertiserGrade(estimatedSpent, activeDays);
}

/**
 * 등급 아이콘만 반환
 */
export function getGradeIcon(level: AdvertiserGradeLevel): string {
    return ADVERTISER_GRADES[level].icon;
}

/**
 * 등급 색상 클래스 반환
 */
export function getGradeTextColor(level: AdvertiserGradeLevel): string {
    return ADVERTISER_GRADES[level].textColor;
}

/**
 * 등급 배경 클래스 반환
 */
export function getGradeBgColor(level: AdvertiserGradeLevel): string {
    return ADVERTISER_GRADES[level].bgColor;
}

/**
 * 금액 포맷팅 (만원 단위)
 */
export function formatSpentAmount(amount: number): string {
    if (amount >= 10_000_000) {
        return `${(amount / 10_000_000).toFixed(1)}천만`;
    } else if (amount >= 10_000) {
        return `${(amount / 10_000).toFixed(0)}만`;
    }
    return amount.toLocaleString();
}
