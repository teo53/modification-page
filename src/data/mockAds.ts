// Mock ad data using real crawled images from queenalba.net
// Updated to use 117 scraped ads from scraped_ads.json

import scrapedAdsData from './scraped_ads.json';

export interface Advertisement {
    id: number;
    title: string;
    location: string;
    pay: string;
    thumbnail: string;
    images: string[];
    badges: string[];
    isNew: boolean;
    isHot: boolean;
    productType: 'vip' | 'special' | 'premium' | 'general';
    price: string;
    duration: string;
}

// Titles for ad variety
const TITLES = [
    '강남 하이퍼블릭 VIP 급구', '역삼 텐프로 VIP 모집', '신논현 룸 스페셜 채용',
    '압구정 클럽 스페셜', '홍대 노래방 모집', '강남 퍼블릭 일반', '청담 라운지 VIP',
    '논현 룸살롱 급구', '잠실 클럽 스페셜', '건대 퍼블릭 모집', '신사 하이퍼블릭',
    '강남역 텐프로', '선릉 룸 VIP', '삼성 클럽 급구', '서초 라운지 스페셜',
    '이태원 클럽 모집', '홍대 바 VIP', '신촌 노래방 급구', '강북 룸 스페샬',
    '동대문 클럽 모집', '명동 라운지 VIP', '종로 퍼블릭 급구', '마포 룸 스페셜',
    '용산 클럽 모집', '성수 하이퍼블릭 VIP'
];

const LOCATIONS = [
    '서울 강남구', '서울 강남구 역삼동', '서울 강남구 신논현', '서울 강남구 압구정',
    '서울 마포구 홍대', '서울 강남구 청담동', '서울 강남구 논현동', '서울 송파구 잠실',
    '서울 광진구 건대입구', '서울 강남구 신사동', '서울 서초구', '서울 용산구 이태원',
    '서울 마포구 신촌', '서울 동대문구', '서울 중구 명동', '서울 종로구', '서울 성동구 성수동'
];

const BADGES_LIST = [
    ['당일지급', '숙소지원'], ['경력우대', '급여협의'], ['초보환영', '교육가능'],
    ['고수입', '유연근무'], ['초보가능'], ['당일지급'], ['VIP'], ['급구', '고수입'],
    ['신입환영', '숙소제공'], ['경력자우대', '인센티브'], ['근무시간협의', '주휴수당']
];

const PAYS = [
    '시급 100,000원', '일급 500,000원', '시급 80,000원', '일급 400,000원',
    '시급 50,000원', '일급 300,000원', '시급 120,000원', '일급 600,000원',
    '시급 70,000원', '일급 350,000원', '협의 후 결정'
];

// Convert scraped ads to Advertisement format
const convertToAd = (scrapedAd: any, productType: 'vip' | 'special' | 'premium' | 'general'): Advertisement => {
    const titleIndex = (scrapedAd.id - 1) % TITLES.length;
    const locationIndex = (scrapedAd.id - 1) % LOCATIONS.length;
    const badgeIndex = (scrapedAd.id - 1) % BADGES_LIST.length;
    const payIndex = (scrapedAd.id - 1) % PAYS.length;

    return {
        id: scrapedAd.id,
        title: TITLES[titleIndex],
        location: LOCATIONS[locationIndex],
        pay: PAYS[payIndex],
        thumbnail: scrapedAd.thumbnail,
        images: scrapedAd.detail_images || [],
        badges: BADGES_LIST[badgeIndex],
        isNew: scrapedAd.id % 3 === 0,
        isHot: scrapedAd.id % 5 === 0,
        productType,
        price: productType === 'vip' ? '300,000원' : productType === 'special' ? '150,000원' : '50,000원',
        duration: productType === 'vip' ? '30일' : productType === 'special' ? '15일' : '7일',
    };
};

// VIP Premium Ads (first 12 scraped ads)
export const vipAds: Advertisement[] = scrapedAdsData.slice(0, 12).map(ad => convertToAd(ad, 'vip'));

// Special Ads (next 24 scraped ads)
export const specialAds: Advertisement[] = scrapedAdsData.slice(12, 36).map(ad => convertToAd(ad, 'special'));

// Regular Ads (remaining scraped ads)
export const regularAds: Advertisement[] = scrapedAdsData.slice(36).map(ad => convertToAd(ad, 'general'));

// All ads combined
export const allAds = [...vipAds, ...specialAds, ...regularAds];

// Helper function to get ad by ID
export const getAdById = (id: number): Advertisement | undefined => {
    return allAds.find(ad => ad.id === id);
};
