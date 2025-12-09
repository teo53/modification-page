/**
 * 광고 폼 상태 인터페이스
 */
export interface AdFormState {
    // Step 1: Business Info
    businessName: string;
    contactPerson: string;
    contactPhone: string;
    kakaoId: string;
    lineId: string;
    telegramId: string;
    wechatId: string;
    address: {
        zonecode: string;
        roadAddress: string;
        detailAddress: string;
    };
    isLocationVerified: boolean;
    verificationDocument: File | null;

    // Step 2: Recruitment Info
    title: string;
    businessLogo: File | null;
    adLogo: File | null;

    industry: {
        level1: string;
        level2: string;
    };

    location: {
        city: string;
        district: string;
        town: string;
    };

    recruitmentType: string;

    workHours: {
        type: 'day' | 'night' | 'both' | 'negotiable' | 'direct';
        start?: string;
        end?: string;
        text?: string;
    };

    salary: {
        type: 'hourly' | 'daily' | 'monthly' | 'annual' | 'negotiable';
        amount: string;
    };

    ageLimit: {
        start: number;
        end: number;
        noLimit: boolean;
    };

    keywords: string[];
    customKeywords: string;

    images: {
        file: File | null;
        description: string;
    }[];

    description: string;
    themes: string[];
}

/**
 * 광고 카드 Props
 */
export interface AdCardProps {
    id?: number | string;
    variant?: 'vip' | 'special' | 'premium' | 'regular';
    title: string;
    location: string;
    pay: string;
    image: string;
    badges?: string[];
    isNew?: boolean;
    isHot?: boolean;
    price?: string;
    duration?: string;
    productType?: 'vip' | 'special' | 'premium' | 'general';
}

/**
 * 스크래핑된 광고 데이터 인터페이스
 */
export interface ScrapedAd {
    id: number;
    title: string;
    thumbnail: string;
    location: string;
    pay: string;
    ad_type: 'vip' | 'special' | 'premium' | 'general';
    industry?: string;
    theme?: string[];
    badges?: string[];
    is_new?: boolean;
    is_hot?: boolean;
    detail_images?: string[];
    advertiser_info?: Record<string, string>;
    recruitment_info?: Record<string, string>;
}
