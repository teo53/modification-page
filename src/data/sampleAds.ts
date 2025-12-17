// Sample ad data with placeholder images for demo/external viewing
// This data will be shown when "Demo Mode" is enabled by admin

import type { Advertisement } from './mockAds';

// Better sample placeholder images (using picsum.photos for variety)
const sampleThumbnails = [
    'https://picsum.photos/seed/luna1/300/400',
    'https://picsum.photos/seed/luna2/300/400',
    'https://picsum.photos/seed/luna3/300/400',
    'https://picsum.photos/seed/luna4/300/400',
    'https://picsum.photos/seed/luna5/300/400',
    'https://picsum.photos/seed/luna6/300/400',
    'https://picsum.photos/seed/luna7/300/400',
    'https://picsum.photos/seed/luna8/300/400',
];

const sampleDetailImages = [
    'https://picsum.photos/seed/detail1/800/600',
    'https://picsum.photos/seed/detail2/800/600',
    'https://picsum.photos/seed/detail3/800/600',
];

const sampleBusinessNames = [
    '샘플업소 A', '샘플업소 B', '샘플업소 C', '샘플업소 D',
    '샘플클럽 E', '샘플라운지 F', '샘플바 G', '샘플홀 H'
];

// Sample Premium Hero Tier ads (for PremiumHeroAds component)
export interface SampleTierAd {
    id: string;
    tier: 'diamond' | 'sapphire' | 'ruby' | 'gold';
    businessName: string;
    title: string;
    location: string;
    salary: string;
    workHours: string;
}

export const sampleHeroAds: SampleTierAd[] = [
    // Diamond (2)
    { id: '99001', tier: 'diamond', businessName: '샘플 다이아몬드 A', title: '[샘플] 프리미엄 채용', location: '서울 - 강남', salary: '일 50만원+', workHours: '협의' },
    { id: '99002', tier: 'diamond', businessName: '샘플 다이아몬드 B', title: '[샘플] VIP 급채', location: '서울 - 청담', salary: '일 40만원+', workHours: '자율' },
    // Sapphire (4)
    { id: '99003', tier: 'sapphire', businessName: '샘플 사파이어 A', title: '[샘플] 고급 라운지', location: '서울 - 압구정', salary: '일 35만원', workHours: '저녁' },
    { id: '99004', tier: 'sapphire', businessName: '샘플 사파이어 B', title: '[샘플] 프리미엄 클럽', location: '부산 - 해운대', salary: '일 30만원', workHours: '야간' },
    { id: '99005', tier: 'sapphire', businessName: '샘플 사파이어 C', title: '[샘플] 하이엔드 바', location: '서울 - 논현', salary: '일 28만원', workHours: '저녁' },
    { id: '99006', tier: 'sapphire', businessName: '샘플 사파이어 D', title: '[샘플] 럭셔리 홀', location: '서울 - 역삼', salary: '일 25만원', workHours: '협의' },
    // Ruby (6)
    { id: '99007', tier: 'ruby', businessName: '샘플 루비 A', title: '[샘플] 고급 업소', location: '경기 - 분당', salary: '일 22만원', workHours: '저녁' },
    { id: '99008', tier: 'ruby', businessName: '샘플 루비 B', title: '[샘플] 프리미엄 홀', location: '인천 - 송도', salary: '일 20만원', workHours: '야간' },
    { id: '99009', tier: 'ruby', businessName: '샘플 루비 C', title: '[샘플] 신규 오픈', location: '대구 - 수성', salary: '일 18만원', workHours: '협의' },
    { id: '99010', tier: 'ruby', businessName: '샘플 루비 D', title: '[샘플] 급구 채용', location: '서울 - 마포', salary: '일 17만원', workHours: '저녁' },
    { id: '99011', tier: 'ruby', businessName: '샘플 루비 E', title: '[샘플] 초보 환영', location: '서울 - 홍대', salary: '일 16만원', workHours: '자율' },
    { id: '99012', tier: 'ruby', businessName: '샘플 루비 F', title: '[샘플] 경력 우대', location: '부산 - 서면', salary: '일 15만원', workHours: '야간' },
    // Gold (8)
    { id: '99013', tier: 'gold', businessName: '샘플 골드 A', title: '[샘플] 일반 채용', location: '서울 - 강서', salary: '일 14만원', workHours: '저녁' },
    { id: '99014', tier: 'gold', businessName: '샘플 골드 B', title: '[샘플] 구인 중', location: '경기 - 수원', salary: '일 13만원', workHours: '협의' },
    { id: '99015', tier: 'gold', businessName: '샘플 골드 C', title: '[샘플] 상시 모집', location: '대전 - 유성', salary: '일 12만원', workHours: '자율' },
    { id: '99016', tier: 'gold', businessName: '샘플 골드 D', title: '[샘플] 즉시 출근', location: '광주 - 서구', salary: '일 11만원', workHours: '저녁' },
    { id: '99017', tier: 'gold', businessName: '샘플 골드 E', title: '[샘플] 주말 가능', location: '서울 - 송파', salary: '일 10만원', workHours: '주말' },
    { id: '99018', tier: 'gold', businessName: '샘플 골드 F', title: '[샘플] 파트타임', location: '경기 - 성남', salary: '시급 2만원', workHours: '파트' },
    { id: '99019', tier: 'gold', businessName: '샘플 골드 G', title: '[샘플] 알바 모집', location: '인천 - 부평', salary: '시급 1.8만원', workHours: '협의' },
    { id: '99020', tier: 'gold', businessName: '샘플 골드 H', title: '[샘플] 신입 환영', location: '서울 - 영등포', salary: '시급 1.5만원', workHours: '오후' },
];

// Sample VIP ads (12 items)
export const sampleVipAds: Advertisement[] = Array.from({ length: 12 }, (_, i) => ({
    id: 90001 + i,
    title: `${sampleBusinessNames[i % 8]} - VIP 채용`,
    location: ['서울 - 강남구', '서울 - 서초구', '경기 - 성남시', '부산 - 해운대구'][i % 4],
    pay: ['일 20~30만원', '일 15~25만원', '일 25~35만원', '월 500만원+'][i % 4],
    thumbnail: sampleThumbnails[i % sampleThumbnails.length],
    images: sampleDetailImages,
    badges: ['채용중', 'VIP', '초보가능'],
    isNew: i < 4,
    isHot: i < 2,
    productType: 'vip' as const,
    price: '300,000원',
    duration: '30일'
}));

// Sample Special ads (24 items)
export const sampleSpecialAds: Advertisement[] = Array.from({ length: 24 }, (_, i) => ({
    id: 80001 + i,
    title: `${sampleBusinessNames[i % 8]} 스페셜`,
    location: ['서울 - 마포구', '서울 - 영등포구', '인천 - 부평구', '대구 - 수성구'][i % 4],
    pay: ['일 12~18만원', '일 15~20만원', '주급 100만원+', '협의'][i % 4],
    thumbnail: sampleThumbnails[i % sampleThumbnails.length],
    images: sampleDetailImages,
    badges: ['채용중', '경력우대'],
    isNew: i < 8,
    isHot: false,
    productType: 'special' as const,
    price: '150,000원',
    duration: '15일'
}));

// Sample Regular ads (24 items for grid)
export const sampleRegularAds: Advertisement[] = Array.from({ length: 24 }, (_, i) => ({
    id: 70001 + i,
    title: `[샘플] ${sampleBusinessNames[i % 8]}`,
    location: ['서울 - 송파구', '경기 - 고양시', '대전 - 유성구', '광주 - 서구'][i % 4],
    pay: ['일 10~15만원', '시급 15,000원', '협의'][i % 3],
    thumbnail: sampleThumbnails[i % sampleThumbnails.length],
    images: sampleDetailImages,
    badges: ['채용중'],
    isNew: i < 6,
    isHot: false,
    productType: 'general' as const,
    price: '50,000원',
    duration: '7일'
}));

export const allSampleAds = [...sampleVipAds, ...sampleSpecialAds, ...sampleRegularAds];
