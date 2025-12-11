// Simple LocalStorage-based Ad Storage
// For demo purposes - not for production

import { getCurrentUser } from './auth';

export interface UserAd {
    id: string;
    userId: string;
    title: string;
    businessName: string;
    location: string;
    salary: string;
    workHours: string;
    description: string;
    contact: string;
    highlightConfig?: {
        color: 'yellow' | 'pink' | 'green' | 'cyan';
        text: string; // The specific substring to highlight
    };
    jumpUpConfig?: {
        enabled: boolean;
        intervalDays: number; // e.g. 1, 3, 7
        totalCount: number; // Total paid jumps
        remainingCount: number;
    };
    productType: 'diamond' | 'sapphire' | 'ruby' | 'gold' | 'premium' | 'special' | 'regular' | 'highlight' | 'jumpup';
    status: 'pending' | 'active' | 'expired' | 'rejected';
    views: number;
    inquiries: number;
    createdAt: string;
    expiresAt: string;
}

const ADS_KEY = 'lunaalba_user_ads';

// Get all ads
export const getAllAds = (): UserAd[] => {
    const data = localStorage.getItem(ADS_KEY);
    return data ? JSON.parse(data) : [];
};

// Save ads
const saveAds = (ads: UserAd[]) => {
    localStorage.setItem(ADS_KEY, JSON.stringify(ads));
};

// Create new ad
export const createAd = (adData: Omit<UserAd, 'id' | 'userId' | 'status' | 'views' | 'inquiries' | 'createdAt' | 'expiresAt'>): { success: boolean; message: string; ad?: UserAd } => {
    const user = getCurrentUser();

    if (!user) {
        return { success: false, message: '로그인이 필요합니다.' };
    }

    if (user.type !== 'advertiser') {
        return { success: false, message: '광고주 계정만 광고를 등록할 수 있습니다.' };
    }

    const ads = getAllAds();

    const newAd: UserAd = {
        id: Date.now().toString(),
        userId: user.id,
        ...adData,
        status: 'active', // Auto approve for demo
        views: Math.floor(Math.random() * 500) + 100,
        inquiries: Math.floor(Math.random() * 20) + 5,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    };

    ads.push(newAd);
    saveAds(ads);

    return { success: true, message: '광고가 성공적으로 등록되었습니다!', ad: newAd };
};

// Get ads by current user
export const getMyAds = (): UserAd[] => {
    const user = getCurrentUser();
    if (!user) return [];

    const ads = getAllAds();
    return ads.filter(ad => ad.userId === user.id);
};

// Get ad by ID
export const getAdById = (id: string): UserAd | undefined => {
    const ads = getAllAds();
    return ads.find(ad => ad.id === id);
};

// Update ad
export const updateAd = (id: string, updates: Partial<UserAd>): { success: boolean; message: string } => {
    const ads = getAllAds();
    const index = ads.findIndex(ad => ad.id === id);

    if (index === -1) {
        return { success: false, message: '광고를 찾을 수 없습니다.' };
    }

    ads[index] = { ...ads[index], ...updates };
    saveAds(ads);

    return { success: true, message: '광고가 수정되었습니다.' };
};

// Delete ad
export const deleteAd = (id: string): { success: boolean; message: string } => {
    const ads = getAllAds();
    const filtered = ads.filter(ad => ad.id !== id);

    if (filtered.length === ads.length) {
        return { success: false, message: '광고를 찾을 수 없습니다.' };
    }

    saveAds(filtered);
    return { success: true, message: '광고가 삭제되었습니다.' };
};

// Get stats for dashboard
export const getAdStats = () => {
    const myAds = getMyAds();

    return {
        total: myAds.length,
        active: myAds.filter(ad => ad.status === 'active').length,
        pending: myAds.filter(ad => ad.status === 'pending').length,
        expired: myAds.filter(ad => ad.status === 'expired').length,
        totalViews: myAds.reduce((sum, ad) => sum + ad.views, 0),
        totalInquiries: myAds.reduce((sum, ad) => sum + ad.inquiries, 0),
    };
};
