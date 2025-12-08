// Mock ad data using real crawled images from queenalba.net
// Generated from scraper test run (5 ads collected)

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

// VIP Premium Ads (using real crawled thumbnails)
export const vipAds: Advertisement[] = [
    {
        id: 1,
        title: '강남 하이퍼블릭 VIP 급구',
        location: '서울 강남구',
        pay: '시급 100,000원',
        thumbnail: '/images/ads/thumbnails/thumb_1.gif',
        images: [
            '/images/ads/details/detail_1_1.jpg',
            '/images/ads/details/detail_1_2.jpg',
            '/images/ads/details/detail_1_3.jpg',
            '/images/ads/details/detail_1_4.jpg',
            '/images/ads/details/detail_1_5.jpg',
            '/images/ads/details/detail_1_6.jpg',
            '/images/ads/details/detail_1_7.jpg',
            '/images/ads/details/detail_1_8.png',
            '/images/ads/details/detail_1_9.gif',
            '/images/ads/details/detail_1_10.gif',
        ],
        badges: ['당일지급', '숙소지원'],
        isNew: true,
        isHot: true,
        productType: 'vip',
        price: '300,000원',
        duration: '30일',
    },
    {
        id: 2,
        title: '역삼 텐프로 VIP 모집',
        location: '서울 강남구 역삼동',
        pay: '일급 500,000원',
        thumbnail: '/images/ads/thumbnails/thumb_2.gif',
        images: [
            '/images/ads/details/detail_2_1.jpg',
            '/images/ads/details/detail_2_2.jpg',
            '/images/ads/details/detail_2_3.jpg',
            '/images/ads/details/detail_2_4.jpg',
            '/images/ads/details/detail_2_5.jpg',
            '/images/ads/details/detail_2_6.jpg',
            '/images/ads/details/detail_2_7.jpg',
            '/images/ads/details/detail_2_8.png',
            '/images/ads/details/detail_2_9.gif',
            '/images/ads/details/detail_2_10.gif',
        ],
        badges: ['경력우대', '급여협의'],
        isNew: true,
        isHot: false,
        productType: 'vip',
        price: '300,000원',
        duration: '30일',
    },
];

// Special Ads
export const specialAds: Advertisement[] = [
    {
        id: 3,
        title: '신논현 룸 스페셜 채용',
        location: '서울 강남구 신논현',
        pay: '시급 80,000원',
        thumbnail: '/images/ads/thumbnails/thumb_3.gif',
        images: [
            '/images/ads/details/detail_3_1.jpg',
            '/images/ads/details/detail_3_2.jpg',
            '/images/ads/details/detail_3_3.jpg',
            '/images/ads/details/detail_3_4.jpg',
            '/images/ads/details/detail_3_5.jpg',
            '/images/ads/details/detail_3_6.jpg',
            '/images/ads/details/detail_3_7.jpg',
            '/images/ads/details/detail_3_8.png',
            '/images/ads/details/detail_3_9.gif',
            '/images/ads/details/detail_3_10.gif',
        ],
        badges: ['초보환영', '교육가능'],
        isNew: false,
        isHot: false,
        productType: 'special',
        price: '150,000원',
        duration: '15일',
    },
    {
        id: 4,
        title: '압구정 클럽 스페셜',
        location: '서울 강남구 압구정',
        pay: '일급 400,000원',
        thumbnail: '/images/ads/thumbnails/thumb_4.gif',
        images: [
            '/images/ads/details/detail_4_1.jpg',
            '/images/ads/details/detail_4_2.jpg',
            '/images/ads/details/detail_4_3.jpg',
            '/images/ads/details/detail_4_4.jpg',
            '/images/ads/details/detail_4_5.jpg',
            '/images/ads/details/detail_4_6.jpg',
            '/images/ads/details/detail_4_7.jpg',
            '/images/ads/details/detail_4_8.png',
            '/images/ads/details/detail_4_9.gif',
            '/images/ads/details/detail_4_10.gif',
        ],
        badges: ['고수입', '유연근무'],
        isNew: false,
        isHot: true,
        productType: 'special',
        price: '150,000원',
        duration: '15일',
    },
];

// Regular Ads
export const regularAds: Advertisement[] = [
    {
        id: 5,
        title: '홍대 노래방 일반 모집',
        location: '서울 마포구 홍대',
        pay: '시급 50,000원',
        thumbnail: '/images/ads/thumbnails/thumb_5.gif',
        images: [
            '/images/ads/details/detail_5_1.jpg',
            '/images/ads/details/detail_5_2.jpg',
            '/images/ads/details/detail_5_3.jpg',
            '/images/ads/details/detail_5_4.jpg',
            '/images/ads/details/detail_5_5.jpg',
            '/images/ads/details/detail_5_6.jpg',
            '/images/ads/details/detail_5_7.jpg',
            '/images/ads/details/detail_5_8.png',
            '/images/ads/details/detail_5_9.gif',
            '/images/ads/details/detail_5_10.gif',
        ],
        badges: ['초보가능'],
        isNew: true,
        isHot: false,
        productType: 'general',
        price: '50,000원',
        duration: '5일',
    },
    {
        id: 6,
        title: '강남 퍼블릭 일반',
        location: '서울 강남구',
        pay: '일급 300,000원',
        thumbnail: '/images/ads/thumbnails/thumb_6.gif',
        images: [
            '/images/ads/details/detail_1_1.jpg', // Reusing images for demo
            '/images/ads/details/detail_1_2.jpg',
            '/images/ads/details/detail_1_3.jpg',
            '/images/ads/details/detail_1_4.jpg',
            '/images/ads/details/detail_1_5.jpg',
        ],
        badges: ['당일지급'],
        isNew: false,
        isHot: false,
        productType: 'general',
        price: '50,000원',
        duration: '5일',
    },
];

export const allAds = [...vipAds, ...specialAds, ...regularAds];
